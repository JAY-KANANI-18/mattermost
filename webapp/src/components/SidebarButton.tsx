import React, { useState, useEffect } from 'react';
import { Client4 } from 'mattermost-redux/client';

interface Member {
    user_id: string;
    // other properties
}
Client4.setUrl('http://localhost:8065'); // Replace with your local Mattermost URL
const SidebarButton: React.FC = () => {
    const [canAccessChannel, setCanAccessChannel] = useState(false);
    const [channelId, setChannelId] = useState<string | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const currentUser = { id: 'current-user-id' }; // Define your current user

    useEffect(() => {
        const fetchMembers = async () => {
            if (!channelId) return;

            try {
                const response = await Client4.getTeams();
                const members = await response.json();
                setMembers(members);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchMembers();
    }, [channelId]);

    const isMember = members.some((member: Member) => member.user_id === currentUser.id);

    return (
        <div>
            <button
                onClick={() => {
                    console.log('Send direct message')
                }}
            >
                Send Direct Message
            </button>
        </div>
    );
};

export default SidebarButton;
