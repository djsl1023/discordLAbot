//set up environment variables
// require('dotenv').config();
import 'dotenv/config';
//import firebase intializations
import { ref, set, child, update, get, remove } from 'firebase/database';
//import relevent classes from discord.js
// const { Client, Intents } = require('discord.js');
import { Client, MessageEmbed } from 'discord.js';
import { botIntents, commands, prefix } from './config/config.js';
import admin from 'firebase-admin';

//instantiate a client with parameters
const client = new Client({
  intents: botIntents,
});
// grab commands
const { trackMe, chaos, guardian, procyons, una, rapport, guild, todo, reset } =
  commands;
const staticDailies = [chaos, guardian, procyons, una, rapport, guild];
//initialize firebase app and database
const app = admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(
      Buffer.from(process.env.GOOGLE_CONFIG_64, 'base64').toString('ascii')
    )
  ),
  databaseURL: process.env.DATABASE_URL,
});

const database = app.database();

function createEmbed(obj) {
  return (
    new MessageEmbed()
      .setColor('ORANGE')
      // .setTitle('Todos')
      .addField('Dailies', '\u200B')
      .addFields(
        {
          name: 'Chaos',
          value: obj.chaos ? ':ballot_box_with_check:' : ':x: Incomplete',
          inline: true,
        },
        {
          name: 'Guardian',
          value: obj.guardian ? ':ballot_box_with_check:' : ':x: Incomplete',
          inline: true,
        },
        {
          name: 'Procyons',
          value: obj.procyons ? ':ballot_box_with_check:' : ':x: Incomplete',
          inline: true,
        }
      )
      .addField('\u200B', '+')
      .addFields(
        {
          name: 'Una',
          value: obj.una ? ':ballot_box_with_check:' : ':x: Incomplete',
          inline: true,
        },
        {
          name: 'Rapport',
          value: obj.rapport ? ':ballot_box_with_check:' : ':x: Incomplete',
          inline: true,
        },
        {
          name: 'Guild',
          value: obj.guild ? ':ballot_box_with_check:' : ':x: Incomplete',
          inline: true,
        }
      )
      .setFooter(null)
  );
}

function checkCustom(embed, customObj, dailyType = null, toggle = null) {
  const customObjKeys = Object.keys(customObj);
  if (customObjKeys.length > 0) {
    embed.addField('\u200B', 'Custom');
    customObjKeys.map((customKey) => {
      if (dailyType !== null && customKey === dailyType) {
        customObj[customKey] = toggle;
      }
      embed.addField(
        `${customKey}`,
        customObj[customKey] ? ':ballot_box_with_check:' : ':x: Incomplete',
        true
      );
    });
  }
}

function toggleDaily(userRef, dailyType, message) {
  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        if (staticDailies.includes(dailyType)) {
          const toggle = !snapshot.val()[dailyType];
          const embed = createEmbed({ ...snapshot.val(), [dailyType]: toggle });
          checkCustom(embed, snapshot.val().custom);
          update(userRef, { [dailyType]: toggle });
          message.reply({ embeds: [embed] });
        } else {
          const toggle = !snapshot.val().custom[dailyType];
          const embed = createEmbed({ ...snapshot.val() });
          checkCustom(embed, snapshot.val().custom, dailyType, toggle);
          const customRef = child(userRef, '/custom/');
          update(customRef, { [dailyType]: toggle });
          message.reply({ embeds: [embed] });
        }
      } else {
        console.log('Error No snapshot available');
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
//Notify when running
client.on('ready', function (e) {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;

  const userCmd = msg.content.slice(prefix.length);
  const userId = msg.author.username;
  switch (userCmd) {
    case trackMe: {
      try {
        const reference = ref(database, 'users');
        const userRef = child(reference, userId);
        set(userRef, {
          chaos: false,
          guardian: false,
          procyons: false,
          una: false,
          rapport: false,
          guild: false,
          custom: { test1: false, test2: false },
        });
        msg.channel.send('Now tracking your dailies!');
      } catch (err) {
        console.log(err);
      }
      break;
    }
    case todo: {
      const reference = ref(database, '/users/' + userId);
      get(reference)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const embed = createEmbed(snapshot.val());
            checkCustom(embed, snapshot.val().custom);
            msg.reply({ embeds: [embed] });
          } else {
            console.log('Error No snapshot available');
          }
        })
        .catch((error) => {
          console.error(error);
        });
      break;
    }
    case chaos: {
      try {
        const reference = ref(database, '/users/' + userId);
        toggleDaily(reference, chaos, msg);
        break;
      } catch (err) {
        console.log(err);
      }
      break;
    }
    case guardian: {
      try {
        const reference = ref(database, '/users/' + userId);
        toggleDaily(reference, guardian, msg);
        break;
      } catch (err) {
        console.log(err);
      }
      break;
    }
    case procyons: {
      try {
        const reference = ref(database, '/users/' + userId);
        toggleDaily(reference, procyons, msg);
        break;
      } catch (err) {
        console.log(err);
      }
      break;
    }
    case una: {
      try {
        const reference = ref(database, '/users/' + userId);
        toggleDaily(reference, una, msg);
        break;
      } catch (err) {
        console.log(err);
      }
      break;
    }
    case rapport: {
      try {
        const reference = ref(database, '/users/' + userId);
        toggleDaily(reference, rapport, msg);
        break;
      } catch (err) {
        console.log(err);
      }
      break;
    }
    case guild: {
      try {
        const reference = ref(database, '/users/' + userId);
        toggleDaily(reference, guild, msg);
        break;
      } catch (err) {
        console.log(err);
      }
      break;
    }
    case reset: {
      try {
        const userRef = ref(database, '/users/' + userId);
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            staticDailies.forEach((daily) => {
              update(userRef, { [daily]: false });
            });
            const customDailyList = Object.keys(snapshot.val().custom);
            if (customDailyList.length > 0) {
              const customRef = child(userRef, '/custom/');
              customDailyList.forEach((customDaily) => {
                update(customRef, { [customDaily]: false });
              });
            }
            msg.reply('Successfully reset your todos!');
          }
        });
      } catch (err) {
        console.log(err);
      }
      break;
    }
    default: {
      const userRef = ref(database, '/users/' + userId);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const customKeys = Object.keys(snapshot.val().custom);
          if (userCmd.slice(0, 4) === 'add ') {
            const newDaily = userCmd.slice(4);
            const addRef = ref(
              database,
              '/users/' + userId + '/custom/' + newDaily
            );
            // const addRef = child(customRef, newDaily);
            set(addRef, false);
            msg.reply(`Added ${newDaily} to customs!`);
            return;
          } else if (customKeys.includes(userCmd)) {
            toggleDaily(userRef, userCmd, msg);
            return;
          } else if (
            userCmd.slice(0, 7) === 'remove ' &&
            customKeys.includes(userCmd.slice(7))
          ) {
            const removeDaily = userCmd.slice(7);
            const removeRef = ref(
              database,
              '/users/' + userId + '/custom/' + removeDaily
            );
            remove(removeRef);
            msg.reply(`Removed ${removeDaily} from customs!`);
          } else {
            msg.reply('I do not understand your command');
          }
        }
      });
    }
  }
});

//Authenticate
client.login(process.env.DISCORD_TOKEN);
