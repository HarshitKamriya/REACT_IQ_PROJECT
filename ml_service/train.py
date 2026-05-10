"""
REACTIQ — ML Model Training Pipeline
Trains all models: Kinetics Prediction, HIRA Risk Classification, CPP Optimization
"""

import os
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor, RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score, accuracy_score, mean_absolute_error
import joblib

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(MODEL_DIR, exist_ok=True)


def train_kinetics_model():
    """Train conversion prediction model using Arrhenius-informed features."""
    print("[1/3] Training Kinetics Model...")
    df = pd.read_csv(os.path.join(DATA_DIR, "kinetics_experiments.csv"))

    # Encode catalyst
    le = LabelEncoder()
    df["catalyst_encoded"] = le.fit_transform(df["catalyst_type"])

    # Arrhenius-informed features
    df["inv_temp_1000"] = 1000 / (df["temperature_C"] + 273.15)
    df["log_scale"] = np.log10(df["scale_mL"])
    df["temp_x_conc"] = df["temperature_C"] * df["catalyst_conc_mol_L"]

    features = [
        "temperature_C", "pressure_atm", "catalyst_encoded",
        "catalyst_conc_mol_L", "scale_mL", "time_min",
        "inv_temp_1000", "log_scale", "temp_x_conc",
    ]

    X = df[features]
    y = df["conversion_pct"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = GradientBoostingRegressor(
        n_estimators=300, max_depth=6, learning_rate=0.08,
        subsample=0.8, min_samples_leaf=5, random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)

    print(f"   R² Score:  {r2:.4f}")
    print(f"   MAE:       {mae:.2f}%")

    # Save model + encoder + feature names
    joblib.dump(model, os.path.join(MODEL_DIR, "kinetics_model.pkl"))
    joblib.dump(le, os.path.join(MODEL_DIR, "catalyst_encoder.pkl"))
    joblib.dump(features, os.path.join(MODEL_DIR, "kinetics_features.pkl"))

    print(f"   [OK] Saved to models/kinetics_model.pkl\n")
    return {"r2": r2, "mae": mae}


def train_risk_model():
    """Train multi-label hazard classifier + severity regressor."""
    print("[2/3] Training HIRA Risk Model...")
    df = pd.read_csv(os.path.join(DATA_DIR, "risk_incidents.csv"))

    features = [
        "temperature_C", "pressure_atm", "concentration_mol_L",
        "pH", "exotherm_kJ_mol", "decomp_temp_C", "viscosity_cP",
    ]
    hazard_cols = [
        "thermal_runaway", "pressure_buildup",
        "vapor_emission", "corrosion", "decomposition",
    ]

    X = df[features]

    # Multi-label hazard classifier
    y_hazards = df[hazard_cols]
    X_train, X_test, y_train, y_test = train_test_split(X, y_hazards, test_size=0.2, random_state=42)

    clf = MultiOutputClassifier(
        RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42)
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"   Exact Match Accuracy: {acc:.4f}")

    # Severity regressor
    y_severity = df["risk_score"]
    X_train_s, X_test_s, y_train_s, y_test_s = train_test_split(X, y_severity, test_size=0.2, random_state=42)

    sev_model = GradientBoostingRegressor(
        n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42,
    )
    sev_model.fit(X_train_s, y_train_s)

    sev_r2 = r2_score(y_test_s, sev_model.predict(X_test_s))
    print(f"   Severity R²: {sev_r2:.4f}")

    joblib.dump(clf, os.path.join(MODEL_DIR, "hira_classifier.pkl"))
    joblib.dump(sev_model, os.path.join(MODEL_DIR, "hira_severity.pkl"))
    joblib.dump(features, os.path.join(MODEL_DIR, "risk_features.pkl"))
    joblib.dump(hazard_cols, os.path.join(MODEL_DIR, "hazard_columns.pkl"))

    print(f"   [OK] Saved to models/hira_*.pkl\n")
    return {"accuracy": acc, "severity_r2": sev_r2}


def train_cpp_model():
    """Train CPP efficiency prediction model."""
    print("[3/3] Training CPP Optimization Model...")
    df = pd.read_csv(os.path.join(DATA_DIR, "cpp_optimization.csv"))

    features = [
        "temperature_C", "pressure_atm", "catalyst_ratio_mol_pct",
        "mixing_speed_rpm", "residence_time_min",
    ]

    X = df[features]
    y = df["efficiency_pct"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = GradientBoostingRegressor(
        n_estimators=250, max_depth=5, learning_rate=0.1,
        subsample=0.9, random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)

    print(f"   R² Score:  {r2:.4f}")
    print(f"   MAE:       {mae:.2f}%")

    joblib.dump(model, os.path.join(MODEL_DIR, "cpp_model.pkl"))
    joblib.dump(features, os.path.join(MODEL_DIR, "cpp_features.pkl"))

    print(f"   [OK] Saved to models/cpp_model.pkl\n")
    return {"r2": r2, "mae": mae}


if __name__ == "__main__":
    print("=" * 50)
    print("REACTIQ -- ML Training Pipeline")
    print("=" * 50 + "\n")

    results = {}
    results["kinetics"] = train_kinetics_model()
    results["risk"] = train_risk_model()
    results["cpp"] = train_cpp_model()

    print("=" * 50)
    print("Training Summary")
    print("=" * 50)
    for name, metrics in results.items():
        print(f"  {name}: {metrics}")
    print("\nAll models trained and saved to ml_service/models/")
