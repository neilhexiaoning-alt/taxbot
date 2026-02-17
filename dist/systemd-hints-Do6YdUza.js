import { t as formatCliCommand } from "./command-format-DEKzLnLg.js";

//#region src/daemon/runtime-format.ts
function formatRuntimeStatus(runtime) {
	if (!runtime) return null;
	const status = runtime.status ?? "unknown";
	const details = [];
	if (runtime.pid) details.push(`pid ${runtime.pid}`);
	if (runtime.state && runtime.state.toLowerCase() !== status) details.push(`state ${runtime.state}`);
	if (runtime.subState) details.push(`sub ${runtime.subState}`);
	if (runtime.lastExitStatus !== void 0) details.push(`last exit ${runtime.lastExitStatus}`);
	if (runtime.lastExitReason) details.push(`reason ${runtime.lastExitReason}`);
	if (runtime.lastRunResult) details.push(`last run ${runtime.lastRunResult}`);
	if (runtime.lastRunTime) details.push(`last run time ${runtime.lastRunTime}`);
	if (runtime.detail) details.push(runtime.detail);
	return details.length > 0 ? `${status} (${details.join(", ")})` : status;
}

//#endregion
//#region src/daemon/systemd-hints.ts
function isSystemdUnavailableDetail(detail) {
	if (!detail) return false;
	const normalized = detail.toLowerCase();
	return normalized.includes("systemctl --user unavailable") || normalized.includes("systemctl not available") || normalized.includes("not been booted with systemd") || normalized.includes("failed to connect to bus") || normalized.includes("systemd user services are required");
}
function renderSystemdUnavailableHints(options = {}) {
	if (options.wsl) return [
		"WSL2 needs systemd enabled: edit /etc/wsl.conf with [boot]\\nsystemd=true",
		"Then run: wsl --shutdown (from PowerShell) and reopen your distro.",
		"Verify: systemctl --user status"
	];
	return ["systemd user services are unavailable; install/enable systemd or run the gateway under your supervisor.", `If you're in a container, run the gateway in the foreground instead of \`${formatCliCommand("openclaw gateway")}\`.`];
}

//#endregion
export { renderSystemdUnavailableHints as n, formatRuntimeStatus as r, isSystemdUnavailableDetail as t };