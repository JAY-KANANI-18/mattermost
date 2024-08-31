import {Store, Action} from 'redux';

import {GlobalState} from '@mattermost/types/lib/store';

import manifest from '@/manifest';

import {PluginRegistry} from '@/types/mattermost-webapp';

import SidebarButton from './components/SidebarButton';

import { Provider } from 'react-redux';
import React, { useState, useEffect } from 'react';


const myMiddleware = (store:any) => (next:any) => (action:any) => {
    console.log('Dispatching action:', action);

    // Example: Only allow actions of a specific type
    if (action.type === 'MY_CUSTOM_ACTION') {
        console.log({type:action.type});

        // Do something with the action or state
    }

    // Proceed to the next middleware or reducer
    return next(action);
};
export default class Plugin {


    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    initialize(registry:any, store:any) {
        // Register a custom sidebar button
        const customMiddleware = myMiddleware;

        console.log('Store:', store);
        console.log('Store State:', store.getState());
        console.log('Dispatch Method:', store.dispatch);
        console.log('Subscribe Method:', store.subscribe);
        const dispatch = store.dispatch;
        store.dispatch = (action:any) => {
            console.log({action});

            // Apply your middleware to each dispatch
            return customMiddleware(store)(dispatch)(action);
        };
        registry.registerLeftSidebarHeaderComponent(  SidebarButton);
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
