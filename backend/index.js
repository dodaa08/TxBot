import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.Google_GenAI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8B" });


import TelegramBot from "node-telegram-bot-api";

const token = process.env.Telegram_token; // Replace with your token
const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
  
    try {
      const Prompt = `
        So, your role is to behave like a BonkBot and you will respond in that way only:
        ${text.toLowerCase()}
      `;
  
      const result = await model.generateContent(Prompt);
  
      // Log the structure of result.response
      console.log(result.response);
  
      // If the response is an object, extract the text from the appropriate property
      let finalResponse = "";
  
      if (typeof result.response === "string") {
        finalResponse = result.response; // If it's a string, use it directly
      } else if (result.response && result.response.text) {
        finalResponse = result.response.text; // If it's an object with 'text' property, use that
      } else {
        finalResponse = "Sorry, I couldn't generate a valid response.";
      }
  
      console.log(finalResponse);
  
      // Send the final response to the Telegram chat
      bot.sendMessage(chatId, finalResponse);
    } catch (error) {
      console.error(error);
  
      // Send error message to the user
      bot.sendMessage(chatId, `Error: ${error.message}`);
    }
  });
  