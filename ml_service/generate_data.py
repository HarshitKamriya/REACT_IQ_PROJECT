"""
REACTIQ — Synthetic Training Data Generator
Generates physics-based esterification data with realistic noise for ML training.
"""

import numpy as np
import pandas as pd
import os

np.random.seed(42)
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)


def generate_kinetics_data(n=3000):
    """Generate esterification kinetics dataset using Arrhenius physics."""
    temps = np.random.uniform(60, 250, n)
    pressures = np.random.uniform(1, 15, n)
    catalysts = np.random.choice(["H2SO4", "p-TSA", "Amberlyst-15", "Ti(OBu)4"], n)
    cat_concs = np.random.uniform(0.01, 0.1, n)
    scales = np.random.choice([500, 2000, 5000, 50000, 500000, 1000000], n)
    times = np.random.uniform(10, 180, n)

    # Arrhenius rate constant
    Ea = 75000  # J/mol
    R = 8.314
    A = 1e12
    k = A * np.exp(-Ea / (R * (temps + 273.15)))

    # Catalyst efficiency multiplier
    cat_efficiency = {
        "H2SO4": 1.0, "p-TSA": 1.15, "Amberlyst-15": 0.85, "Ti(OBu)4": 0.95
    }
    cat_mult = np.array([cat_efficiency[c] for c in catalysts])

    # Conversion model: first-order kinetics
    effective_k = k * cat_concs * cat_mult * (1 + pressures * 0.02)
    conversion = 100 * (1 - np.exp(-effective_k * times / 60))

    # Scale-up efficiency loss (larger = more heat/mass transfer issues)
    scale_penalty = 1 - 0.015 * np.log10(scales / 500)
    conversion = conversion * scale_penalty

    # Add realistic noise
    conversion += np.random.normal(0, 1.5, n)
    conversion = np.clip(conversion, 0, 99.5)

    # Yield is slightly lower than conversion (side reactions)
    yield_pct = conversion * np.random.uniform(0.88, 0.98, n)

    # Rate constant (observable)
    rate_constant = effective_k + np.random.normal(0, effective_k * 0.05)

    # Activation energy estimate (varies by catalyst)
    ea_est = Ea + np.random.normal(0, 2000, n)

    # Heat dissipation (W/m²) — correlates with temp and scale
    heat_dissipation = (
        200 + temps * 2.5 + np.log10(scales) * 50
        + np.random.normal(0, 30, n)
    )

    df = pd.DataFrame({
        "temperature_C": np.round(temps, 1),
        "pressure_atm": np.round(pressures, 2),
        "catalyst_type": catalysts,
        "catalyst_conc_mol_L": np.round(cat_concs, 4),
        "scale_mL": scales,
        "time_min": np.round(times, 1),
        "conversion_pct": np.round(conversion, 2),
        "yield_pct": np.round(yield_pct, 2),
        "rate_constant": np.round(rate_constant, 6),
        "activation_energy_J_mol": np.round(ea_est, 0),
        "heat_dissipation_W_m2": np.round(heat_dissipation, 1),
    })

    path = os.path.join(DATA_DIR, "kinetics_experiments.csv")
    df.to_csv(path, index=False)
    print(f"[OK] Generated {n} kinetics samples -> {path}")
    return df


