import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FolderOpen,
  Search,
  RotateCcw,
  Share2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Brain,
  Palette,
} from 'lucide-react';
import { useUIStore } from '../../../../store/uiStore';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: '仪表盘' },
  { to: '/knowledge', icon: BookOpen, label: '全部知识' },
  { to: '/space', icon: FolderOpen, label: '知识空间' },
  { to: '/search', icon: Search, label: '智能搜索' },
  { to: '/review', icon: RotateCcw, label: '回顾中心' },
  { to: '/graph', icon: Share2, label: '知识图谱' },
  { to: '/privacy', icon: ShieldCheck, label: '隐私管理' },
];

export default function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const theme = useUIStore((s) => s.theme);

  return (
    <aside
      className={`flex flex-col h-full bg-sidebar border-r border-theme-border/50 transition-all duration-300 flex-shrink-0 ${
        collapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-theme-border/40 flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
          <Brain size={20} className="text-primary-600" />
        </div>
        {!collapsed && (
          <span className="text-lg font-medium text-stone-700 tracking-wide animate-fadeIn">
            智知
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3 py-3 rounded-lg text-[15px] transition-all duration-200 ${
                isActive
                  ? 'border-l-[3px] border-primary-500 bg-primary-50/60 text-primary-700 font-medium ml-0 pl-2.5'
                  : 'border-l-[3px] border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-100/60 font-normal ml-0 pl-2.5'
              }`
            }
          >
            <item.icon size={19} className="flex-shrink-0" />
            {!collapsed && <span className="animate-fadeIn truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className="px-3 pb-2 flex-shrink-0">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-lg text-stone-400 hover:text-primary-600 hover:bg-primary-50/50 transition-colors"
          title="切换主题"
        >
          <Palette size={17} />
          {!collapsed && (
            <span className="text-sm animate-fadeIn">
              {theme === 'v1' ? '切换莫兰迪' : '切换米黄色'}
            </span>
          )}
        </button>
      </div>

      {/* Collapse toggle */}
      <div className="px-3 pb-4 border-t border-theme-border/30 pt-3 flex-shrink-0">
        <button
          onClick={toggle}
          className="flex items-center justify-center w-full py-2.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100/60 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="ml-2.5 text-[15px] font-normal animate-fadeIn">收起侧栏</span>}
        </button>
      </div>
    </aside>
  );
}
