import { client } from "../..";
import logger from "../../func/logger";

interface activityStruc {
    label: string,
    type?: string,
    status?: string
};

client.once('ready', () => {
    logger('The client is now up and ready to go! Logged in as ' + client.user?.username + '.');

    const activities: activityStruc[] = [
        {
           label: ''
        }
    ];
});