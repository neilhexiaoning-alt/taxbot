/**
 * TaxChat Knowledge Management
 */

import { state, scheduleRender } from "./state";
import { showToast, addNotification, formatImportResult, generateTimestamp, generateWordDoc } from "./utils";
import { syncManagedSkills } from "./skills";

// ─── Knowledge Drag Counter ────────────────────────────────────
export let knowledgeDragCounter = 0;
export function setKnowledgeDragCounter(val: number) { knowledgeDragCounter = val; }

// ─── Knowledge Indexing & Relevance Selection ─────────────────
interface KnowledgeChunk {
  fileName: string;
  content: string;
  keywords: string[];
}

let knowledgeIndex: KnowledgeChunk[] = [];

/** Split raw knowledge content into indexed chunks by 【filename】 markers */
export function indexKnowledge(raw: string) {
  knowledgeIndex = [];
  if (!raw) return;

  // Split by 【filename】 markers
  const parts = raw.split(/(?=【[^\n】]+】)/);
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const headerMatch = trimmed.match(/^【([^\n】]+)】/);
    const fileName = headerMatch ? headerMatch[1] : "unknown";
    const content = headerMatch ? trimmed.slice(headerMatch[0].length).trim() : trimmed;

    // Extract keywords: Chinese chars 2+, or latin words 3+
    const keywords: string[] = [];
    const cnMatches = content.match(/[\u4e00-\u9fa5]{2,}/g);
    if (cnMatches) {
      const freq = new Map<string, number>();
      for (const w of cnMatches) freq.set(w, (freq.get(w) || 0) + 1);
      const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);
      for (const [w] of sorted.slice(0, 30)) keywords.push(w);
    }
    const enMatches = content.match(/[a-zA-Z]{3,}/g);
    if (enMatches) {
      const freq = new Map<string, number>();
      for (const w of enMatches) freq.set(w.toLowerCase(), (freq.get(w.toLowerCase()) || 0) + 1);
      for (const [w] of [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)) keywords.push(w);
    }

    knowledgeIndex.push({ fileName, content, keywords });
  }
  console.log(`[Knowledge] Indexed ${knowledgeIndex.length} chunks`);
}

