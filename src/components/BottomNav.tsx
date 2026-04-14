import Icon from "@/components/ui/icon";
import type { Tab } from "@/pages/Index";

interface Props {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: "home", icon: "Home", label: "Главная" },
  { id: "vpn", icon: "Shield", label: "VPN" },
  { id: "settings", icon: "Settings", label: "Настройки" },
];

const BottomNav = ({ activeTab, onChange }: Props) => {
  return (
    <div
      className="relative z-20 safe-bottom"
      style={{
        background: "rgba(13,13,31,0.9)",
        backdropFilter: "blur(30px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-center justify-around px-4 py-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="tap-effect flex flex-col items-center gap-1 py-2 px-5 rounded-2xl transition-all duration-300"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(34,211,238,0.1) 100%)"
                  : "transparent",
              }}
            >
              <div
                className="transition-all duration-300"
                style={{
                  filter: isActive
                    ? "drop-shadow(0 0 8px rgba(168,85,247,0.8))"
                    : "none",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                }}
              >
                <Icon
                  name={tab.icon}
                  size={22}
                  className={isActive ? "text-purple-400" : "text-white/40"}
                />
              </div>
              <span
                className="text-[10px] font-medium transition-all duration-300"
                style={{
                  color: isActive ? "rgba(168,85,247,1)" : "rgba(255,255,255,0.35)",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
