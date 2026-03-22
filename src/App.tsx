import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useUIStore } from './store/uiStore';

import V1Layout from './components/layout/Layout';
import V1Dashboard from './pages/Dashboard';
import V1AllKnowledge from './pages/AllKnowledge';
import V1KnowledgeSpace from './pages/KnowledgeSpace';
import V1SmartSearch from './pages/SmartSearch';
import V1ReviewCenter from './pages/ReviewCenter';
import V1GraphView from './pages/GraphView';
import V1PrivacySettings from './pages/PrivacySettings';

const V2Layout = lazy(() => import('./themes/v2/components/layout/Layout'));
const V2Dashboard = lazy(() => import('./themes/v2/pages/Dashboard'));
const V2AllKnowledge = lazy(() => import('./themes/v2/pages/AllKnowledge'));
const V2KnowledgeSpace = lazy(() => import('./themes/v2/pages/KnowledgeSpace'));
const V2SmartSearch = lazy(() => import('./themes/v2/pages/SmartSearch'));
const V2ReviewCenter = lazy(() => import('./themes/v2/pages/ReviewCenter'));
const V2GraphView = lazy(() => import('./themes/v2/pages/GraphView'));
const V2PrivacySettings = lazy(() => import('./themes/v2/pages/PrivacySettings'));

function V1Routes() {
  return (
    <Routes>
      <Route element={<V1Layout />}>
        <Route path="/" element={<V1Dashboard />} />
        <Route path="/knowledge" element={<V1AllKnowledge />} />
        <Route path="/space" element={<V1KnowledgeSpace />} />
        <Route path="/search" element={<V1SmartSearch />} />
        <Route path="/review" element={<V1ReviewCenter />} />
        <Route path="/graph" element={<V1GraphView />} />
        <Route path="/privacy" element={<V1PrivacySettings />} />
      </Route>
    </Routes>
  );
}

function V2Routes() {
  return (
    <Routes>
      <Route element={<V2Layout />}>
        <Route path="/" element={<V2Dashboard />} />
        <Route path="/knowledge" element={<V2AllKnowledge />} />
        <Route path="/space" element={<V2KnowledgeSpace />} />
        <Route path="/search" element={<V2SmartSearch />} />
        <Route path="/review" element={<V2ReviewCenter />} />
        <Route path="/graph" element={<V2GraphView />} />
        <Route path="/privacy" element={<V2PrivacySettings />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter basename="/zhizhi-kb">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-theme-bg">
            <div className="text-center space-y-4">
              <div className="w-10 h-10 border-3 border-primary-300 border-t-primary-600 rounded-full animate-spin mx-auto" />
              <p className="text-sm text-stone-500">加载主题中…</p>
            </div>
          </div>
        }
      >
        {theme === 'v2' ? <V2Routes /> : <V1Routes />}
      </Suspense>
    </BrowserRouter>
  );
}
