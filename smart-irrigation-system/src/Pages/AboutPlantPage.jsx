import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import back from "../images/backTrack.png";
import { getDatabase, ref, get } from "firebase/database";
import All from "../components/AboutPlantPage/All";
import "../styles/AboutPlant.css";

export default function AboutPlantPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const [plant, setPlant] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingThresholds, setLoadingThresholds] = useState(true)
    const [idealConditions, setIdealConditions] = useState(null)
    const [active, setActive] = useState('all')

    const [all, setAll] = useState(1)
    const [ph, setPh] = useState(null)
    const [humidity, setHumidity] = useState(null)
    const [npk, setNpk] = useState(null)


    useEffect(() => {
        if (location.state && location.state.plantObject) {
            setPlant(location.state.plantObject)
            setLoading(false)
            fetchPlantTypeThresholds(location.state.plantObject.type)
        } else {
            console.log("No plant data received in navigation state");
            setLoading(false)
        }
    }, [location, navigate])

    const fetchPlantTypeThresholds = async (plantType) => {
        try {
            setLoadingThresholds(true);
            const db = getDatabase();
            // Use encodeURIComponent to handle special characters in plant type names
            const plantTypeRef = ref(db, `plantTypes/${encodeURIComponent(plantType)}`);
            
            const snapshot = await get(plantTypeRef);
            if (snapshot.exists()) {
                setIdealConditions(snapshot.val());
                console.log("Fetched ideal conditions:", snapshot.val());
            } else {
                console.log("No threshold data found for plant type:", plantType);
            }
        } catch (error) {
            console.error("Error fetching plant type thresholds:", error);
        } finally {
            setLoadingThresholds(false);
        }
    };

    // Render loading state while plant data is being set
    if (loading) {
        return <div>Loading plant data...</div>;
    }

    function toggleButton (event) {
        if(event.currentTarget.dataset.all){
            setAll(1)
            setHumidity(null)
            setNpk(null)
            setPh(null)
            setActive('all')
        }
        if(event.currentTarget.dataset.ph){
            setAll(null)
            setHumidity(null)
            setNpk(null)
            setPh(1)
            setActive('ph')
        }
        if(event.currentTarget.dataset.humidity){
            setAll(null)
            setHumidity(1)
            setNpk(null)
            setPh(null)
            setActive('humidity')
        }
        if(event.currentTarget.dataset.npk){
            setAll(null)
            setHumidity(null)
            setNpk(1)
            setPh(null)
            setActive('npk')
        }
    }

    function isHealthy() {
        if (!plant || !idealConditions) return false
        
        const pHDiff = Math.abs(plant.metrics.pHLevel - idealConditions.metrics.pHLevel)
        const isPHGood = pHDiff <= 0.5
        
        const currentHumidity = parseFloat(plant.metrics.humidity.replace('%', ''))
        const idealHumidity = idealConditions.metrics.humidity
        const humidityDiff = Math.abs(currentHumidity - idealHumidity)
        const isHumidityGood = humidityDiff <= 10
        
        const currentNitrogen = parseFloat(plant.metrics.nutrients.nitrogen.replace('%', ''))
        const currentPhosphorus = parseFloat(plant.metrics.nutrients.phosphorus.replace('%', ''))
        const currentPotassium = parseFloat(plant.metrics.nutrients.potassium.replace('%', ''))
        
        const idealNitrogen = idealConditions.metrics.nutrients.nitrogen;
        const idealPhosphorus = idealConditions.metrics.nutrients.phosphorus;
        const idealPotassium = idealConditions.metrics.nutrients.potassium;
        
        const isNitrogenGood = currentNitrogen >= idealNitrogen * 0.7
        const isPhosphorusGood = currentPhosphorus >= idealPhosphorus * 0.7
        const isPotassiumGood = currentPotassium >= idealPotassium * 0.7
        
        return isPHGood && isHumidityGood && isNitrogenGood && isPhosphorusGood && isPotassiumGood
      }

    return (
        <>
            <header className="header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <img src={back} alt="go back" />
                </button>
                <h1 className="plantName">{plant.name}</h1>
            </header>
            <main className="all-content">
                <section>
                    {plant.imageUrl && <img src={plant.imageUrl} alt={plant.name}  className="image"/>}
                    <div className="intro-container">
                        <h1 className="main-name">{plant.name}</h1>
                        <p className={isHealthy()? "Healthy": "Unhealthy"}>{isHealthy()? "Healthy": "Unhealthy"}</p>
                    </div>
                    <h2 className="plant-type">Plant Type: {plant.type}</h2>
                </section>

                <section className="button-container">
                    <button onClick={toggleButton} data-all="true" className={`tab-about  ${active==='all'&& "selected"}`}>All</button>
                    <button onClick={toggleButton} data-ph="true" className={`tab-about  ${active==='ph'&& "selected"}`}>PH Level</button>
                    <button onClick={toggleButton} data-humidity="true" className={`tab-about  ${active==='humidity'&& "selected"}`}>Humidity</button>
                    <button onClick={toggleButton} data-npk="true" className={`tab-about  ${active==='npk'&& "selected"}`}>NPK</button>
                </section>
                
                <section>
                    {all && (
                        <All plant = {plant} idealConditions = {idealConditions}/>
                    )}

                    {ph &&(
                        <h1>Ph tab</h1>
                    )}

                    {humidity&& (
                        <h1>humidity tab</h1>
                    )}

                    {npk && (
                        <h1>NPK tab</h1>
                    )}
                    
                </section>       
            </main>
            <Footer />
        </>
    );
}