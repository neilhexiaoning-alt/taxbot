import { t as CONFIG_PATH } from "./paths-DcBT4Q4r.mjs";
import { a as displayPath } from "./utils-D9-prTJL.mjs";

//#region src/config/logging.ts
function formatConfigPath(path = CONFIG_PATH) {
	return displayPath(path);
}
function logConfigUpdated(runtime, opts = {}) {
	const path = formatConfigPath(opts.path ?? CONFIG_PATH);
	const suffix = opts.suffix ? ` ${opts.suffix}` : "";
	runtime.log(`Updated ${path}${suffix}`);
}

//#endregion
export { logConfigUpdated as n, formatConfigPath as t };