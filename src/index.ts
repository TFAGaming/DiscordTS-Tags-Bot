import { CCBot } from './class/CCBot';
import { config } from 'dotenv';
import logger from './func/logger';

config();

export const client: CCBot = new CCBot({
    clientToken: process.env.CLIENT_TOKEN,
    clientId: process.env.CLIENT_ID,
});

client.load_modules();
client.load_application_commands();
client.start();

process.on('unhandledRejection', (e) => logger(`${e}`, 'error'));
process.on('uncaughtException', (e) => logger(`${e}`, 'error'));