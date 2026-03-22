import { Star, ExternalLink, Clock, Shield, ShieldAlert, ShieldOff, Eye } from 'lucide-react';
import type { KnowledgeCard as CardType } from '../../types';
import { useKnowledgeStore } from '../../store/knowledgeStore';
import { useUIStore } from '../../store/uiStore';

const PRIVACY_CONFIG = {
  public: { icon: Shield, label: '公开', color: 'text-emerald-500' },
  private: { icon: ShieldAlert, label: '私密', color: 'text-amber-500' },
  secret: { icon: ShieldOff, label: '机密', color: 'text-rose-500' },
};

const SOURCE_LABELS: Record<string, string> = {
  url: '网页',
  text: '文本',
  file: '文件',
  note: '笔记',
};

interface Props {
  card: CardType;
  compact?: boolean;
}

export default function KnowledgeCard({ card, compact }: Props) {
  const toggleFavorite = useKnowledgeStore((s) => s.toggleFavorite);
  const openCardDetail = useUIStore((s) => s.openCardDetail);
  const collections = useKnowledgeStore((s) => s.collections);
  const collection = collections.find((c) => c.id === card.collectionId);
  const privacy = PRIVACY_CONFIG[card.privacyLevel];
  const PrivacyIcon = privacy.icon;

  return (
    <div
      className={`group bg-white rounded-2xl border border-theme-border hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer flex flex-col h-full ${
        compact ? 'p-5' : 'p-6'
      }`}
      onClick={() => openCardDetail(card.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {collection && (
            <span
              className="text-[13px] px-3 py-1 rounded-lg font-bold flex-shrink-0"
              style={{ backgroundColor: collection.color + '15', color: collection.color }}
            >
              {collection.icon} {collection.name}
            </span>
          )}
          <span className="text-[13px] text-stone-400 font-medium flex items-center gap-1.5 flex-shrink-0 bg-stone-50 px-2.5 py-1 rounded-lg">
            <PrivacyIcon size={14} className={privacy.color} />
            {privacy.label}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(card.id);
          }}
          className="flex-shrink-0 p-1.5 -m-1.5 rounded-full hover:bg-stone-50 transition-colors"
        >
          <Star
            size={20}
            className={
              card.isFavorite
                ? 'fill-amber-400 text-amber-400'
                : 'text-stone-300 group-hover:text-stone-400'
            }
          />
        </button>
      </div>

      <h3 className="text-lg font-bold text-stone-900 mb-3 line-clamp-2 leading-snug group-hover:text-primary-700 transition-colors">
        {card.title}
      </h3>

      {card.privacyLevel !== 'secret' ? (
        <p className="text-[15px] text-stone-500 mb-5 line-clamp-2 leading-relaxed flex-1">{card.summary}</p>
      ) : (
        <p className="text-[15px] text-stone-400 italic mb-5 flex items-center gap-1.5 flex-1 font-medium">
          <Eye size={16} /> 机密内容已在本地加密隐藏
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {card.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="text-[13px] px-2.5 py-1 bg-stone-100 text-stone-600 font-medium rounded-lg hover:bg-primary-50 hover:text-primary-700 transition-colors"
          >
            {tag}
          </span>
        ))}
        {card.tags.length > 4 && (
          <span className="text-[13px] text-stone-400 font-medium px-2 py-1">+{card.tags.length - 4}</span>
        )}
      </div>

      <div className="flex items-center justify-between text-[13px] text-stone-400 pt-4 border-t border-stone-100 font-medium mt-auto">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {new Date(card.createdAt).toLocaleDateString('zh-CN')}
          </span>
          <span className="bg-stone-100 px-2 py-1 rounded-md text-stone-500">
            {SOURCE_LABELS[card.sourceType]}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>复习 {card.reviewCount} 次</span>
          {card.source && (
            <ExternalLink size={14} className="text-stone-400 hover:text-primary-600 transition-colors" />
          )}
        </div>
      </div>
    </div>
  );
}
