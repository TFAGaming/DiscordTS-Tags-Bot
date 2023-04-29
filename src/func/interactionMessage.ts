import { CommandInteraction, EmbedBuilder } from "discord.js";

export function interactionMessage(message: string, type?: string, footer?: string) {
    switch (type) {
        case 'error': {
            return new EmbedBuilder()
                .setDescription('`❌` ' + message)
                .setFooter(footer ? { text: footer } : null)
                .setColor('Red');
        };

        case 'warn': {
            return new EmbedBuilder()
                .setDescription('`⚠️` ' + message)
                .setFooter(footer ? { text: footer } : null)
                .setColor('Yellow');
        };

        case 'info': {
            return new EmbedBuilder()
                .setDescription('`✅` '  + message)
                .setFooter(footer ? { text: footer } : null)
                .setColor('Green');
        };

        default: {
            return new EmbedBuilder()
                .setDescription(message)
                .setFooter(footer ? { text: footer } : null);
        };
    };
};