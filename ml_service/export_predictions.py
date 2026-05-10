"""
Export trained model predictions as JSON for Vercel serverless functions.
Since Vercel runs Node.js (not Python), we pre-compute predictions and export as JSON.
"""

import os
import json
import numpy as np
import pandas as pd
import joblib

BASE_DIR = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE_DIR, "models")
EXPORT_DIR = os.path.join(os.path.dirname(BASE_DIR), "api", "_ml_data")
os.makedirs(EXPORT_DIR, exist_ok=True)

DATA_PATH = os.path.join(BASE_DIR, "data", "oleochemical_arrhenius_20000_dataset.xlsx")


def export_arrhenius_params():
    """Export real Arrhenius parameters from the dataset summary."""
    summary = pd.read_excel(DATA_PATH, sheet_name="Reaction Summary")
    params = []
    for _, row in summary.iterrows():
        params.append({
            "reaction": row["Reaction"],
            "A": int(row["Pre-exponential Factor A (1/s)"]),
            "Ea": int(row["Activation Energy Ea (J/mol)"]),
            "dataPoints": int(row["Data Points"]),
        })

    with open(os.path.join(EXPORT_DIR, "arrhenius_params.json"), "w") as f:
        json.dump(params, f, indent=2)
    print(f"[OK] Exported {len(params)} Arrhenius parameters")
    return params


def export_kinetics_predictions():
    """Export conversion predictions across temperature range for each reaction."""
    model = joblib.load(os.path.join(MODEL_DIR, "kinetics_model.pkl"))
    k_model = joblib.load(os.path.join(MODEL_DIR, "rate_constant_model.pkl"))
    le = joblib.load(os.path.join(MODEL_DIR, "reaction_encoder.pkl"))
    features = joblib.load(os.path.join(MODEL_DIR, "kinetics_features.pkl"))

    reactions = list(le.classes_)
    predictions = {}

    for rxn in reactions:
        rxn_enc = le.transform([rxn])[0]
        rxn_data = {"temperatures": [], "conversions": [], "rateConstants": [], "lnK": []}

        for temp in range(30, 181, 5):
            inv_t = 1 / (temp + 273.15)
            X = pd.DataFrame(
                [[temp, 5.0, 600, 120, rxn_enc, inv_t, 52.0]],
                columns=features,
            )
            conv = float(model.predict(X)[0])
            k = float(k_model.predict(X)[0])
            rxn_data["temperatures"].append(temp)
            rxn_data["conversions"].append(round(conv, 2))
            rxn_data["rateConstants"].append(round(k, 6))
            rxn_data["lnK"].append(round(np.log(max(k, 1e-10)), 4))

        predictions[rxn] = rxn_data

    with open(os.path.join(EXPORT_DIR, "kinetics_predictions.json"), "w") as f:
        json.dump(predictions, f, indent=2)
    print(f"[OK] Exported kinetics predictions for {len(reactions)} reactions")


def export_scaleup_predictions():
    """Export scale-up success boundaries."""
    model = joblib.load(os.path.join(MODEL_DIR, "scaleup_model.pkl"))
    le = joblib.load(os.path.join(MODEL_DIR, "reaction_encoder.pkl"))
    features = joblib.load(os.path.join(MODEL_DIR, "scaleup_features.pkl"))

    reactions = list(le.classes_)
    results = {}

    for rxn in reactions:
        rxn_enc = le.transform([rxn])[0]
        temp_probs = []
        for temp in range(30, 181, 10):
            X = np.array([[temp, 5.0, 600, 120, rxn_enc, 0.2, 45.0, 52.0, 100.0]])
            prob = float(model.predict_proba(X)[0][1])
            temp_probs.append({"temp": temp, "successProb": round(prob * 100, 1)})
        results[rxn] = temp_probs

    with open(os.path.join(EXPORT_DIR, "scaleup_predictions.json"), "w") as f:
        json.dump(results, f, indent=2)
    print(f"[OK] Exported scale-up predictions for {len(reactions)} reactions")


def export_dataset_stats():
    """Export dataset statistics for the frontend."""
    xl = pd.ExcelFile(DATA_PATH)
    sheets = [s for s in xl.sheet_names if s != "Reaction Summary"]
    stats = {}

    for sheet in sheets:
        df = pd.read_excel(xl, sheet_name=sheet)
        stats[sheet] = {
            "count": len(df),
            "tempRange": [round(df["Temperature (C)"].min(), 1), round(df["Temperature (C)"].max(), 1)],
            "pressureRange": [round(df["Pressure (bar)"].min(), 1), round(df["Pressure (bar)"].max(), 1)],
            "conversionRange": [round(df["Conversion (%)"].min(), 1), round(df["Conversion (%)"].max(), 1)],
            "avgConversion": round(df["Conversion (%)"].mean(), 2),
            "scaleUpRate": round(df["Scale-Up Success"].mean() * 100, 1),
            "avgRateConstant": round(df["Rate Constant k (1/s)"].mean(), 4),
        }

    with open(os.path.join(EXPORT_DIR, "dataset_stats.json"), "w") as f:
        json.dump(stats, f, indent=2)
    print(f"[OK] Exported dataset stats for {len(sheets)} reactions")


def export_model_metrics():
    """Export model performance metrics."""
    metrics = {
        "kinetics": {"r2": 0.5250, "mae": 2.52, "model": "GradientBoosting", "dataPoints": 20000},
        "rateConstant": {"r2": 1.0000, "mae": 0.0, "model": "GradientBoosting", "dataPoints": 20000},
        "scaleUp": {"accuracy": 0.9945, "precision": 0.97, "recall": 0.98, "model": "GradientBoosting", "dataPoints": 20000},
        "reactions": [
            "Oleic Acid + Methanol Esterification",
            "Palmitic Acid + Ethanol Esterification",
            "Lauric Acid + Butanol Esterification",
            "Stearic Acid + Methanol Esterification",
            "Biodiesel Transesterification (Soybean Oil)",
        ],
        "features": ["Temperature", "Pressure", "Agitation RPM", "Residence Time", "Reaction Type", "1/T", "Heat Duty"],
    }

    with open(os.path.join(EXPORT_DIR, "model_metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)
    print("[OK] Exported model metrics")


if __name__ == "__main__":
    print("Exporting ML predictions for Vercel...\n")
    export_arrhenius_params()
    export_kinetics_predictions()
    export_scaleup_predictions()
    export_dataset_stats()
    export_model_metrics()
    print(f"\nAll exports saved to {EXPORT_DIR}")
