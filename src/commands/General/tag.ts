import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from "discord.js";
import { Command } from "../../class/Command";
import { interactionMessage } from "../../func/interactionMessage";
import tagschema from "../../schema/tagschema";
import { ButtonsPaginatorBuilder } from "utilityxtreme";

export default new Command({
    command_data: new SlashCommandBuilder()
        .setName('tag')
        .setDescription('Tag system.')
        .addSubcommand((sub) =>
            sub.setName('create')
                .setDescription('Creates a new tag.')
                .addStringOption((opt) =>
                    opt.setName('name')
                        .setDescription('The tag name.')
                        .setMaxLength(20)
                        .setMinLength(3)
                        .setRequired(true)
                )
                .addStringOption((opt) =>
                    opt.setName('visibility')
                        .setDescription('The visibility of the tag for guild members, except staff members.')
                        .addChoices(
                            { name: 'Public', value: 'public' },
                            { name: 'Unlisted', value: 'unlisted' },
                            { name: 'Private', value: 'private' }
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub.setName('delete')
                .setDescription('Deletes an existing tag.')
                .addStringOption((opt) =>
                    opt.setName('name')
                        .setDescription('The tag name.')
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub.setName('view')
                .setDescription('Replies with the content of a tag.')
                .addStringOption((opt) =>
                    opt.setName('name')
                        .setDescription('The tag name.')
                        .setRequired(true)
                )
        )
        .addSubcommand((sub) =>
            sub.setName('list')
                .setDescription('Replies with a list of public tags.')
        )
        .addSubcommand((sub) =>
            sub.setName('my-tags')
                .setDescription('Replies with a list of the tags that you have created, including private ones.')
        )
        .setDMPermission(false),
    run: async (client, interaction, args) => {
        const subcommandInput = args?.getSubcommand();

        const systemtoggle: string = await client.jsondb.get('toggle');

        if (systemtoggle === 'disabled') {
            await interaction.deferReply({ ephemeral: true });

            await interaction.editReply({
                embeds: [
                    interactionMessage('The tag system is currently disabled by server Administrators.')
                ]
            });

            return;
        };

        switch (subcommandInput) {
            case 'create': {
                await interaction.deferReply();

                const tagname = args?.getString('name');
                const tagvisibility = args?.getString('visibility');

                let data = await tagschema.findOne({ name: tagname });

                if (data) {
                    await interaction.editReply({
                        embeds: [
                            interactionMessage('The tag name already exists, please try a different name.\nExample: ' + tagname + '-' + Math.floor(Math.random() * 9999999), 'error')
                        ]
                    });

                    return;
                };

                let seconddata = (await tagschema.find()).filter((item) => item.author === interaction.user.id);

                if (seconddata.length >= client.jsondb.get('maxtags')) {
                    await interaction.editReply({
                        embeds: [
                            interactionMessage('You have reached to the limit! You can only create **' + client.jsondb.get('maxtags') + '** tags.')
                        ]
                    });

                    return;
                };

                await interaction.editReply({
                    embeds: [
                        interactionMessage('You are going to create tag with the name \`' + tagname + '\` and the visibility is going to be **' + tagvisibility + '**.\nPlease send the content of the tag in this channel. You have 3 minutes until this action going to be cancelled.', 'none', 'You can type \'cancel\' to cancel this interaction.')
                    ]
                });

                interaction.channel?.awaitMessages({
                    filter: (i) => i.author.id === interaction.user.id,
                    time: 180000,
                    max: 1
                }).then(async (i) => {
                    const messageinput = i.first();

                    if (messageinput?.content.toLowerCase() === 'cancel') {
                        await messageinput?.delete().catch(() => { });

                        await interaction.editReply({
                            embeds: [
                                interactionMessage(`The action has been cancelled.`, 'info')
                            ]
                        });

                        return;
                    };

                    data = new tagschema({
                        name: tagname,
                        author: interaction.user.id,
                        content: messageinput?.content,
                        visibility: tagvisibility,
                        createdAt: Date.now()
                    });

                    await messageinput?.delete().catch(() => { });

                    await data.save();

                    await interaction.editReply({
                        embeds: [
                            interactionMessage(`The tag has been successfully published.\nName: \`${tagname}\`\nVisibility: **${tagvisibility}**`, 'info', `Run the command \'/tag view ${tagname}\' to view the content.`)
                        ]
                    });
                });

                break;
            };

            case 'delete': {
                await interaction.deferReply({ ephemeral: true });

                const tagname = args?.getString('name');

                let data = await tagschema.findOne({ name: tagname });

                if (!data) {
                    await interaction.editReply({
                        embeds: [
                            interactionMessage('The tag \`' + tagname + '\` does not exist on the database.', 'error')
                        ]
                    });

                    return;
                };

                if (data.author !== interaction.user.id) {
                    await interaction.editReply({
                        embeds: [
                            interactionMessage('You are not the author of the tag \`' + tagname + '\`.', 'error')
                        ]
                    });

                    return;
                };

                let components: ButtonBuilder[] = [
                    new ButtonBuilder()
                        .setLabel('Yes')
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId('delete_action_accepted'),
                    new ButtonBuilder()
                        .setLabel('No')
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('delete_action_denied')
                ];

                await interaction.editReply({
                    embeds: [
                        interactionMessage('Are you sure that you want to delete \`' + tagname + '\`?\nIf you accept the action, the tag will be gone forever!', 'warn', 'No response after 30 seconds will cancel this interaction.')
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                components
                            )
                    ]
                });

                const collector = interaction.channel?.createMessageComponentCollector({
                    filter: (i) => i.customId === 'delete_action_accepted' || i.customId === 'delete_action_denied',
                    time: 30000
                });

                collector?.on('collect', async (i) => {
                    await i.deferReply({ ephemeral: true });

                    if (i.customId === 'delete_action_accepted') {
                        await tagschema.deleteOne({ name: tagname });
                        
                        await i.editReply({
                            embeds: [
                                interactionMessage('The tag \`' + tagname + '\` has been deleted.', 'info')
                            ]
                        });
                    } else {
                        await i.editReply({
                            embeds: [
                                interactionMessage(`The action has been cancelled.`, 'info')
                            ]
                        });
                    };

                    collector.stop();
                });

                collector?.once('end', async () => {
                    await interaction.editReply({
                        components: [
                            new ActionRowBuilder<ButtonBuilder>()
                                .addComponents(
                                    components.map((btn) => btn.setDisabled(true).setStyle(ButtonStyle.Secondary))
                                )
                        ]
                    });
                });

                break;
            };

            case 'view': {
                await interaction.deferReply();

                const tagname = args?.getString('name');

                let data = await tagschema.findOne({ name: tagname });

                if (!data) {
                    await interaction.editReply({
                        embeds: [
                            interactionMessage('The tag \`' + tagname + '\` does not exist on the database.', 'error')
                        ]
                    });

                    return;
                };

                if (data.visibility === 'private' && data.author !== interaction.user.id) {
                    await interaction.editReply({
                        embeds: [
                            interactionMessage('The tag \`' + tagname + '\` is private, only the author can view it.', 'error')
                        ]
                    });

                    return;
                };

                if (data.author === interaction.user.id && data.visibility === 'private') {
                    await interaction.editReply({
                        embeds: [
                            interactionMessage('You are going to receive a DM with the tag content.', 'info')
                        ]
                    });

                    await interaction.user.send({
                        content: `Tag: \`${tagname}\`\nAuthor: You, ${interaction.user.tag}\nID: \`${data.id}\`\nCreated at: <t:${Math.floor(data.createdAt / 1000)}:d> (<t:${Math.floor(data.createdAt / 1000)}:R>)\n\n${data.content}`
                    }).catch(async () => {
                        await interaction.editReply({
                            embeds: [
                                interactionMessage('Could not send the message because I\'m currently blocked by you or your DMs are disabled.', 'error')
                            ]
                        });
                    });

                    return;
                } else {
                    await interaction.editReply({
                        content: `Tag: \`${tagname}\`\nAuthor: ${interaction.guild?.members.cache.get(data.author)?.user.tag || 'Deleted User#0000'}\nID: \`${data.id}\`\nCreated at: <t:${Math.floor(data.createdAt / 1000)}:d> (<t:${Math.floor(data.createdAt / 1000)}:R>)\n\n${data.content}`
                    });

                    return;
                };
            };

            case 'list': {
                await interaction.deferReply();

                let data = (await tagschema.find()).filter((item) => item.visibility === 'public');

                if (data.length <= 0) {
                    await interaction.editReply({
                        embeds: [
                            interactionMessage('There are currently no tags created.', 'none', 'There is a chance that the problem is coming from the database connection.')
                        ]
                    });

                    return;
                };

                const paginator = new ButtonsPaginatorBuilder(interaction, { time: 300000 })
                    .setButtons(
                        { label: 'Previous', id: 'previous', type: ButtonStyle.Secondary, emoji: { name: '⬅️' } },
                        { label: 'Next', id: 'next', type: ButtonStyle.Secondary, emoji: { name: '➡️' } }
                    )

                let firstindex = 0;
                let lastindex = 10;

                data.forEach(() => {
                    const toadd = data.slice(firstindex, lastindex);

                    const str = toadd.map((element, index) => `${index + 1}. ${element.name}`).join('\n');

                    firstindex += 9;
                    lastindex += 10;

                    paginator.addPages({
                        content: str
                    });
                });

                await paginator.send({
                    editReply: true,
                    disableButtonsOnLastAndFirstPage: true,
                    onEnd: {
                        content: 'This menu has been expired after 5 minutes timeout.'
                    }
                });
            };

            case 'my-tags': {
                await interaction.deferReply({ ephemeral: true });

                let data = await tagschema.find();

                data = data.filter((item) => item.author === interaction.user.id);

                if (data.length <= 0) {
                    await interaction.editReply({
                        embeds: [
                            interactionMessage('There are currently no tags created by you.', 'none', 'There is a chance that the problem is coming from the database connection.')
                        ]
                    });

                    return;
                };

                const paginator = new ButtonsPaginatorBuilder(interaction, { time: 300000 })
                    .setButtons(
                        { label: 'Previous', id: 'previous', type: ButtonStyle.Secondary, emoji: { name: '⬅️' } },
                        { label: 'Next', id: 'next', type: ButtonStyle.Secondary, emoji: { name: '➡️' } }
                    )

                let firstindex = 0;
                let lastindex = 10;

                data.forEach(() => {
                    const toadd = data.slice(firstindex, lastindex);

                    const str = toadd.map((element, index) => `${index + 1}. ${element.name}`).join('\n');

                    firstindex += 9;
                    lastindex += 10;

                    paginator.addPages({
                        content: str
                    });
                });

                await paginator.send({
                    editReply: true,
                    disableButtonsOnLastAndFirstPage: true,
                    onEnd: {
                        content: 'This menu has been expired after 5 minutes timeout.'
                    }
                });
            };
        };

    }
})