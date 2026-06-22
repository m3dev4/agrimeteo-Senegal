import { createContext, useContext, useEffect, useState } from "react";
import regionCoords from "../utils/regionsCoord";
import { useGeolocalisation } from "../hooks/useLocalisation";

/**
 * Ce provider est responsable de la gestion de l'état de l'application.
 * Il gère la récupération des données météo pour toutes les régions du Sénégal.
 * La fonction selectRegion lui a pour role de récupérer les données météo de la région sélectionnée.
 */

const WeatherContext = createContext(null);

const WeatherProvider = ({ children }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [allRegionsWeather, setAllRegionsWeather] = useState(null);
  const [userWeather, setUserWeather] = useState(null);
  const { regionId, status } = useGeolocalisation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY_API;

  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedRegion) return;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${selectedRegion.lat}&lon=${selectedRegion.lon}&appid=${apiKey}&units=metric&lang=fr`;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
             "Erreur lors de la récupération des données météo.",
          );
        }
        const data = await response.json();

        setWeatherData(data);
        return data;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedRegion, refreshKey]);

  const selectRegion = (region) => {
    setSelectedRegion(region);
    setWeatherData(null);
    setError(null);
    setRefreshKey(prev => prev + 1);
  };

  const getAllWeather = async () => {
    const RegionWeather = await Promise.all(
      Object.values(regionCoords).map(async (region) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${region.lat}&lon=${region.lon}&appid=${apiKey}&units=metric&lang=fr`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données météo");
        }
        const data = await response.json();
        return {
          nom: region.nom,
          temp: data.main.temp,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          winSpeed: data.wind.speed,
          winDeg: data.wind.deg,
        };
      }),
    );
    console.log(RegionWeather);
    setAllRegionsWeather(RegionWeather);
  };

  useEffect(() => {
    const getUserWeather = async () => {
      const lat = regionId?.lat ?? regionCoords["dakar"].lat;
      const lon = regionId?.lon ?? regionCoords["dakar"].lon;

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Une erreur est survenue");
        const data = await response.json();
        setUserWeather(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserWeather();
  }, [regionId, status]);

  useEffect(() => {
    getAllWeather();
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        selectedRegion,
        weatherData,
        error,
        loading,
        selectRegion,
        allRegionsWeather,
        userWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
export default WeatherProvider;

const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error(
      "useWeatherContext doit être utilisé au sein d'un WeatherProvider",
    );
  }
  return context;
};

export { useWeatherContext };
