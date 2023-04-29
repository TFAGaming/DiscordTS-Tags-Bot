import {
    SlashCommandBuilder,
    ContextMenuCommandBuilder,
    CommandInteraction,
    CommandInteractionOptionResolver,
} from "discord.js";
import { CCBot } from "./CCBot";

interface CommandStructure {
    command_data: SlashCommandBuilder | ContextMenuCommandBuilder,
    run: (client: CCBot, interaction: CommandInteraction, args?: CommandInteractionOptionResolver) => void
};

export class Command implements CommandStructure {
    command_data: CommandStructure['command_data'];
    run: CommandStructure['run'];

    constructor(struc: CommandStructure) {
        this.command_data = struc['command_data'];
        this.run = struc['run'];
    };
};