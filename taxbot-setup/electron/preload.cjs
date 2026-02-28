/**
 * OpenClaw Desktop - Electron Preload Script
 * 提供安全的 IPC 通信接口
 */

const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // Gateway 状态
  getGatewayStatus: () => {
    return new Promise((resolve) => {
      ipcRenderer.send('get-gateway-status');
      ipcRenderer.once('gateway-status', (event, status) => {
        resolve(status);
      });
    });
  },

  // 重启 Gateway
  restartGateway: () => {
    ipcRenderer.send('restart-gateway');
  },

  // 关闭 Gateway
  stopGateway: () => {
    ipcRenderer.send('stop-gateway');
  },

  // 启动 Gateway
  startGateway: () => {
    ipcRenderer.send('start-gateway');
  },

  // 监听 Gateway 错误
  onGatewayError: (callback) => {
    ipcRenderer.on('gateway-error', (event, message) => {
      callback(message);
    });
  },

  // 获取 Gateway 端口（可能因冲突而变化）
  getGatewayPort: () => ipcRenderer.invoke('get-gateway-port'),
  // 监听端口变更
  onGatewayPortChanged: (callback) => {
    ipcRenderer.on('gateway-port-changed', (event, port) => {
      callback(port);
    });
  },
  // 获取 Gateway token
  getGatewayToken: () => ipcRenderer.invoke('get-gateway-token'),

  // 文件夹选择与记忆导入
  openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),
  importFolderToMemory: (folderPath) => ipcRenderer.invoke('import-folder-to-memory', folderPath),
  getFolderKnowledge: () => ipcRenderer.invoke('get-folder-knowledge'),
  startFolderWatcher: (folderPath) => ipcRenderer.invoke('start-folder-watcher', folderPath),
  stopFolderWatcher: () => ipcRenderer.invoke('stop-folder-watcher'),
  onFolderKnowledgeUpdated: (callback) => {
    ipcRenderer.on('folder-knowledge-updated', (event, data) => {
      callback(data);
    });
  },

  // 文档文本提取 (PDF/文本文件)
  extractDocumentText: (base64Data, mimeType, fileName) => ipcRenderer.invoke('extract-document-text', { base64Data, mimeType, fileName }),

  // Taxbot专业知识 API
  taxYesChat: (content, messageList) => ipcRenderer.invoke('taxyes-chat', { content, messageList }),

  // 收藏同步到 memory（供 agent 回忆）
  syncFavoritesToMemory: (favorites) => ipcRenderer.invoke('sync-favorites-to-memory', favorites),

  // 智能体目录同步到主 workspace
  syncAgentsToMainWorkspace: (data) => ipcRenderer.invoke('sync-agents-to-main-workspace', data),
  // 从 workspace 目录恢复智能体身份信息
  recoverAgentIdentities: () => ipcRenderer.invoke('recover-agent-identities'),
  // 保存智能体头像到 workspace 目录
  saveAgentAvatar: (data) => ipcRenderer.invoke('save-agent-avatar', data),
  // 创建智能体工作区（IDENTITY.md + SOUL.md）
  createAgentWorkspace: (data) => ipcRenderer.invoke('create-agent-workspace', data),
  // 更新智能体工作区文件
  updateAgentWorkspace: (data) => ipcRenderer.invoke('update-agent-workspace', data),
  // 读取智能体工作区文件（用于编辑）
  readAgentWorkspace: (data) => ipcRenderer.invoke('read-agent-workspace', data),
  // 删除智能体工作区文件夹
  deleteAgentWorkspace: (data) => ipcRenderer.invoke('delete-agent-workspace', data),

  // 智能体记忆持久化
  readAgentMemory: (agentId) => ipcRenderer.invoke('read-agent-memory', { agentId }),
  writeAgentMemory: (agentId, content) => ipcRenderer.invoke('write-agent-memory', { agentId, content }),

  // 知识库文件管理
  listKnowledgeFiles: (folderPath) => ipcRenderer.invoke('list-knowledge-files', folderPath),
  copyToKnowledgeFolder: (fileData) => ipcRenderer.invoke('copy-to-knowledge-folder', fileData),
  deleteKnowledgeFile: (folderPath, fileName) => ipcRenderer.invoke('delete-knowledge-file', { folderPath, fileName }),
  readKnowledgeFile: (fileName) => ipcRenderer.invoke('read-knowledge-file', fileName),

  // 自定义 Skill 文件管理
  saveCustomSkill: (skill) => ipcRenderer.invoke('save-custom-skill', skill),
  deleteCustomSkill: (id, name, folderName) => ipcRenderer.invoke('delete-custom-skill', { id, name, folderName }),
  installSkillPackage: (base64Data, fileName) => ipcRenderer.invoke('install-skill-package', { base64Data, fileName }),
  installSkillBuffer: (buffer, fileName) => ipcRenderer.invoke('install-skill-buffer', { buffer, fileName }),
  exportSkill: (id, name) => ipcRenderer.invoke('export-skill', { id, name }),
  listManagedSkills: () => ipcRenderer.invoke('list-managed-skills'),
  openPath: (filePath) => ipcRenderer.invoke('open-path', filePath),
  onManagedSkillsUpdated: (callback) => {
    ipcRenderer.on('managed-skills-updated', () => {
      callback();
    });
  },

  // 退出应用
  quitApp: () => {
    ipcRenderer.send('quit-app');
  },

  // 应用信息
  appInfo: {
    name: 'Taxbot',
    version: process.env.npm_package_version || '1.0.0',
    platform: process.platform,
  },
});

// 日志到控制台
console.log('OpenClaw Desktop Preload Script Loaded');
