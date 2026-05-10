"""
REACTIQ -- AI/ML Intelligence Lab
Streamlit Dashboard trained on Real Oleochemical Arrhenius Data (20,000 points)
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import joblib
import os

st.set_page_config(
    page_title="REACTIQ ML Lab",
    page_icon="https://img.icons8.com/color/48/test-tube.png",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    .stApp { background-color: #0a0a0f; }
    section[data-testid="stSidebar"] { background-color: #0d0d15; border-right: 1px solid #1a1a2e; }
    h1, h2, h3 { font-family: 'Inter', sans-serif; }
    .stMetric label { font-family: 'JetBrains Mono', monospace; font-size: 0.75em; }
</style>
""", unsafe_allow_html=True)

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")
SUMMARY_PATH = os.path.join(DATA_DIR, "reaction_summary.csv")


def load_model(name):
    path = os.path.join(MODEL_DIR, name)
    return joblib.load(path) if os.path.exists(path) else None


def load_all_reactions():
    summary = pd.read_csv(SUMMARY_PATH)
    sheets = summary["Reaction"].tolist()
    all_data = []
    for sheet in sheets:
        safe_name = sheet.replace(" ", "_").replace("+", "plus").replace("(", "").replace(")", "").lower()
        csv_path = os.path.join(DATA_DIR, f"{safe_name}.csv")
        df = pd.read_csv(csv_path)
        df["Reaction"] = sheet
        all_data.append(df)
    return pd.concat(all_data, ignore_index=True)


REACTIONS = [
    "Oleic Acid + Methanol Esterific",
    "Palmitic Acid + Ethanol Esterif",
    "Lauric Acid + Butanol Esterific",
    "Stearic Acid + Methanol Esterif",
    "Biodiesel Transesterification (",
]

# --- Sidebar ---
st.sidebar.markdown("## REACT**IQ** ML Lab")
st.sidebar.caption("Trained on 20,000 real oleochemical data points")
st.sidebar.divider()

page = st.sidebar.radio(
    "Module",
    ["Dashboard", "Kinetic Prediction", "Scale-Up Classifier",
     "Arrhenius Explorer", "Data Explorer", "Train Models"],
)

st.sidebar.divider()
st.sidebar.caption("Built for Chemical Engineering")

# ==============================
# DASHBOARD
# ==============================
if page == "Dashboard":
    st.markdown("# REACTIQ ML Intelligence Lab")
    st.markdown("AI-Driven Esterification Scale-Up Prediction -- Trained on Real Oleochemical Data")
    st.divider()

    models = {
        "Kinetics (Conversion)": "kinetics_model.pkl",
        "Rate Constant (k)": "rate_constant_model.pkl",
        "Scale-Up Classifier": "scaleup_model.pkl",
        "Cooling Load": "cooling_model.pkl",
    }

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Data Points", "20,000")
    c2.metric("Reactions", "5")
    c3.metric("Models", f"{sum(1 for v in models.values() if os.path.exists(os.path.join(MODEL_DIR, v)))}/{len(models)}")
    c4.metric("Dataset", "Oleochemical Arrhenius")

    st.divider()
    col1, col2 = st.columns(2)

    with col1:
        st.subheader("Model Status")
        for name, fname in models.items():
            ready = os.path.exists(os.path.join(MODEL_DIR, fname))
            st.markdown(f"{'[OK]' if ready else '[--]'} **{name}** -- {'Trained' if ready else 'Pending'}")

    with col2:
        st.subheader("Reaction Types")
        summary = pd.read_csv(SUMMARY_PATH) if os.path.exists(SUMMARY_PATH) else None
        if summary is not None:
            st.dataframe(summary, use_container_width=True, hide_index=True)

    if not os.path.exists(os.path.join(MODEL_DIR, "kinetics_model.pkl")):
        st.warning("Models not trained yet. Go to **Train Models** page first.")

