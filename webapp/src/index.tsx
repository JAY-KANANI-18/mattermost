import { Store, Action } from 'redux';

import { GlobalState } from '@mattermost/types/lib/store';
import { Client4 } from '@mattermost/client';


import manifest from '@/manifest';
import axios from 'axios';

import { PluginRegistry } from '@/types/mattermost-webapp';

import SidebarButton from './components/SidebarButton';

import { Provider } from 'react-redux';
import React, { useState, useEffect } from 'react';


const myMiddleware = (store: any) => (next: any) => (action: any) => {
    console.log('Dispatching action:', action);

    // Example: Only allow actions of a specific type
    if (action.type === 'MY_CUSTOM_ACTION') {
        console.log({ type: action.type });

        // Do something with the action or state
    }

    // Proceed to the next middleware or reducer
    return next(action);
};
// Middleware to modify API responses
const deleteElement = () => {

    const element = document.querySelector('[data-testid="mentionSuggestion_admin616"]');

    // Check if the element exists
    if (element) {
        // Remove the element from the DOM
        element.remove();
    }




    const elements = document.querySelectorAll('.suggestion-list__divider');

    // Iterate through each element to find the one with the desired text
    elements.forEach((element: any) => {
        console.log("element11")
        // Check if the element contains the desired text
        if (element.textContent.includes('Not in Channel')) {
            // Get the parent of the target element
            const parent = element.parentNode;

            // Remove all sibling elements after the target element
            let nextSibling = element.nextSibling;
            while (nextSibling) {
                const toRemove = nextSibling;
                nextSibling = nextSibling.nextSibling;
                parent.removeChild(toRemove);
            }

            // Optionally, remove the target element itself
            parent.removeChild(element);
        }
    });
}


const modifyApiResponseMiddleware = (store: any) => (next: any) => (action: any) => {
    deleteElement()
    if (action.payload) {

        const users = action.payload?.users
        const out_of_channel = action.payload?.out_of_channel;
        console.log({ users, out_of_channel });

        if (users || out_of_channel) {


            // Modify the response (e.g., filter out 'out_of_channel' users)
            const modifiedResponse = {
                ...action.payload,
                users: [...users],  // Keep the current users
                out_of_channel: [],  // Clear out_of_channel users or manipulate as needed
            };

            // Dispatch the modified data to the next middleware/reducer
            const modifiedAction = {
                ...action,
                payload: modifiedResponse,
            };

            return next(modifiedAction); // Pass the modified action
        }

    }

    // For other actions, just continue as normal
    return next(action);
};
const getUserChannels = (state: any) => {

    const currentUserId = state.entities.users.currentUserId;
    const channels = state.entities.channels.channels;
    console.log({ currentUserId, channels });
    return [];
    // return Object.values(state.entities.channels.myChannels)
    //     .filter((channel:any) => state.entities.channels.membersInChannel[channel.id]?.includes(currentUserId));
};
const getUsersInChannels = (state: any, channelIds: string[]) => {
    const allUsers = state.entities.users.users;
    const usersInChannels = new Set();

    channelIds.forEach(channelId => {
        const memberIds = state.entities.channels.membersInChannel[channelId] || [];
        memberIds.forEach((userId: any) => {
            if (allUsers[userId]) {
                usersInChannels.add(allUsers[userId]);
            }
        });
    });

    return Array.from(usersInChannels);
};
export default class Plugin {


    private async fetchChannelMembers(channelId: string, token: string) {
        const response = await axios.get(`${"http://localhost:8065/api/v4"}/channels/${channelId}/members`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    private async currentTeam(teamId: any, token: any) {
        const response = await axios.get(`http://localhost:8065/api/v4/users/me/teams/${teamId}/channels`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;

    }
    private async UserInChannel(channelId: any, token: any) {
        const response = await axios.get(`http://localhost:8065/api/v4/users?in_channel=${channelId}&page=0&per_page=100&sort=admin
`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;

    }


    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    initialize(registry: any, store: any) {
        // Register a custom sidebar button
        const customMiddleware = myMiddleware;


        setInterval(async () => {

            const state = store.getState() as GlobalState;
            const token = store.getState().entities.general.config.Token;
            const channelIds = Object.keys(state.entities.channels.channels);
            const currentTeams = store.getState().entities.teams.currentTeamId;
            const channnel = (await this.currentTeam(currentTeams, token)).filter((each: any) => each.display_name === "Town Square" || !each.display_name)




            let arr:any = []

            for (const cham of channnel) {
                const channelId = cham.id
                const members = await this.UserInChannel(channelId, token);


                console.log({members  });


                arr.push(members.map((each:any)=> each.username))
                arr = arr.flat(Infinity)
                // const userIds = members.map((member: any) => member.user_id);

                // console.log('Channel ID:', channelId);
                // console.log('Profiles In Channel:', profiles);

                // // Process profiles as needed
                // const values = new Set<string>();
                // profiles.forEach((profile:any) => values.add(profile.id));

                // const uniqueValuesArray = Array.from(values);
                // console.log('Unique Values:', uniqueValuesArray);

            }











            const validUsers = new Set(arr)
            console.log({validUsers,arr});

            const elements = document.querySelectorAll('[id^="switchChannel_"]');

            // Iterate through the elements and remove those not in the set
            elements.forEach((element:any) => {
                // Extract the part of the ID after "switchChannel_"
                const idValue = element.id.replace("switchChannel_", "");

                // Check if the ID value is not in the set, and remove the element if not
                if (!validUsers.has(idValue)) {
                    element.remove();
                }
            });

            const userChannels = getUserChannels(store.getState())

            console.log('Store:', store);
            console.log('Store State:', store.getState());
            console.log('Dispatch Method:', store.dispatch);
            console.log('Subscribe Method:', store.subscribe);
            console.log({ "Dispatch": store.getState()?.entities });
            console.log({ "sss": store.getState()?.entities?.users });


            const data = store.getState()?.entities?.users?.profilesInChannel

            const values = new Set();

            for (const key in data) {
                if (Array.isArray(data[key])) {
                    data[key].forEach((item: any) => values.add(item.value));
                }
            }

            const uniqueValuesArray = Array.from(values);
            console.log({ uniqueValuesArray });

        }, 10000);
        const dispatch = store.dispatch;
        store.dispatch = (action: any) => {
            // console.log({ action });
            //    const channelIds = userChannels.map((channel:any) => channel.id);
            //    const usersInChannels = getUsersInChannels(store.getState(), channelIds);

            //    console.log({userChannels,channelIds,usersInChannels});


            // Apply your middleware to each dispatch
            return modifyApiResponseMiddleware(store)(dispatch)(action);
        };
        registry.registerLeftSidebarHeaderComponent(SidebarButton);
    }

    uninitialize() {
        // Clean up if needed when the plugin is uninstalled
    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void
    }
}

window.registerPlugin("test", new Plugin());
