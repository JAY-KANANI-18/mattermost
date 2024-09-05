import { Store, Action } from 'redux';

import { GlobalState } from '@mattermost/types/lib/store';
import { Client4 } from '@mattermost/client';

import ReactDOM from 'react-dom';

import manifest from '@/manifest';
import axios from 'axios';

import { PluginRegistry } from '@/types/mattermost-webapp';

import SidebarButton from './components/SidebarButton';

import { Provider } from 'react-redux';
import React, { useState, useEffect } from 'react';
import InterceptorComponent from './components/interceptor';

const URL = "http://localhost:8065"
// const URL = "https://chat.crmtiger.com"
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
const hideSuggetion = (username: any) => {

    const element = document.querySelector(`[data-testid^="mentionSuggestion_${username}"]`);

    // Check if the element exists
    if (element) {
        // Remove the element from the DOM
        element.remove();
    }




    // const elements = document.querySelectorAll('.suggestion-list__divider');

    // // Iterate through each element to find the one with the desired text
    // elements.forEach((element: any) => {
    //     console.log("element11")
    //     // Check if the element contains the desired text
    //     if (element.textContent.includes('Not in Channel')) {
    //         // Get the parent of the target element
    //         const parent = element.parentNode;

    //         // Remove all sibling elements after the target element
    //         let nextSibling = element.nextSibling;
    //         while (nextSibling) {
    //             const toRemove = nextSibling;
    //             nextSibling = nextSibling.nextSibling;
    //             parent.removeChild(toRemove);
    //         }

    //         // Optionally, remove the target element itself
    //         parent.removeChild(element);
    //     }
    // });
}


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


const getRestrictedUsersList = async (store: any) => {
    try {

        const state = store.getState();
        console.log({ state });
        const token = state.entities.general.config.Token;
        const allUsers = await getAllUsers(token)
        console.log({ allUsers });

        const currentTeams = state.entities.teams.currentTeamId;
        let channels = await currentTeam(currentTeams, token);
        console.log({ channels });

        channels = channels.filter((channel: any) => channel.display_name !== "Town Square" && channel.display_name !== "");
        console.log({ channels });
        const usernames: string[] = [];

        for (const channel of channels) {
            const members = await UserInChannel(channel.id, token);
            usernames.push(...members.map((member: any) => member.username));
        }
        console.log({ usernames });

        return allUsers.filter((element: any) => !usernames.includes(element.username));
    } catch (e) {
        console.log(e);

        return e
    }

};




    // const mainFunc = async (store: any, RestrictedUsersList: any) => {
    //     try {
    //         // const state = store.getState();
    //         // console.log({ state });
    //         // const token = state.entities.general.config.Token;
    //         // let allUsers = await getAllUsers(token)

    //         // const channelIds = Object.keys(state.entities.channels.channels);
    //         // const currentTeams = state.entities.teams.currentTeamId;

    //         // // Fetch channels
    //         // let channels = await currentTeam(currentTeams, token);
    //         // const channel1 = [...channels]
    //         // channels = channels.filter((channel: any) => channel.display_name !== "Town Square" && channel.display_name !== "");
    //         // // console.log({ channel1, channels });

    //         // // Get usernames of members in filtered channels
    //         // const usernames: string[] = [];
    //         // const inValidUsernames: string[] = [];
    //         // for (const channel of channels) {
    //         //     const members = await UserInChannel(channel.id, token);
    //         //     usernames.push(...members.map((member: any) => member.username));
    //         // }
    //         // for (const channel of channel1) {
    //         //     const members = await UserInChannel(channel.id, token);
    //         //     inValidUsernames.push(...members.map((member: any) => member.username));
    //         // }

    //         // // console.log({ inValidUsernames, usernames });
    //         // const inValidUsers: any = inValidUsernames.filter((element: any) => !usernames.includes(element));

    //         // // console.log({ inValidUsernames, inValidUsers });





    //         // // Remove elements not in the validUsers set
    //         const elements1: any = document.querySelectorAll('[id^="switchChannel_"]');

    //         const elements2: any = document.querySelectorAll(`[data-testid^="mentionSuggestion_"]`);

    //         // console.log({ usernames, elements1, elements2 });
    //         const elements = [...elements1, ...elements2]

    //         if (elements.length > 0) {

    //             elements.forEach((element: any) => {
    //                 const idValue = element.id.replace("switchChannel_", "");
    //                 const dataValue = element.getAttribute("data-testid").replace("mentionSuggestion_", "");
    //                 console.log({ dataValue });
    //                 console.log(RestrictedUsersList.includes(dataValue));


    //                 if ((idValue && RestrictedUsersList.includes(idValue)) || (dataValue && RestrictedUsersList.includes(dataValue))) {

    //                     if (element) {
    //                         try {
    //                             element.style.display = 'none';

    //                             // element.parentNode.removeChild(element);
    //                         } catch (error) {
    //                             // console.error('Error safely removing element:', error);
    //                         }
    //                     }

    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error in mainFunc:', error);
    //     }
    // };