def generate_risk_data(n=2000):
    """Generate hazard/risk dataset for HIRA classification."""
    temps = np.random.uniform(60, 300, n)
    pressures = np.random.uniform(1, 20, n)
    concentrations = np.random.uniform(0.01, 0.5, n)
    pH_values = np.random.uniform(0.5, 7, n)
    exotherms = np.random.uniform(20, 200, n)
    decomp_temps = np.random.uniform(200, 400, n)
    viscosities = np.random.uniform(0.5, 50, n)

    # Physics-based hazard rules
    thermal_runaway = ((temps > 180) & (exotherms > 80)).astype(int)
    thermal_runaway |= ((temps / decomp_temps) > 0.7).astype(int)

    pressure_buildup = ((pressures > 10) | ((temps > 200) & (pressures > 6))).astype(int)

    vapor_emission = ((temps > 150) & (concentrations > 0.2)).astype(int)

    corrosion = ((pH_values < 2) | (concentrations > 0.3)).astype(int)

    decomposition = ((temps > decomp_temps * 0.8)).astype(int)

    # Add noise (10% flip rate for realism)
    for arr in [thermal_runaway, pressure_buildup, vapor_emission, corrosion, decomposition]:
        flip_mask = np.random.random(n) < 0.1
        arr[flip_mask] = 1 - arr[flip_mask]

    # Risk score (0-100)
    risk_score = (
        temps / 300 * 30
        + pressures / 20 * 25
        + exotherms / 200 * 20
        + (1 - decomp_temps / 400) * 15
        + concentrations * 20
        + np.random.normal(0, 5, n)
    )
    risk_score = np.clip(risk_score, 5, 99)

    # Severity label
    severity = np.where(risk_score > 75, "critical",
               np.where(risk_score > 50, "high",
               np.where(risk_score > 30, "medium", "low")))

    df = pd.DataFrame({
        "temperature_C": np.round(temps, 1),
        "pressure_atm": np.round(pressures, 2),
        "concentration_mol_L": np.round(concentrations, 4),
        "pH": np.round(pH_values, 2),
        "exotherm_kJ_mol": np.round(exotherms, 1),
        "decomp_temp_C": np.round(decomp_temps, 1),
        "viscosity_cP": np.round(viscosities, 2),
        "thermal_runaway": thermal_runaway,
        "pressure_buildup": pressure_buildup,
        "vapor_emission": vapor_emission,
        "corrosion": corrosion,
        "decomposition": decomposition,
        "risk_score": np.round(risk_score, 1),
        "severity": severity,
    })

    path = os.path.join(DATA_DIR, "risk_incidents.csv")
    df.to_csv(path, index=False)
    print(f"[OK] Generated {n} risk samples -> {path}")
    return df


def generate_cpp_data(n=2500):
    """Generate CPP optimization dataset."""
    temps = np.random.uniform(60, 250, n)
    pressures = np.random.uniform(1, 15, n)
    cat_ratios = np.random.uniform(0.5, 5, n)
    mixing_speeds = np.random.uniform(50, 600, n)
    residence_times = np.random.uniform(10, 180, n)

    # Efficiency model (complex nonlinear surface)
    efficiency = (
        40
        + 30 * np.sin((temps - 60) * np.pi / 280)
        * np.cos((pressures - 5) * np.pi / 10)
        + cat_ratios * 5
        + np.log(mixing_speeds + 1) * 3
        - (residence_times - 90) ** 2 / 2000
        + np.random.normal(0, 3, n)
    )
    efficiency = np.clip(efficiency, 10, 99)

    # Yield correlates with efficiency
    yield_pct = efficiency * np.random.uniform(0.9, 1.02, n)
    yield_pct = np.clip(yield_pct, 10, 99)

    # Cost model
    cost_per_batch = (
        500 + temps * 2 + pressures * 30 + cat_ratios * 100
        + mixing_speeds * 0.5 + np.random.normal(0, 50, n)
    )

    df = pd.DataFrame({
        "temperature_C": np.round(temps, 1),
        "pressure_atm": np.round(pressures, 2),
        "catalyst_ratio_mol_pct": np.round(cat_ratios, 3),
        "mixing_speed_rpm": np.round(mixing_speeds, 0).astype(int),
        "residence_time_min": np.round(residence_times, 1),
        "efficiency_pct": np.round(efficiency, 2),
        "yield_pct": np.round(yield_pct, 2),
        "cost_per_batch_INR": np.round(cost_per_batch, 0).astype(int),
    })

    path = os.path.join(DATA_DIR, "cpp_optimization.csv")
    df.to_csv(path, index=False)
    print(f"[OK] Generated {n} CPP samples -> {path}")
    return df


if __name__ == "__main__":
    print("REACTIQ -- Generating Synthetic Training Data\n")
    generate_kinetics_data()
    generate_risk_data()
    generate_cpp_data()
    print("\nAll datasets generated in ml_service/data/")
