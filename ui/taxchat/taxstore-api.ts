/**
 * TaxStore API Client — HTTP interface to taxbot.cc OpenAPI
 */

const TAXSTORE_BASE = "https://taxbot.cc:8443/api/open";

// ─── Types ────────────────────────────────────────────────────
export interface TaxStoreUser {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
}

export interface TaxStoreSkill {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  tags: string | null;
  pointsCost: number;
  downloads: number;
  status: string;
  author: { name: string };
  reviews: Array<{ rating: number }>;
  createdAt: string;
}

export interface TaxStoreInstalled {
  id: string;
  skillId: string;
  version: string;
  installedAt: string;
  skill: { id: string; name: string; version: string; category: string };
}

export interface TaxStorePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Auth ─────────────────────────────────────────────────────
export async function tsLogin(
  email: string,
  password: string,
): Promise<{ token: string; user: TaxStoreUser; expiresIn: number }> {
  const res = await fetch(`${TAXSTORE_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `登录失败 (${res.status})`);
  }
  return res.json();
}

export async function tsGetMe(token: string): Promise<TaxStoreUser> {
  const res = await fetch(`${TAXSTORE_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("token 无效或已过期");
  const data = await res.json();
  return data.user ?? data;
}

// ─── Skills ───────────────────────────────────────────────────
export async function tsListSkills(opts: {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  sort?: "latest" | "popular";
  token?: string | null;
}): Promise<{ skills: TaxStoreSkill[]; pagination: TaxStorePagination }> {
  const params = new URLSearchParams();
  if (opts.page) params.set("page", String(opts.page));
  if (opts.limit) params.set("limit", String(opts.limit));
  if (opts.q) params.set("q", opts.q);
  if (opts.category) params.set("category", opts.category);
  if (opts.sort) params.set("sort", opts.sort);

  const headers: Record<string, string> = {};
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  const res = await fetch(`${TAXSTORE_BASE}/skills?${params}`, { headers });
  if (!res.ok) throw new Error(`获取技能列表失败 (${res.status})`);
  return res.json();
}

export async function tsGetSkillDetail(
  id: string,
  token?: string | null,
): Promise<TaxStoreSkill> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${TAXSTORE_BASE}/skills/${id}`, { headers });
  if (!res.ok) throw new Error(`获取技能详情失败 (${res.status})`);
  return res.json();
}

export async function tsDownloadSkill(
  id: string,
  token: string,
): Promise<{ blob: Blob; alreadyPurchased: boolean }> {
  const res = await fetch(`${TAXSTORE_BASE}/skills/${id}/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 402) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      data.error || `积分不足 (需要: ${data.required ?? "?"}, 当前: ${data.current ?? "?"})`,
    );
  }
  if (res.status === 401) throw new Error("请先登录 TaxStore 账户");
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.warn("[TaxStore] Download failed:", res.status, data);
    throw new Error(data.error || `下载失败 (${res.status})`);
  }
  const blob = await res.blob();
  const alreadyPurchased = res.headers.get("X-Already-Purchased") === "1";
  return { blob, alreadyPurchased };
}

// ─── Agent Rental Types ──────────────────────────────────────
export interface AgentListing {
  id: string;
  name: string;
  emoji: string;
  description: string;
  price: number;
  status: string;
  completedTasks: number;
  avgRating: number;
  agentId: string;
  avatarUrl?: string | null;
  tags?: string | null;
  owner: { id: string; name: string };
  createdAt: string;
  _count?: { tasks: number };
}

export interface TaskAttachmentMeta {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface AgentTask {
  id: string;
  title: string;
  content: string;
  attachments?: string;
  result?: string;
  resultAttachments?: string;
  status: string;
  rating?: number;
  ratingComment?: string;
  revisionCount?: number;
  revisionRequest?: string;
  price: number;
  listing: { id: string; name: string; emoji: string; agentId: string; avatarUrl?: string | null; owner: { name: string } };
  client: { id: string; name: string };
  createdAt: string;
  completedAt?: string;
  clientRead?: boolean;
  unreadMessageCount?: number;
}

// ─── Agent Rental API ────────────────────────────────────────
export async function tsPublishAgent(
  token: string,
  data: { name: string; emoji: string; description: string; price: number; agentId: string; avatarUrl?: string; tags?: string },
): Promise<AgentListing> {
  const res = await fetch(`${TAXSTORE_BASE}/agents/publish`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || `发布失败 (${res.status})`);
  }
  return res.json();
}

export async function tsUpdateAgent(
  token: string,
  id: string,
  data: Partial<{ description: string; price: number; status: string; tags: string }>,
): Promise<AgentListing> {
  const res = await fetch(`${TAXSTORE_BASE}/agents/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || `更新失败 (${res.status})`);
  }
  return res.json();
}

export async function tsUnpublishAgent(token: string, id: string): Promise<void> {
  const res = await fetch(`${TAXSTORE_BASE}/agents/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || `下架失败 (${res.status})`);
  }
}

