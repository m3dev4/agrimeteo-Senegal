import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TemperatureChart = ({ weatherData }) => {
  // Extraction sécurisée des données adaptées aux deux structures possibles (directe ou imbriquée)
  const currentTemp = weatherData?.main?.temp ?? weatherData?.temp;
  const currentFeelsLike = weatherData?.main?.feels_like ?? weatherData?.feels_like;

  // Générer les données du graphique à partir des données météo
  const chartData = useMemo(() => {
    if (!currentTemp) return [];

    const baseTemp = currentTemp;
    const data = [];
    const now = new Date();
    
    // Générer des données sur 7 jours
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const hour = date.getHours();
      let variation = 0;
      
      // Simuler une variation réaliste sur la journée
      if (hour >= 6 && hour <= 12) {
        variation = (hour - 6) * 0.3;
      } else if (hour > 12 && hour <= 18) {
        variation = 1.8 - (hour - 12) * 0.2;
      } else if (hour > 18 && hour <= 24) {
        variation = 0.6 - (hour - 18) * 0.1;
      } else {
        variation = -1.2 + hour * 0.05;
      }
      
      const randomVariation = (Math.random() - 0.5) * 0.8;
      
      const tempMin = baseTemp + variation - 1.5 + randomVariation;
      const tempMax = baseTemp + variation + 1.5 + randomVariation;
      const tempAvg = (tempMin + tempMax) / 2;
      
      const day = date.toLocaleDateString('fr-FR', { 
        weekday: 'short',
        day: '2-digit'
      });
      
      data.push({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        min: Math.round(tempMin * 10) / 10,
        avg: Math.round(tempAvg * 10) / 10,
        max: Math.round(tempMax * 10) / 10,
      });
    }
    
    return data;
  }, [currentTemp]);

  // Si pas de données ou données vides
  if (!currentTemp || chartData.length === 0) {
    return (
      <div className="h-40 w-full flex items-center justify-center text-xs text-gray-400">
        Aucune donnée disponible
      </div>
    );
  }

  // Calcul des min/max pour le domaine Y
  const time = chartData.flatMap((d) => [d.min, d.max]);
  const min = Math.floor(Math.min(...time)) - 1;
  const max = Math.ceil(Math.max(...time)) + 1;

  // Statistiques
  const avgAll = chartData.reduce((s, d) => s + d.avg, 0) / chartData.length;
  const minAll = Math.min(...chartData.map((d) => d.min));
  const maxAll = Math.max(...chartData.map((d) => d.max));

  // Mapping des labels pour le tooltip
  const labelMap = {
    max: "Maximum",
    avg: "Moyenne",
    min: "Minimum",
  };

  return (
    <div className="w-full text-slate-200">
      {/* En-tête avec informations */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h4 className="text-xs font-semibold text-gray-100">
          Évolution des températures (7 jours)
        </h4>
        <div className="flex items-center gap-3 text-[11px]">
          <Stat label="Min" value={Math.round(minAll)} color="#42a5f5" />
          <Stat label="Moy" value={Math.round(avgAll)} color="#4caf50" />
          <Stat label="Max" value={Math.round(maxAll)} color="#ff9800" />
        </div>
      </div>

      {/* Graphique */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 6, right: 6, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="maxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff9800" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#ff9800" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4caf50" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#4caf50" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#42a5f5" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#42a5f5" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[min, max]}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={35}
              tickFormatter={(v) => `${v}°`}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(15,23,42,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                color: "#f8fafc",
                fontSize: 11,
              }}
              labelStyle={{ color: "#cbd5e1" }}
              formatter={(v, name) => [`${v}°C`, labelMap[name] ?? name]}
            />

            <Area
              type="monotone"
              dataKey="max"
              stroke="#ff9800"
              strokeWidth={1.5}
              fill="url(#maxGrad)"
              animationDuration={500}
            />

            <Area
              type="monotone"
              dataKey="avg"
              stroke="#4caf50"
              strokeWidth={2}
              fill="url(#avgGrad)"
              animationDuration={500}
            />

            <Area
              type="monotone"
              dataKey="min"
              stroke="#42a5f5"
              strokeWidth={1.5}
              fill="url(#minGrad)"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Informations supplémentaires adaptées au thème sombre */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-white/5 border border-white/5 rounded-xl">
          <p className="text-[10px] text-gray-400">Max</p>
          <p className="text-sm font-bold text-orange-400">{Math.round(maxAll)}°C</p>
        </div>
        <div className="p-2 bg-white/5 border border-white/5 rounded-xl">
          <p className="text-[10px] text-gray-400">Moyenne</p>
          <p className="text-sm font-bold text-green-400">{Math.round(avgAll)}°C</p>
        </div>
        <div className="p-2 bg-white/5 border border-white/5 rounded-xl">
          <p className="text-[10px] text-gray-400">Min</p>
          <p className="text-sm font-bold text-blue-400">{Math.round(minAll)}°C</p>
        </div>
      </div>

      {/* Température actuelle adaptée au thème sombre */}
      <div className="mt-3 p-3 bg-white/5 border border-white/5 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] text-gray-400">Actuelle</p>
            <p className="text-xl font-bold text-white">{Math.round(currentTemp)}°C</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400">Ressenti</p>
            <p className="text-sm font-semibold text-gray-300">{Math.round(currentFeelsLike)}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Réparation du composant Stat réutilisable découpé
function Stat({ label, value, color }) {
  return (
    <div className="flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-gray-400">{label}:</span>
      <span className="font-medium text-white">{value}°</span>
    </div>
  );
}

export default TemperatureChart;
