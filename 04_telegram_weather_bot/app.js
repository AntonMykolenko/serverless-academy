import TgBot from "node-telegram-bot-api";
import weather from "./utils/weatherBotUtils.js";

import dotenv from "dotenv";

dotenv.config();

const bot = new TgBot(process.env.BOT_KEY, { polling: true });

const keyboard = {
    keyboard:[[{ text: "Get weather forecast" }]]
};

bot.setMyCommands([
    { command: 'start', description: 'Start bot' },
    { command: 'forecast', description: 'Get forecast' }
]);

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Hello! I am bot.',
        {
            reply_markup: JSON.stringify(keyboard),
        }
    );
});

bot.onText(/(Go back to main menu)/, (msg) => {
    bot.sendMessage(msg.chat.id, "Choose option", {
        reply_markup: JSON.stringify(keyboard),
    });
});


weather(bot, keyboard);