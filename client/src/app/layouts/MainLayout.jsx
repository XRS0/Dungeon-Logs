import { ControlSidebar } from "~widgets/control-sidebar";

export const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-base-200">
      <ControlSidebar />
       <main className="flex-1 overflow-hidden">
         <div className="flex w-full flex-col gap-8 px-8 h-full">
          {children}
        </div>
      </main>
    </div>
  );
};