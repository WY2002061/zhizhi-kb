import { useState, useMemo } from 'react';
import { Search, Sparkles, Clock, Tag, Filter } from 'lucide-react';
import { useKnowledgeStore } from '../../../store/knowledgeStore';
import KnowledgeCardComponent from '../components/cards/KnowledgeCard';

const EXAMPLE_QUERIES = [
  '之前看过的关于推荐系统的文章',
  'React性能优化相关知识',
  '产品设计方法论',
  '分布式系统面试题',
  '大模型提示词技巧',
];

export default function SmartSearch() {
  const searchCards = useKnowledgeStore((s) => s.searchCards);
  const getAllTags = useKnowledgeStore((s) => s.getAllTags);
  const collections = useKnowledgeStore((s) => s.collections);

  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const tags = getAllTags();

  const results = useMemo(() => {
    if (!query.trim() && selectedTags.length === 0 && !selectedCol) return [];
    let found = query.trim() ? searchCards(query) : useKnowledgeStore.getState().cards.filter((c) => c.privacyLevel !== 'secret');

    if (selectedTags.length > 0) {
      found = found.filter((c) => selectedTags.some((t) => c.tags.includes(t)));
    }
    if (selectedCol) {
      found = found.filter((c) => c.collectionId === selectedCol);
    }
    return found;
  }, [query, searchCards, selectedTags, selectedCol]);

  const handleSearch = (q: string) => {
    setQuery(q);
    setSearched(true);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setSearched(true);
  };

  return (
    <div className="space-y-7 animate-fadeIn pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">智能搜索</h1>
        <p className="text-base text-stone-500 mt-1.5 font-medium">用自然语言搜索你的知识库</p>
      </div>

      <div className="relative max-w-4xl">
        <div className="flex items-center gap-3 bg-white rounded-lg border border-stone-200 focus-within:border-primary-400 focus-within:shadow-sm transition-all px-5 py-3.5">
          <Sparkles size={20} className="text-stone-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearched(true); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="输入你想找的知识，例如：之前看过的推荐系统相关文章..."
            className="flex-1 text-base text-stone-700 placeholder:text-stone-400 focus:outline-none bg-transparent font-medium"
          />
          <button
            onClick={() => handleSearch(query)}
            className="px-5 py-2.5 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <Search size={15} /> 搜索
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-all w-fit ${
            showFilters ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Filter size={15} /> 高级筛选
        </button>
        {selectedTags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                onClick={() => toggleTag(tag)}
                className="text-xs px-3 py-1.5 bg-primary-50 text-primary-700 font-medium rounded-lg cursor-pointer hover:bg-primary-100 transition-colors flex items-center gap-1.5"
              >
                {tag} <span className="text-primary-400 hover:text-primary-600 text-sm leading-none">×</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg border border-stone-200 p-6 space-y-5 animate-fadeIn max-w-4xl">
          <div>
            <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Tag size={14} /> 标签筛选
            </h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => toggleTag(tag.name)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                    selectedTags.includes(tag.name) ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-300' : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">知识集</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCol(null)}
                className={`px-4 py-2 text-xs rounded-lg font-medium transition-all ${
                  !selectedCol ? 'bg-primary-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                全部
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCol(col.id === selectedCol ? null : col.id)}
                  className={`px-4 py-2 text-xs rounded-lg font-medium transition-all ${
                    selectedCol === col.id ? 'bg-primary-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {col.icon} {col.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {!searched ? (
        <div className="text-center py-20 bg-white rounded-lg border border-stone-200">
          <div className="w-16 h-16 mx-auto mb-5 bg-primary-50 rounded-lg flex items-center justify-center">
            <Search size={30} className="text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-stone-700 mb-2">试试语义搜索</h3>
          <p className="text-base text-stone-500 mb-8 font-medium">不需要记住精确关键词，用自然语言描述你想找的内容</p>
          <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
            {EXAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => handleSearch(q)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-stone-50 border border-stone-200 rounded-lg text-stone-600 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-all"
              >
                <Clock size={14} className="text-stone-400" /> {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="pt-2">
          <p className="text-sm text-stone-500 font-medium mb-5 bg-stone-50 px-4 py-2 rounded-lg w-fit">找到 {results.length} 条相关知识</p>
          {results.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-stone-200">
              <p className="text-base text-stone-500 font-medium">没有找到匹配的知识</p>
              <p className="text-sm text-stone-400 mt-2">试试换个关键词？</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {results.map((card, i) => (
                <div key={card.id} className="animate-fadeIn h-full" style={{ animationDelay: `${i * 50}ms` }}>
                  <KnowledgeCardComponent card={card} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
