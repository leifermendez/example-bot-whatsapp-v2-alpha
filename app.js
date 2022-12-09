const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  addChild,
} = require("@bot-whatsapp/bot");

const WebWhatsappProvider = require("@bot-whatsapp/provider/web-whatsapp");
const MockAdapter = require("@bot-whatsapp/database/mock");

/**
 * Declarando flujo hijo
 */

const flowZapatos = addKeyword(["zapatos", "ZAPATOS"])
  .addAnswer("🤯 Veo que elegiste zapatos")
  .addAnswer("Tengo muchos zapatos...bla bla");

const flowBolsos = addKeyword(["bolsos", "BOLSOS"])
  .addAnswer("🙌 Veo que elegiste bolsos")
  .addAnswer("Tengo muchos bolsos...bla bla");

/**
 * Declarando flujo principal
 */
const flowPrincipal = addKeyword(["hola", "ole", "HOLA"])
  .addAnswer("Bienvenido a mi tienda")
  .addAnswer("_", {
    media: "https://i.imgur.com/LMaruj6.png",
  })
  .addAnswer("Como puedo ayudarte?", {
    delay: 5000,
    buttons: [
      { body: "😎 Cursos" },
      { body: "👉 Youtube" },
      { body: "😁 Telegram" },
    ],
  })
  .addAnswer(["Tengo:", "Zapatos", "Bolsos", "etc.."])
  .addAnswer("Escribe zapatos o bolsos")
  .addAnswer(
    "esperando respuesta...",
    { capture: true },
    () => {
      console.log("Aqui puedes ver más info del usuario...");
      console.log("Puedes enviar un mail, hook, etc..");
    },
    [...addChild(flowBolsos), ...addChild(flowZapatos)]
  );

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowPrincipal]);
  const adapterProvider = createProvider(WebWhatsappProvider);

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
};

main();
