import { useState } from 'react';
import { Plus, Edit3, Trash2, Check, BookOpen } from 'lucide-react';
import { useKnowledgeStore } from '../store/knowledgeStore';
import KnowledgeCardComponent from '../components/cards/KnowledgeCard';

const COLLECTION_COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#84CC16'];
const COLLECTION_ICONS = ['📚', '🎨', '⚙️', '🌱', '📖', '🧠', '💡', '🎯', '🔬', '🌍'];

export default function KnowledgeSpace() {
  const collections = useKnowledgeStore((s) => s.collections);
  const cards = useKnowledgeStore((s) => s.cards);
  const addCollection = useKnowledgeStore((s) => s.addCollection);
  const updateCollection = useKnowledgeStore((s) => s.updateCollection);
  const deleteCollection = useKnowledgeStore((s) => s.deleteCollection);

  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formIcon, setFormIcon] = useState('📚');
  const [formColor, setFormColor] = useState('#6366F1');

  const selectedCards = selectedCol ? cards.filter((c) => c.collectionId === selectedCol) : [];

  const startCreate = () => {
    setCreating(true);
    setFormName('');
    setFormDesc('');
    setFormIcon('📚');
    setFormColor('#6366F1');
  };

  const startEdit = (col: typeof collections[0]) => {
    setEditingId(col.id);
    setFormName(col.name);
    setFormDesc(col.description);
    setFormIcon(col.icon);
    setFormColor(col.color);
  };

  const handleCreate = () => {
    if (!formName.trim()) return;
    addCollection({ name: formName, description: formDesc, icon: formIcon, color: formColor });
    setCreating(false);
  };

  const handleUpdate = () => {
    if (!editingId || !formName.trim()) return;
    updateCollection(editingId, { name: formName, description: formDesc, icon: formIcon, color: formColor });
    setEditingId(null);
  };

  const CollectionForm = ({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => (
    <div className="bg-white rounded-2xl border-2 border-primary-300 p-6 space-y-4 animate-scaleIn shadow-lg ring-4 ring-primary-50">
      <input
        type="text"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        placeholder="知识集名称"
        className="w-full px-4 py-3 text-[15px] border-2 border-stone-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 bg-stone-50/50 focus:bg-white transition-all font-bold text-stone-800"
        autoFocus
      />
      <input
        type="text"
        value={formDesc}
        onChange={(e) => setFormDesc(e.target.value)}
        placeholder="描述（可选）"
        className="w-full px-4 py-3 text-[15px] border-2 border-stone-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 bg-stone-50/50 focus:bg-white transition-all font-medium text-stone-800"
      />
      <div>
        <p className="text-sm font-bold text-stone-500 mb-2">选择图标</p>
        <div className="flex gap-2 flex-wrap">
          {COLLECTION_ICONS.map((icon) => (
            <button
              key={icon}
              onClick={() => setFormIcon(icon)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                formIcon === icon ? 'bg-primary-100 ring-2 ring-primary-400 scale-110 shadow-sm' : 'bg-stone-50 hover:bg-stone-100'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-stone-500 mb-2">选择颜色</p>
        <div className="flex gap-2.5">
          {COLLECTION_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setFormColor(color)}
              className={`w-8 h-8 rounded-full transition-all ${formColor === color ? 'ring-4 ring-offset-2 ring-primary-200 scale-110' : 'hover:scale-110'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-5 py-2.5 text-[14px] text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl font-bold transition-colors shadow-sm">
          取消
        </button>
        <button onClick={onSave} className="px-6 py-2.5 text-[14px] bg-primary-600 text-white rounded-xl hover:bg-primary-700 flex items-center gap-2 font-bold shadow-md shadow-primary-600/20 transition-all hover:-translate-y-0.5">
          <Check size={16} /> 保存
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">知识空间</h1>
          <p className="text-[15px] text-stone-500 mt-1.5 font-bold">管理你的知识集</p>
        </div>
        {!creating && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-5 py-3 bg-primary-600 text-white text-[14px] font-bold rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-600/20 hover:-translate-y-0.5"
          >
            <Plus size={18} /> 新建知识集
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creating && <CollectionForm onSave={handleCreate} onCancel={() => setCreating(false)} />}

        {collections.map((col) => {
          const colCards = cards.filter((c) => c.collectionId === col.id);

          if (editingId === col.id) {
            return <CollectionForm key={col.id} onSave={handleUpdate} onCancel={() => setEditingId(null)} />;
          }

          return (
            <div
              key={col.id}
              onClick={() => setSelectedCol(selectedCol === col.id ? null : col.id)}
              className={`bg-white rounded-3xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl group flex flex-col h-[200px] ${
                selectedCol === col.id ? 'border-primary-400 shadow-md ring-4 ring-primary-50' : 'border-theme-border hover:border-primary-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: col.color + '15' }}
                  >
                    {col.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">{col.name}</h3>
                    <p className="text-[14px] text-stone-500 mt-1 font-bold">{colCards.length} 条知识</p>
                  </div>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); startEdit(col); }}
                    className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteCollection(col.id); if (selectedCol === col.id) setSelectedCol(null); }}
                    className="p-2 rounded-xl text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {col.description && (
                <p className="text-[14px] text-stone-500 mt-5 leading-relaxed line-clamp-2 font-medium">{col.description}</p>
              )}
              <div className="flex items-center gap-3 mt-auto pt-5">
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ backgroundColor: col.color, width: `${Math.min(colCards.length * 12, 100)}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCol && (
        <div className="space-y-8 animate-fadeIn pt-8 border-t-2 border-theme-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center">
              <BookOpen size={24} className="text-primary-600" />
            </div>
            <h2 className="text-2xl font-black text-stone-800 flex items-center gap-3">
              {collections.find((c) => c.id === selectedCol)?.icon}{' '}
              {collections.find((c) => c.id === selectedCol)?.name} 的知识
            </h2>
            <span className="text-[15px] text-stone-500 font-bold bg-stone-100 px-4 py-1.5 rounded-xl">{selectedCards.length} 条</span>
          </div>
          {selectedCards.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-theme-border">
              <p className="text-[16px] text-stone-400 font-bold">暂无知识，去添加吧</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {selectedCards.map((card) => (
                <KnowledgeCardComponent key={card.id} card={card} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
