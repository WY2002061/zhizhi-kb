import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useUIStore } from '../../store/uiStore';
import AddKnowledgeModal from '../modals/AddKnowledgeModal';
import CardDetail from '../cards/CardDetail';
import Onboarding from '../Onboarding';

export default function Layout() {
  const addModalOpen = useUIStore((s) => s.addModalOpen);
  const detailCardId = useUIStore((s) => s.detailCardId);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-theme-bg">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          <div className="max-w-[1400px] mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {addModalOpen && <AddKnowledgeModal />}
      {detailCardId && <CardDetail cardId={detailCardId} />}
      <Onboarding />
    </div>
  );
}
