import { client } from "../..";
import { interactionMessage } from "../../func/interactionMessage";

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands_map.get(interaction.commandName);

        if (!command) {
            await interaction.reply({
                embeds: [
                    interactionMessage('This command does not exist in the commands functionality list.', 'error')
                ]
            });

            return;
        };

        await command.run(client, interaction, interaction.options);
    } else if (interaction.isContextMenuCommand()) {
        const command = client.commands_map.get(interaction.commandName);

        if (!command) {
            await interaction.reply({
                embeds: [
                    interactionMessage('This command does not exist in the commands functionality list.', 'error')
                ]
            });

            return;
        };

        await command.run(client, interaction);
    } else return;
});