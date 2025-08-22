import streamlit as st
from PIL import Image
import matplotlib.pyplot as plt

# ---------------------------
# Custom CSS for styling
# ---------------------------

st.markdown("""
<style>
    /* General text color */
    body {
        color: white;
    }
    /* Input widgets */
    .stTextInput input, .stSelectbox select {
        height: 12px !important; /* Further reduced height */
        font-size: 12px !important; /* Smaller font */
    }
    /* Smaller labels */
    label {
        font-size: 12px !important; /* Smaller font for labels */
    }

    /* --- LANDING PAGE STYLES --- */
    .landing-page-wrapper .main {
        background-color: #0b1f15 !important;
    }
    .landing-page-wrapper .stButton>button {
        background-color: #0d2418;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        transition: background-color 0.3s ease;
    }
    .landing-page-wrapper .stButton>button:hover {
        background-color: #15803d; /* green-700 */
        color: white;
    }

    /* --- MAIN APP STYLES --- */
    .main-app-wrapper .main {
        background-color: #000000 !important;
    }

    /* --- REFINED DARK THEME (SHARED) --- */

    /* Main Theme Colors */
    :root {
        --primary-color: #34d399;
        --secondary-color: #15803d;
        --accent-color: #0d2418;
        --background-color: #0b1f15;
        --text-color: #d1d5db;
        --header-color: #122d1e;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------
# Page Config
# ---------------------------
st.set_page_config(page_title="AI Farming System", page_icon="🌾", layout="wide")

# Hide default Streamlit header
st.markdown("""<style>header[data-testid="stHeader"] {display: none;}</style>""", unsafe_allow_html=True)

# ---------------------------
# Page Definitions
# ---------------------------
# PAGES dictionary is for the main app's navigation
PAGES = {
    "👨‍🌾 Registration": "registration",
    "📷 Monitoring": "monitoring",
    "📈 Prices": "prices",
    "☁️ Weather Report": "weather_report"
}

# ---------------------------
# Session State
# ---------------------------
# Initialize session state
if "farmer" not in st.session_state:
    st.session_state["farmer"] = None
if "crop_history" not in st.session_state:
    st.session_state["crop_history"] = []
if "page" not in st.session_state:
    st.session_state.page = "home"  # Default to home page

# ---------------------------
# Page Functions
# ---------------------------

def home():
    """Renders the landing page of the application."""
    # Custom Header
    st.markdown("""
    <div style="background-color: #0d2418; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; color: white;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.5rem; color: #34d399;">🌱</span>
            <h1 style="font-size: 1.25rem; font-weight: 500; margin: 0;">Farm Vision</h1>
        </div>
        <nav>
            <ul style="display: flex; gap: 2rem; list-style: none; margin: 0;">
                <li style="cursor: pointer;">Categories</li>
                <li style="cursor: pointer;">Contact us</li>
                <li style="cursor: pointer;">About us</li>
            </ul>
        </nav>
    </div>
    """, unsafe_allow_html=True)

    # Hero Section
    st.write("&nbsp;") # Spacer
    with st.container():
        col1, col2 = st.columns([1.2, 1], gap="large")
        with col1:
            st.markdown("""
            <div style="background-color: #122d1e; padding: 3rem 2rem; border-radius: 1.5rem; height: 100%;">
                <h2 style="font-size: 2.2rem; font-weight: 300; line-height: 1.5; color: white;">
                    From seed to harvest, we safeguard your plants with intelligent
                    disease prediction for a greener tomorrow
                </h2>
                <p style="color: #d1d5db; margin-top: 1rem; margin-bottom: 1.5rem;">
                    Predict. Protect. Prosper
                </p>
            </div>
            """, unsafe_allow_html=True)
            if st.button("Get Started", key="start_app"):
                st.session_state.page = "registration"
                st.rerun()

        with col2:
            st.image(
                "https://images.unsplash.com/photo-1616627987938-1a5e6e36d2e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                use_container_width=True
            )

def registration():
    st.header("👨‍🌾 Farmer Registration")
    if st.session_state["farmer"] is None:
        with st.form("register_form"):
            name = st.text_input("Full Name")
            phone = st.text_input("Phone Number")
            state = st.text_input("State")
            district = st.text_input("District")
            village = st.text_input("Village")
            crop = st.selectbox("Primary Crop", ["Tomato", "Rice", "Cotton", "Maize", "Wheat"])

            if st.form_submit_button("✅ Register"):
                st.session_state["farmer"] = {
                    "name": name, "phone": phone, "state": state,
                    "district": district, "village": village, "crop": crop
                }
                st.success(f"Welcome {name}! You are registered.")
    else:
        farmer = st.session_state["farmer"]
        st.success(f"Registered as {farmer['name']} ({farmer['crop']})")

def monitoring():
    st.header("📷 Crop Health Monitoring")

    is_registered = st.session_state["farmer"] is not None
    if not is_registered:
        st.warning("Please register first to upload images and run analysis.")

    uploaded_file = st.file_uploader("Upload a crop leaf image", type=["jpg", "jpeg", "png"], disabled=not is_registered)
    if uploaded_file is not None:
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded Crop Image", use_container_width=True)

        if st.button("🔍 Run AI Analysis", disabled=not is_registered):
            # --- Fake AI detection for demo ---
            import random
            health_status = random.choice(["Healthy", "Diseased"])
            if health_status == "Healthy":
                result = {
                    "filename": uploaded_file.name,
                    "status": "Healthy",
                    "disease": "None",
                    "confidence": "95%",
                    "advisory": "No action required"
                }
                st.success("✅ Crop is Healthy (95%)")
            else:
                result = {
                    "filename": uploaded_file.name,
                    "status": "Diseased",
                    "disease": "Early Blight",
                    "confidence": "91%",
                    "advisory": "Spray organic fungicide"
                }
                st.error(f"🛑 Detected: {result['disease']} ({result['confidence']})")
                st.info(f"💡 Advisory: {result['advisory']}")

            # Save to session
            st.session_state["crop_history"].append(result)

    st.header("📊 Crop Health Summary")

    if len(st.session_state["crop_history"]) > 0:
        st.subheader("🖼 Uploaded Images & Results")
        for entry in st.session_state["crop_history"]:
            st.write(f"{entry['filename']}** → {entry['status']} ({entry['disease']})")

        # Pie chart
        healthy = sum(1 for e in st.session_state["crop_history"] if e["status"] == "Healthy")
        diseased = len(st.session_state["crop_history"]) - healthy

        labels = ["Healthy", "Diseased"]
        values = [healthy, diseased]

        fig, ax = plt.subplots()
        ax.pie(values, labels=labels, autopct="%1.1f%%", startangle=90)
        ax.axis("equal")
        st.pyplot(fig)
    else:
        st.info("No crop analysis history yet. Upload an image to see summary.")

def prices():
    st.header("📈 Market Intelligence")

    is_registered = st.session_state["farmer"] is not None
    if not is_registered:
        st.warning("Please register first to view market prices.")

    # Hardcoded mandi data for demo
    market_data = {
        "Tomato": {"Hyderabad": 1200, "Vijayawada": 1100, "Warangal": 1250},
        "Rice": {"Hyderabad": 1800, "Karimnagar": 1750, "Nizamabad": 1850},
        "Cotton": {"Warangal": 6500, "Nalgonda": 6400, "Khammam": 6550}
    }

    crop_choice = st.selectbox("Select your crop", list(market_data.keys()), disabled=not is_registered)
    location = st.selectbox("Select nearest market", list(market_data[crop_choice].keys()), disabled=not is_registered)

    if st.button("📊 Show Market Prices", disabled=not is_registered):
        st.subheader(f"💰 Prices for {crop_choice}")
        prices = market_data[crop_choice]
        st.table(prices)

        best_market = max(prices, key=prices.get)
        st.success(f"🌟 Best price is at *{best_market}* → ₹{prices[best_market]}/qtl")

def weather_report():
    st.header("☁️ Weather Report")

    location_input = ""
    # Check if farmer is registered to get location automatically
    if st.session_state["farmer"] is not None:
        farmer = st.session_state["farmer"]
        location_input = farmer['district']
        st.success(f"📍 Showing weather for your registered location: {location_input}, {farmer['state']}")
    else:
        st.info("Register to see weather for your specific location automatically.")
        location_input = st.text_input("Enter your city or district for a weather forecast", "Hyderabad")

    if not location_input:
        st.warning("Please enter a location to get the weather forecast.")
        return

    # OpenWeatherMap API (replace with your key)
    api_key = "YOUR_OPENWEATHER_API_KEY"
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={location_input}&appid={api_key}&units=metric"

    import requests, datetime
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()

            # Tomorrow’s date
            today = datetime.date.today()
            tomorrow = today + datetime.timedelta(days=1)

            # Filter data for tomorrow
            tomorrow_data = [
                item for item in data["list"]
                if datetime.datetime.fromtimestamp(item["dt"]).date() == tomorrow
            ]

            if tomorrow_data:
                temps = [entry["main"]["temp"] for entry in tomorrow_data]
                weather_conditions = [entry["weather"][0]["description"] for entry in tomorrow_data]

                min_temp = min(temps)
                max_temp = max(temps)
                main_weather = max(set(weather_conditions), key=weather_conditions.count)

                st.write(f"🌡 Min Temp:** {min_temp:.1f}°C")
                st.write(f"🔥 Max Temp:** {max_temp:.1f}°C")
                st.write(f"☁ Weather:** {main_weather.capitalize()}")

                # Farming tips
                if "rain" in main_weather.lower():
                    st.info("💡 Rain expected tomorrow, reduce irrigation.")
                elif max_temp > 35:
                    st.warning("🔥 High temp tomorrow, ensure proper watering.")
                elif min_temp < 15:
                    st.info("❄ Cold conditions tomorrow, protect seedlings.")

                # Optional: show trend chart
                import matplotlib.pyplot as plt
                times = [datetime.datetime.fromtimestamp(entry["dt"]).strftime("%H:%M") for entry in tomorrow_data]
                fig, ax = plt.subplots()
                ax.plot(times, temps, marker="o")
                ax.set_title(f"Tomorrow's Temperature Trend for {location_input.capitalize()}")
                ax.set_xlabel("Time")
                ax.set_ylabel("Temperature (°C)")
                plt.xticks(rotation=45)
                st.pyplot(fig)

            else:
                st.warning("⚠ No forecast data available for tomorrow.")
        else:
            st.error("⚠ Unable to fetch weather data. Please check city name or API key.")
    except Exception as e:
        st.error(f"Error fetching weather: {e}")

# Main App Logic
# ---------------------------
# This logic now decides whether to show the landing page or the main app
if st.session_state.page == "home":
    st.markdown('<div class="landing-page-wrapper">', unsafe_allow_html=True)
    home()
    st.markdown('</div>', unsafe_allow_html=True)
else:
    st.markdown('<div class="main-app-wrapper">', unsafe_allow_html=True)
    st.title("🌱 AI-Powered Field Monitoring & Market Advisory System")

    # --- Navigation Bar for Main App ---
    cols = st.columns(len(PAGES))
    for i, (page_name, page_fn_name) in enumerate(PAGES.items()):
        # Highlight the current page button
        button_type = "primary" if st.session_state.page == page_fn_name else "secondary"
        if cols[i].button(page_name, key=page_fn_name, use_container_width=True, type=button_type):
            st.session_state.page = page_fn_name
            st.rerun()

    st.markdown("---")

    # --- Call the current page function ---
    page_fn = globals()[st.session_state.page]
    page_fn()
    st.markdown('</div>', unsafe_allow_html=True)