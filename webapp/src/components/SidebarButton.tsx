import React from 'react';
import { ChannelIcon } from 'components/widgets/icons'; // Adjust import as needed

const SidebarButton: React.FC = () => {
    const handleClick = () => {
        // eslint-disable-next-line no-console
        console.log('Sidebar button clicked');
    };

    return (
        <div
            className="SidebarButton"
            onClick={handleClick}
            style={{ cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center' }}
        >
            <ChannelIcon />
            <span style={{ marginLeft: '8px' }}>{'My Button'}</span>
        </div>
    );
};

export default SidebarButton;
