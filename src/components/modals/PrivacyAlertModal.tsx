import { ShieldAlert, AlertTriangle, Lock, EyeOff, X, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import type { SensitiveMatch } from '../../types';

interface Props {
  matches: SensitiveMatch[];
  originalText: string;
  onConfirm: (action: 'encrypt' | 'mask' | 'skip' | 'cancel', remember: boolean) => void;
}

const ACTION_OPTIONS = [
  {
    value: 'encrypt' as const,
    icon: Lock,
    label: '完整记录并加密',
    desc: '原文加密保存，AI不读取此条正文',
    color: 'border-indigo-300 bg-indigo-50',
  },
  {
    value: 'mask' as const,
    icon: EyeOff,
    label: '脱敏后记录',
    desc: '敏感字段替换为 ****，AI可处理其余内容',
    color: 'border-amber-300 bg-amber-50',
  },
  {
    value: 'skip' as const,
    icon: CheckCircle2,
    label: '仅记录非敏感部分',
    desc: '自动剔除敏感段落，只保留安全内容',
    color: 'border-emerald-300 bg-emerald-50',
  },
  {
    value: 'cancel' as const,
    icon: X,
    label: '取消录入',
    desc: '整条内容不保存',
    color: 'border-stone-300 bg-stone-50',
  },
];

export default function PrivacyAlertModal({ matches, originalText, onConfirm }: Props) {
  const [selected, setSelected] = useState<'encrypt' | 'mask' | 'skip' | 'cancel'>('mask');
  const [remember, setRemember] = useState(false);

  const highlightedText = () => {
    const allIndices = matches.flatMap((m) => m.indices);
    if (allIndices.length === 0) return originalText;

    allIndices.sort((a, b) => a[0] - b[0]);
    const parts: { text: string; sensitive: boolean }[] = [];
    let lastEnd = 0;

    for (const [start, end] of allIndices) {
      if (start > lastEnd) {
        parts.push({ text: originalText.slice(lastEnd, start), sensitive: false });
      }
      parts.push({ text: originalText.slice(start, end), sensitive: true });
      lastEnd = end;
    }
    if (lastEnd < originalText.length) {
      parts.push({ text: originalText.slice(lastEnd), sensitive: false });
    }
    return parts;
  };

  const parts = highlightedText();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-scaleIn flex flex-col max-h-[90vh]">
        <div className="flex items-center gap-4 p-6 border-b border-theme-border flex-shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0 shadow-inner">
            <ShieldAlert size={26} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">检测到敏感信息</h3>
            <p className="text-[15px] text-stone-500 mt-1 font-medium">为保护你的隐私，我需要确认如何处理</p>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {matches.map((m) => (
                <span key={m.type} className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 bg-amber-100/80 text-amber-800 rounded-lg font-bold border border-amber-200/50">
                  <AlertTriangle size={14} />
                  {m.label} ({m.matches.length}处)
                </span>
              ))}
            </div>

            <div className="bg-stone-50 border border-stone-100 rounded-2xl p-5 text-[15px] text-stone-700 leading-relaxed max-h-40 overflow-y-auto font-medium shadow-inner">
              {typeof parts === 'string'
                ? parts
                : parts.map((part, i) =>
                    part.sensitive ? (
                      <mark key={i} className="bg-amber-200 text-amber-900 px-1 py-0.5 rounded-md font-bold shadow-sm">
                        {part.text}
                      </mark>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-1">请选择处理方式</p>
            {ACTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelected(opt.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selected === opt.value ? opt.color + ' border-2 shadow-md scale-[1.01]' : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${selected === opt.value ? 'bg-white/50 shadow-sm' : 'bg-stone-100'}`}>
                  <opt.icon size={20} className={selected === opt.value ? 'text-stone-800' : 'text-stone-500'} />
                </div>
                <div>
                  <p className="text-[16px] font-bold text-stone-800">{opt.label}</p>
                  <p className="text-[14px] text-stone-500 mt-0.5 font-medium">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none bg-stone-50 p-4 rounded-xl border border-stone-100 hover:bg-stone-100 transition-colors mt-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-5 h-5 rounded-md border-stone-300 text-primary-600 focus:ring-primary-500/20 transition-all"
            />
            <span className="text-[15px] text-stone-600 font-medium">
              以后遇到 <b className="text-stone-800">同类敏感信息</b> 时，自动按此方式处理
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-theme-border bg-stone-50/50 rounded-b-3xl flex-shrink-0">
          <button
            onClick={() => onConfirm('cancel', false)}
            className="px-6 py-3 text-[15px] text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl transition-colors font-bold shadow-sm"
          >
            取消录入
          </button>
          <button
            onClick={() => onConfirm(selected, remember)}
            className="px-8 py-3 text-[15px] bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-bold shadow-md shadow-primary-600/20 hover:-translate-y-0.5"
          >
            确认处理
          </button>
        </div>
      </div>
    </div>
  );
}