/** Select the most relevant knowledge chunks for a given query, up to maxChars */
export function selectRelevantKnowledge(query: string, maxChars = 4000): string {
  if (knowledgeIndex.length === 0) return state.folderKnowledge || "";

  // If total knowledge is small enough, send it all
  const totalLen = knowledgeIndex.reduce((sum, c) => sum + c.content.length, 0);
  if (totalLen <= maxChars) {
    return knowledgeIndex.map(c => `【${c.fileName}】\n${c.content}`).join("\n\n");
  }

  // Score each chunk by keyword overlap with query
  const queryLower = query.toLowerCase();
  const scored = knowledgeIndex.map(chunk => {
    let score = 0;
    for (const kw of chunk.keywords) {
      if (queryLower.includes(kw.toLowerCase())) score += 2;
    }
    // Boost if filename matches
    if (queryLower.includes(chunk.fileName.toLowerCase())) score += 5;
    return { chunk, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Take chunks until maxChars
  const selected: string[] = [];
  let charCount = 0;
  for (const { chunk, score } of scored) {
    if (score === 0 && selected.length > 0) break; // Stop if no more relevant chunks
    const entry = `【${chunk.fileName}】\n${chunk.content}`;
    if (charCount + entry.length > maxChars && selected.length > 0) break;
    selected.push(entry);
    charCount += entry.length;
  }

  return selected.join("\n\n");
}

// ─── Folder Knowledge ──────────────────────────────────────────
export async function loadFolderKnowledge() {
  const api = (window as any).electronAPI;
  if (!api?.getFolderKnowledge || !state.authorizedFolder) return;
  try {
    const result = await api.getFolderKnowledge();
    if (result?.ok && result.content) {
      state.folderKnowledge = result.content;
      indexKnowledge(result.content);
      console.log(`Folder knowledge loaded: ${result.files?.length || 0} files, ${result.content.length} chars`);
    }
  } catch (err) {
    console.warn("Failed to load folder knowledge:", err);
  }
}

export async function loadKnowledgeFiles() {
  const api = (window as any).electronAPI;
  if (!api?.listKnowledgeFiles || !state.authorizedFolder) return;
  state.knowledgeLoading = true;
  scheduleRender();
  try {
    const result = await api.listKnowledgeFiles(state.authorizedFolder);
    if (result?.ok) {
      state.knowledgeFiles = result.files || [];
    }
  } catch (err) {
    console.warn("Failed to list knowledge files:", err);
  }
  state.knowledgeLoading = false;
  scheduleRender();
}

export async function handleKnowledgeDrop(e: DragEvent) {
  const api = (window as any).electronAPI;
  if (!api?.copyToKnowledgeFolder || !state.authorizedFolder) return;
  const files = e.dataTransfer?.files;
  if (!files || files.length === 0) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      if (!base64) return;
      try {
        await api.copyToKnowledgeFolder({
          folderPath: state.authorizedFolder,
          fileName: file.name,
          base64Data: base64,
        });
      } catch (err) {
        console.warn("Failed to copy file to knowledge folder:", err);
      }
      if (i === files.length - 1) {
        await loadKnowledgeFiles();
        await loadFolderKnowledge();
        state.folderKnowledgeSent = false;
      }
    };
    reader.readAsDataURL(file);
  }
}

export function addKnowledgeRef(name: string) {
  if (state.knowledgeRefs.some(r => r.name === name)) return;
  state.knowledgeRefs.push({ name });
  scheduleRender();
}

export function removeKnowledgeRef(index: number) {
  state.knowledgeRefs.splice(index, 1);
  scheduleRender();
}

export async function deleteKnowledgeFileAction(fileName: string) {
  const api = (window as any).electronAPI;
  if (!api?.deleteKnowledgeFile || !state.authorizedFolder) return;
  try {
    await api.deleteKnowledgeFile(state.authorizedFolder, fileName);
    state.knowledgeRefs = state.knowledgeRefs.filter(r => r.name !== fileName);
    await loadKnowledgeFiles();
    await loadFolderKnowledge();
    state.folderKnowledgeSent = false;
  } catch (err) {
    console.warn("Failed to delete knowledge file:", err);
  }
}

// ─── Folder Import ─────────────────────────────────────────────
export async function doImportFolder(folderPath: string) {
  const api = (window as any).electronAPI;
  state.importingFolder = true;
  state.importResult = null;
  scheduleRender();
  try {
    const result = await api.importFolderToMemory(folderPath);
    state.importingFolder = false;
    if (result.ok) {
      state.authorizedFolder = result.folderPath;
      localStorage.setItem("taxbot_authorized_folder", result.folderPath);
      state.importResult = formatImportResult(result);
      addNotification(`文件夹已导入: ${state.importResult}`, "📂");
      await loadFolderKnowledge();
      state.folderKnowledgeSent = false;
      startWatcher();
    } else {
      state.importResult = result.error || "导入失败";
    }
  } catch (err: any) {
    state.importingFolder = false;
    state.importResult = err?.message || "导入失败";
  }
  scheduleRender();
}

export async function handleAuthorizeFolder() {
  const api = (window as any).electronAPI;
  if (!api?.openFolderDialog) return;
  const folderPath = await api.openFolderDialog();
  if (!folderPath) return;
  await doImportFolder(folderPath);
}

export async function handleRefreshFolder() {
  if (!state.authorizedFolder) return;
  await doImportFolder(state.authorizedFolder);
}

// ─── Save Message to Knowledge ─────────────────────────────────
export async function saveMessageToKnowledge(text: string) {
  const api = (window as any).electronAPI;
  if (!api?.copyToKnowledgeFolder) return;
  if (!state.authorizedFolder) {
    showToast("请先在知识库中选择文件夹");
    return;
  }
  const fileName = `Taxbot_${generateTimestamp()}.doc`;
  const wordDoc = generateWordDoc(text);
  const base64 = btoa(unescape(encodeURIComponent(wordDoc)));
  try {
    await api.copyToKnowledgeFolder({
      folderPath: state.authorizedFolder,
      fileName,
      base64Data: base64,
    });
    showToast(`已保存到知识库: ${fileName}`);
    await loadKnowledgeFiles();
    await loadFolderKnowledge();
    state.folderKnowledgeSent = false;
  } catch (err) {
    console.warn("Failed to save to knowledge:", err);
    showToast("保存失败");
  }
}

// ─── File Watcher ──────────────────────────────────────────────
export function startWatcher() {
  const api = (window as any).electronAPI;
  if (!api?.startFolderWatcher || !state.authorizedFolder) return;
  api.startFolderWatcher(state.authorizedFolder);
}

let _watcherListenerRegistered = false;
export function registerWatcherListener() {
  if (_watcherListenerRegistered) return;
  const api = (window as any).electronAPI;
  if (!api?.onFolderKnowledgeUpdated) return;
  _watcherListenerRegistered = true;
  api.onFolderKnowledgeUpdated(async (data: { newFiles: string[]; count: number }) => {
    console.log(`Folder watcher: ${data.count} new file(s) detected`);
    await loadFolderKnowledge();
    const names = data.newFiles.length <= 3
      ? data.newFiles.join("、")
      : data.newFiles.slice(0, 3).join("、") + ` 等${data.newFiles.length}个文件`;
    const msg = `新知识已学习: ${names}`;
    showToast(msg);
    addNotification(msg, "📚");
    scheduleRender();
  });
}

let _skillsListenerRegistered = false;
export function registerManagedSkillsListener() {
  if (_skillsListenerRegistered) return;
  const api = (window as any).electronAPI;
  if (!api?.onManagedSkillsUpdated) return;
  _skillsListenerRegistered = true;
  api.onManagedSkillsUpdated(() => {
    console.log("Managed skills directory changed, syncing...");
    syncManagedSkills();
  });
}
