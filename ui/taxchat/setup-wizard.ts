/**
 * TaxChat Setup Wizard — First-run configuration
 */

import { state, scheduleRender } from "./state";
import { showToast } from "./utils";

export const DASHSCOPE_MODELS = [
  { id: "qwen-plus",  name: "通义千问 Plus (推荐)", desc: "均衡性价比" },
  { id: "qwen-max",   name: "通义千问 Max",        desc: "最强推理能力" },
  { id: "qwen-turbo", name: "通义千问 Turbo",      desc: "极速响应" },
  { id: "qwen-long",  name: "通义千问 Long",       desc: "超长上下文" },
];

const DASHSCOPE_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";

export async function saveSetupConfig(): Promise<void> {
  if (!state.setupApiKey.trim()) {
    state.setupError = "请输入 API Key";
    scheduleRender();
    return;
  }
  if (!state.client || !state.connected) {
    state.setupError = "服务连接中，请稍候再试...";
    scheduleRender();
    return;
  }

  state.setupSaving = true;
  state.setupError = null;
  scheduleRender();

  try {
    const patch = {
      models: {
        providers: {
          dashscope: {
            baseUrl: DASHSCOPE_BASE_URL,
            apiKey: state.setupApiKey.trim(),
            api: "openai-completions",
            models: [{
              id: state.setupModelId,
              name: state.setupModelId,
              reasoning: false,
              input: ["text", "image"],
              cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
              contextWindow: 128000,
              maxTokens: 8192,
            }],
          },
        },
      },
    };
    await state.client.request("config.patch", {
      baseHash: null,
      raw: JSON.stringify(patch),
      note: "初始模型配置",
      restartDelayMs: 1000,
    });
    localStorage.setItem("taxbot_setup_done", "1");
    state.setupStep = 3;
    showToast("配置已保存！");
  } catch (err: any) {
    state.setupError = err?.message || String(err);
  }
  state.setupSaving = false;
  scheduleRender();
}

export function dismissSetupWizard() {
  state.setupWizardVisible = false;
  scheduleRender();
}

export function skipSetupWizard() {
  localStorage.setItem("taxbot_setup_done", "1");
  state.setupWizardVisible = false;
  scheduleRender();
}
