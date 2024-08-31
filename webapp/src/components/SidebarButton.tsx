import React, { useState, useEffect } from 'react';
import { Client4 ,apiGet } from 'mattermost-redux/client';

interface Member {
    user_id: string;
    // other properties
}

const SidebarButton: React.FC = () => {
    const [canAccessChannel, setCanAccessChannel] = useState(false);
    const [channelId, setChannelId] = useState<string | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const currentUser = { id: 'current-user-id' }; // Define your current user

    useEffect(() => {
        const fetchMembers = async () => {
            if (!channelId) return;

            try {
                const response = await apiGet(`/api/v4/channels/${channelId}/members`);
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
                    // Define action for the button
                    console.log('Send direct message');
                }}
            >
                Send Direct Message
            </button>
        </div>
    );
};

export default SidebarButton;
