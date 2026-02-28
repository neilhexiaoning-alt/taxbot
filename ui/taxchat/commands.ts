/**
 * TaxChat Quick Commands — /command palette
 */

import { state, scheduleRender } from "./state";

export interface QuickCommand {
  id: string;
  name: string;
  emoji: string;
  description: string;
  action: () => void;
}

// Commands are populated by the entry point (taxchat-app.ts) to avoid circular imports
let registeredCommands: QuickCommand[] = [];

export function registerCommands(cmds: QuickCommand[]) {
  registeredCommands = cmds;
}

export function getFilteredCommands(): QuickCommand[] {
  const filter = state.commandFilter.toLowerCase().replace(/^\//, "");
  if (!filter) return registeredCommands;
  return registeredCommands.filter(c =>
    c.name.toLowerCase().includes(filter) ||
    c.id.toLowerCase().includes(filter) ||
    c.description.toLowerCase().includes(filter)
  );
}

export function openCommandPalette() {
  state.commandPaletteVisible = true;
  state.commandFilter = state.draft;
  state.commandIndex = 0;
  scheduleRender();
}

export function closeCommandPalette() {
  state.commandPaletteVisible = false;
  state.commandFilter = "";
  state.commandIndex = 0;
  scheduleRender();
}

export function executeCommand(cmd: QuickCommand) {
  closeCommandPalette();
  state.draft = "";
  cmd.action();
  scheduleRender();
}

/** Check if current draft should trigger command palette */
export function checkCommandTrigger(): boolean {
  const draft = state.draft.trim();
  if (draft.startsWith("/") && !draft.includes(" ")) {
    if (!state.commandPaletteVisible) {
      openCommandPalette();
    } else {
      state.commandFilter = draft;
      state.commandIndex = 0;
      scheduleRender();
    }
    return true;
  }
  if (state.commandPaletteVisible) {
    closeCommandPalette();
  }
  return false;
}

export function commandNavigate(direction: "up" | "down") {
  const cmds = getFilteredCommands();
  if (cmds.length === 0) return;
  if (direction === "up") {
    state.commandIndex = (state.commandIndex - 1 + cmds.length) % cmds.length;
  } else {
    state.commandIndex = (state.commandIndex + 1) % cmds.length;
  }
  scheduleRender();
}

export function commandExecuteSelected() {
  const cmds = getFilteredCommands();
  if (cmds.length > 0 && state.commandIndex < cmds.length) {
    executeCommand(cmds[state.commandIndex]);
  }
}
