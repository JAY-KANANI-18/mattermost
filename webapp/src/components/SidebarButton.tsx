import React, { useState, useEffect } from 'react';
import { GlobalState } from '@mattermost/types/lib/store';
import { useSelector } from 'react-redux';
import axios from 'axios';
import manifest from '@/manifest';

interface Member {
    user_id: string;
    // other properties
}

interface User {
    "id": string,
    "create_at": number,
    "update_at": number,
    "delete_at": number,
    "username": string,
    "auth_data": string,
    "auth_service": string,
    "email": string,
    "nickname": string,
    "first_name": string,
    "last_name": string,
    "position": string,
    "roles": string,
    "last_picture_update": number,
    "locale": string,
    "timezone": {
        "automaticTimezone": string,
        "manualTimezone": string,
        "useAutomaticTimezone": string
    },
    "is_bot": boolean,
    "bot_description": string,
    "disable_welcome_email": boolean
}

interface ApiResponse {
    users: User[];
    // Add other properties if needed
}
const SidebarButton: React.FC = () => {
    const [canAccessChannel, setCanAccessChannel] = useState(false);
    const [channelId, setChannelId] = useState<string | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [restrictedUsr, setRestrictedUsr] = useState<string[]>([]);
    const currentUser = { id: 'current-user-id' }; // Define your current user

    const someState = useSelector((state: GlobalState) => state.entities.teams.currentTeamId);
    const state = useSelector((state: GlobalState) => state);


    // const Url = "http://localhost:8065"
    const Url = "https://chat.crmtiger.com"



    // useEffect(() => {


    //     // Save the original fetch function
    //     const originalFetch = window.fetch;

    //     // Override the global fetch function
    //     window.fetch = async (...args: [RequestInfo | URL, RequestInit?]) => {
    //         let url: string;


    //         console.log({url : args[0]});
    //         // Handle different types for args[0]
    //         if (typeof args[0] === 'string') {
    //             url = args[0];
    //         } else if (args[0] instanceof Request) {
    //             url = args[0].url;  // Extract URL from Request object
    //         } else if (args[0] instanceof URL) {
    //             url = args[0].toString();  // Convert URL to string
    //             args[0] = url;  // Update args[0] to be a string
    //         } else {
    //             return originalFetch(args[0], args[1]);
    //         }

    //         // Call the original fetch
    //         const response = await originalFetch(args[0], args[1]);

    //         // Clone the response to modify it
    //         const clonedResponse = response.clone();


    //         // Check if the URL includes the specific path
    //         if (url.includes('/api/v4/users/autocomplete')) {
    //             const data: ApiResponse = await clonedResponse.json();
    //             console.log({ data1: data });

    //             if (Array.isArray(data.users)) {
    //                 data.users = data.users.filter((element: User) => !restrictedUsr.includes(element.username));
    //             }
    //             console.log({ data });

    //             // Modify the response data
    //             // data.customField = 'Modified Data';

    //             // Create a new Response object with modified data
    //             const modifiedResponse = new Response(JSON.stringify(data), {
    //                 status: response.status,
    //                 statusText: response.statusText,
    //                 headers: response.headers,
    //             });

    //             return modifiedResponse;
    //         }

    //         const privateChannelPattern = /\/api\/v4\/teams\/[^/]+\/channels/;
    //         if(url.endsWith('/channels') || url.includes('channels?include_deleted=true')){
    //             console.log("get channels of team");
    //             let data:any =  await clonedResponse.json()
    //             console.log({ data1: data });

    //             if (Array.isArray(data)) {
    //                 data = data.filter((channel: any) => channel.display_name !== "Town Square" && channel.display_name !== "");
    //             }
    //             console.log({ data });

    //             // Modify the response data
    //             // data.customField = 'Modified Data';

    //             // Create a new Response object with modified data
    //             const modifiedResponse = new Response(JSON.stringify(data), {
    //                 status: response.status,
    //                 statusText: response.statusText,
    //                 headers: response.headers,
    //             });

    //             return modifiedResponse;

    //         }

    //         return response;
    //     };

    //     // Restore original fetch function when component unmounts
    //     return () => {
    //         window.fetch = originalFetch;
    //     };
    // }, []);








    const getAllUsers = async (token: any) => {


        let temp:any = []
        const users:any = []
        let page = 0
        do {

            const response = await axios.get(`${Url}/api/v4/users?page=${page}&per_page=200`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            temp = response.data
            if (temp.length > 0) {
                users.push(...temp); // Add users from the current page
                page++; // Move to the next page
            } else {
                // Break the loop if no more data is available
                break;
            }
     
            
            // console.log({response,users,temp,page});


        } while (temp.length > 0 );

        return users;
    }

    const currentTeam = async (teamId: any, token: any) => {

        const response = await axios.get(`${Url}/api/v4/users/me/teams/${teamId}/channels?include_deleted=true`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;

    }


    const UserInChannel = async (channelId: any, token: any) => {
        const response = await axios.get(`${Url}/api/v4/users?in_channel=${channelId}&page=0&per_page=100&sort=admin
    `, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;

    }


    const getRestrictedUsersList = async (state: any) => {
        try {

            // const state = store.getState();
            // console.log({ state });
            const token = state.entities.general.config.Token;
            const allUsers = await getAllUsers(token)
            // console.log({ allUsers });

            const currentTeams = state.entities.teams.currentTeamId;
            // console.log({ currentTeams });
            let channels = await currentTeam(currentTeams, token);
            // console.log({ channels });

            channels = channels.filter((channel: any) => channel.display_name !== "Town Square" && channel.display_name !== "");
            // console.log({ channels });
            const usernames: string[] = [];

            for (const channel of channels) {
                const members = await UserInChannel(channel.id, token);
                usernames.push(...members.map((member: any) => member.username));
            }
            // console.log({ usernames });

            return await allUsers.filter((element: any) => !usernames?.includes(element.username))?.map((el: any) => el.username);
        } catch (e) {
            console.log(e);

            return e
        }

    };

    const mainFunc = async (state: any, RestrictedUsersList: any) => {
        try {
            // const state = store.getState();
            // console.log({ state });
            const timesele: any = document.querySelector('#sidebarItem_town-square');
            if (timesele) timesele.parentNode.style.display = 'none';
            const ee: any = document.querySelector('#switchChannel_town-square');
            if (ee) ee.style.display = 'none';
            // const token = state.entities.general.config.Token;
            // let allUsers = await getAllUsers(token)

            // const channelIds = Object.keys(state.entities.channels.channels);
            // const currentTeams = state.entities.teams.currentTeamId;

            // // Fetch channels
            // let channels = await currentTeam(currentTeams, token);
            // const channel1 = [...channels]
            // channels = channels.filter((channel: any) => channel.display_name !== "Town Square" && channel.display_name !== "");
            // // console.log({ channel1, channels });

            // // Get usernames of members in filtered channels
            // const usernames: string[] = [];
            // const inValidUsernames: string[] = [];
            // for (const channel of channels) {
            //     const members = await UserInChannel(channel.id, token);
            //     usernames.push(...members.map((member: any) => member.username));
            // }
            // for (const channel of channel1) {
            //     const members = await UserInChannel(channel.id, token);
            //     inValidUsernames.push(...members.map((member: any) => member.username));
            // }

            // // console.log({ inValidUsernames, usernames });
            // const inValidUsers: any = inValidUsernames.filter((element: any) => !usernames.includes(element));

            // // console.log({ inValidUsernames, inValidUsers });





            // // Remove elements not in the validUsers set
            // switchChannel_jayk


            const elements1: any = document.querySelectorAll('[id^="switchChannel_"]');

            const elements2: any = document.querySelectorAll(`[data-testid^="mentionSuggestion_"]`);

            // console.log({  elements1, elements2 });
            const elements = [...elements1, ...elements2]
            if (Array.isArray(RestrictedUsersList) || typeof RestrictedUsersList === 'string') {

            if (elements.length > 0) {

                elements.forEach((element: any) => {
                    const idValue = element.id.replace("switchChannel_", "");
                    const dataValue = element.getAttribute("data-testid").replace("mentionSuggestion_", "");
                    // console.log({ dataValue });
                    // console.log({ RestrictedUsersList });
                    // console.log(RestrictedUsersList.includes(dataValue));


                    if ((idValue && RestrictedUsersList?.includes(idValue)) || (dataValue && RestrictedUsersList?.includes(dataValue))) {

                        // if (element) {
                            try {
                                element.style.display = 'none';

                                // element.parentNode.removeChild(element);
                            } catch (error) {
                                // console.error('Error safely removing element:', error);
                            }
                        // }

                    }
                });
            }
        }
        } catch (error) {
            console.error('Error in mainFunc:', error);
        }
    };
    // let RestrictedUsersList:any =  []
    //  RestrictedUsersList = RestrictedUsersList.map((usr:any)=>usr.username)

    // useEffect(() => {
    //     console.log({restrictedUsr});

    //     mainFunc(state, restrictedUsr)
    // }, [state])
    // document.addEventListener('DOMContentLoaded', () => {
    //     mainFunc(state, restrictedUsr)

    // });

    const observer = new MutationObserver((mutations) => {
        const current = state.entities.users.currentUserId
        const find = state.entities.users.profiles[current].roles.includes("system_admin")
        if(find) { 
            return}        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                mainFunc(state, restrictedUsr);
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-testid'] });
    


    useEffect(() => {
        const current = state.entities.users.currentUserId
        const find = state.entities.users.profiles[current].roles.includes("system_admin") || state.entities.users.profiles[current].roles.includes("team_admin")
        if(find) { 
         return}
        // This effect will run whenever `someState` changes
        
        async function getp() {
            const RestrictedUsersList = await getRestrictedUsersList(state)
            // console.log({RestrictedUsersList});

            setRestrictedUsr(RestrictedUsersList)
            // RestrictedUsersList = RestrictedUsersList.map((usr:any)=>usr.username)

            // console.log('State has changed:', someState);
            // console.log("wd", { RestrictedUsersList });
        }
        getp()


        // Perform any side effects here, such as API calls or DOM manipulation

    }, [someState]); // Dependency array includes `someState` to trigger the effect on changes


    const isMember = members.some((member: Member) => member.user_id === currentUser.id);

    return (
        <></>
    );
};

export default SidebarButton;
