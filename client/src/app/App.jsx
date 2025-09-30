import { MainLayout } from "~app/layouts/MainLayout";
import { AppProviders } from "~app/providers";
import { DashboardPage } from "~pages/dashboard";

export const App = () => {
  return (
    <AppProviders>
      <MainLayout>
        <DashboardPage />
      </MainLayout>
    </AppProviders>
  );
};
