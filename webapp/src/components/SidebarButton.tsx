import React, { useState, useEffect } from 'react';
import { GlobalState } from '@mattermost/types/lib/store';
import { useSelector } from 'react-redux';

interface Member {
    user_id: string;
    // other properties
}
const SidebarButton: React.FC = () => {
    const [canAccessChannel, setCanAccessChannel] = useState(false);
    const [channelId, setChannelId] = useState<string | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const currentUser = { id: 'current-user-id' }; // Define your current user

    const someState = useSelector((state: GlobalState) => console.log(state));

    useEffect(() => {
        // This effect will run whenever `someState` changes
        console.log('State has changed:', someState);

        // Perform any side effects here, such as API calls or DOM manipulation

    }, [someState]); // Dependency array includes `someState` to trigger the effect on changes


    // const isMember = members.some((member: Member) => member.user_id === currentUser.id);

    return (
    <></>
    );
};

export default SidebarButton;
