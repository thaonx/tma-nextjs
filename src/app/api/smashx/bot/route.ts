export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const token = process.env.SMASHX_TELEGRAM_BOT_TOKEN;

if (!token)
  throw new Error("SMASHX_TELEGRAM_BOT_TOKEN environment variable not found.");
import { Bot, Context, session, SessionFlavor, webhookCallback } from "grammy";

const bot = new Bot(token);

// handle message:text event
bot.on("message:text", async (ctx) => {
  console.log("ctx.from", ctx.from);
  const appUrl = process.env.SMASHX_APP_URL_SMASH as string;
  const userName = ctx.from?.username;
  const replyMessage = `Hello @${userName} Welcome to SmashX bot!`;
  ctx.reply(replyMessage, {
    entities: [
      // { type: "mention", offset: 6, length: 8 },
      { type: "bold", offset: 0, length: 5 },
    ],
    reply_markup: {
      // keyboard: [[{ text: "Start Mini App", web_app: { url: appUrl } }]],
      inline_keyboard: [
        [{ text: "Play Now", web_app: { url: appUrl } }],
        [
          { text: "Red", callback_data: "Red" },
          { text: "Blue", callback_data: "Blue" },
        ],
      ],
      // keyboard: [
      //   [{ text: "Red" }, { text: "Blue" }],
      //   [{ text: "Green" }],
      // ],
    },
  });
});

// handle callback_query event
bot.on("callback_query", async (ctx) => {
  console.log("ctx.callbackQuery", ctx.callbackQuery);
  ctx.answerCallbackQuery("You clicked on " + ctx.callbackQuery.data);
});

export const POST = webhookCallback(bot, "std/http");
