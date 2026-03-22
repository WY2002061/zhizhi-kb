import { Plus, Bell, User, Palette } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useKnowledgeStore } from '../../store/knowledgeStore';

export default function TopBar() {
  const openAddModal = useUIStore((s) => s.openAddModal);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const theme = useUIStore((s) => s.theme);
  const cardCount = useKnowledgeStore((s) => s.cards.length);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-theme-border flex items-center justify-between px-8 flex-shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4 min-w-0">
        <div className="truncate">
          <h2 className="text-lg font-bold text-stone-800 truncate tracking-tight">我的知识库</h2>
          <p className="text-sm text-stone-500 truncate mt-0.5">{cardCount} 条知识 · 本地安全存储</p>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-theme-border text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-primary-700 transition-all"
          title="切换 UI 主题"
        >
          <Palette size={16} />
          <span className="hidden sm:inline">{theme === 'v1' ? '切换莫兰迪' : '切换米黄色'}</span>
        </button>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2.5 px-5 py-2.5 bg-primary-600 text-white text-[15px] font-medium rounded-xl hover:bg-primary-700 active:scale-[0.98] transition-all shadow-sm shadow-primary-600/20"
        >
          <Plus size={18} />
          添加知识
        </button>

        <button className="relative w-11 h-11 rounded-xl flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white cursor-pointer hover:shadow-md transition-shadow shadow-sm ring-2 ring-white ml-1">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}
