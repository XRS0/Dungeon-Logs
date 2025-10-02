import { MainLayout } from "~app/layouts/MainLayout";
import { DashboardPage } from "~pages/dashboard";
import { ExplorerPage } from "~pages/explorer";
import { IncidentsPage } from "~pages/incidents";
import { SettingsPage } from "~pages/settings";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LogsPage } from "../pages/logs/ui/LogsPage";

export const App = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/explorer" element={<ExplorerPage />} />
          <Route path="/explorer/:runId" element={<ExplorerPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </MainLayout>

      <Toaster />
    </BrowserRouter>
  );
};
