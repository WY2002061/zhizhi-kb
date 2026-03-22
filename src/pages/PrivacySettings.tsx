import { useState, useRef } from 'react';
import { ShieldCheck, Eye, EyeOff, Shield, ShieldAlert, ShieldOff, Trash2, Download, Upload, Clock, AlertTriangle, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { useKnowledgeStore } from '../store/knowledgeStore';

const ACTION_LABELS: Record<string, { label: string; icon: typeof Eye; color: string }> = {
  ai_read: { label: 'AI 读取', icon: Eye, color: 'text-blue-500 bg-blue-50' },
  ai_summarize: { label: 'AI 摘要', icon: FileText, color: 'text-indigo-500 bg-indigo-50' },
  ai_tag: { label: 'AI 标签', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50' },
  user_modify: { label: '用户修改', icon: Shield, color: 'text-stone-500 bg-stone-50' },
  user_delete: { label: '用户删除', icon: XCircle, color: 'text-rose-500 bg-rose-50' },
  privacy_change: { label: '隐私变更', icon: ShieldAlert, color: 'text-amber-500 bg-amber-50' },
};

const PRIVACY_STATS_CONFIG = [
  { level: 'public' as const, label: '公开', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { level: 'private' as const, label: '私密', icon: ShieldAlert, color: 'text-amber-500', bg: 'bg-amber-50' },
  { level: 'secret' as const, label: '机密', icon: ShieldOff, color: 'text-rose-500', bg: 'bg-rose-50' },
];

export default function PrivacySettings() {
  const cards = useKnowledgeStore((s) => s.cards);
  const auditLogs = useKnowledgeStore((s) => s.auditLogs);
  const clearAuditLogs = useKnowledgeStore((s) => s.clearAuditLogs);
  const updateCard = useKnowledgeStore((s) => s.updateCard);
  const addAuditLog = useKnowledgeStore((s) => s.addAuditLog);
  const importData = useKnowledgeStore((s) => s.importData);
  const privacyPreferences = useKnowledgeStore((s) => s.privacyPreferences);
  const setPrivacyPreference = useKnowledgeStore((s) => s.setPrivacyPreference);

  const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'logs' | 'preferences'>('overview');
  const [importResult, setImportResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = {
    public: cards.filter((c) => c.privacyLevel === 'public').length,
    private: cards.filter((c) => c.privacyLevel === 'private').length,
    secret: cards.filter((c) => c.privacyLevel === 'secret').length,
  };

  const handleBatchPrivacy = (level: 'public' | 'private' | 'secret', targetLevel: 'public' | 'private' | 'secret') => {
    cards
      .filter((c) => c.privacyLevel === level)
      .forEach((c) => {
        updateCard(c.id, { privacyLevel: targetLevel });
        addAuditLog({
          action: 'privacy_change',
          cardId: c.id,
          cardTitle: c.title,
          detail: `批量隐私变更：${level} -> ${targetLevel}`,
        });
      });
  };

  const handleExportData = () => {
    const data = {
      cards: cards.map(({ content, ...rest }) => ({
        ...rest,
        content: rest.privacyLevel === 'secret' ? '[已加密]' : content,
      })),
      exportedAt: new Date().toISOString(),
      totalCards: cards.length,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `知识库导出_${new Date().toLocaleDateString('zh-CN')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        const result = importData({ cards: json.cards, collections: json.collections });
        setImportResult(`导入成功：新增 ${result.cardsAdded} 条知识、${result.collectionsAdded} 个知识集`);
        setTimeout(() => setImportResult(null), 5000);
      } catch {
        setImportResult('导入失败：文件格式不正确');
        setTimeout(() => setImportResult(null), 5000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const TABS = [
    { key: 'overview' as const, label: '总览' },
    { key: 'cards' as const, label: '卡片权限' },
    { key: 'logs' as const, label: '审计日志' },
    { key: 'preferences' as const, label: '自动化偏好' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">隐私管理</h1>
          <p className="text-[15px] text-stone-500 mt-1.5 font-bold">掌控你的数据安全</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="file" ref={fileInputRef} accept=".json" className="hidden" onChange={handleImportData} />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-theme-border text-[14px] text-stone-700 rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-all font-bold shadow-sm hover:-translate-y-0.5"
          >
            <Upload size={18} /> 导入数据
          </button>
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-theme-border text-[14px] text-stone-700 rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-all font-bold shadow-sm hover:-translate-y-0.5"
          >
            <Download size={18} /> 导出数据
          </button>
        </div>
      </div>

      {importResult && (
        <div className={`px-5 py-3 rounded-xl text-[14px] font-bold animate-fadeIn ${importResult.includes('成功') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {importResult}
        </div>
      )}

      <div className="flex gap-3 border-b-2 border-theme-border pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-[15px] font-bold border-b-4 transition-colors ${
              activeTab === tab.key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50/50 rounded-t-xl'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRIVACY_STATS_CONFIG.map((cfg) => (
              <div key={cfg.level} className="bg-white rounded-3xl border border-theme-border p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${cfg.bg}`}>
                    <cfg.icon size={22} className={cfg.color} />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-stone-900 tracking-tight">{stats[cfg.level]}</p>
                    <p className="text-[14px] text-stone-500 font-bold mt-1">{cfg.label}内容</p>
                  </div>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${cards.length ? (stats[cfg.level] / cards.length) * 100 : 0}%`,
                      backgroundColor: cfg.level === 'public' ? '#10B981' : cfg.level === 'private' ? '#F59E0B' : '#EF4444',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-theme-border p-8 space-y-6 shadow-sm">
            <h3 className="text-lg font-black text-stone-800 flex items-center gap-2.5">
              <ShieldCheck size={22} className="text-primary-500" /> AI 访问策略
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl gap-4 hover:bg-emerald-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Eye size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-stone-800">公开内容 AI 全权限</p>
                    <p className="text-[14px] text-stone-500 mt-1 font-bold">AI可读取、摘要、关联、推荐</p>
                  </div>
                </div>
                <span className="text-[13px] bg-emerald-100 text-emerald-700 px-3.5 py-1.5 rounded-xl font-bold flex-shrink-0 w-fit border border-emerald-200">已启用</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-amber-50/50 border-2 border-amber-100 rounded-2xl gap-4 hover:bg-amber-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <EyeOff size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-stone-800">私密内容 AI 有限权限</p>
                    <p className="text-[14px] text-stone-500 mt-1 font-bold">AI仅读取标题和标签，不访问正文</p>
                  </div>
                </div>
                <span className="text-[13px] bg-amber-100 text-amber-700 px-3.5 py-1.5 rounded-xl font-bold flex-shrink-0 w-fit border border-amber-200">已启用</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-rose-50/50 border-2 border-rose-100 rounded-2xl gap-4 hover:bg-rose-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <ShieldOff size={20} className="text-rose-600" />
                  </div>
                  <div>
                    <p className="text-[16px] font-bold text-stone-800">机密内容 AI 零权限</p>
                    <p className="text-[14px] text-stone-500 mt-1 font-bold">AI完全不可访问，端到端加密存储</p>
                  </div>
                </div>
                <span className="text-[13px] bg-rose-100 text-rose-700 px-3.5 py-1.5 rounded-xl font-bold flex-shrink-0 w-fit border border-rose-200">已启用</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cards' && (
        <div className="bg-white rounded-3xl border border-theme-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-stone-100 bg-stone-50/80">
                  <th className="px-8 py-5 font-black text-stone-500 text-[13px] uppercase tracking-widest">知识标题</th>
                  <th className="px-8 py-5 font-black text-stone-500 text-[13px] uppercase tracking-widest w-40">当前级别</th>
                  <th className="px-8 py-5 font-black text-stone-500 text-[13px] uppercase tracking-widest w-48">AI 权限</th>
                  <th className="px-8 py-5 font-black text-stone-500 text-[13px] uppercase tracking-widest w-48">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {cards.map((card) => {
                  const cfg = PRIVACY_STATS_CONFIG.find((c) => c.level === card.privacyLevel)!;
                  return (
                    <tr key={card.id} className="hover:bg-stone-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <p className="font-bold text-stone-800 text-[15px] truncate max-w-[400px] group-hover:text-primary-700 transition-colors">{card.title}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-2 text-[13px] px-3.5 py-1.5 rounded-xl font-bold ${cfg.bg} ${cfg.color} border border-current/10`}>
                          <cfg.icon size={16} /> {cfg.label}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-[13px] text-stone-500 font-bold">
                        {card.privacyLevel === 'public' ? '完全访问' : card.privacyLevel === 'private' ? '仅标题' : '禁止访问'}
                      </td>
                      <td className="px-8 py-5">
                        <select
                          value={card.privacyLevel}
                          onChange={(e) => {
                            const newLevel = e.target.value as 'public' | 'private' | 'secret';
                            updateCard(card.id, { privacyLevel: newLevel });
                            addAuditLog({ action: 'privacy_change', cardId: card.id, cardTitle: card.title, detail: `隐私级别更改为「${newLevel}」` });
                          }}
                          className="text-[13px] px-4 py-2 border-2 border-stone-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 bg-white font-bold text-stone-700 hover:border-stone-300 transition-colors cursor-pointer w-full"
                        >
                          <option value="public">公开</option>
                          <option value="private">私密</option>
                          <option value="secret">机密</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white px-8 py-5 rounded-3xl border border-theme-border shadow-sm">
            <p className="text-[15px] font-black text-stone-700">共 {auditLogs.length} 条审计记录</p>
            {auditLogs.length > 0 && (
              <button onClick={clearAuditLogs} className="flex items-center gap-2.5 px-5 py-2.5 text-[13px] text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors font-bold border border-rose-100">
                <Trash2 size={16} /> 清除所有日志
              </button>
            )}
          </div>
          {auditLogs.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-theme-border shadow-sm">
              <div className="w-20 h-20 mx-auto mb-6 bg-stone-50 rounded-full flex items-center justify-center">
                <Clock size={36} className="text-stone-300" />
              </div>
              <p className="text-base text-stone-500 font-bold">暂无审计日志</p>
            </div>
          ) : (
            <div className="space-y-4">
              {auditLogs.map((log) => {
                const actionCfg = ACTION_LABELS[log.action] || { label: log.action, icon: AlertTriangle, color: 'text-stone-500 bg-stone-50' };
                const ActionIcon = actionCfg.icon;
                return (
                  <div key={log.id} className="flex items-start gap-5 bg-white rounded-3xl border border-theme-border p-6 hover:shadow-md transition-shadow group">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${actionCfg.color} shadow-inner group-hover:scale-110 transition-transform`}>
                      <ActionIcon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] font-black text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200/50">{actionCfg.label}</span>
                        <span className="text-[15px] font-bold text-stone-800 truncate">{log.cardTitle}</span>
                      </div>
                      <p className="text-[14px] text-stone-500 mt-2.5 font-medium leading-relaxed">{log.detail}</p>
                    </div>
                    <span className="text-[13px] text-stone-400 font-bold flex-shrink-0 bg-stone-50 px-4 py-2 rounded-xl border border-stone-100">
                      {new Date(log.timestamp).toLocaleString('zh-CN')}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-theme-border p-8 shadow-sm">
            <h3 className="text-lg font-black text-stone-800 mb-6">已保存的自动化偏好</h3>
            {privacyPreferences.filter((p) => p.remembered).length === 0 ? (
              <p className="text-[15px] text-stone-500 bg-stone-50 p-6 rounded-2xl border border-stone-100 font-medium leading-relaxed">暂无已保存的偏好。当你在添加知识时遇到敏感信息检测弹窗并勾选"记住选择"后，偏好将保存在这里。</p>
            ) : (
              <div className="space-y-4">
                {privacyPreferences
                  .filter((p) => p.remembered)
                  .map((pref) => (
                    <div key={pref.type} className="flex items-center justify-between p-5 bg-stone-50/80 border border-stone-100 rounded-2xl hover:bg-stone-50 transition-colors">
                      <div>
                        <p className="text-[16px] font-black text-stone-800">{pref.type}</p>
                        <p className="text-[14px] text-stone-500 mt-1.5 font-medium">
                          自动处理方式：<span className="text-primary-600 font-black">{pref.action === 'encrypt' ? '完整记录并加密' : pref.action === 'mask' ? '脱敏后记录' : pref.action === 'skip' ? '跳过敏感部分' : '取消录入'}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => setPrivacyPreference({ ...pref, remembered: false })}
                        className="px-4 py-2 text-[13px] text-rose-600 bg-white border border-rose-100 hover:bg-rose-50 rounded-xl font-bold transition-colors shadow-sm"
                      >
                        移除偏好
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0 shadow-inner">
                <AlertTriangle size={22} className="text-amber-600" />
              </div>
              <div>
                <h4 className="text-[16px] font-black text-amber-900">本地隐私提示</h4>
                <p className="text-[14px] text-amber-800 mt-1.5 leading-relaxed font-medium">
                  所有数据均存储在你的本地浏览器中，不会上传到任何服务器。AI分析功能在本产品中以模拟方式运行，不会将你的内容发送到外部API。
                  你可以随时通过"导出数据"功能备份，或清除浏览器数据来完全删除所有知识。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
