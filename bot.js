//set up environment variables
// require('dotenv').config();
import 'dotenv/config';
import { initializeApp } from 'firebase/app';
//import relevent classes from discord.js
// const { Client, Intents } = require('discord.js');
import { Client, MessageEmbed } from 'discord.js';
import { botIntents, commands, prefix } from './config/config.js';

//instantiate a client with parameters
const client = new Client({
  intents: botIntents,
});

//Notify when running
client.on('ready', function (e) {
  console.log(`Logged in as ${client.user.tag}!`);
});

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,

  authDomain: 'ladiscordbot.firebaseapp.com',

  databaseURL: 'https://ladiscordbot-default-rtdb.firebaseio.com',

  projectId: 'ladiscordbot',

  storageBucket: 'ladiscordbot.appspot.com',

  messagingSenderId: '505785205450',

  appId: '1:505785205450:web:32b39e8a7ff8ef4848aa33',

  measurementId: 'G-9FB5T3XEGH',
};
client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;

  const userCmd = msg.content.slice(prefix.length);
  switch (userCmd) {
    case 'hello': {
      const embeded = new MessageEmbed()
        .setColor('ORANGE')
        .setTitle('Message Hello World')
        .setDescription(`world`)
        .addFields({ name: 'wefewfwe', value: 'aewfokwefokwef' })
        .setFooter(null);
      await msg.channel.send({ embeds: [embeded] });
      break;
    }
    default:
      msg.reply('I do not understand your command');
  }
});

//Authenticate
client.login(process.env.DISCORD_TOKEN);
