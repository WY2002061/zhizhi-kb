import { useState, useMemo } from 'react';
import { RotateCcw, Shuffle, Calendar, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Clock } from 'lucide-react';
import { useKnowledgeStore } from '../store/knowledgeStore';
import { useUIStore } from '../store/uiStore';

type ReviewMode = 'daily' | 'spaced' | 'random';

export default function ReviewCenter() {
  const cards = useKnowledgeStore((s) => s.cards);
  const markReviewed = useKnowledgeStore((s) => s.markReviewed);
  const openCardDetail = useUIStore((s) => s.openCardDetail);
  const [mode, setMode] = useState<ReviewMode>('daily');
  const [randomCard, setRandomCard] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  const publicCards = useMemo(() => cards.filter((c) => c.privacyLevel !== 'secret'), [cards]);
  const now = Date.now();

  const dailyCards = useMemo(() => {
    const shuffled = [...publicCards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [publicCards]);

  const spacedCards = useMemo(() => {
    return publicCards
      .filter((c) => c.nextReviewAt <= now)
      .sort((a, b) => a.nextReviewAt - b.nextReviewAt);
  }, [publicCards, now]);

  const handleRandom = () => {
    const idx = Math.floor(Math.random() * publicCards.length);
    setRandomCard(publicCards[idx]?.id || null);
  };

  const handleMarkReviewed = (id: string) => {
    markReviewed(id);
    setReviewedIds((prev) => new Set(prev).add(id));
  };

  const currentCards = mode === 'daily' ? dailyCards : mode === 'spaced' ? spacedCards : [];
  const currentCard = mode === 'random'
    ? publicCards.find((c) => c.id === randomCard)
    : currentCards[currentIdx];

  const MODES: { value: ReviewMode; icon: typeof Calendar; label: string; desc: string }[] = [
    { value: 'daily', icon: Calendar, label: '每日简报', desc: 'AI推荐5条知识回顾' },
    { value: 'spaced', icon: Clock, label: '间隔复习', desc: '基于遗忘曲线推荐' },
    { value: 'random', icon: Shuffle, label: '随机漫游', desc: '随机邂逅一条知识' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">回顾中心</h1>
        <p className="text-[15px] text-stone-500 mt-1.5 font-bold">温故而知新，让知识真正内化</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => { setMode(m.value); setCurrentIdx(0); }}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
              mode === m.value
                ? 'border-primary-400 bg-primary-50 shadow-md ring-4 ring-primary-50/50'
                : 'border-theme-border hover:border-primary-200 bg-white hover:shadow-md'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              mode === m.value ? 'bg-primary-500 text-white shadow-inner' : 'bg-stone-100 text-stone-400'
            }`}>
              <m.icon size={24} />
            </div>
            <div>
              <p className="text-base font-bold text-stone-800">{m.label}</p>
              <p className="text-[14px] text-stone-500 mt-0.5 font-bold">{m.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {mode === 'random' ? (
        <div className="flex flex-col items-center pt-8">
          {!randomCard ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-theme-border shadow-sm w-full max-w-2xl">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center shadow-inner">
                <Shuffle size={40} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">随机漫游</h3>
              <p className="text-base text-stone-500 mb-8 font-medium">点击下方按钮，随机邂逅一条知识</p>
              <button
                onClick={handleRandom}
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-base font-bold rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-1"
              >
                开始漫游
              </button>
            </div>
          ) : currentCard ? (
            <div className="w-full max-w-2xl animate-scaleIn">
              <div className="bg-white rounded-3xl border border-theme-border shadow-xl p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={18} className="text-primary-500" />
                    <span className="text-sm text-primary-600 font-bold tracking-wide">随机推荐</span>
                  </div>
                  <h2 className="text-2xl font-black text-stone-900 leading-tight">{currentCard.title}</h2>
                  <p className="text-base text-stone-600 leading-relaxed bg-stone-50 p-5 rounded-2xl">{currentCard.summary}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {currentCard.tags.map((tag) => (
                      <span key={tag} className="text-[13px] px-3 py-1.5 bg-stone-100 text-stone-600 font-medium rounded-lg">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-4 pt-6 border-t border-stone-100 mt-6">
                    <button onClick={handleRandom} className="flex-1 py-3.5 text-[15px] border-2 border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all font-bold flex items-center justify-center gap-2">
                      <Shuffle size={18} /> 换一条
                    </button>
                    <button onClick={() => openCardDetail(currentCard.id)} className="flex-1 py-3.5 text-[15px] bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-600/20 font-bold flex items-center justify-center gap-2">
                      查看详情 <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="pt-4">
          {currentCards.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-theme-border shadow-sm">
              <div className="w-24 h-24 mx-auto mb-6 bg-emerald-50 rounded-full flex items-center justify-center">
                <CheckCircle2 size={48} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">
                {mode === 'spaced' ? '暂无到期复习' : '暂无推荐'}
              </h3>
              <p className="text-base text-stone-500 font-medium">
                {mode === 'spaced' ? '你的知识都在合理的复习周期内' : '先去添加一些知识吧'}
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-theme-border shadow-sm">
                <p className="text-[15px] font-bold text-stone-700">
                  {mode === 'daily' ? '今日推荐' : '到期复习'} <span className="text-stone-400 font-medium ml-2">共 {currentCards.length} 条</span>
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-[15px] font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">{currentIdx + 1} / {currentCards.length}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                      disabled={currentIdx === 0}
                      className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button
                      onClick={() => setCurrentIdx(Math.min(currentCards.length - 1, currentIdx + 1))}
                      disabled={currentIdx >= currentCards.length - 1}
                      className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-stone-300 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {currentCard && (
                <div className="bg-white rounded-3xl border border-theme-border shadow-lg p-8 space-y-6 animate-fadeIn relative overflow-hidden" key={currentCard.id}>
                  <h2 className="text-2xl font-black text-stone-900 leading-tight">{currentCard.title}</h2>
                  <div className="bg-primary-50/70 rounded-2xl p-5 border border-primary-100/50">
                    <h4 className="text-sm font-bold text-primary-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles size={16} /> AI 摘要
                    </h4>
                    <p className="text-base text-stone-700 leading-relaxed font-medium">{currentCard.summary}</p>
                  </div>
                  <div className="text-[15px] text-stone-600 leading-relaxed whitespace-pre-wrap bg-stone-50 rounded-2xl p-6 max-h-64 overflow-y-auto border border-stone-100">
                    {currentCard.content}
                  </div>
                  {currentCard.personalNote && (
                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100/50">
                      <h4 className="text-sm font-bold text-amber-700 mb-2">我的批注</h4>
                      <p className="text-[15px] text-amber-900 italic font-medium">{currentCard.personalNote}</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {currentCard.tags.map((tag) => (
                      <span key={tag} className="text-[13px] px-3 py-1.5 bg-stone-100 text-stone-600 font-medium rounded-lg">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-4 pt-6 border-t border-stone-100">
                    {reviewedIds.has(currentCard.id) ? (
                      <div className="flex-1 py-3.5 text-[15px] text-center text-emerald-700 bg-emerald-50 rounded-xl font-bold flex items-center justify-center gap-2 border border-emerald-200/50">
                        <CheckCircle2 size={18} /> 已完成复习
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMarkReviewed(currentCard.id)}
                        className="flex-1 py-3.5 text-[15px] bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5"
                      >
                        <RotateCcw size={18} /> 标记已复习
                      </button>
                    )}
                    <button
                      onClick={() => openCardDetail(currentCard.id)}
                      className="flex-1 py-3.5 text-[15px] border-2 border-stone-200 rounded-xl text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all font-bold flex items-center justify-center gap-2"
                    >
                      查看详情 <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
