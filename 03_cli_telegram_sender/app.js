import { Command } from "commander";
import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();

const token = process.env.TOKEN;
const chatID = process.env.ID;

const bot = new TelegramBot(token, { polling: true });
const program = new Command();

program
    .command("send-message")
    .description("send message to bot")
    .argument("<string>", "message to send")
    .action((message) => {
        bot.sendMessage(chatID, message)
            .then(() => {
                console.log("Message sent successfully.");
                process.exit(0); 
            })
            .catch((error) => {
                console.error("Error sending the message:", error);
                process.exit(1); 
            });
    });

program
    .command("send-photo")
    .description("send image to bot")
    .argument("<string>", "path to photo")
    .action((pathToPhoto) => {
        bot.sendPhoto(chatID, pathToPhoto)
            .then(() => {
                console.log("Photo sent successfully.");
                process.exit(0);
            })
            .catch((error) => {
                console.error("Error sending the photo:", error);
                process.exit(1); 
            });
    });

program.parse();
