import TelegramBot from "node-telegram-bot-api";
import { keyboards } from "./keyboards/keyboards.js";
import { getEurMessage, getUsdMessage } from "./utils/currency.js";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.BOT_KEY;
const bot = new TelegramBot(token, { polling: true });
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "Welcome, please, use provided buttons",
        keyboards.main
    );
});

bot.onText(/Back/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "Welcome, please, use provided buttons",
        keyboards.main
    );
});

bot.onText(/Currency exchange/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        "Please,choose the currency",
        keyboards.currency
    );
});

bot.onText(/USD/, async (msg) => {
    const text = await getUsdMessage();
    bot.sendMessage(msg.chat.id, text, keyboards.currency);
});

bot.onText(/EUR/, async (msg) => {
    const text = await getEurMessage();
    bot.sendMessage(msg.chat.id, text, keyboards.currency);
});