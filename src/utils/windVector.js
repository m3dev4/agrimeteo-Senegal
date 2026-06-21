const getWindVector = (deg) => {
  const rad = (deg * Math.PI) / 180;

  return {
    x: Math.cos(rad),
    y: Math.sin(rad),
  };
};

export default getWindVector;