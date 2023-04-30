import { ActivityType, PresenceStatusData } from "discord.js";
import { client } from "../..";
import logger from "../../func/logger";

interface activityStruc {
    label: string,
    type?: ActivityType | number,
    status?: PresenceStatusData
};

client.once('ready', () => {
    logger('The client is now up and ready to go! Logged in as ' + client.user?.username + '.', 'success');

    const activities: activityStruc[] = [
        { label: 'Written in TypeScript' },
        { label: 'by T.F.A#7524' },
        { label: 'Spotify', type: ActivityType.Listening, status: 'idle' },
        { label: 'T.F.A videos on YouTube', type: ActivityType.Watching }
    ];

    setInterval(() => {
        const data = activities[Math.floor(Math.random() * activities.length)];

        client.user?.setPresence({
            activities: [{
                name: data.label,
                type: data.type || 0,
                url: 'https://www.twitch.tv/discord'
            }],
            status: data.status || 'online'
        });
    }, 7500);
});