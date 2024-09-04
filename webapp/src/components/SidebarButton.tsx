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
    const currentUser = { id: 'current-user-id' }; // Define your current user

    const someState = useSelector((state: GlobalState) => state.entities.teams.currentTeamId);
    const state = useSelector((state: GlobalState) => state);



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


    const UserInChannel = async (channelId: any, token: any) => {
        const response = await axios.get(`${URL}/api/v4/users?in_channel=${channelId}&page=0&per_page=100&sort=admin
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






    useEffect( () => {
        // This effect will run whenever `someState` changes
        console.log('State has changed:', someState);
        const RestrictedUsersList =  getRestrictedUsersList(state)
        console.log("wd", { RestrictedUsersList });


        // Perform any side effects here, such as API calls or DOM manipulation

    }, [someState]); // Dependency array includes `someState` to trigger the effect on changes


    // const isMember = members.some((member: Member) => member.user_id === currentUser.id);

    return (
        <></>
    );
};

export default SidebarButton;
