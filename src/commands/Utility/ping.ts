import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Command";
import tagschema from "../../schema/tagschema";

export default new Command({
    command_data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the client WebSocket ping and the DB latency.')
        .setDMPermission(false),
    run: async (client, interaction, args) => {
        const before_date = Date.now();

        await interaction.deferReply();

        const now_date = Date.now();

        const before_date_mongodb = Date.now();

        await tagschema.find();

        const now_date_mongodb = Date.now();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(client.user?.username + ' latency')
                    .addFields(
                        { name: 'WebSocket Latency', value: `\`${client.ws.ping} ms\``, inline: true },
                        { name: 'Heartbeat', value: '\`~80 beat/min\`', inline: true },
                        { name: 'Edited reply Latency', value: `\`${now_date - before_date} ms\``, inline: true },
                        { name: 'Database Latency', value: `\`${now_date_mongodb - before_date_mongodb} ms\``, inline: true },
                    )
                    .setColor('#3f48cc')
            ]
        });
    }
})