import { Command } from "commander";
declare const COMPLETION_SHELLS: readonly ["zsh", "bash", "powershell", "fish"];
type CompletionShell = (typeof COMPLETION_SHELLS)[number];
export declare function resolveShellFromEnv(env?: NodeJS.ProcessEnv): CompletionShell;
export declare function isCompletionInstalled(shell: CompletionShell, binName?: string): Promise<boolean>;
export declare function registerCompletionCli(program: Command): void;
export declare function installCompletion(shell: string, yes: boolean, binName?: string): Promise<void>;
export {};
