import React from 'react';

const SidebarButton: React.FC = () => {
    const handleClick = () => {
        // Define what happens when the button is clicked
        console.log('Sidebar button clicked');
    };

    return (
        <div
            className="SidebarButton"
            onClick={handleClick}
            style={{ cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center' }}
        >
            <span style={{ marginLeft: '8px' }}>My Button</span>
        </div>
    );
};

export default SidebarButton;
