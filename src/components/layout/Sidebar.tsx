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
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

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

  return (
    <aside
      className={`flex flex-col h-full bg-sidebar border-r border-theme-border transition-all duration-300 flex-shrink-0 shadow-sm ${
        collapsed ? 'w-[80px]' : 'w-[260px]'
      }`}
    >
      <div className="flex items-center gap-4 px-6 h-20 border-b border-theme-border flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Brain size={22} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-xl font-bold text-sidebar-text tracking-wide animate-fadeIn">智知</span>
        )}
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                  : 'text-sidebar-text hover:bg-sidebar-hover'
              }`
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!collapsed && <span className="animate-fadeIn truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-theme-border flex-shrink-0">
        <button
          onClick={toggle}
          className="flex items-center justify-center w-full py-3.5 rounded-xl text-sidebar-text hover:bg-sidebar-hover transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="ml-3 text-[15px] font-medium">收起侧栏</span>}
        </button>
      </div>
    </aside>
  );
}
