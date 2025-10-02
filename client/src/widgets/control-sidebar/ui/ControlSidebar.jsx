import { useMutation } from "@tanstack/react-query";
import { Activity, AlertTriangle, Compass, Import, Logs, Settings } from "lucide-react";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { axiosInstance } from "../../../entities/axios/instance";

const navigationItems = [
  { icon: Activity, label: "Обзор", description: "Сводка событий", to: "/dashboard" },
  { icon: Logs, label: "Все логи", description: "Plan/apply сеансы", to: "/logs" },
  { icon: Compass, label: "Исследователь", description: "Гант / Логи", to: "/explorer" },
  { icon: AlertTriangle, label: "Инциденты", description: "Ошибки и алерты", to: "/incidents" },
  { icon: Settings, label: "Настройки", description: "Сведения", to: "/settings" }
];

export const ControlSidebar = () => {
  const handleUploadLogs = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (!file.type.includes("json")) {
      toast.error("Please select a correct logs file");
      return;
    }

    mutate(file);
  }

  const { mutate } = useMutation({
    mutationKey: ["upload"],
    mutationFn: file => axiosInstance.post(`/logs/upload`, file),
    onSuccess: () => {
      toast.success("Logs has been uploaded successfully")
    }
  });

  return (
    <aside className="hidden sticky top-0 h-screen w-[320px] flex-col justify-between bg-base-100 px-6 py-8 shadow-inset backdrop-blur lg:flex">
      <div className="space-y-10">
        <img src="/logo.svg" alt="logo" />

        <nav className="space-y-3">
          {navigationItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `group block rounded-[20px] p-2 transition-all duration-200 ${
                  isActive
                    ? "bg-secondary shadow-glow"
                    : "bg-primary hover:bg-secondary/50"
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex items-center gap-4">
                  <span
                    className={`flex size-10 items-center justify-center rounded-xl ${
                      isActive ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    <Icon
                      className="size-5 text-base-content"
                    />
                  </span>
                  <span className="space-y-1">
                    <span className="flex items-center font-size-[15px] gap-2 text-lg font-semibold">
                      {label}
                    </span>
                  </span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <footer>
        <label htmlFor="upload-logs">
          <div 
            className="cursor-pointer bg-primary hover:bg-secondary/50 rounded-[20px] p-2 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <span
                className="flex size-10 items-center justify-center rounded-xl bg-secondary"
              >
                <Import
                  className="size-5 text-base-content"
                />
              </span>
              <span className="space-y-1">
                <span className="flex items-center font-size-[15px] gap-2 text-lg font-semibold">
                  Upload logs
                </span>
              </span>
            </div>
          </div>
          
          <input
              type="file"
              id="upload-logs"
              accept="application/json"
              className="hidden"
              onChange={handleUploadLogs}
            />
        </label>
      </footer>
    </aside>
  );
};
