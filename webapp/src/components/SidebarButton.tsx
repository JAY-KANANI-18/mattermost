import React from 'react';
import { getClient } from 'mattermost-redux/client';
import { Button } from 'react-bootstrap'; // or use a different UI library/component

const SidebarButton: React.FC = () => {
    const [canAccessChannel, setCanAccessChannel] = useState(false);

    useEffect(() => {
        const fetchAccess = async () => {
            const client = getClient();
            try {
                // Replace 'channelId' with the ID of the channel you want to check access for
                const response = await client.get(`/api/v4/channels/${channelId}/members`);
                const members = await response.json();
                // Check if current user is a member
                const currentUser = await client.get('/api/v4/users/me');
                const isMember = members.some(member => member.user_id === currentUser.id);
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
            <Button
                variant="primary"
                onClick={() => {
                    // Define action for the button
                    console.log('Send direct message');
                }}
            >
                Send Direct Message
            </Button>
        </div>
    );
};

export default SidebarButton;
