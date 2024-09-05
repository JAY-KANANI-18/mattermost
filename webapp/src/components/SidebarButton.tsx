import React, { useState, useEffect } from 'react';
import { GlobalState } from '@mattermost/types/lib/store';
import { useSelector } from 'react-redux';
import axios from 'axios';

interface Member {
    user_id: string;
    // other properties
}
const SidebarButton: React.FC = () => {
    const [canAccessChannel, setCanAccessChannel] = useState(false);
    const [channelId, setChannelId] = useState<string | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [restrictedUsr, setRestrictedUsr] = useState([]);
    const currentUser = { id: 'current-user-id' }; // Define your current user

    const someState = useSelector((state: GlobalState) => state.entities.teams.currentTeamId);
    const state = useSelector((state: GlobalState) => state);


    const URL = "http://localhost:8065"

    const getAllUsers = async (token: any) => {
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


    const UserInChannel = async (channelId: any, token: any) => {
        const response = await axios.get(`${URL}/api/v4/users?in_channel=${channelId}&page=0&per_page=100&sort=admin
    `, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;

    }


    const getRestrictedUsersList = async (state: any)  => {
        try {

            // const state = store.getState();
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

            return await allUsers.filter((element: any) => !usernames.includes(element.username)).map((el:any)=>el.username);
        } catch (e) {
            console.log(e);

            return e
        }

    };

    const mainFunc = async (state: any, RestrictedUsersList: any) => {
        try {
            // const state = store.getState();
            console.log({ state });
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
            const elements1: any = document.querySelectorAll('[id^="switchChannel_"]');

            const elements2: any = document.querySelectorAll(`[data-testid^="mentionSuggestion_"]`);

            // console.log({ usernames, elements1, elements2 });
            const elements = [...elements1, ...elements2]

            if (elements.length > 0) {

                elements.forEach((element: any) => {
                    const idValue = element.id.replace("switchChannel_", "");
                    const dataValue = element.getAttribute("data-testid").replace("mentionSuggestion_", "");
                    console.log({ dataValue });
                    console.log({ RestrictedUsersList });
                    console.log(RestrictedUsersList.includes(dataValue));


                    if ((idValue && RestrictedUsersList.includes(idValue)) || (dataValue && RestrictedUsersList.includes(dataValue))) {

                        if (element) {
                            try {
                                element.style.display = 'none';

                                // element.parentNode.removeChild(element);
                            } catch (error) {
                                // console.error('Error safely removing element:', error);
                            }
                        }

                    }
                });
            }
        } catch (error) {
            console.error('Error in mainFunc:', error);
        }
    };
    // let RestrictedUsersList:any =  []
    //  RestrictedUsersList = RestrictedUsersList.map((usr:any)=>usr.username)

    useEffect(() => {
        mainFunc(state,restrictedUsr)
    }, [state])


    useEffect(() => {
        // This effect will run whenever `someState` changes

        async function getp(){
          const  RestrictedUsersList = await getRestrictedUsersList(state)
          setRestrictedUsr(RestrictedUsersList)
            // RestrictedUsersList = RestrictedUsersList.map((usr:any)=>usr.username)

            console.log('State has changed:', someState);
            console.log("wd", { RestrictedUsersList });
        }
        getp()


        // Perform any side effects here, such as API calls or DOM manipulation

    }, [someState]); // Dependency array includes `someState` to trigger the effect on changes


    // const isMember = members.some((member: Member) => member.user_id === currentUser.id);

    return (
        <></>
    );
};

export default SidebarButton;