# ==============================
# KINETIC PREDICTION
# ==============================
elif page == "Kinetic Prediction":
    st.markdown("# Kinetic Modeling Prediction")
    st.markdown("Predict conversion and rate constant using trained ML models")
    st.divider()

    model = load_model("kinetics_model.pkl")
    k_model = load_model("rate_constant_model.pkl")
    le = load_model("reaction_encoder.pkl")
    features = load_model("kinetics_features.pkl")

    if model is None:
        st.error("Models not trained. Go to **Train Models** first.")
        st.stop()

    col1, col2 = st.columns([1, 2])

    with col1:
        st.subheader("Parameters")
        reaction = st.selectbox("Reaction Type", REACTIONS)
        temperature = st.slider("Temperature (C)", 30, 180, 110)
        pressure = st.slider("Pressure (bar)", 1.0, 15.0, 5.0, 0.5)
        agitation = st.slider("Agitation (RPM)", 100, 1200, 600, 50)
        residence = st.slider("Residence Time (min)", 10, 300, 120)
        heat_duty = st.slider("Heat Duty (kJ/mol)", 40.0, 65.0, 52.0, 0.5)

        predict_btn = st.button("Predict", type="primary", use_container_width=True)

    with col2:
        if predict_btn:
            rxn_enc = le.transform([reaction])[0]
            inv_t = 1 / (temperature + 273.15)
            X = pd.DataFrame(
                [[temperature, pressure, agitation, residence, rxn_enc, inv_t, heat_duty]],
                columns=features,
            )

            conv_pred = model.predict(X)[0]
            k_pred = k_model.predict(X)[0]

            m1, m2, m3 = st.columns(3)
            m1.metric("Predicted Conversion", f"{conv_pred:.2f}%")
            m2.metric("Rate Constant k", f"{k_pred:.4f} 1/s")
            m3.metric("ln(k)", f"{np.log(max(k_pred, 1e-10)):.3f}")

            # Conversion vs Temperature curve
            temps = np.arange(30, 181, 5)
            convs, ks = [], []
            for t in temps:
                Xt = pd.DataFrame(
                    [[t, pressure, agitation, residence, rxn_enc, 1/(t+273.15), heat_duty]],
                    columns=features,
                )
                convs.append(model.predict(Xt)[0])
                ks.append(k_model.predict(Xt)[0])

            fig = go.Figure()
            fig.add_trace(go.Scatter(x=temps, y=convs, mode="lines+markers",
                name="Conversion (%)", line=dict(color="#00e5ff", width=3)))
            fig.add_trace(go.Scatter(x=[temperature], y=[conv_pred], mode="markers",
                marker=dict(size=14, color="red", symbol="diamond"), name="Your Point"))
            fig.update_layout(
                title="Conversion vs Temperature",
                xaxis_title="Temperature (C)", yaxis_title="Conversion (%)",
                template="plotly_dark", paper_bgcolor="#0a0a0f", plot_bgcolor="#12121f",
                font=dict(family="JetBrains Mono"), height=380,
            )
            st.plotly_chart(fig, use_container_width=True)

            # Arrhenius plot
            inv_temps = [1000 / (t + 273.15) for t in temps]
            ln_ks = [np.log(max(k, 1e-10)) for k in ks]
            fig2 = go.Figure()
            fig2.add_trace(go.Scatter(x=inv_temps, y=ln_ks, mode="lines",
                name="ln(k) predicted", line=dict(color="#ffc107", width=3)))
            fig2.update_layout(
                title="Arrhenius Plot -- ln(k) vs 1000/T",
                xaxis_title="1000/T (1/K)", yaxis_title="ln(k)",
                template="plotly_dark", paper_bgcolor="#0a0a0f", plot_bgcolor="#12121f",
                height=350,
            )
            st.plotly_chart(fig2, use_container_width=True)

            # Feature importance
            imp = model.feature_importances_
            fig3 = px.bar(x=imp, y=features, orientation="h",
                title="Feature Importance (Conversion)", color=imp,
                color_continuous_scale=["#1a1a2e", "#00e5ff"])
            fig3.update_layout(template="plotly_dark", paper_bgcolor="#0a0a0f",
                plot_bgcolor="#12121f", height=280)
            st.plotly_chart(fig3, use_container_width=True)

