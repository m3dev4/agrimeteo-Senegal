import { useEffect, useState } from "react";

/*
Ce code a pour but de récupérer la position de l'utilisateur et de la stocker dans un state 
On utilise le hook useGeolocalisation qui est un hook personnalisé qui permet de récupérer 
la position de l'utilisateur et de la stocker dans un state 
soit les coordonées de sa position actuelle ou soit la région la plus proche de sa position actuelle.
*/

export const useGeolocalisation = () => {
  const [regionId, setRegionId] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setRegionId({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setStatus("granted");
      },
      () => {
        setStatus("denied");
      },
    );
  }, []);
  return { regionId, status };
};
