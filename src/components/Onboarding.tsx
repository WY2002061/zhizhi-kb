import { BookOpen, Search, RotateCcw, ShieldCheck, Sparkles, ArrowRight, ArrowLeft, X, Palette } from 'lucide-react';
import { useUIStore } from '../store/uiStore';

const STEPS = [
  {
    icon: Sparkles,
    title: '欢迎使用智知',
    desc: '智知是你的 AI 个人知识库。接下来几步，带你快速了解核心功能。',
    color: 'bg-primary-500',
  },
  {
    icon: BookOpen,
    title: '添加 & 管理知识',
    desc: '支持网页链接、文本、笔记等多种方式添加知识。AI 会自动生成摘要和标签，帮你快速归档。',
    color: 'bg-indigo-500',
  },
  {
    icon: Search,
    title: '智能搜索',
    desc: '用自然语言描述你想找的内容，不需要记住精确关键词，语义搜索帮你快速定位。',
    color: 'bg-cyan-500',
  },
  {
    icon: RotateCcw,
    title: '间隔复习',
    desc: '基于遗忘曲线的智能提醒，每日简报、间隔复习、随机漫游三种模式让知识真正内化。',
    color: 'bg-amber-500',
  },
  {
    icon: ShieldCheck,
    title: '隐私保护',
    desc: '三级隐私分级（公开/私密/机密），敏感信息自动检测并弹窗确认，所有数据存储在本地。',
    color: 'bg-rose-500',
  },
  {
    icon: Palette,
    title: '双主题切换',
    desc: '提供米黄色暖色调和莫兰迪极简两套 UI 主题，可在顶部栏或侧栏一键切换。',
    color: 'bg-emerald-500',
  },
];

export default function Onboarding() {
  const done = useUIStore((s) => s.onboardingDone);
  const step = useUIStore((s) => s.onboardingStep);
  const next = useUIStore((s) => s.nextOnboardingStep);
  const prev = useUIStore((s) => s.prevOnboardingStep);
  const finish = useUIStore((s) => s.finishOnboarding);

  if (done) return null;

  const current = STEPS[step];
  if (!current) return null;
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={finish} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scaleIn flex flex-col overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-stone-100 flex-shrink-0">
          <div
            className="h-full bg-primary-500 transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Close button */}
        <button
          onClick={finish}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="px-8 pt-10 pb-6 text-center">
          <div className={`w-16 h-16 mx-auto rounded-2xl ${current.color} flex items-center justify-center mb-6`}>
            <Icon size={30} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-stone-900 mb-3">{current.title}</h2>
          <p className="text-base text-stone-500 leading-relaxed max-w-sm mx-auto">{current.desc}</p>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 pb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-primary-500' : 'w-1.5 bg-stone-200'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-8 pb-8">
          {isFirst ? (
            <button onClick={finish} className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
              跳过引导
            </button>
          ) : (
            <button
              onClick={prev}
              className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors"
            >
              <ArrowLeft size={15} /> 上一步
            </button>
          )}

          <button
            onClick={isLast ? finish : next}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
          >
            {isLast ? '开始使用' : '下一步'} {!isLast && <ArrowRight size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}
