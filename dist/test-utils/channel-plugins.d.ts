import type { ChannelCapabilities, ChannelId, ChannelOutboundAdapter, ChannelPlugin } from "../channels/plugins/types.js";
import type { PluginRegistry } from "../plugins/registry.js";
export declare const createTestRegistry: (channels?: PluginRegistry["channels"]) => PluginRegistry;
export declare const createIMessageTestPlugin: (params?: {
    outbound?: ChannelOutboundAdapter;
}) => ChannelPlugin;
export declare const createOutboundTestPlugin: (params: {
    id: ChannelId;
    outbound: ChannelOutboundAdapter;
    label?: string;
    docsPath?: string;
    capabilities?: ChannelCapabilities;
}) => ChannelPlugin;
