import {
  Droplets,
  WavesArrowUp,
  Wind,
  RefreshCcw,
  X,
  MapPin,
  Sunrise,
  Sunset,
} from "lucide-react";
import SunCard from "../sunCard";

const DetailWeather = (props) => {
  const handleClose = () => {
    props.selectRegion(null);
  };

  const convertPressure = (pressure) => Math.round(pressure / 100);

  const formatTime = (timestamp) =>
    new Date(timestamp * 1000).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

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

  return (
    <div
      className="
      h-full w-80
      bg-[#1D2430]/70
      backdrop-blur-xl
      text-white
      border border-white/10
      rounded-l-3xl
      shadow-2xl
      overflow-hidden
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
            <RefreshCcw size={17} />
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

      <div className="px-4 space-y-5">
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
        <button className="btn btn-sm w-full mr-5 ">Voir Plus</button>
      </div>
    </div>
  );
};

export default DetailWeather;
