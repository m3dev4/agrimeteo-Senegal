export const getAiAdvice = async ({ region, temp, humidity, score, label }) => {
  const url = "https://openrouter.ai/api/v1/chat/completions";
  const apiKey = import.meta.env.VITE_OPENROUTER_KEY_API;
  const modelAi = import.meta.env.VITE_OPENROUTER_MODEL;

  const prompt = `Région: ${region}. Temp: ${temp}°C, Humidité: ${humidity}%, 
    Score risque: ${score}/100 (${label}). 
    Donne un conseil agricole pratique en 2 phrases max pour un agriculteur sénégalais.`;

  try {
    console.log("debut du fetching");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelAi,
        messages: [
          {
            role: "user",
            content: prompt, 
          },
        ],
        temperature: 0.3,
        max_tokens: 150,
        repetition_penalty: 1.1,
        top_p: 0.95,
      }),
    });

    console.log("status:", res.status);

    if (!res.ok) throw new Error(`Erreur API : ${res.status}`);

    const data = await res.json();
    console.log("réponse IA:", data);

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'api", error);
    return "";
  }
};
