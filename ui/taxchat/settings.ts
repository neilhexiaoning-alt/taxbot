/**
 * TaxChat Model/Settings Management
 */

import type { AppState } from "./types";
import { state, scheduleRender } from "./state";
import { showToast } from "./utils";

// ─── Model Config Helpers ──────────────────────────────────────
export function getProviderNames(): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const m of state.modelList) {
    const key = m.provider || "unknown";
    if (!seen.has(key)) { seen.add(key); result.push(key); }
  }
  return result;
}

export function getModelsForProvider(provider: string): AppState["modelList"] {
  return state.modelList.filter(m => m.provider === provider);
}

export function selectProvider(providerName: string) {
  state.modelConfigDraft.provider = providerName;
  state.modelConfigDraft.baseUrl = "";
  state.modelConfigDraft.apiKey = "";
  state.modelConfigDraft.api = "openai-completions";
  state.apiKeyVisible = false;
  const providers = state.currentModelConfig?.providers;
  if (providers && typeof providers === "object") {
    const p = providers[providerName];
    if (p) {
      state.modelConfigDraft.baseUrl = p.baseUrl || "";
      state.modelConfigDraft.apiKey = p.apiKey || "";
      state.modelConfigDraft.api = p.api || "openai-completions";
    }
  }
  const models = getModelsForProvider(providerName);
  state.modelConfigDraft.modelId = models.length > 0 ? models[0].id : "";
  scheduleRender();
}

export function selectModel(modelId: string) {
  state.modelConfigDraft.modelId = modelId;
  scheduleRender();
}

export function populateModelDraft(config: any) {
  const providers = config?.models?.providers;
  if (!providers || typeof providers !== "object") return;
  const keys = Object.keys(providers);
  if (keys.length === 0) return;
  const key = keys[0];
  const p = providers[key];
  const modelId = p?.models?.[0]?.id || "";
  const baseUrl = p?.baseUrl || "";
  const apiKey = p?.apiKey || "";
  state.modelConfigDraft = {
    provider: key,
    baseUrl,
    apiKey,
    api: p?.api || "openai-completions",
    modelId,
  };
  state.activeModel = { provider: key, modelId, baseUrl, apiKey };
}

export async function loadModelConfig() {
  if (!state.client || !state.connected) {
    state.modelError = "未连接到服务";
    scheduleRender();
    return;
  }
  state.modelLoading = true;
  state.modelError = null;
  scheduleRender();
  try {
    const [modelsRes, configRes] = await Promise.all([
      state.client.request("models.list", {}) as Promise<any>,
      state.client.request("config.get", {}) as Promise<any>,
    ]);
    state.modelList = Array.isArray(modelsRes?.models) ? modelsRes.models : [];
    state.configBaseHash = configRes?.hash || null;
    state.currentModelConfig = configRes?.config?.models || null;
    populateModelDraft(configRes?.config);
  } catch (err: any) {
    state.modelError = err?.message || String(err);
  }
  state.modelLoading = false;
  scheduleRender();
}

export async function saveModelConfig() {
  if (!state.client || !state.connected) {
    state.modelError = "未连接到服务";
    scheduleRender();
    return;
  }
  const d = state.modelConfigDraft;
  if (!d.provider.trim()) { state.modelError = "请填写提供商名称"; scheduleRender(); return; }
  if (!d.baseUrl.trim()) { state.modelError = "请填写 API 地址"; scheduleRender(); return; }
  if (!d.modelId.trim()) { state.modelError = "请填写模型 ID"; scheduleRender(); return; }

  state.modelSaving = true;
  state.modelError = null;
  scheduleRender();
  try {
    const patch: any = {
      models: {
        providers: {
          [d.provider.trim()]: {
            baseUrl: d.baseUrl.trim(),
            apiKey: d.apiKey.trim() || undefined,
            api: d.api,
            models: [{
              id: d.modelId.trim(),
              name: d.modelId.trim(),
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
      baseHash: state.configBaseHash,
      raw: JSON.stringify(patch),
      note: "模型配置更新",
      restartDelayMs: 1000,
    });
    showToast("模型配置已保存，服务正在重启...");
    state.settingsView = "main";
  } catch (err: any) {
    state.modelError = err?.message || String(err);
  }
  state.modelSaving = false;
  scheduleRender();
}
