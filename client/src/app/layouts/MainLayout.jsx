import { ControlSidebar } from "~widgets/control-sidebar";

export const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-canvas text-white">
      <ControlSidebar />
       <main className="flex-1 overflow-hidden">
         <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
