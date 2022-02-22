import { Intents } from 'discord.js';

const { DIRECT_MESSAGES, GUILD_MESSAGES, GUILDS } = Intents.FLAGS;

const botIntents = [DIRECT_MESSAGES, GUILD_MESSAGES, GUILDS];

const commands = {
  hello: 'hello',
  trackMe: 'trackme',
  chaos: 'chaos',
  raid: 'raid',
};

const prefix = '!';

export { botIntents, commands, prefix };
