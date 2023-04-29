import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Command";
import { interactionMessage } from "../../func/interactionMessage";
import tagschema from "../../schema/tagschema";

export default new Command({
    command_data: new SlashCommandBuilder()
        .setName('configure')
        .setDescription('Configure the tag system for guild members.')
        .addSubcommand((sub) =>
            sub.setName('max-tags')
                .setDescription('How many tags can a guild member create on their account?')
                .addNumberOption((opt) =>
                    opt.setName('amount')
                        .setDescription('The amount of tags that a member can create on the server, conditions: 1 <= AMOUNT <= 5')
                        .setMaxValue(5)
                        .setMinValue(1)
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub.setName('clear-all-bans')
                .setDescription('Clears all the guild member bans, which means that they can use the tag commands again.')
        )
        .addSubcommand((sub) =>
            sub.setName('clear-all-tags')
                .setDescription('Clears all the guild member bans, which means that they can use the tag commands again.')
        )
        .addSubcommand((sub) =>
            sub.setName('toggle')
                .setDescription('Enable or disable the system on the guild.')
                .addStringOption((opt) =>
                    opt.setName('toggle')
                        .setDescription('Toggle the system; Enable or disable it for every guild member.')
                        .addChoices(
                            { name: 'Enable', value: 'enabled' },
                            { name: 'Disable', value: 'disabled' },
                        )
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true });

        const subcommandInput = args?.getSubcommand();

        switch (subcommandInput) {
            case 'max-tags': {
                const amountInput = args?.getNumber('amount') || 5;

                client.jsondb.set('maxtags', amountInput);

                await interaction.editReply({
                    embeds: [
                        interactionMessage('Done, the max tags per user is now **' + amountInput + '**.', 'info')
                    ]
                });

                break;
            };

            case 'clear-all-bans': {
                client.jsondb.set('bans', []);

                await interaction.editReply({
                    embeds: [
                        interactionMessage('Done, all the banned users from using tags are now unbanned.', 'info')
                    ]
                });
            };

            case 'clear-all-tags': {
                const data = await tagschema.find();

                await interaction.editReply({
                    embeds: [
                        interactionMessage('Purge started, this might take a while.')
                    ]
                });

                await data.forEach(async (element) => {
                    await tagschema.deleteOne({
                        name: element.name
                    });
                });

                await interaction.editReply({
                    embeds: [
                        interactionMessage('Done, all tags has been deleted.', 'info')
                    ]
                });

                break;
            };

            case 'toggle': {
                const stringInput = args?.getString('toggle');

                client.jsondb.set('toggle', stringInput);

                await interaction.editReply({
                    embeds: [
                        interactionMessage('Done, the system is now ' + stringInput + '.', 'info')
                    ]
                });

                break;
            };
        };

    }
})