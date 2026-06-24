import React, { useEffect, useRef } from "react";
import SenegalMapSVG from "../../../public/images/sn_fixed.svg?react";
import { ID_MAP } from "../../constants/region";
import { useWeatherContext } from "../../context/WeatherContext";
import regionCoords from "../../utils/regionsCoord";
import Layout from "../layout/Layout";
import Wind from "../animations/wind";
import DetailWeather from "../weatherAside/detailWeather";

const REGION_IDS = Object.values(ID_MAP);

const SenegalMap = () => {
  const containerRef = useRef(null);
  const {
    selectRegion,
    selectedRegion,
    weatherData,
    allRegionsWeather,
    loading,
  } = useWeatherContext();

  const normalize = (value) => {
    if (!value) return "";
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Fonction pour déterminer la couleur de base selon la température
  const getColorByTemp = (temp) => {
    if (temp === undefined || temp === null) return "#316b45";
    if (temp < 30) return "#316b45"; 
    if (temp >= 30 && temp <= 35) return "#f0e445";
    return "#b80606"; 
  };

  useEffect(() => {
    const svg = containerRef.current?.querySelector("svg");

    if (!svg) return;

    // Nettoyage des anciens textes pour éviter les doublons lors des mises à jour
    svg.querySelectorAll("text").forEach(text => text.remove());

    Object.entries(ID_MAP).forEach(([oldId, newId]) => {
      const el = svg.querySelector(`#${oldId}`);
      if (!el) return;
      el.setAttribute("id", newId);
      el.style.cursor = "pointer";
      el.style.stroke = "#ffffff";
      el.style.strokeWidth = "1.5";
      el.style.transition = "fill 0.2s ease, opacity 0.2s ease";
    });

    REGION_IDS.forEach((id) => {
      const region = svg.querySelector(`#${id}`);
      const regionTempData = allRegionsWeather?.find(
        (region) => normalize(region.nom) === normalize(regionCoords[id].nom),
      );

      if (!region) return;

      const temp = regionTempData?.temp;
      const baseColor = getColorByTemp(temp);
      const isSelected = selectedRegion && normalize(selectedRegion.nom) === normalize(regionCoords[id].nom)

      // Appliquer la couleur initiale dynamique
      region.style.fill = isSelected ? "#e7864d" : baseColor;

      const box = region.getBBox();

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      )

      const tempText = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      text.textContent = id;
      tempText.textContent = temp !== undefined ? `${Math.round(temp)}°C` : "";

      text.setAttribute("x", `${box.x + box.width / 2}`);
      text.setAttribute("y", `${box.y + box.height / 2 - 10}`);
      tempText.setAttribute("x", `${box.x + box.width / 2}`);
      tempText.setAttribute("y", `${box.y + box.height / 2 + 13}`);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      tempText.setAttribute("text-anchor", "middle");
      tempText.setAttribute("dominant-baseline", "middle");

      text.setAttribute("fill", "white");
      text.setAttribute("font-size", "18");
      text.setAttribute("font-weight", "800");
      text.setAttribute("pointer-events", "none");
      tempText.setAttribute("fill", "#1f241f");
      tempText.setAttribute("font-size", "16");
      tempText.setAttribute("font-weight", "500");
      tempText.setAttribute("pointer-events", "none");

      svg.appendChild(text);
      svg.appendChild(tempText);

      const onEnter = () => {
        region.style.opacity = "0.8"; 
      };

      const onLeave = () => {
        region.style.opacity = "1";
        
      };

      const onClick = () => {
        selectRegion(regionCoords[id]);
      };

      region.removeEventListener("mouseenter", onEnter);
      region.removeEventListener("mouseleave", onLeave);
      region.removeEventListener("click", onClick);

      region.addEventListener("mouseenter", onEnter);
      region.addEventListener("mouseleave", onLeave);
      region.addEventListener("click", onClick);
    });
  }, [allRegionsWeather,selectedRegion]);

  return (
    <Layout>
      <div className="h-full w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] -m-4 md:-m-6 bg-gradient-to-r from-zinc-900 via-gray-800 to-zinc-900 overflow-hidden flex items-center justify-center relative">
        <div className="relative p-4" ref={containerRef}>
          <SenegalMapSVG className="w-full h-auto max-h-[75vh] object-contain" />
          <Wind
            svgRef={containerRef}
            regionWeather={allRegionsWeather}
            regionCoords={regionCoords}
          />
        </div>
        
        <div
          className={`fixed top-0 right-0 z-50 h-full w-80 transition-transform duration-300 ease-in-out ${
            selectedRegion ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <DetailWeather
            nom={selectedRegion?.nom}
            temp={weatherData?.main?.temp}
            feels_like={weatherData?.main?.feels_like}
            weather={weatherData?.weather[0]?.icon}
            selectRegion={selectRegion}
            humidity={weatherData?.main?.humidity}
            wind={weatherData?.wind?.speed}
            sea_level={weatherData?.main?.sea_level}
            sunrise={weatherData?.sys?.sunrise}
            sunset={weatherData?.sys?.sunset}
            region={selectedRegion}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SenegalMap;