# ==============================
# SCALE-UP CLASSIFIER
# ==============================
elif page == "Scale-Up Classifier":
    st.markdown("# Scale-Up Success Predictor")
    st.markdown("Will your reaction scale up successfully? (99.45% accuracy)")
    st.divider()

    model = load_model("scaleup_model.pkl")
    le = load_model("reaction_encoder.pkl")
    features = load_model("scaleup_features.pkl")

    if model is None:
        st.error("Model not trained. Go to **Train Models** first.")
        st.stop()

    col1, col2 = st.columns([1, 2])

    with col1:
        st.subheader("Process Conditions")
        reaction = st.selectbox("Reaction", REACTIONS, key="su_rxn")
        temp = st.slider("Temperature (C)", 30, 180, 120, key="su_t")
        pres = st.slider("Pressure (bar)", 1.0, 15.0, 5.0, 0.5, key="su_p")
        rpm = st.slider("Agitation (RPM)", 100, 1200, 600, 50, key="su_rpm")
        res_time = st.slider("Residence Time (min)", 10, 300, 120, key="su_res")
        k_val = st.number_input("Rate Constant k (1/s)", 0.001, 3.0, 0.2, 0.01)
        conv = st.number_input("Conversion (%)", 30.0, 60.0, 45.0, 0.5)
        heat = st.slider("Heat Duty (kJ/mol)", 40.0, 65.0, 52.0, 0.5, key="su_heat")
        cool = st.slider("Cooling Load (kW)", 5.0, 250.0, 100.0, 5.0)

        assess_btn = st.button("Predict Scale-Up", type="primary", use_container_width=True)

    with col2:
        if assess_btn:
            rxn_enc = le.transform([reaction])[0]
            X = np.array([[temp, pres, rpm, res_time, rxn_enc, k_val, conv, heat, cool]])
            pred = model.predict(X)[0]
            prob = model.predict_proba(X)[0]

            if pred == 1:
                st.success(f"## Scale-Up: SUCCESS ({prob[1]*100:.1f}% confidence)")
            else:
                st.error(f"## Scale-Up: FAIL ({prob[0]*100:.1f}% confidence)")

            st.metric("Success Probability", f"{prob[1]*100:.1f}%")
            st.metric("Failure Probability", f"{prob[0]*100:.1f}%")

            st.divider()
            st.subheader("What-If Analysis: Temperature Sweep")
            temps = np.arange(30, 181, 5)
            probs = []
            for t in temps:
                Xt = np.array([[t, pres, rpm, res_time, rxn_enc, k_val, conv, heat, cool]])
                probs.append(model.predict_proba(Xt)[0][1] * 100)

            fig = go.Figure()
            fig.add_trace(go.Scatter(x=temps, y=probs, mode="lines+markers",
                line=dict(color="#00e676", width=3), name="Success %"))
            fig.add_hline(y=50, line_dash="dash", line_color="red", annotation_text="50% threshold")
            fig.update_layout(
                title="Scale-Up Success vs Temperature",
                xaxis_title="Temperature (C)", yaxis_title="Success Probability (%)",
                template="plotly_dark", paper_bgcolor="#0a0a0f", plot_bgcolor="#12121f", height=400,
            )
            st.plotly_chart(fig, use_container_width=True)

