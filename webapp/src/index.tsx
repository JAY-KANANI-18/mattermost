import {Store, Action} from 'redux';

import {GlobalState} from '@mattermost/types/lib/store';

import manifest from '@/manifest';

import {PluginRegistry} from '@/types/mattermost-webapp';

import SidebarButton from './components/SidebarButton';

export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    initialize(registry:any, store:any) {
        // Register a custom sidebar button
        registry.registerLeftSidebarHeaderComponent( SidebarButton);
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
