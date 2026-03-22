import { useState, useMemo } from 'react';
import { Grid3X3, List, SlidersHorizontal, Search, CheckSquare, Square, Trash2, FolderInput, ShieldAlert, X } from 'lucide-react';
import { useKnowledgeStore } from '../store/knowledgeStore';
import { useUIStore } from '../store/uiStore';
import KnowledgeCardComponent from '../components/cards/KnowledgeCard';
import type { PrivacyLevel } from '../types';

type SortKey = 'newest' | 'oldest' | 'mostReviewed' | 'leastReviewed' | 'favorites';

export default function AllKnowledge() {
  const cards = useKnowledgeStore((s) => s.cards);
  const collections = useKnowledgeStore((s) => s.collections);
  const getAllTags = useKnowledgeStore((s) => s.getAllTags);
  const batchDeleteCards = useKnowledgeStore((s) => s.batchDeleteCards);
  const batchUpdatePrivacy = useKnowledgeStore((s) => s.batchUpdatePrivacy);
  const batchMoveCollection = useKnowledgeStore((s) => s.batchMoveCollection);

  const viewMode = useUIStore((s) => s.viewMode);
  const setViewMode = useUIStore((s) => s.setViewMode);
  const batchMode = useUIStore((s) => s.batchMode);
  const selectedCardIds = useUIStore((s) => s.selectedCardIds);
  const enterBatchMode = useUIStore((s) => s.enterBatchMode);
  const exitBatchMode = useUIStore((s) => s.exitBatchMode);
  const toggleCardSelection = useUIStore((s) => s.toggleCardSelection);
  const selectAllCards = useUIStore((s) => s.selectAllCards);
  const clearSelection = useUIStore((s) => s.clearSelection);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showBatchMove, setShowBatchMove] = useState(false);
  const [showBatchPrivacy, setShowBatchPrivacy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const tags = getAllTags();
  const selectedCount = selectedCardIds.size;

  const filtered = useMemo(() => {
    let result = [...cards];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedTag) result = result.filter((c) => c.tags.includes(selectedTag));
    if (selectedCollection) result = result.filter((c) => c.collectionId === selectedCollection);
    switch (sortKey) {
      case 'newest': result.sort((a, b) => b.createdAt - a.createdAt); break;
      case 'oldest': result.sort((a, b) => a.createdAt - b.createdAt); break;
      case 'mostReviewed': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case 'leastReviewed': result.sort((a, b) => a.reviewCount - b.reviewCount); break;
      case 'favorites': result = result.filter((c) => c.isFavorite); break;
    }
    return result;
  }, [cards, searchQuery, selectedTag, selectedCollection, sortKey]);

  const handleSelectAll = () => {
    if (selectedCount === filtered.length) clearSelection();
    else selectAllCards(filtered.map((c) => c.id));
  };

  const handleBatchDelete = () => {
    batchDeleteCards(Array.from(selectedCardIds));
    exitBatchMode();
    setConfirmDelete(false);
  };

  const handleBatchMove = (colId: string | null) => {
    batchMoveCollection(Array.from(selectedCardIds), colId);
    setShowBatchMove(false);
  };

  const handleBatchPrivacy = (level: PrivacyLevel) => {
    batchUpdatePrivacy(Array.from(selectedCardIds), level);
    setShowBatchPrivacy(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">全部知识</h1>
          <p className="text-[15px] text-stone-500 mt-1.5 font-bold">共 {cards.length} 条知识</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={batchMode ? exitBatchMode : enterBatchMode}
            className={`flex items-center gap-2 px-4 py-2 text-[14px] font-bold rounded-xl border-2 transition-all ${
              batchMode ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-theme-border text-stone-600 hover:bg-stone-50'
            }`}
          >
            <CheckSquare size={16} /> {batchMode ? '退出批量' : '批量操作'}
          </button>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-theme-border shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-stone-400 hover:bg-stone-50'}`}
            >
              <Grid3X3 size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-stone-400 hover:bg-stone-50'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Batch toolbar */}
      {batchMode && (
        <div className="flex items-center gap-4 bg-primary-50 border-2 border-primary-200 rounded-2xl px-6 py-4 animate-fadeIn">
          <button onClick={handleSelectAll} className="flex items-center gap-2 text-[14px] font-bold text-primary-700 hover:text-primary-800 transition-colors">
            {selectedCount === filtered.length && filtered.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
            {selectedCount === filtered.length && filtered.length > 0 ? '取消全选' : '全选'}
          </button>
          <span className="text-[14px] font-bold text-primary-600 bg-white px-3 py-1 rounded-lg border border-primary-200">
            已选 {selectedCount} 项
          </span>
          <div className="flex-1" />
          {selectedCount > 0 && (
            <>
              <div className="relative">
                <button onClick={() => { setShowBatchMove(!showBatchMove); setShowBatchPrivacy(false); }} className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
                  <FolderInput size={15} /> 移动到
                </button>
                {showBatchMove && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-xl border border-stone-200 shadow-xl p-2 min-w-[180px] z-20 animate-fadeIn">
                    <button onClick={() => handleBatchMove(null)} className="w-full text-left px-4 py-2.5 text-[13px] font-bold rounded-lg hover:bg-stone-50 text-stone-700">无分类</button>
                    {collections.map((col) => (
                      <button key={col.id} onClick={() => handleBatchMove(col.id)} className="w-full text-left px-4 py-2.5 text-[13px] font-bold rounded-lg hover:bg-stone-50 text-stone-700">
                        {col.icon} {col.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button onClick={() => { setShowBatchPrivacy(!showBatchPrivacy); setShowBatchMove(false); }} className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
                  <ShieldAlert size={15} /> 隐私级别
                </button>
                {showBatchPrivacy && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-xl border border-stone-200 shadow-xl p-2 min-w-[140px] z-20 animate-fadeIn">
                    {(['public', 'private', 'secret'] as PrivacyLevel[]).map((lv) => (
                      <button key={lv} onClick={() => handleBatchPrivacy(lv)} className="w-full text-left px-4 py-2.5 text-[13px] font-bold rounded-lg hover:bg-stone-50 text-stone-700">
                        {lv === 'public' ? '公开' : lv === 'private' ? '私密' : '机密'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {confirmDelete ? (
                <div className="flex items-center gap-2 animate-fadeIn">
                  <span className="text-[13px] text-rose-600 font-bold">确认删除 {selectedCount} 项？</span>
                  <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 text-[13px] font-bold text-stone-600 bg-white border border-stone-200 rounded-lg">取消</button>
                  <button onClick={handleBatchDelete} className="px-3 py-1.5 text-[13px] font-bold text-white bg-rose-500 rounded-lg hover:bg-rose-600">确认</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors">
                  <Trash2 size={15} /> 删除
                </button>
              )}
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索知识标题、摘要、标签..."
            className="w-full pl-12 pr-5 py-3 text-[15px] font-medium border-2 border-theme-border rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 bg-white shadow-sm transition-all placeholder:text-stone-400"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-3 text-[15px] font-bold rounded-xl border-2 transition-all shadow-sm flex-shrink-0 ${
            showFilters ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-theme-border text-stone-600 hover:bg-stone-50'
          }`}
        >
          <SlidersHorizontal size={18} /> 高级筛选
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-3xl border-2 border-theme-border p-8 space-y-8 animate-fadeIn shadow-sm mx-2">
          <div>
            <h4 className="text-[15px] font-black text-stone-400 uppercase tracking-widest mb-4">排序方式</h4>
            <div className="flex flex-wrap gap-3">
              {([
                { key: 'newest' as SortKey, label: '最新添加' },
                { key: 'oldest' as SortKey, label: '最早添加' },
                { key: 'mostReviewed' as SortKey, label: '复习最多' },
                { key: 'leastReviewed' as SortKey, label: '复习最少' },
                { key: 'favorites' as SortKey, label: '仅看收藏' },
              ]).map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSortKey(s.key)}
                  className={`px-5 py-2.5 text-[14px] rounded-xl font-bold transition-all border-2 ${
                    sortKey === s.key ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20' : 'bg-stone-50 text-stone-600 border-transparent hover:bg-stone-100 hover:border-stone-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[15px] font-black text-stone-400 uppercase tracking-widest mb-4">知识集</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCollection(null)}
                className={`px-5 py-2.5 text-[14px] rounded-xl font-bold transition-all border-2 ${
                  !selectedCollection ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20' : 'bg-stone-50 text-stone-600 border-transparent hover:bg-stone-100 hover:border-stone-200'
                }`}
              >
                全部知识
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollection(col.id === selectedCollection ? null : col.id)}
                  className={`px-5 py-2.5 text-[14px] rounded-xl font-bold transition-all border-2 flex items-center gap-2 ${
                    selectedCollection === col.id ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-600/20' : 'bg-stone-50 text-stone-600 border-transparent hover:bg-stone-100 hover:border-stone-200'
                  }`}
                >
                  <span className="text-lg leading-none">{col.icon}</span> {col.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[15px] font-black text-stone-400 uppercase tracking-widest mb-4">标签</h4>
            <div className="flex flex-wrap gap-2.5">
              {tags.slice(0, 15).map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => setSelectedTag(tag.name === selectedTag ? null : tag.name)}
                  className={`px-4 py-2 text-[14px] rounded-xl font-bold transition-all border-2 ${
                    selectedTag === tag.name ? 'bg-primary-50 text-primary-700 border-primary-300 shadow-sm' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  {tag.name} <span className="text-stone-400 ml-1.5 font-medium">({tag.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-theme-border">
          <p className="text-stone-400 text-base font-medium">没有找到匹配的知识卡片</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {filtered.map((card, i) => (
            <div key={card.id} className="animate-fadeIn h-full relative" style={{ animationDelay: `${i * 50}ms` }}>
              {batchMode && (
                <button
                  onClick={(e) => { e.stopPropagation(); toggleCardSelection(card.id); }}
                  className="absolute top-3 left-3 z-10 w-7 h-7 rounded-lg bg-white border-2 border-stone-200 flex items-center justify-center hover:border-primary-400 transition-colors shadow-sm"
                >
                  {selectedCardIds.has(card.id) ? (
                    <CheckSquare size={16} className="text-primary-600" />
                  ) : (
                    <Square size={16} className="text-stone-300" />
                  )}
                </button>
              )}
              <div className={batchMode && selectedCardIds.has(card.id) ? 'ring-2 ring-primary-400 rounded-2xl' : ''}>
                <KnowledgeCardComponent card={card} compact={viewMode === 'list'} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
