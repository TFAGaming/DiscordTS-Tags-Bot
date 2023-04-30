import {
    Client,
    GatewayIntentBits,
    Partials,
    REST,
    Routes
} from 'discord.js';
import { readdirSync } from 'fs';
import logger from '../func/logger';
import { Command } from './Command';
import { connect } from 'mongoose';
import JSONdb = require('simple-json-db');

interface CCBotConstructorOptions {
    clientToken: any,
    clientId: any
};

export class CCBot extends Client {
    // I had to use 'any' instead of 'Command' because there is a weird error comes from interaction#options in the chatInputCommand.ts file.
    commands_map: Map<string, any> = new Map();
    commands_array: object[] = [];
    jsondb: JSONdb = new JSONdb('./JSON/db.json');
    details: CCBotConstructorOptions;

    constructor(options: CCBotConstructorOptions) {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.MessageContent
            ],
            partials: [
                Partials.Channel,
                Partials.Message,
                Partials.User,
                Partials.GuildMember,
                Partials.Reaction,
                Partials.ThreadMember
            ]
        });

        this.details = options;
    };

    public async load_modules() {
        logger('Modules loader started, directory: commands', 'warn');

        for (let dir of readdirSync('./dist/commands/')) {
            for (let file of readdirSync('./dist/commands/' + dir + '/').filter((f) => f.endsWith('.js'))) {
                const module: Command = require('../commands/' + dir + '/' + file).default;

                this.commands_map.set(module.command_data.name, module);

                this.commands_array.push(module.command_data);

                logger('Successfully loaded new command: ' + file, 'info');
            };
        };

        logger('Modules loader started, directory: events', 'warn');

        for (let dir of readdirSync('./dist/events/')) {
            for (let file of readdirSync('./dist/events/' + dir + '/').filter((f) => f.endsWith('.js'))) {
                require('../events/' + dir + '/' + file);

                logger('Successfully loaded new event: ' + file, 'info');
            };
        };
    };

    public async load_application_commands() {
        const rest = new REST().setToken(this.details.clientToken);

        try {
            logger('Started loading application commands...', 'warn');
            
            await rest.put(Routes.applicationCommands(this.details.clientId), { body: this.commands_array });

            logger('Finished loading application commands.', 'success');
        } catch (err) {
            logger('Could not load application commands.', 'error');
        };
    };

    public async start(): Promise<void> {
        await connect(`${process.env.MONGODB_URI}`).then(() => {
            logger('MongoDB connection string connected!', 'success');
        });
    
        await this.login(this.details.clientToken).catch((err) => {
            logger('Could not connect to the Discord Bot.\n' + err, 'error');
        });
    };
};