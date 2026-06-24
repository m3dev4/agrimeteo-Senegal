export function calculateRisk(temp, humidity) {
  // 1. Calcul des sous-risques avec un plafond strict à 100%
  const heat = Math.max(0, Math.min(100, ((temp - 28) / (46 - 28)) * 100));
  const dryness = Math.max(0, Math.min(100, ((45 - humidity) / 45) * 100));
  const wet = Math.max(0, Math.min(100, ((humidity - 85) / 15) * 100));
  
  // 2. Score pondéré dynamique (Somme des coefficients = 1.00)
  let score = 0;
  if (humidity <= 45) {
    score = Math.round(heat * 0.60 + dryness * 0.40);
  } else {
    score = Math.round(heat * 0.60 + wet * 0.40);
  }
  
  // 3. Définition du niveau et de la couleur
  let level, baseLabel, color;
  if (score <= 25) { 
    level = "low"; baseLabel = "Risque Faible"; color = "#4caf50"; 
  } else if (score <= 50) { 
    level = "moderate"; baseLabel = "Risque Modéré"; color = "#ffc107"; 
  } else if (score <= 75) { 
    level = "high"; baseLabel = "Risque Important"; color = "#ff9800"; 
  } else { 
    level = "critical"; baseLabel = "Risque Critique"; color = "#f44336"; 
  }

  // 4. Affinement précis du libellé selon le facteur critique
  let label = baseLabel;
  if (level !== "low") {
    if (temp >= 38 && heat >= Math.max(dryness, wet)) {
      label = "Risque Canicule";
    } else if (humidity < 35 && dryness > heat) {
      label = "Stress Hydrique";
    } else if (humidity > 85 && wet > heat) {
      label = "Excès d'Humidité";
    }
  }
  
  return { score, label, color, level };
}
