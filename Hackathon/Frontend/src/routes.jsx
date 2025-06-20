import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import OKRSubmit from './pages/OKRSubmit';
import OKRDashboard from './pages/OKRDashboard';
import NotFound from './pages/NotFound';
import ReportPage from './pages/ReportPage';
import ReportListPage from './pages/ReportListPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<OKRDashboard />} />
        <Route path='/submit-okr' element={<OKRSubmit />} />
        <Route path='/view-report' element={<ReportListPage />} />
        <Route path='/view-report/:okrId' element={<ReportPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
} 