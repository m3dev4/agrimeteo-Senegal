# 🌱 Agrimeteo Sénégal

**Agrimeteo Sénégal** est une application web interactive conçue pour fournir aux agriculteurs sénégalais des données météorologiques précises, une analyse des risques climatiques et des conseils générés par Intelligence Artificielle pour optimiser leurs récoltes.

---

## 🛠️ 1. Choix Technologiques & Architecture

Le projet a été développé avec une approche moderne, modulaire et performante, en séparant rigoureusement la logique métier de l'interface utilisateur.

### Stack Technique
*   **React (Vite)** : Framework Front-end choisi pour sa rapidité de rendu et sa gestion réactive de l'interface. Vite offre un environnement de développement ultra-rapide.
*   **Tailwind CSS** : Utilisé pour le styling. Permet de créer une interface sur-mesure, moderne (effets de "Glassmorphism", dégradés, animations fluides) sans écrire de fichiers CSS lourds.
*   **React Context API (`WeatherContext`)** : Utilisé comme gestionnaire d'état global (Global State Management). Il centralise les appels API et évite le *prop-drilling* (le fait de passer des données en cascade entre de nombreux composants).
*   **OpenWeatherMap API** : Fournisseur de données météorologiques en temps réel (température, vent, pression, etc.).
*   **OpenRouter API (IA)** : Intégration d'un modèle d'Intelligence Artificielle pour générer des conseils agricoles personnalisés basés sur le contexte météo actuel.

### Architecture du Projet
*   **`src/context/`** : Contient la logique métier pure (gestion du cache, appels API, mise à jour des états globaux).
*   **`src/components/`** : Composants réutilisables, découpés par fonctionnalité.
    *   **`/map/`** : Gestion complexe de la carte interactive du Sénégal. La carte est un fichier SVG dont le DOM est manipulé dynamiquement pour des raisons de performance.
    *   **`/weatherAside/`** : Panneau latéral d'affichage des détails et du coach IA.
*   **`src/utils/`** : Fonctions utilitaires pures (Calcul de risque, appel IA). Totalement décorrélées des composants React pour faciliter les tests.
*   **`src/hooks/`** : Hooks personnalisés (ex: `useLocalisation`) pour encapsuler la logique du navigateur (GPS).

---

## 🧠 2. Logique Métier : L'Indice de Risque Climatique Agricole

L'une des fonctionnalités phares d'Agrimeteo est son algorithme de calcul de risque. Au lieu de simplement afficher la température, l'application calcule un "Score de Risque" (de 0 à 100) pour alerter l'agriculteur sur les dangers potentiels.

Cet algorithme repose sur la combinaison pondérée de trois "sous-risques" climatiques.

### A. Calcul des Sous-Risques (Indicateurs 0 - 100%)
Les données brutes sont d'abord normalisées sur une échelle de danger :

1.  🔥 **Risque de Chaleur (`heat`)** :
    *   *Seuil de confort* : 28°C (0% de risque).
    *   *Plafond critique* : 46°C (100% de risque).
    *   *Formule* : `((Température - 28) / 18) * 100`

2.  🏜️ **Risque de Sécheresse (`dryness`)** :
    *   Intervient uniquement lorsque l'humidité baisse dangereusement en dessous de 45%.
    *   *Formule* : `((45 - Humidité) / 45) * 100`

3.  💧 **Risque d'Excès d'Humidité (`wet`)** :
    *   Intervient lorsque l'humidité dépasse les 85% (risque de maladies fongiques pour les cultures).
    *   *Formule* : `((Humidité - 85) / 15) * 100`

### B. Le Score Global Pondéré (0 à 100)
Le climat est un équilibre. Le score global est calculé en combinant la chaleur avec le facteur d'humidité dominant, selon la formule suivante :

| Scénario | Formule Appliquée | Explication |
| :--- | :--- | :--- |
| **Climat Sec** (Humidité ≤ 45%) | `(Chaleur * 60%) + (Sécheresse * 40%)` | La chaleur couplée au manque d'eau assèche les sols rapidement. |
| **Climat Humide** (Humidité > 45%) | `(Chaleur * 60%) + (Excès Hum. * 40%)` | La chaleur associée à une forte humidité crée un effet de serre mortel pour les plants. |

### C. Niveaux d'Alerte et Diagnostics
Le score final détermine la couleur et le niveau d'alerte. Un système de "diagnostic" analyse ensuite quel facteur est le plus aggravant pour donner un titre d'alerte précis :

*   🟢 **Score 0 - 25 : Risque Faible** (Conditions optimales).
*   🟡 **Score 26 - 50 : Risque Modéré** (À surveiller).
*   🟠 **Score 51 - 75 : Risque Important** (Action requise).
*   🔴 **Score 76 - 100 : Risque Critique** (Danger immédiat pour les récoltes).

**Affinements des Diagnostics Spéciaux :**
*   Si le score est supérieur à 25, l'algorithme cherche le facteur dominant :
    *   Si Température ≥ 38°C et dominante ➡️ **"Risque Canicule"**
    *   Si Humidité < 35% et dominante ➡️ **"Stress Hydrique"**
    *   Si Humidité > 85% et dominante ➡️ **"Excès d'Humidité"**

---

## 🚀 3. Optimisations et Bonnes Pratiques

*   **Prévention des "Glitches" Visuels** : Utilisation stricte des dépendances dans les `useEffect` (ex: `refreshKey`) pour synchroniser les états de chargement (Skeletons) et éviter l'affichage d'états vides ou de valeurs "NaN" lors des transitions réseau.
*   **Optimisation Réseau** : Possibilité d'implémenter un système de cache dans le `WeatherContext` pour éviter d'atteindre les limites de quota (Rate Limits) des API gratuites.
*   **Sécurité** : Les clés API sensibles (`VITE_OPENWEATHER_KEY_API`, `VITE_OPENROUTER_KEY_API`) sont injectées via des variables d'environnement (`.env`) pour ne jamais être exposées dans le code source.