export async function tsGetMyAgents(token: string): Promise<AgentListing[]> {
  const res = await fetch(`${TAXSTORE_BASE}/agents/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`获取我的智能体失败 (${res.status})`);
  return res.json();
}

export async function tsHeartbeat(token: string, listingIds: string[]): Promise<void> {
  if (listingIds.length === 0) return;
  try {
    await fetch(`${TAXSTORE_BASE}/agents/heartbeat`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ listingIds }),
    });
  } catch { /* silent */ }
}

export async function tsGetPendingTasks(token: string, status?: string): Promise<AgentTask[]> {
  const params = status ? `?status=${status}` : "";
  const res = await fetch(`${TAXSTORE_BASE}/agents/tasks${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`获取任务失败 (${res.status})`);
  return res.json();
}

export async function tsCompleteTask(
  token: string,
  taskId: string,
  result: string,
  resultAttachments?: TaskAttachmentMeta[],
): Promise<AgentTask> {
  const res = await fetch(`${TAXSTORE_BASE}/agents/tasks/${taskId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ result, ...(resultAttachments && { resultAttachments }) }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || `提交失败 (${res.status})`);
  }
  return res.json();
}

export async function tsUploadTaskAttachment(
  token: string,
  file: File,
): Promise<TaskAttachmentMeta> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${TAXSTORE_BASE}/agents/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || `上传失败 (${res.status})`);
  }
  return res.json();
}

export async function tsGetAgentStats(): Promise<{ avgMinutes: number; recentCount: number }> {
  const res = await fetch(`${TAXSTORE_BASE}/agents/stats`);
  if (!res.ok) return { avgMinutes: 0, recentCount: 0 };
  return res.json();
}

export async function tsListAgents(opts?: {
  q?: string;
  sort?: "latest" | "popular";
  page?: number;
  limit?: number;
}): Promise<{ agents: AgentListing[]; pagination: TaxStorePagination }> {
  const params = new URLSearchParams();
  if (opts?.q) params.set("q", opts.q);
  if (opts?.sort) params.set("sort", opts.sort);
  if (opts?.page) params.set("page", String(opts.page));
  if (opts?.limit) params.set("limit", String(opts.limit));
  const qs = params.toString();
  const res = await fetch(`${TAXSTORE_BASE}/agents${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error(`获取智能体列表失败 (${res.status})`);
  return res.json();
}

export async function tsCreateTask(
  token: string,
  listingId: string,
  data: { title: string; content: string; attachments?: TaskAttachmentMeta[] },
): Promise<AgentTask> {
  const res = await fetch(`${TAXSTORE_BASE}/agents/${listingId}/task`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || `下单失败 (${res.status})`);
  }
  return res.json();
}

export async function tsGetMyTasks(token: string): Promise<AgentTask[]> {
  const res = await fetch(`${TAXSTORE_BASE}/agents/my-tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`获取我的任务失败 (${res.status})`);
  return res.json();
}

export async function tsMarkTaskRead(
  token: string,
  taskId: string,
): Promise<void> {
  await fetch(`${TAXSTORE_BASE}/agents/my-tasks/${taskId}/read`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {});
}

export async function tsRateTask(
  token: string,
  taskId: string,
  data: { rating: number; comment?: string },
): Promise<void> {
  const res = await fetch(`${TAXSTORE_BASE}/agents/my-tasks/${taskId}/rate`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || `评价失败 (${res.status})`);
  }
}

// ─── Task Revision ──────────────────────────────────────────
export async function tsRequestRevision(
  token: string,
  taskId: string,
  request: string,
): Promise<AgentTask> {
  const res = await fetch(`${TAXSTORE_BASE}/agents/my-tasks/${taskId}/revise`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ request }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || `请求修订失败 (${res.status})`);
  }
  return res.json();
}

// ─── Task Messages ───────────────────────────────────────────
export interface TaskMessage {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string };
}

export async function tsGetTaskMessages(
  token: string,
  taskId: string,
): Promise<TaskMessage[]> {
  const res = await fetch(`${TAXSTORE_BASE}/agents/tasks/${taskId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`获取消息失败 (${res.status})`);
  const data = await res.json();
  return data.messages;
}

export async function tsSendTaskMessage(
  token: string,
  taskId: string,
  content: string,
): Promise<TaskMessage> {
  const res = await fetch(`${TAXSTORE_BASE}/agents/tasks/${taskId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || `发送失败 (${res.status})`);
  }
  return res.json();
}

// ─── Installed ────────────────────────────────────────────────
export async function tsGetInstalled(
  token: string,
): Promise<TaxStoreInstalled[]> {
  const res = await fetch(`${TAXSTORE_BASE}/me/installed`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`获取已安装列表失败 (${res.status})`);
  return res.json();
}

export async function tsRecordInstall(
  token: string,
  skillId: string,
  version: string,
): Promise<void> {
  const res = await fetch(`${TAXSTORE_BASE}/me/installed`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ skillId, version }),
  });
  if (!res.ok) {
    // Non-critical — don't throw, just log
    console.warn("[TaxStore] Failed to record installation:", res.status);
  }
}
