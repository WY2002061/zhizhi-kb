import { useState } from 'react';
import { Plus, Edit3, Trash2, Check, BookOpen } from 'lucide-react';
import { useKnowledgeStore } from '../../../store/knowledgeStore';
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
    <div className="bg-white rounded-lg border border-primary-300 p-5 space-y-4 animate-scaleIn">
      <input
        type="text"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        placeholder="知识集名称"
        className="w-full px-3.5 py-2.5 text-base border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-400 bg-white transition-all font-medium text-stone-800"
        autoFocus
      />
      <input
        type="text"
        value={formDesc}
        onChange={(e) => setFormDesc(e.target.value)}
        placeholder="描述（可选）"
        className="w-full px-3.5 py-2.5 text-base border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/15 focus:border-primary-400 bg-white transition-all font-medium text-stone-800"
      />
      <div>
        <p className="text-sm font-medium text-stone-500 mb-2">选择图标</p>
        <div className="flex gap-1.5 flex-wrap">
          {COLLECTION_ICONS.map((icon) => (
            <button
              key={icon}
              onClick={() => setFormIcon(icon)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-base transition-all ${
                formIcon === icon ? 'bg-primary-50 ring-1 ring-primary-400 scale-105' : 'bg-stone-50 hover:bg-stone-100'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-stone-500 mb-2">选择颜色</p>
        <div className="flex gap-2">
          {COLLECTION_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setFormColor(color)}
              className={`w-7 h-7 rounded-full transition-all ${formColor === color ? 'ring-2 ring-offset-2 ring-primary-200 scale-110' : 'hover:scale-110'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2.5 pt-1">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 rounded-lg font-medium transition-colors">
          取消
        </button>
        <button onClick={onSave} className="px-5 py-2 text-sm border border-primary-400 text-primary-600 rounded-lg hover:bg-primary-50 flex items-center gap-1.5 font-medium transition-colors">
          <Check size={15} /> 保存
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">知识空间</h1>
          <p className="text-sm text-stone-500 mt-1 font-medium">管理你的知识集</p>
        </div>
        {!creating && (
          <button
            onClick={startCreate}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-primary-400 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-50 transition-colors"
          >
            <Plus size={16} /> 新建知识集
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
              className={`bg-white rounded-lg border p-5 cursor-pointer transition-all duration-200 group flex flex-col h-[180px] ${
                selectedCol === col.id ? 'border-primary-400' : 'border-theme-border hover:border-primary-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: col.color + '12' }}
                  >
                    {col.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-stone-800">{col.name}</h3>
                    <p className="text-sm text-stone-500 mt-0.5 font-medium">{colCards.length} 条知识</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); startEdit(col); }}
                    className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteCollection(col.id); if (selectedCol === col.id) setSelectedCol(null); }}
                    className="p-1.5 rounded-lg text-stone-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {col.description && (
                <p className="text-sm text-stone-500 mt-4 leading-relaxed line-clamp-2">{col.description}</p>
              )}
              <div className="flex items-center gap-3 mt-auto pt-4">
                <div className="w-full bg-stone-100 rounded-full h-1 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ backgroundColor: col.color, width: `${Math.min(colCards.length * 12, 100)}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCol && (
        <div className="space-y-6 animate-fadeIn pt-6 border-t border-stone-200">
          <div className="flex items-center gap-3">
            <BookOpen size={20} className="text-primary-500" />
            <h2 className="text-lg font-semibold text-stone-700 flex items-center gap-2">
              {collections.find((c) => c.id === selectedCol)?.icon}{' '}
              {collections.find((c) => c.id === selectedCol)?.name} 的知识
            </h2>
            <span className="text-sm text-stone-500 font-medium bg-stone-100 px-3 py-1 rounded-lg">{selectedCards.length} 条</span>
          </div>
          {selectedCards.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-stone-200">
              <p className="text-base text-stone-400 font-medium">暂无知识，去添加吧</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
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
