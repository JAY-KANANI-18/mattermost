import { Store, Action } from 'redux';

import { GlobalState } from '@mattermost/types/lib/store';

import manifest from '@/manifest';

import { PluginRegistry } from '@/types/mattermost-webapp';

import SidebarButton from './components/SidebarButton';

import { Provider } from 'react-redux';
import React, { useState, useEffect } from 'react';


const myMiddleware = (store: any) => (next: any) => (action: any) => {
    console.log('Dispatching action:', action);

    // Example: Only allow actions of a specific type
    if (action.type === 'MY_CUSTOM_ACTION') {
        console.log({ type: action.type });

        // Do something with the action or state
    }

    // Proceed to the next middleware or reducer
    return next(action);
};
// Middleware to modify API responses
const modifyApiResponseMiddleware = (store: any) => (next: any) => (action: any) => {

    if (action.payload) {

        const users = action.payload?.users
        const out_of_channel = action.payload?.out_of_channel;

        if (users || out_of_channel) {


            // Modify the response (e.g., filter out 'out_of_channel' users)
            const modifiedResponse = {
                ...action.payload,
                users: [...users],  // Keep the current users
                out_of_channel: [],  // Clear out_of_channel users or manipulate as needed
            };

            // Dispatch the modified data to the next middleware/reducer
            const modifiedAction = {
                ...action,
                payload: modifiedResponse,
            };

            return next(modifiedAction); // Pass the modified action
        }

    }

    // For other actions, just continue as normal
    return next(action);
};

export default class Plugin {


    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    initialize(registry: any, store: any) {
        // Register a custom sidebar button
        const customMiddleware = myMiddleware;

        console.log('Store:', store);
        console.log('Store State:', store.getState());
        console.log('Dispatch Method:', store.dispatch);
        console.log('Subscribe Method:', store.subscribe);
        const dispatch = store.dispatch;
        store.dispatch = (action: any) => {
            console.log({ action });

            // Apply your middleware to each dispatch
            return customMiddleware(store)(dispatch)(action);
        };
        registry.registerLeftSidebarHeaderComponent(SidebarButton);
    }

    uninitialize() {
        // Clean up if needed when the plugin is uninstalled
    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void
    }
}

window.registerPlugin("test", new Plugin());
