export declare function isTruthy(value: unknown): boolean;
export declare function resolveConfigPath(config: unknown, pathStr: string): unknown;
export declare function isConfigPathTruthyWithDefaults(config: unknown, pathStr: string, defaults: Record<string, boolean>): boolean;
export declare function resolveRuntimePlatform(): string;
export declare function hasBinary(bin: string): boolean;