// const observeDOMChanges = (store: any) => {
//     const observer = new MutationObserver((mutations) => {
//         mutations.forEach((mutation) => {
//             if (mutation.type === 'childList') {
//                 // Re-run your main function or logic here
//                 mainFunc(store);
//             }
//         });
//     });

// Observe changes in the body or any specific container element
//     observer.observe(document.body, { childList: true, subtree: true });
// };
const UserInChannel = async (channelId: any, token: any) => {
    const response = await axios.get(`${URL}/api/v4/users?in_channel=${channelId}&page=0&per_page=100&sort=admin
`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;

}
const getUsersofChannels = async (channelIds: any, token: any) => {
    const response = await axios.post(`${URL}/api/v4/users/group_channels`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;

}

const getAllUsers = async (token: any): Promise<any> => {
    const response = await axios.get(`${URL}/api/v4/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;

}

const currentTeam = async (teamId: any, token: any) => {

    const response = await axios.get(`${URL}/api/v4/users/me/teams/${teamId}/channels?include_deleted=true`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;

}

const modifyApiResponseMiddleware = (store: any) => (next: any) => (action: any) => {
    // deleteElement()
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
export default class Plugin {


    private async fetchChannelMembers(channelId: string, token: string) {
        const response = await axios.get(`${URL}/api/v4/channels/${channelId}/members`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }








    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    async initialize(registry: any, store: any) {
        // Register a custom sidebar button
        // const customMiddleware = myMiddleware;
        // observeDOMChanges(store)
        // const rootElement = document.getElementById('root');

        // if (rootElement) {
        //     ReactDOM.render(<InterceptorComponent />, rootElement);
        // }


        const userChannels = getUserChannels(store.getState())

        console.log('Store:', store);
        console.log('Store State:', store.getState());
        console.log('Dispatch Method:', store.dispatch);
        console.log('Subscribe Method:', store.subscribe);
        console.log({ "Dispatch": store.getState()?.entities });
        console.log({ "sss": store.getState()?.entities?.users });
        // const RestrictedUsersList = await getRestrictedUsersList(store)
        // console.log({ RestrictedUsersList });



        // const data = store.getState()?.entities?.users?.profilesInChannel

        // const values = new Set();

        // for (const key in data) {
        //     if (Array.isArray(data[key])) {
        //         data[key].forEach((item: any) => values.add(item.value));
        //     }
        // }

        // const uniqueValuesArray = Array.from(values);


        const dispatch = store.dispatch;
        store.dispatch = async (action: any) => {


            // mainFunc(store, RestrictedUsersList)

            // const timesele: any = document.querySelector('#sidebarItem_town-square');
            // if (timesele) timesele.parentNode.style.display = 'none';
            // const ee: any = document.querySelector('#switchChannel_town-square');
            // if (ee) ee.style.display = 'none';
            return modifyApiResponseMiddleware(store)(dispatch)(action);
        };
        registry.registerChannelHeaderButton(SidebarButton);
        // registry.registerLeftSidebarHeaderComponent(InterceptorComponent);
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