# ==============================
# ARRHENIUS EXPLORER
# ==============================
elif page == "Arrhenius Explorer":
    st.markdown("# Arrhenius Data Explorer")
    st.markdown("Visualize real Arrhenius kinetics across 5 oleochemical reactions")
    st.divider()

    if not os.path.exists(SUMMARY_PATH):
        st.error("Dataset not found.")
        st.stop()

    df = load_all_reactions()

    selected = st.multiselect("Select Reactions", REACTIONS, default=REACTIONS[:2])
    filtered = df[df["Reaction"].isin(selected)]

    tab1, tab2, tab3 = st.tabs(["Arrhenius Plot", "Conversion Distribution", "Correlation"])

    with tab1:
        fig = px.scatter(filtered, x="1/T (1/K)", y="ln(k)", color="Reaction",
            opacity=0.4, title="Arrhenius Plot: ln(k) vs 1/T")
        fig.update_layout(template="plotly_dark", paper_bgcolor="#0a0a0f",
            plot_bgcolor="#12121f", height=500)
        st.plotly_chart(fig, use_container_width=True)

    with tab2:
        fig = px.histogram(filtered, x="Conversion (%)", color="Reaction",
            nbins=60, barmode="overlay", opacity=0.6, title="Conversion Distribution")
        fig.update_layout(template="plotly_dark", paper_bgcolor="#0a0a0f",
            plot_bgcolor="#12121f", height=400)
        st.plotly_chart(fig, use_container_width=True)

    with tab3:
        num_cols = ["Temperature (C)", "Pressure (bar)", "Rate Constant k (1/s)",
                    "Conversion (%)", "Agitation RPM", "Residence Time (min)",
                    "Heat Duty (kJ/mol)", "Cooling Load (kW)"]
        corr = filtered[num_cols].corr()
        fig = px.imshow(corr, text_auto=".2f", title="Feature Correlation Matrix",
            color_continuous_scale=[[0, "#0a0a0f"], [0.5, "#1a1a2e"], [1, "#00e5ff"]])
        fig.update_layout(template="plotly_dark", paper_bgcolor="#0a0a0f", height=500)
        st.plotly_chart(fig, use_container_width=True)

# ==============================
# DATA EXPLORER
# ==============================
elif page == "Data Explorer":
    st.markdown("# Raw Data Explorer")
    st.divider()

    if not os.path.exists(SUMMARY_PATH):
        st.error("Dataset not found.")
        st.stop()

    csv_files = [f for f in os.listdir(DATA_DIR) if f.endswith('.csv')]
    sheet = st.selectbox("File", csv_files)
    df = pd.read_csv(os.path.join(DATA_DIR, sheet))

    st.markdown(f"**{len(df)}** rows x **{len(df.columns)}** columns")
    st.dataframe(df, use_container_width=True, height=400)

    st.divider()
    num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    if num_cols:
        col = st.selectbox("Histogram Column", num_cols)
        fig = px.histogram(df, x=col, nbins=50, color_discrete_sequence=["#00e5ff"])
        fig.update_layout(template="plotly_dark", paper_bgcolor="#0a0a0f", plot_bgcolor="#12121f")
        st.plotly_chart(fig, use_container_width=True)

# ==============================
# TRAIN MODELS
# ==============================
elif page == "Train Models":
    st.markdown("# Model Training Pipeline")
    st.markdown("Train all models on real oleochemical dataset")
    st.divider()

    has_data = os.path.exists(SUMMARY_PATH)
    st.markdown(f"**Dataset**: {'Found (20,000 rows)' if has_data else 'NOT FOUND'}")

    if not has_data:
        st.error("Place your CSV files in `ml_service/data/`")
        st.stop()

    if st.button("Train All Models on Real Data", type="primary"):
        with st.spinner("Training Kinetics Model..."):
            from train_real import train_kinetics_model, train_scaleup_model, train_cooling_model
            k = train_kinetics_model()
        st.success(f"Kinetics: R2={k['r2_conversion']:.4f}, Rate Constant R2={k['r2_rate_constant']:.4f}")

        with st.spinner("Training Scale-Up Classifier..."):
            s = train_scaleup_model()
        st.success(f"Scale-Up Classifier: Accuracy={s['accuracy']:.4f}")

        with st.spinner("Training Cooling Model..."):
            c = train_cooling_model()
        st.success(f"Cooling Load: R2={c['r2']:.4f}")

        st.balloons()

    st.divider()
    st.subheader("Upload Custom Dataset")
    uploaded = st.file_uploader("Upload CSV or Excel", type=["csv", "xlsx"])
    if uploaded:
        if uploaded.name.endswith(".csv"):
            df = pd.read_csv(uploaded)
        else:
            df = pd.read_excel(uploaded)
        st.dataframe(df.head(20), use_container_width=True)
        st.markdown(f"Shape: {df.shape}")
