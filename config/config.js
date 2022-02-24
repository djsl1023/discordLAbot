import { Intents } from 'discord.js';

const { DIRECT_MESSAGES, GUILD_MESSAGES, GUILDS } = Intents.FLAGS;

const botIntents = [DIRECT_MESSAGES, GUILD_MESSAGES, GUILDS];

const commands = {
  hello: 'hello',
  trackMe: 'trackme',
  todo: 'todo',
  chaos: 'chaos',
  guardian: 'guardian',
  procyons: 'procyons',
  una: 'una',
  rapport: 'rapport',
  guild: 'guild',
};

const prefix = '!';

export { botIntents, commands, prefix };
