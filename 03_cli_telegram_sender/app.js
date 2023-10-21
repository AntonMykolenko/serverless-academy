import { Command } from "commander";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.TOKEN;
const chatID = process.env.ID;

const bot = new TelegramBot(token, { polling: true });
const program = new Command();

program
    .command("message")
    .description("send message to bot")
    .argument("<string>", "message to send")
    .action((message) => {
        bot.sendMessage(chatID, message);
    });
program
    .command("image")
    .description("send image to bot")
    .argument("<string>", "path to photo")
    .action((pathToPhoto) => {
        bot.sendPhoto(chatID, pathToPhoto);
    });

program.parse();