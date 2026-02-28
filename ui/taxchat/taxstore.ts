/**
 * TaxStore Integration — login, browse, install, sync logic
 */

import { state, generateUUID, scheduleRender } from "./state";
import { showToast, addNotification } from "./utils";
import { saveCustomSkills } from "./persistence";
import {
  tsLogin,
  tsGetMe,
  tsListSkills,
  tsDownloadSkill,
  tsRecordInstall,
  tsGetInstalled,
  tsGetSkillDetail,
} from "./taxstore-api";
import type { TaxStoreSkill, TaxStoreInstalled } from "./taxstore-api";
import type { CustomSkill } from "./types";

const TOKEN_KEY = "taxbot_taxstore_token";

// ─── Init ─────────────────────────────────────────────────────

/** Called once at startup — restore saved token and validate */
export async function initTaxStore() {
  const saved = localStorage.getItem(TOKEN_KEY);
  if (!saved) return;

  state.taxstoreToken = saved;
  try {
    const user = await tsGetMe(saved);
    state.taxstoreUser = user;
    state.taxstoreConnected = true;
    scheduleRender();
  } catch {
    // Token expired / invalid — clear it
    localStorage.removeItem(TOKEN_KEY);
    state.taxstoreToken = null;
    state.taxstoreConnected = false;
  }
}

// ─── Auth ─────────────────────────────────────────────────────

export async function loginTaxStore(email: string, password: string) {
  state.taxstoreLoading = true;
  state.taxstoreError = null;
  scheduleRender();

  try {
    const { token, user } = await tsLogin(email, password);
    state.taxstoreToken = token;
    state.taxstoreUser = user;
    state.taxstoreConnected = true;
    localStorage.setItem(TOKEN_KEY, token);

    // Load first page of skills
    await fetchSkills(1);
    showToast(`已连接 TaxStore: ${user.name}`);
  } catch (err: any) {
    state.taxstoreError = err.message || "登录失败";
  } finally {
    state.taxstoreLoading = false;
    scheduleRender();
  }
}

export function logoutTaxStore() {
  state.taxstoreToken = null;
  state.taxstoreUser = null;
  state.taxstoreConnected = false;
  state.taxstoreSkills = [];
  state.taxstorePage = 1;
  state.taxstoreTotalPages = 1;
  state.taxstoreError = null;
  state.taxstoreInstalledIds = new Set();
  localStorage.removeItem(TOKEN_KEY);
  scheduleRender();
}

// ─── Browse Skills ────────────────────────────────────────────

export async function fetchSkills(page: number = 1) {
  state.taxstoreLoading = true;
  state.taxstoreError = null;
  scheduleRender();

  try {
    const data = await tsListSkills({
      page,
      limit: 15,
      q: state.taxstoreQuery || undefined,
      category: state.taxstoreCategory || undefined,
      sort: state.taxstoreSort,
      token: state.taxstoreToken,
    });
    state.taxstoreSkills = data.skills;
    state.taxstorePage = data.pagination.page;
    state.taxstoreTotalPages = data.pagination.totalPages;
  } catch (err: any) {
    state.taxstoreError = err.message || "获取技能列表失败";
  } finally {
    state.taxstoreLoading = false;
    scheduleRender();
  }
}

export function searchSkills(query: string) {
  state.taxstoreQuery = query;
  fetchSkills(1);
}

export function filterByCategory(cat: string) {
  state.taxstoreCategory = cat;
  fetchSkills(1);
}

export function changeSortOrder(sort: "latest" | "popular") {
  state.taxstoreSort = sort;
  fetchSkills(1);
}

// ─── Install Skill ────────────────────────────────────────────

