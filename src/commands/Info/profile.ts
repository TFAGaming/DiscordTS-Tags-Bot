import { ContextMenuCommandBuilder, ContextMenuCommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "../../class/Command";
import tagschema from "../../schema/tagschema";
import { interactionMessage } from "../../func/interactionMessage";

export default new Command({
    command_data: new ContextMenuCommandBuilder()
        .setName('Tags Profile')
        .setType(2)
        .setDMPermission(false),
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const userTarget = client.users.cache.get((interaction as ContextMenuCommandInteraction).targetId);
        const memberTarget = interaction.guild?.members.cache.get((interaction as ContextMenuCommandInteraction).targetId);

        let data = (await tagschema.find()).filter((item) => item.author === userTarget?.id);

        if (!data || data.length <= 0) {
            await interaction.editReply({
                embeds: [
                    interactionMessage(`The member ${memberTarget ? `<@${memberTarget.id}>` : 'Deleted User#0000'} did not created a tag yet.`)
                ]
            });

            return;
        };

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(userTarget?.tag + ' tag profile')
                    .addFields(
                        { name: 'Author ID registered as', value: `\`${userTarget?.id}\``, inline: true },
                        { name: 'Number of tags created', value: `${data.length}`, inline: true },
                        { name: 'Tags', value: `${data.map((item) => item.name).join(', ')}.`, inline: true },
                        { name: 'Manage other users tags?', value: `${memberTarget?.permissions.has('Administrator') ? 'Yes': 'No'}`, inline: true }
                    )
                    .setColor('#3f48cc')
            ]
        });
    }
})

