import { ShieldAlert, AlertTriangle, Lock, EyeOff, X, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import type { SensitiveMatch } from '../../../../types';

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
    activeClasses: 'border-indigo-200 bg-indigo-50/60',
  },
  {
    value: 'mask' as const,
    icon: EyeOff,
    label: '脱敏后记录',
    desc: '敏感字段替换为 ****，AI可处理其余内容',
    activeClasses: 'border-amber-200 bg-amber-50/60',
  },
  {
    value: 'skip' as const,
    icon: CheckCircle2,
    label: '仅记录非敏感部分',
    desc: '自动剔除敏感段落，只保留安全内容',
    activeClasses: 'border-emerald-200 bg-emerald-50/60',
  },
  {
    value: 'cancel' as const,
    icon: X,
    label: '取消录入',
    desc: '整条内容不保存',
    activeClasses: 'border-stone-200 bg-stone-50',
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
      <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity" />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl animate-scaleIn flex flex-col max-h-[90vh]">
        <div className="flex items-center gap-3.5 p-5 border-b border-stone-100 flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <ShieldAlert size={22} className="text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-stone-800">检测到敏感信息</h3>
            <p className="text-base text-stone-400 mt-0.5">为保护你的隐私，我需要确认如何处理</p>
          </div>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {matches.map((m) => (
                <span
                  key={m.type}
                  className="flex items-center gap-1.5 text-sm px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg font-medium border border-amber-100"
                >
                  <AlertTriangle size={14} />
                  {m.label} ({m.matches.length}处)
                </span>
              ))}
            </div>

            <div className="bg-stone-50 border border-stone-100 rounded-lg p-4 text-base text-stone-600 leading-relaxed max-h-40 overflow-y-auto">
              {typeof parts === 'string'
                ? parts
                : parts.map((part, i) =>
                    part.sensitive ? (
                      <mark key={i} className="bg-amber-100 text-amber-800 px-0.5 py-0.5 rounded font-medium">
                        {part.text}
                      </mark>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
            </div>
          </div>

          <div className="space-y-2.5">
            <p className="text-sm font-medium text-stone-400 tracking-wide mb-1">请选择处理方式</p>
            {ACTION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelected(opt.value)}
                className={`w-full flex items-center gap-3.5 p-3.5 rounded-lg border transition-all duration-150 text-left ${
                  selected === opt.value
                    ? opt.activeClasses + ' shadow-sm'
                    : 'border-stone-100 hover:border-stone-200 bg-white hover:bg-stone-50/50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    selected === opt.value ? 'bg-white/70' : 'bg-stone-50'
                  }`}
                >
                  <opt.icon size={18} className={selected === opt.value ? 'text-stone-700' : 'text-stone-400'} />
                </div>
                <div>
                  <p className="text-base font-medium text-stone-700">{opt.label}</p>
                  <p className="text-sm text-stone-400 mt-0.5">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none bg-stone-50/70 p-3.5 rounded-lg border border-stone-100 hover:bg-stone-50 transition-colors mt-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-primary-600 focus:ring-primary-200 transition-all"
            />
            <span className="text-base text-stone-500">
              以后遇到 <b className="text-stone-700 font-medium">同类敏感信息</b> 时，自动按此方式处理
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-stone-100 flex-shrink-0">
          <button
            onClick={() => onConfirm('cancel', false)}
            className="px-5 py-2.5 text-base text-stone-500 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors font-medium"
          >
            取消录入
          </button>
          <button
            onClick={() => onConfirm(selected, remember)}
            className="px-6 py-2.5 text-base bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            确认处理
          </button>
        </div>
      </div>
    </div>
  );
}
