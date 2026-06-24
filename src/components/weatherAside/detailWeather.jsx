import React, { useState, useMemo } from "react";
import {
  Droplets,
  WavesArrowUp,
  Wind,
  RefreshCcw,
  X,
  MapPin,
  Sunrise,
  Sunset,
  AlertTriangle, 
} from "lucide-react";
import SunCard from "../sunCard";
import WeatherSkeleton from "../ui/skeleton";
import TemperatureChart from "../layout/dashboard/TemperatureChart";
import { calculateRisk } from "../../utils/calculateRisk";
import { useEffect } from "react";
import { getAiAdvice } from "../../utils/getAdviceAi";
import { Bot } from "lucide-react";
import { Loader2 } from "lucide-react";

const DetailWeather = (props) => {
  const [showChart, setShowChart] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorAi, setErrorAi] = useState(null);

  const handleClose = () => {
    props.selectRegion(null);
  };

  const convertPressure = (pressure) => Math.round(pressure / 100);

  const formatTime = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Calcul du risque climatique basé sur les props actuelles (température et humidité)
  const risk = useMemo(() => {
    if (props.temp !== undefined && props.humidity !== undefined) {
      return calculateRisk(props.temp, props.humidity);
    }
    return null;
  }, [props.temp, props.humidity]);

  useEffect(() => {
    const region = props.region?.nom;
    const temp = props.temp;
    const humidity = props.humidity;
    const score = risk?.score;
    const label = risk?.label;
    if (props.region) {
      setLoadingAi(true);
      setErrorAi(null);
      getAiAdvice({ region, temp, humidity, score, label })
        .then((data) => {
          setAdvice(data);
        })
        .catch((error) => {
          setErrorAi(error);
        })
        .finally(() => {
          setLoadingAi(false);
        });
    }
  }, [props.region, props.temp, props.humidity]);

  const weatherInfos = [
    {
      icon: Droplets,
      value: `${Math.round(props.humidity)} %`,
      label: "Humidité",
      color: "text-blue-400",
    },
    {
      icon: Wind,
      value: `${Math.round(props.wind)} km/h`,
      label: "Vent",
      color: "text-green-400",
    },
    {
      icon: WavesArrowUp,
      value: `${convertPressure(props.sea_level)} mb`,
      label: "Pression",
      color: "text-cyan-400",
    },
  ];

  const reload = () => {
    props.selectRegion(props.region);
  };

  if (props.loading || props.temp === undefined || props.temp === null) {
    return <WeatherSkeleton />;
  }

  return (
    <div
      className="
      h-full w-80
      bg-[#0F172AF2]/70
      backdrop-blur-xl
      text-white
      border border-white/10
      rounded-l-3xl
      shadow-2xl
      overflow-y-auto
      "
    >
      {/* HEADER */}
      <div className="flex justify-between px-5 pt-6 items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-green-500/10">
              <MapPin size={18} className="text-green-400" />
            </div>

            <h1 className="text-2xl font-semibold">{props.nom}</h1>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="flex gap-2">
          <button className="p-2 hover:bg-white/10 rounded-full transition">
            <RefreshCcw size={17} onClick={reload} />
          </button>

          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-full transition"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      <div className="h-px bg-white/10 my-5 mx-5" />

      <div className="px-4 pb-6 space-y-5">
        {/* TEMPERATURE */}
        <div
          className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-5
          flex
          justify-between
          items-center
          "
        >
          <div>
            <h2 className="text-5xl font-bold">
              {Math.round(props.temp)}
              <span className="text-lg text-gray-300">°C</span>
            </h2>

            <p className="text-sm text-gray-400 mt-2">
              Ressenti : {Math.round(props.feels_like)}°C
            </p>
          </div>

          <img
            src={`https://openweathermap.org/img/wn/${props.weather}@2x.png`}
            alt="weather"
            className="w-20 h-20"
          />
        </div>

        {/* WEATHER INFOS */}
        <div className="grid grid-cols-3 gap-2">
          {weatherInfos.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="
                bg-white/5
                border border-white/10
                rounded-2xl
                py-3
                flex
                flex-col
                items-center
                gap-1
                hover:bg-white/10
                transition
                "
              >
                <Icon size={18} className={item.color} />

                <p className="font-bold text-sm">{item.value}</p>

                <span className="text-[11px] text-gray-400">{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* SUN */}
        <div className="grid grid-cols-2 gap-3">
          <SunCard
            icon={Sunrise}
            image="/images/sunrise.png"
            time={formatTime(props.sunrise)}
            label="Lever du soleil"
          />

          <SunCard
            icon={Sunset}
            image="/images/sunset.png"
            time={formatTime(props.sunset)}
            label="Coucher du soleil"
          />
        </div>

        {/* BUTTON TOGGLE */}
        <button
          onClick={() => setShowChart(!showChart)}
          className="btn btn-sm w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 py-2 rounded-xl transition"
        >
          {showChart ? "Masquer les détails" : "Voir Plus"}
        </button>

        {/* CHART & RISK CONDITIONNELS */}
        {showChart && (
          <div className="space-y-4 transition-all duration-300">
            {/* Graphique de température */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-gray-700">
              <TemperatureChart weatherData={props.weatherData || props} />
            </div>

            {/* Encadrement du Risque Climatique */}
            {risk && (
              <div
                className="rounded-2xl p-4 border border-white/10 flex flex-col items-center justify-center text-center shadow-lg transition-all"
                style={{
                  backgroundColor: `${risk.color}20`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={18} style={{ color: risk.color }} />
                  <span className="text-xs uppercase font-semibold tracking-wider text-gray-300">
                    Analyse de Risque
                  </span>
                </div>

                <strong
                  className="text-lg font-bold"
                  style={{ color: risk.color }}
                >
                  {risk.label}
                </strong>

                <div className="text-sm text-gray-300 mt-1">
                  Score global :{" "}
                  <span className="font-bold text-white">{risk.score}</span> /
                  100
                </div>

                {/* Barre de progression visuelle pour le score */}
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${risk.score}%`,
                      backgroundColor: risk.color,
                    }}
                  />
                </div>
              </div>
            )}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border border-gray-700">
              <h2 className="text-sm font-semibold flex items-center gap-2 mb-3 text-white">
                <Bot size={16} className="text-emerald-400" />
                Conseil du Coach IA
              </h2>

              <div className="text-gray-300 text-xs space-y-2">
                {loadingAi ? (
                  <p className="italic text-gray-500 flex gap-2 items-center justify-center">
                    <Loader2
                      size={18}
                      className="animate-spin text-green-500"
                    />{" "}
                    <span>Génération du conseil...</span>
                  </p>
                ) : errorAi ? (
                  <p className="text-red-400">
                    Erreur de chargement du conseil
                  </p>
                ) : (
                  <p>
                    {advice ||
                      "Pas de conseil disponible pour le moment."}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailWeather;
