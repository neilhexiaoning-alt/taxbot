import { c as createSubsystemLogger } from "./exec-CTJFoTnU.js";
import { t as parseBooleanValue } from "./boolean-mcn6kL0s.js";

//#region src/infra/env.ts
const log = createSubsystemLogger("env");
function isTruthyEnvValue(value) {
	return parseBooleanValue(value) === true;
}

//#endregion
export { isTruthyEnvValue as t };