export async function installFromTaxStore(skill: TaxStoreSkill) {
  if (!state.taxstoreToken) {
    showToast("请先登录 TaxStore 账户");
    return;
  }

  // Check if already installed locally
  if (state.customSkills.some(s => s.taxstoreSkillId === skill.id)) {
    showToast(`技能「${skill.name}」已安装`);
    return;
  }

  // Prevent double-click
  if (state.taxstoreInstallingId) return;

  state.taxstoreInstallingId = skill.id;
  state.taxstoreInstallStep = "downloading";
  scheduleRender();

  try {
    // 1. Download ZIP
    const { blob } = await tsDownloadSkill(skill.id, state.taxstoreToken);

    // Validate it's actually a ZIP (PK\x03\x04 magic bytes)
    const header = new Uint8Array(await blob.slice(0, 4).arrayBuffer());
    if (header[0] !== 0x50 || header[1] !== 0x4B) {
      throw new Error("服务器返回的文件不是有效的技能包（非 ZIP 格式）");
    }

    state.taxstoreInstallStep = "installing";
    scheduleRender();

    // 2. Convert to ArrayBuffer (much faster than base64 for IPC)
    const arrayBuffer = await blob.arrayBuffer();

    // 3. Install via Electron (prefer buffer API, fallback to base64)
    const api = (window as any).electronAPI;
    if (!api?.installSkillPackage && !api?.installSkillBuffer) {
      showToast("当前环境不支持技能包安装");
      return;
    }

    const result = api.installSkillBuffer
      ? await api.installSkillBuffer(arrayBuffer, `${skill.name}.zip`)
      : await api.installSkillPackage(await blobToBase64(blob), `${skill.name}.zip`);

    if (!result?.ok) {
      showToast(`安装失败: ${result?.error || "未知错误"}`);
      return;
    }

    // 4. Add to local custom skills
    const customSkill: CustomSkill = {
      id: generateUUID(),
      name: result.skill?.name || skill.name,
      emoji: result.skill?.emoji || "📦",
      description: result.skill?.description || skill.description,
      prompt: result.skill?.prompt || "",
      pinned: false,
      createdAt: Date.now(),
      folderName: result.folderName,
      taxstoreSkillId: skill.id,
      taxstoreVersion: skill.version,
    };
    state.customSkills.push(customSkill);
    saveCustomSkills();
    state.taxstoreInstalledIds.add(skill.id);

    // 5. Record on TaxStore (non-blocking)
    tsRecordInstall(state.taxstoreToken, skill.id, skill.version).catch(() => {});

    // 6. Refresh user points
    refreshUserInfo();

    showToast(`技能「${skill.name}」已安装`);
    addNotification(`已从 TaxStore 安装技能: ${skill.name}`, "📦");
  } catch (err: any) {
    showToast(err.message || "安装失败");
  } finally {
    state.taxstoreInstallingId = null;
    state.taxstoreInstallStep = null;
    scheduleRender();
  }
}

// ─── Sync ─────────────────────────────────────────────────────

/** Refresh user info (points etc.) — called after install */
async function refreshUserInfo() {
  if (!state.taxstoreToken) return;
  try {
    state.taxstoreUser = await tsGetMe(state.taxstoreToken);
    scheduleRender();
  } catch { /* ignore */ }
}

/**
 * Sync installed skills on startup:
 * - Build set of TaxStore skill IDs installed locally
 * - Fetch remote installed list to detect missing / updatable
 */
export async function syncInstalled() {
  if (!state.taxstoreToken || !state.taxstoreConnected) return;

  // Build local installed set
  for (const sk of state.customSkills) {
    if (sk.taxstoreSkillId) {
      state.taxstoreInstalledIds.add(sk.taxstoreSkillId);
    }
  }

  try {
    const remote = await tsGetInstalled(state.taxstoreToken);

    // Check for updates
    const updates: Array<{ skillId: string; name: string; localVersion: string; remoteVersion: string }> = [];
    for (const r of remote) {
      const local = state.customSkills.find(s => s.taxstoreSkillId === r.skillId);
      if (local && local.taxstoreVersion && local.taxstoreVersion !== r.skill.version) {
        // Version on TaxStore may differ from installed version
        // Fetch latest detail to compare
        try {
          const detail = await tsGetSkillDetail(r.skillId, state.taxstoreToken);
          if (detail.version !== local.taxstoreVersion) {
            updates.push({
              skillId: r.skillId,
              name: r.skill.name,
              localVersion: local.taxstoreVersion,
              remoteVersion: detail.version,
            });
          }
        } catch { /* skip */ }
      }
    }

    if (updates.length > 0) {
      state.taxstoreUpdates = updates;
      addNotification(`${updates.length} 个 TaxStore 技能有更新可用`, "🔄");
      scheduleRender();
    }
  } catch {
    // Non-critical — ignore sync failures
  }
}

// ─── Helpers ──────────────────────────────────────────────────

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Check if a TaxStore skill is installed locally */
export function isInstalledLocally(skillId: string): boolean {
  return state.taxstoreInstalledIds.has(skillId);
}

/** Get average rating from reviews array */
export function avgRating(reviews: Array<{ rating: number }>): string {
  if (!reviews || reviews.length === 0) return "-";
  const sum = reviews.reduce((a, r) => a + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
}
