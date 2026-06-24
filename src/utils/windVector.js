/*
Ce code a pour but de convertir un angle en radians en un vecteur de déplacement.
Math cos et Math sin permettent de calculer les coordonées x et y du vecteur de déplacement.
*/

const getWindVector = (deg) => {
  const rad = (deg * Math.PI) / 180;

  return {
    x: Math.cos(rad),
    y: Math.sin(rad),
  };
};

export default getWindVector;
