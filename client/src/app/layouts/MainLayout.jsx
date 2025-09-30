import { ControlSidebar } from "~widgets/control-sidebar";

export const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-canvas text-white">
      <ControlSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  );
};
