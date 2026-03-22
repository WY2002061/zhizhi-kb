import { BookOpen, FolderOpen, Star, RotateCcw, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useKnowledgeStore } from '../store/knowledgeStore';
import { useUIStore } from '../store/uiStore';
import { generateHeatmapData } from '../data/sampleData';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

function StatCard({ icon: Icon, label, value, change, color }: { icon: typeof BookOpen; label: string; value: number; change: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-theme-border p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-300 flex flex-col justify-between h-[160px] group shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <span className="text-[13px] text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">{change}</span>
      </div>
      <div className="mt-auto">
        <p className="text-3xl font-black text-stone-900 tracking-tight leading-none mb-1.5">{value}</p>
        <p className="text-[14px] text-stone-500 font-bold">{label}</p>
      </div>
    </div>
  );
}

function Heatmap() {
  const data = useMemo(() => generateHeatmapData(), []);
  const today = new Date();
  const weeks: string[][] = [];

  for (let w = 25; w >= 0; w--) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (w * 7 + (6 - d)));
      week.push(date.toISOString().slice(0, 10));
    }
    weeks.push(week);
  }

  const getColor = (count: number | undefined) => {
    if (!count) return 'bg-stone-100';
    if (count <= 1) return 'bg-primary-200';
    if (count <= 3) return 'bg-primary-300';
    if (count <= 5) return 'bg-primary-400';
    return 'bg-primary-500';
  };

  return (
    <div className="bg-white rounded-2xl border border-theme-border p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2.5">
        <TrendingUp size={20} className="text-primary-500" />
        学习热力图
      </h3>
      <div className="flex-1 flex items-center justify-center w-full overflow-x-auto pb-4">
        <div className="flex gap-1.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1.5">
              {week.map((day) => (
                <div
                  key={day}
                  className={`w-4 h-4 rounded-[3px] ${getColor(data[day])} transition-colors hover:ring-2 ring-primary-300 ring-offset-1 cursor-pointer`}
                  title={`${day}: ${data[day] || 0} 条`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 mt-6 text-[14px] text-stone-500 font-bold">
        <span>少</span>
        <div className="w-4 h-4 rounded-[3px] bg-stone-100" />
        <div className="w-4 h-4 rounded-[3px] bg-primary-200" />
        <div className="w-4 h-4 rounded-[3px] bg-primary-300" />
        <div className="w-4 h-4 rounded-[3px] bg-primary-400" />
        <div className="w-4 h-4 rounded-[3px] bg-primary-500" />
        <span>多</span>
      </div>
    </div>
  );
}

function TagCloud() {
  const getAllTags = useKnowledgeStore((s) => s.getAllTags);
  const tags = getAllTags();

  const maxCount = Math.max(...tags.map((t) => t.count), 1);
  const colors = ['text-primary-600', 'text-emerald-600', 'text-rose-600', 'text-amber-600', 'text-violet-600', 'text-cyan-600', 'text-pink-600'];

  return (
    <div className="bg-white rounded-2xl border border-theme-border p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2.5">
        <BookOpen size={20} className="text-primary-500" />
        标签词云
      </h3>
      <div className="flex-1 flex flex-wrap content-start gap-3 overflow-y-auto pr-2">
        {tags.map((tag, i) => {
          const sizeClass = tag.count / maxCount > 0.7 ? 'text-2xl font-black' : tag.count / maxCount > 0.4 ? 'text-lg font-bold' : 'text-[15px] font-bold';
          return (
            <span
              key={tag.name}
              className={`${colors[i % colors.length]} ${sizeClass} hover:scale-110 cursor-pointer transition-transform origin-left inline-block`}
            >
              {tag.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const cards = useKnowledgeStore((s) => s.cards);
  const collections = useKnowledgeStore((s) => s.collections);
  const openAddModal = useUIStore((s) => s.openAddModal);
  const openCardDetail = useUIStore((s) => s.openCardDetail);
  const navigate = useNavigate();

  const now = Date.now();
  const weekAgo = now - 7 * 86400000;
  const weekCards = cards.filter((c) => c.createdAt > weekAgo);
  const favoriteCount = cards.filter((c) => c.isFavorite).length;
  const dueReview = cards.filter((c) => c.nextReviewAt <= now);

  const dailyDigest = useMemo(() => {
    const shuffled = [...cards].filter((c) => c.privacyLevel !== 'secret').sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [cards]);

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">欢迎回来 👋</h1>
          <p className="text-base text-stone-500 mt-2 font-medium">你的知识库今日概览</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-primary-600 text-white text-[15px] font-bold rounded-xl hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md shadow-primary-600/20 flex-shrink-0"
        >
          <Sparkles size={18} /> 快速添加知识
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={BookOpen} label="知识总量" value={cards.length} change={`+${weekCards.length} 本周`} color="bg-primary-500" />
        <StatCard icon={FolderOpen} label="知识集" value={collections.length} change="分类清晰" color="bg-emerald-500" />
        <StatCard icon={Star} label="收藏" value={favoriteCount} change="精华内容" color="bg-amber-500" />
        <StatCard icon={RotateCcw} label="待回顾" value={dueReview.length} change="需要复习" color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-theme-border p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow min-h-[360px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <Sparkles size={20} className="text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-stone-800 tracking-tight">每日知识简报</h3>
            </div>
            <button
              onClick={() => navigate('/review')}
              className="text-[14px] text-primary-600 hover:text-primary-700 flex items-center gap-1.5 font-bold bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-lg transition-colors"
            >
              去回顾中心 <ArrowRight size={16} />
            </button>
          </div>
          <div className="flex-1 space-y-4">
            {dailyDigest.map((card, i) => (
              <div
                key={card.id}
                className="flex gap-4 p-5 rounded-2xl border border-stone-100 hover:border-primary-200 hover:bg-primary-50/30 cursor-pointer transition-all duration-300 group shadow-sm hover:shadow-md"
                onClick={() => openCardDetail(card.id)}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center text-lg font-black flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-[16px] font-bold text-stone-900 truncate group-hover:text-primary-700 transition-colors leading-tight mb-1.5">{card.title}</h4>
                  <p className="text-[14px] text-stone-500 line-clamp-1 leading-relaxed font-medium">{card.summary}</p>
                </div>
                <div className="hidden sm:flex gap-2 flex-shrink-0 items-center">
                  {card.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[13px] px-3 py-1 bg-stone-100 text-stone-600 rounded-lg font-bold group-hover:bg-white transition-colors border border-transparent group-hover:border-stone-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white shadow-lg flex-1 flex flex-col justify-center relative overflow-hidden group min-h-[200px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-bold tracking-tight">知识增长</h3>
              </div>
              <p className="text-5xl font-black tracking-tighter mb-3">{cards.length}</p>
              <p className="text-[14px] text-white/90 font-bold flex items-center gap-2 mb-5">
                <span className="bg-white/20 px-2.5 py-1 rounded-md">本周新增 {weekCards.length} 条</span>
              </p>
              <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
                <div className="bg-white rounded-full h-full transition-all duration-1000 relative" style={{ width: `${Math.min(weekCards.length * 15, 100)}%` }}>
                  <div className="absolute inset-0 bg-white/50 animate-pulse"></div>
                </div>
              </div>
              <p className="text-[13px] text-white/80 mt-2.5 font-bold">周目标进度</p>
            </div>
          </div>

          {dueReview.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden min-h-[140px] flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200/50 rounded-full blur-xl -mr-6 -mt-6"></div>
              <div className="relative z-10">
                <h4 className="text-lg font-bold text-amber-900 mb-2 flex items-center gap-2.5">
                  <RotateCcw size={20} className="text-amber-600" />
                  复习提醒
                </h4>
                <p className="text-[15px] text-amber-800 font-bold mb-4">
                  你有 <b className="text-2xl font-black text-amber-600 mx-1">{dueReview.length}</b> 条知识到了复习时间
                </p>
                <button
                  onClick={() => navigate('/review')}
                  className="px-5 py-2.5 bg-amber-500 text-white text-[15px] font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2 w-full justify-center shadow-md shadow-amber-500/20 hover:-translate-y-0.5"
                >
                  立即去复习 <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Heatmap />
        <TagCloud />
      </div>
    </div>
  );
}
