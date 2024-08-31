import {Store, Action} from 'redux';

import {GlobalState} from '@mattermost/types/lib/store';

import {PluginRegistry} from '@/types/mattermost-webapp';

import SidebarButton from './components/SidebarButton';

export default class Plugin {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async initialize(registry: PluginRegistry, store: Store<GlobalState, Action<Record<string, unknown>>>) {
        // Register your custom sidebar button
        registry.registerSidebarButton('my-plugin-sidebar-button', SidebarButton);
    }
}

declare global {
    interface Window {
        registerPlugin(pluginId: string, plugin: Plugin): void
    }
}

window.registerPlugin("test-plugin", new Plugin());
