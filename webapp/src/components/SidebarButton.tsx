import React from 'react';
import { Client4 } from 'mattermost-redux/client';
import React, { useState, useEffect } from 'react';

const SidebarButton: React.FC = () => {
    const [canAccessChannel, setCanAccessChannel] = useState(false);
    const [channelId, setChannelId] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccess = async () => {
            const client = getClient();
            try {
                // Replace 'channelId' with the ID of the channel you want to check access for
                const response = await client.get(`/api/v4/channels/${channelId}/members`);
                const members = await response.json();
                // Check if current user is a member
                const currentUser = await client.get('/api/v4/users/me');
                const isMember = members.some((member:any) => member.user_id === currentUser.id);
                setCanAccessChannel(isMember);
            } catch (error) {
                console.error('Error fetching channel access:', error);
                setCanAccessChannel(false); // Default to not having access if there's an error
            }
        };

        fetchAccess();
    }, []);

    if (!canAccessChannel) {
        return null; // Hide the component if user does not have access
    }

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
