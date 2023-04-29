import { ApplicationCommandType, EmbedBuilder, SlashCommandBuilder, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../class/Command";
import { interactionMessage } from "../../func/interactionMessage";

export default new Command({
    command_data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Replies with a list of available client commands.')
        .addStringOption((opt) =>
            opt.setName('command')
                .setDescription('Get a command information.')
                .setRequired(false)
        )
        .setDMPermission(false),
    run: async (client, interaction, args) => {
        await interaction.deferReply();

        const commandInput = args?.getString('command');

        if (commandInput) {
            const command: Command = client.commands_map.get(commandInput);

            if (!command) {
                await interaction.editReply({
                    embeds: [
                        interactionMessage('This command does not exists.', 'error')
                    ]
                });

                return;
            };

            const jsoncommand = command.command_data.toJSON();

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('/' + commandInput + ' command information')
                        .addFields(
                            { name: 'Type', value: `${ApplicationCommandType[jsoncommand.type || 1]}` },
                            { name: 'Options', value: `${jsoncommand.options?.length || [].length > 0 ? jsoncommand.options?.map((element) => `> **Name**: ${element.name}\n> **Description**: ${element.description}\n> **Type**: ${ApplicationCommandOptionType[element.type]}\n> **Required?**: ${element.required || false}`).join('\n\n') : 'No options'}` }
                        )
                        .setColor('#3f48cc')
                ]
            });
        } else {
            const commandsFetched = await client.application?.commands?.fetch();

            const commands_slash: string[] = [];

            commandsFetched?.forEach((cmd) => {
                if (cmd.type === 1) {
                    if (cmd.options && cmd.options?.length > 0) {
                        for (let option of cmd.options) {
                            if (option.type === 1) {
                                commands_slash.push(`</${cmd.name} ${option.name}:${cmd.id}>: ${option.description}`);
                            } else {
                                commands_slash.push(`</${cmd.name}:${cmd.id}>: ${cmd.description}`);

                                break;
                            };
                        };
                    } else {
                        commands_slash.push(`</${cmd.name}:${cmd.id}>: ${cmd.description}`);
                    };
                };
            });

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(client.user?.username + ' commands')
                        .setDescription(`${commands_slash?.map((element) => element).join('\n')}`)
                        .setColor('#3f48cc')
                ]
            });
        };
    }
})