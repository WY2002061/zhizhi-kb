import { useState, useMemo } from 'react';
import { RotateCcw, Shuffle, Calendar, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Clock } from 'lucide-react';
import { useKnowledgeStore } from '../../../store/knowledgeStore';
import { useUIStore } from '../../../store/uiStore';

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
    <div className="space-y-7 animate-fadeIn pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">回顾中心</h1>
        <p className="text-base text-stone-500 mt-1.5 font-medium">温故而知新，让知识真正内化</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => { setMode(m.value); setCurrentIdx(0); }}
            className={`flex items-center gap-4 p-5 rounded-lg border transition-all duration-200 text-left ${
              mode === m.value
                ? 'border-primary-300 bg-primary-50/50 shadow-sm'
                : 'border-stone-200 hover:border-primary-200 bg-white hover:shadow-sm'
            }`}
          >
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center transition-colors ${
              mode === m.value ? 'bg-primary-500 text-white' : 'bg-stone-100 text-stone-400'
            }`}>
              <m.icon size={22} />
            </div>
            <div>
              <p className="text-base font-semibold text-stone-800">{m.label}</p>
              <p className="text-sm text-stone-500 mt-0.5 font-medium">{m.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {mode === 'random' ? (
        <div className="flex flex-col items-center pt-6">
          {!randomCard ? (
            <div className="text-center py-16 bg-white rounded-lg border border-stone-200 w-full max-w-2xl">
              <div className="w-20 h-20 mx-auto mb-5 bg-primary-50 rounded-lg flex items-center justify-center">
                <Shuffle size={36} className="text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-stone-700 mb-2">随机漫游</h3>
              <p className="text-base text-stone-500 mb-8 font-medium">点击下方按钮，随机邂逅一条知识</p>
              <button
                onClick={handleRandom}
                className="px-7 py-3.5 bg-primary-500 text-white text-base font-medium rounded-lg hover:bg-primary-600 transition-colors"
              >
                开始漫游
              </button>
            </div>
          ) : currentCard ? (
            <div className="w-full max-w-2xl animate-scaleIn">
              <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-7 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={16} className="text-primary-500" />
                  <span className="text-sm text-primary-600 font-medium tracking-wide">随机推荐</span>
                </div>
                <h2 className="text-2xl font-semibold text-stone-800 leading-tight">{currentCard.title}</h2>
                <p className="text-base text-stone-600 leading-relaxed bg-stone-50 p-5 rounded-lg">{currentCard.summary}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {currentCard.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1.5 bg-stone-100 text-stone-600 font-medium rounded-lg">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-3 pt-5 border-t border-stone-100 mt-5">
                  <button onClick={handleRandom} className="flex-1 py-3 text-sm border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all font-medium flex items-center justify-center gap-2">
                    <Shuffle size={16} /> 换一条
                  </button>
                  <button onClick={() => openCardDetail(currentCard.id)} className="flex-1 py-3 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center justify-center gap-2">
                    查看详情 <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="pt-2">
          {currentCards.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-stone-200">
              <div className="w-20 h-20 mx-auto mb-5 bg-emerald-50 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-stone-700 mb-2">
                {mode === 'spaced' ? '暂无到期复习' : '暂无推荐'}
              </h3>
              <p className="text-base text-stone-500 font-medium">
                {mode === 'spaced' ? '你的知识都在合理的复习周期内' : '先去添加一些知识吧'}
              </p>
            </div>
          ) : (
            <div className="space-y-5 max-w-3xl mx-auto">
              <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-lg border border-stone-200">
                <p className="text-sm font-medium text-stone-700">
                  {mode === 'daily' ? '今日推荐' : '到期复习'} <span className="text-stone-400 ml-2">共 {currentCards.length} 条</span>
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">{currentIdx + 1} / {currentCards.length}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                      disabled={currentIdx === 0}
                      className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 hover:border-stone-300 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      onClick={() => setCurrentIdx(Math.min(currentCards.length - 1, currentIdx + 1))}
                      disabled={currentIdx >= currentCards.length - 1}
                      className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 hover:border-stone-300 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {currentCard && (
                <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-7 space-y-5 animate-fadeIn" key={currentCard.id}>
                  <h2 className="text-2xl font-semibold text-stone-800 leading-tight">{currentCard.title}</h2>
                  <div className="bg-primary-50/60 rounded-lg p-5 border border-primary-100/50">
                    <h4 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles size={15} /> AI 摘要
                    </h4>
                    <p className="text-base text-stone-700 leading-relaxed font-medium">{currentCard.summary}</p>
                  </div>
                  <div className="text-base text-stone-600 leading-relaxed whitespace-pre-wrap bg-stone-50 rounded-lg p-5 max-h-64 overflow-y-auto border border-stone-100">
                    {currentCard.content}
                  </div>
                  {currentCard.personalNote && (
                    <div className="bg-amber-50 rounded-lg p-5 border border-amber-100/50">
                      <h4 className="text-sm font-semibold text-amber-700 mb-2">我的批注</h4>
                      <p className="text-sm text-amber-900 italic font-medium">{currentCard.personalNote}</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {currentCard.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1.5 bg-stone-100 text-stone-600 font-medium rounded-lg">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-5 border-t border-stone-100">
                    {reviewedIds.has(currentCard.id) ? (
                      <div className="flex-1 py-3 text-sm text-center text-emerald-700 bg-emerald-50 rounded-lg font-medium flex items-center justify-center gap-2 border border-emerald-200/50">
                        <CheckCircle2 size={16} /> 已完成复习
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMarkReviewed(currentCard.id)}
                        className="flex-1 py-3 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={16} /> 标记已复习
                      </button>
                    )}
                    <button
                      onClick={() => openCardDetail(currentCard.id)}
                      className="flex-1 py-3 text-sm border border-stone-200 rounded-lg text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-all font-medium flex items-center justify-center gap-2"
                    >
                      查看详情 <ArrowRight size={16} />
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
