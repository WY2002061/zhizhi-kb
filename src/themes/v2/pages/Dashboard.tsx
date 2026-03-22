import { BookOpen, FolderOpen, Star, RotateCcw, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useKnowledgeStore } from '../../../store/knowledgeStore';
import { useUIStore } from '../../../store/uiStore';
import { generateHeatmapData } from '../../../data/sampleData';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

function StatCard({ icon: Icon, label, value, change, color }: { icon: typeof BookOpen; label: string; value: number; change: string; color: string }) {
  return (
    <div className="bg-white rounded-lg border border-theme-border p-5 hover:border-primary-200 transition-all duration-200 flex flex-col justify-between h-[140px] group">
      <div className="flex items-center justify-between mb-2">
        <Icon size={22} className={color} />
        <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-md">{change}</span>
      </div>
      <div className="mt-auto">
        <p className="text-2xl font-semibold text-stone-800 tracking-tight leading-none mb-1">{value}</p>
        <p className="text-sm text-stone-500 font-medium">{label}</p>
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
    <div className="bg-white rounded-lg border border-theme-border p-5 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-stone-700 mb-5 flex items-center gap-2">
        <TrendingUp size={18} className="text-primary-500" />
        学习热力图
      </h3>
      <div className="flex-1 flex items-center justify-center w-full overflow-x-auto pb-3">
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day}
                  className={`w-3 h-3 rounded-sm ${getColor(data[day])} transition-colors hover:ring-1 ring-primary-300 ring-offset-1 cursor-pointer`}
                  title={`${day}: ${data[day] || 0} 条`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1.5 mt-4 text-xs text-stone-400 font-medium">
        <span>少</span>
        <div className="w-3 h-3 rounded-sm bg-stone-100" />
        <div className="w-3 h-3 rounded-sm bg-primary-200" />
        <div className="w-3 h-3 rounded-sm bg-primary-300" />
        <div className="w-3 h-3 rounded-sm bg-primary-400" />
        <div className="w-3 h-3 rounded-sm bg-primary-500" />
        <span>多</span>
      </div>
    </div>
  );
}

function TagCloud() {
  const getAllTags = useKnowledgeStore((s) => s.getAllTags);
  const tags = getAllTags();

  const maxCount = Math.max(...tags.map((t) => t.count), 1);
  const colors = ['text-primary-600', 'text-emerald-600', 'text-rose-500', 'text-amber-600', 'text-violet-500', 'text-cyan-600', 'text-pink-500'];

  return (
    <div className="bg-white rounded-lg border border-theme-border p-5 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-stone-700 mb-5 flex items-center gap-2">
        <BookOpen size={18} className="text-primary-500" />
        标签词云
      </h3>
      <div className="flex-1 flex flex-wrap content-start gap-2.5 overflow-y-auto pr-2">
        {tags.map((tag, i) => {
          const sizeClass = tag.count / maxCount > 0.7 ? 'text-xl font-semibold' : tag.count / maxCount > 0.4 ? 'text-base font-medium' : 'text-sm font-medium';
          return (
            <span
              key={tag.name}
              className={`${colors[i % colors.length]} ${sizeClass} hover:scale-105 cursor-pointer transition-transform origin-left inline-block`}
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
    <div className="space-y-7 animate-fadeIn pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">欢迎回来</h1>
          <p className="text-base text-stone-500 mt-1.5 font-medium">你的知识库今日概览</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 border border-primary-400 text-primary-600 text-base font-medium rounded-lg hover:bg-primary-50 transition-colors flex-shrink-0"
        >
          <Sparkles size={17} /> 快速添加知识
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={BookOpen} label="知识总量" value={cards.length} change={`+${weekCards.length} 本周`} color="text-primary-500" />
        <StatCard icon={FolderOpen} label="知识集" value={collections.length} change="分类清晰" color="text-emerald-500" />
        <StatCard icon={Star} label="收藏" value={favoriteCount} change="精华内容" color="text-amber-500" />
        <StatCard icon={RotateCcw} label="待回顾" value={dueReview.length} change="需要复习" color="text-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-lg border border-theme-border p-5 flex flex-col min-h-[340px]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <Sparkles size={18} className="text-primary-500" />
              <h3 className="text-lg font-semibold text-stone-700">每日知识简报</h3>
            </div>
            <button
              onClick={() => navigate('/review')}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              去回顾中心 <ArrowRight size={15} />
            </button>
          </div>
          <div className="flex-1 space-y-3">
            {dailyDigest.map((card, i) => (
              <div
                key={card.id}
                className="flex gap-3.5 p-4 rounded-lg border border-stone-100 hover:border-primary-200 hover:bg-primary-50/20 cursor-pointer transition-all duration-200 group"
                onClick={() => openCardDetail(card.id)}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-base font-medium text-stone-800 truncate group-hover:text-primary-700 transition-colors leading-snug mb-1">{card.title}</h4>
                  <p className="text-sm text-stone-500 line-clamp-1 leading-relaxed">{card.summary}</p>
                </div>
                <div className="hidden sm:flex gap-1.5 flex-shrink-0 items-center">
                  {card.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-stone-50 text-stone-500 rounded font-medium group-hover:bg-white transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5 flex flex-col">
          <div className="bg-primary-500 rounded-lg p-5 text-white flex-1 flex flex-col justify-center min-h-[190px]">
            <div className="flex items-center gap-2.5 mb-5">
              <TrendingUp size={18} className="text-white/80" />
              <h3 className="text-lg font-semibold">知识增长</h3>
            </div>
            <p className="text-4xl font-semibold tracking-tight mb-2">{cards.length}</p>
            <p className="text-sm text-white/80 font-medium flex items-center gap-2 mb-4">
              <span className="bg-white/15 px-2 py-0.5 rounded">本周新增 {weekCards.length} 条</span>
            </p>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div className="bg-white rounded-full h-full transition-all duration-1000" style={{ width: `${Math.min(weekCards.length * 15, 100)}%` }} />
            </div>
            <p className="text-xs text-white/70 mt-2 font-medium">周目标进度</p>
          </div>

          {dueReview.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-5 flex flex-col justify-center min-h-[130px]">
              <h4 className="text-base font-semibold text-amber-800 mb-1.5 flex items-center gap-2">
                <RotateCcw size={17} className="text-amber-500" />
                复习提醒
              </h4>
              <p className="text-sm text-amber-700 font-medium mb-3">
                你有 <span className="text-xl font-semibold text-amber-600 mx-0.5">{dueReview.length}</span> 条知识到了复习时间
              </p>
              <button
                onClick={() => navigate('/review')}
                className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-1.5 w-full justify-center"
              >
                立即去复习 <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Heatmap />
        <TagCloud />
      </div>
    </div>
  );
}
