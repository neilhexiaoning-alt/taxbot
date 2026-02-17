/**
 * Best-effort process-tree termination.
 * - Windows: use taskkill /T to include descendants.
 * - Unix: try process-group kill first, then direct pid kill.
 */
export declare function killProcessTree(pid: number): void;
