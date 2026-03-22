import { Plus, Bell, User, Palette } from 'lucide-react';
import { useUIStore } from '../../../../store/uiStore';
import { useKnowledgeStore } from '../../../../store/knowledgeStore';

export default function TopBar() {
  const openAddModal = useUIStore((s) => s.openAddModal);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const theme = useUIStore((s) => s.theme);
  const cardCount = useKnowledgeStore((s) => s.cards.length);

  return (
    <header className="h-16 bg-white border-b border-theme-border/60 flex items-center justify-between px-6 md:px-8 flex-shrink-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <div className="truncate">
          <h2 className="text-base font-medium text-stone-700 truncate">我的知识库</h2>
          <p className="text-sm text-stone-400 truncate">{cardCount} 条知识</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-stone-400 hover:text-primary-600 hover:bg-primary-50/50 transition-colors"
          title="切换 UI 主题"
        >
          <Palette size={15} />
          <span className="hidden sm:inline">
            {theme === 'v1' ? '切换莫兰迪' : '切换米黄色'}
          </span>
        </button>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 border border-primary-500 text-primary-600 bg-transparent text-[15px] font-medium rounded-lg hover:bg-primary-50 active:scale-[0.98] transition-all"
        >
          <Plus size={17} />
          <span className="hidden sm:inline">添加知识</span>
        </button>

        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100/60 transition-colors">
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
        </button>

        <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 cursor-pointer hover:bg-stone-300 transition-colors ml-0.5">
          <User size={17} />
        </div>
      </div>
    </header>
  );
}
