import { MainLayout } from "~app/layouts/MainLayout";
import { QueryProvider, ThemeProvider } from "~app/providers";
import { DashboardPage } from "~pages/dashboard";
import { LaunchesPage } from "~pages/launches";
import { ExplorerPage } from "~pages/explorer";
import { IncidentsPage } from "~pages/incidents";
import { SettingsPage } from "~pages/settings";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export const App = () => {
  return (
    <ThemeProvider>
      <QueryProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/launches" element={<LaunchesPage />} />
              <Route path="/explorer" element={<ExplorerPage />} />
              <Route path="/explorer/:runId" element={<ExplorerPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  );
};
