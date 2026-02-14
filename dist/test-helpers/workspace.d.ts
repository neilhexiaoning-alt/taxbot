export declare function makeTempWorkspace(prefix?: string): Promise<string>;
export declare function writeWorkspaceFile(params: {
    dir: string;
    name: string;
    content: string;
}): Promise<string>;
