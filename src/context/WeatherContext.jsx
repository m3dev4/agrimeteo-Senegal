import { createContext, useContext, useEffect, useState } from "react";
import regionCoords from "../utils/regionsCoord";

const WeatherContext = createContext(null);

const WeatherProvider = ({ children }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [allRegionsWeather, setAllRegionsWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
            data.message || "Erreur lors de la récupération des données météo.",
          );
        }
        const data = await response.json();

        setWeatherData(data);
        console.log(data);

        return data;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedRegion]);

  const selectRegion = (region) => {
    setSelectedRegion(region);
    setWeatherData(null);
    setError(null);
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
        };
      }),
    );
    console.log(RegionWeather);
    setAllRegionsWeather(RegionWeather);
  };

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
