"""
REACTIQ — Train ML Models on Real Oleochemical Arrhenius Dataset
Uses the 20,000 data point oleochemical_arrhenius_20000_dataset.xlsx
"""

import os
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score, accuracy_score, mean_absolute_error, classification_report
import joblib

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)

XLSXDATA_DIR = os.path.join(os.path.dirname(__file__), "data")


def load_all_reactions():
    """Load all 5 sheets from the CSV datasets and combine them."""
    summary_path = os.path.join(DATA_DIR, "reaction_summary.csv")
    summary = pd.read_csv(summary_path)
    sheets = summary["Reaction"].tolist()
    
    all_data = []

    for sheet in sheets:
        safe_name = sheet.replace(" ", "_").replace("+", "plus").replace("(", "").replace(")", "").lower()
        csv_path = os.path.join(DATA_DIR, f"{safe_name}.csv")
        df = pd.read_csv(csv_path)
        df["Reaction"] = sheet
        all_data.append(df)

    combined = pd.concat(all_data, ignore_index=True)
    print(f"Loaded {len(combined)} rows from {len(sheets)} reactions")
    print(f"Columns: {list(combined.columns)}")
    return combined


def train_kinetics_model():
    """Train conversion prediction model on real data."""
    print("\n[1/3] Training Kinetics Model (Real Data)...")
    df = load_all_reactions()

    # Encode reaction type
    le = LabelEncoder()
    df["reaction_encoded"] = le.fit_transform(df["Reaction"])

    features = [
        "Temperature (C)", "Pressure (bar)", "Agitation RPM",
        "Residence Time (min)", "reaction_encoded",
        "1/T (1/K)", "Heat Duty (kJ/mol)",
    ]

    X = df[features]
    y = df["Conversion (%)"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = GradientBoostingRegressor(
        n_estimators=300, max_depth=6, learning_rate=0.08,
        subsample=0.8, min_samples_leaf=5, random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)

    print(f"   R2 Score:  {r2:.4f}")
    print(f"   MAE:       {mae:.2f}%")

    # Also train a rate constant predictor
    y_k = df["Rate Constant k (1/s)"]
    X_train_k, X_test_k, y_train_k, y_test_k = train_test_split(
        X, y_k, test_size=0.2, random_state=42
    )
    k_model = GradientBoostingRegressor(
        n_estimators=250, max_depth=6, learning_rate=0.1, random_state=42,
    )
    k_model.fit(X_train_k, y_train_k)
    k_r2 = r2_score(y_test_k, k_model.predict(X_test_k))
    print(f"   Rate Constant R2: {k_r2:.4f}")

    joblib.dump(model, os.path.join(MODEL_DIR, "kinetics_model.pkl"))
    joblib.dump(k_model, os.path.join(MODEL_DIR, "rate_constant_model.pkl"))
    joblib.dump(le, os.path.join(MODEL_DIR, "reaction_encoder.pkl"))
    joblib.dump(features, os.path.join(MODEL_DIR, "kinetics_features.pkl"))
    print("   [OK] Saved kinetics models\n")

    return {"r2_conversion": r2, "mae": mae, "r2_rate_constant": k_r2}


def train_scaleup_model():
    """Train scale-up success classifier on real data."""
    print("[2/3] Training Scale-Up Success Classifier (Real Data)...")
    df = load_all_reactions()

    le = LabelEncoder()
    df["reaction_encoded"] = le.fit_transform(df["Reaction"])

    features = [
        "Temperature (C)", "Pressure (bar)", "Agitation RPM",
        "Residence Time (min)", "reaction_encoded",
        "Rate Constant k (1/s)", "Conversion (%)",
        "Heat Duty (kJ/mol)", "Cooling Load (kW)",
    ]

    X = df[features]
    y = df["Scale-Up Success"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = GradientBoostingClassifier(
        n_estimators=300, max_depth=6, learning_rate=0.1,
        subsample=0.8, random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)

    print(f"   Accuracy: {acc:.4f}")
    print(f"   Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["Fail", "Success"]))

    joblib.dump(model, os.path.join(MODEL_DIR, "scaleup_model.pkl"))
    joblib.dump(features, os.path.join(MODEL_DIR, "scaleup_features.pkl"))
    joblib.dump(le, os.path.join(MODEL_DIR, "reaction_encoder.pkl"))
    print("   [OK] Saved scale-up model\n")

    return {"accuracy": acc}


def train_cooling_model():
    """Train cooling load prediction model on real data."""
    print("[3/3] Training Cooling Load Predictor (Real Data)...")
    df = load_all_reactions()

    le = LabelEncoder()
    df["reaction_encoded"] = le.fit_transform(df["Reaction"])

    features = [
        "Temperature (C)", "Pressure (bar)", "Agitation RPM",
        "Residence Time (min)", "reaction_encoded",
        "Heat Duty (kJ/mol)",
    ]

    X = df[features]
    y = df["Cooling Load (kW)"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = GradientBoostingRegressor(
        n_estimators=250, max_depth=5, learning_rate=0.1, random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)

    print(f"   R2 Score:  {r2:.4f}")
    print(f"   MAE:       {mae:.2f} kW")

    joblib.dump(model, os.path.join(MODEL_DIR, "cooling_model.pkl"))
    joblib.dump(features, os.path.join(MODEL_DIR, "cooling_features.pkl"))
    print("   [OK] Saved cooling model\n")

    return {"r2": r2, "mae": mae}


if __name__ == "__main__":
    print("=" * 55)
    print("REACTIQ -- ML Training on Real Oleochemical Data")
    print("=" * 55)

    results = {}
    results["kinetics"] = train_kinetics_model()
    results["scaleup"] = train_scaleup_model()
    results["cooling"] = train_cooling_model()

    print("=" * 55)
    print("Training Summary")
    print("=" * 55)
    for name, metrics in results.items():
        print(f"  {name}: {metrics}")
    print("\nAll models trained on real data and saved to ml_service/models/")
