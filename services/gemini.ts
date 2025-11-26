import { GoogleGenAI } from "@google/genai";
import { SimulationData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRealEstateScenario = async (data: SimulationData): Promise<string> => {
  const prompt = `
Sos “El Simulador del Futuro Inmobiliario”. 
Tu audiencia son personas reales en Argentina/Rioplatenses que están pensando en **COMPRAR** una propiedad, **VENDER** la suya, o mudarse.

Tu misión es detectar cuál es la intención del usuario (Comprador vs. Vendedor) basándote en la selección inicial y mostrarle cómo podría verse su vida de acá a 12 meses según las decisiones que tome hoy.

La persona respondió lo siguiente:

- Selección Inicial (Perfil y Urgencia): ${data.decision_inicial}
- Qué quiere lograr: ${data.que_quiero}
- Por qué quiere hacer ese cambio (motivos emocionales y personales): ${data.por_que}
- Dónde se imagina viviendo: ${data.donde}
- Cómo piensa financiar el cambio: ${data.como}
- Cuándo imagina tomar acción: ${data.cuando}
- Detalles adicionales sobre el cuándo: ${data.cuando_detalle}
- Con quién toma o comparte esta decisión: ${data.con_quien}
- Detalles adicionales sobre las personas involucradas: ${data.con_quien_detalle}

En base a toda esta información:
1.  **DETECTÁ EL PERFIL:** Buscá en "Selección Inicial" si dice "PERFIL: COMPRADOR" o "PERFIL: VENDEDOR". Esto es clave para el enfoque.
2.  **GENERÁ EL INFORME:** Escribí un relato en segunda persona (usando "vos") respondiendo a estas partes:

1) **Diagnóstico Situacional:** Describí brevemente dónde está parada la persona hoy emocionalmente (ej: si es comprador, la ansiedad de no tener lo propio o el cansancio de alquilar; si es vendedor, la carga de la casa actual o la necesidad de liquidez). Tené muy en cuenta la **urgencia** que manifestó (decidir ya vs. esperar).

2) **Escenario DE ACCIÓN (Si compra/vende en 12 meses):**
    - **Nivel de estrés:** ¿Por qué? (Ej: mudanza, obra, deuda si compra; trámites, despedida si vende).
    - **Economía:** Sensación de control financiero. (Ej: "Ya no tirás plata en alquiler" o "Tenés el capital en mano").
    - **Calidad de vida:** Tiempo, entorno, disfrute del nuevo espacio.
    - **Relaciones:** ¿Cómo impactó el movimiento en la pareja/familia?
    - **Emoción dominante:** (Orgullo, alivio, entusiasmo, etc.).
    - **Escena concreta:** Una imagen mental del día a día en ese futuro.

3) **Escenario DE INACCIÓN (Si espera o no hace nada):**
    - ¿Cómo se siente quedarse igual? (Ej: precios que suben y alejan el sueño para el comprador; casa que se deteriora o expensas que comen ahorro para el vendedor).
    - Consecuencias emocionales de la postergación.

4) **Cierre:** 2 o 3 frases contundentes, sin agresividad pero claras.
    - "En los inmuebles no elegimos solo ladrillos. Elegimos futuros."
    - Adaptadas a si es comprador ("El metro cuadrado más caro es el que no se compra a tiempo") o vendedor ("La casa que no se vende hoy es la mochila de mañana"), o frases generales existenciales.

**Tono general:**
- Humano, directo, cálido, rioplatense (usá "vos").
- Sin tecnicismos financieros duros.
- No des consejos de inversión, enfocate en la vida y la emoción.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 16000 }, // High budget for deep reasoning
      }
    });
    
    return response.text || "Hubo un error generando tu simulación. Por favor, intentá de nuevo.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Lo siento, tuve un problema conectando con el simulador. Por favor verificá tu conexión e intentá nuevamente.";
  }
};