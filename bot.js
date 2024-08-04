import axios from 'axios';
import dotenv from 'dotenv'
import TelegramBot from 'node-telegram-bot-api';
dotenv.config();
const TOKEN =process.env.BOTTOKEN;
const CHAT_ID = process.env.GROUP_CHAT_ID;
const bot = new TelegramBot(TOKEN, { polling: true });

//Geetinng the CHAT ID


// bot.on('message', (msg) => {
//   console.log('Chat ID:', msg.chat.id);
// });


//Testing the bot to send Greeting Message
const sendHelloMessage = async () => {
  try {
    await bot.sendMessage(CHAT_ID, 'Hello From WikiGyan Bot.');
    await bot.sendMessage(CHAT_ID, 'Radom Article of the day.');
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

//Fetching a Random Wikipedia Article using Wikipedia API and AXIOS 
const fetchArticle = async () => {
  try {
    const { data } = await axios.get('https://en.wikipedia.org/api/rest_v1/page/random/summary');
    const { title, extract, content_urls, thumbnail } = data;
    const articleUrl = content_urls.desktop.page;
    const thumbnailUrl = thumbnail ? thumbnail.source : null;
    return {
      title,
      summary: extract,
      url: articleUrl,
      thumbnail: thumbnailUrl
    };
  } catch (error) {
    console.error('Error fetching Wikipedia article:', error);
    return null;
  }
};

//Function to post article to Telegram
const postToTelegram = async (title, summary, url, thumbnail) => {
  try {
    const message = `*${title}*\n\n${summary}\n\n[Read more](${url})`;
    await bot.sendPhoto(CHAT_ID, thumbnail, { caption: message, parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
};

const main = async () => {
  sendHelloMessage();
  const article = await fetchArticle();
  if (article) {
    await postToTelegram(article.title, article.summary, article.url, article.thumbnail);
  }
};
main();
