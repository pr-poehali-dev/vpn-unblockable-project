import { useState } from "react";
import Icon from "@/components/ui/icon";

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}

const Toggle = ({ value, onChange, color = "#a855f7" }: ToggleProps) => (
  <div
    className="toggle-track tap-effect"
    style={{ background: value ? color : "rgba(255,255,255,0.1)" }}
    onClick={() => onChange(!value)}
  >
    <div
      className="toggle-thumb"
      style={{
        left: value ? "27px" : "3px",
        background: value ? "#fff" : "rgba(255,255,255,0.5)",
      }}
    />
  </div>
);

interface SettingRowProps {
  icon: string;
  iconColor: string;
  label: string;
  description?: string;
  right?: React.ReactNode;
}

const SettingRow = ({ icon, iconColor, label, description, right }: SettingRowProps) => (
  <div className="flex items-center gap-3.5 py-3.5 px-4">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${iconColor}22` }}
    >
      <Icon name={icon} size={18} style={{ color: iconColor }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-white text-sm font-medium">{label}</p>
      {description && <p className="text-white/40 text-xs mt-0.5">{description}</p>}
    </div>
    {right}
  </div>
);

const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="animate-fade-in-up">
    <p className="text-xs text-white/40 font-semibold tracking-widest uppercase px-1 mb-2">
      {title}
    </p>
    <div
      className="rounded-3xl overflow-hidden divide-y"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        divideColor: "rgba(255,255,255,0.06)",
      }}
    >
      {children}
    </div>
  </div>
);

const SettingsScreen = () => {
  const [killSwitch, setKillSwitch] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);
  const [dnsLeak, setDnsLeak] = useState(true);
  const [splitTunnel, setSplitTunnel] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [protocol, setProtocol] = useState("WireGuard");

  const protocols = ["WireGuard", "OpenVPN", "IKEv2", "Shadowsocks"];

  return (
    <div className="px-4 pt-4 pb-6 space-y-5">
      {/* Header */}
      <div className="animate-fade-in">
        <p className="text-xs text-white/40 font-medium tracking-widest uppercase">Конфигурация</p>
        <h1 className="text-2xl font-bold text-white mt-0.5">Настройки</h1>
      </div>

      {/* Profile card */}
      <div
        className="rounded-3xl p-4 flex items-center gap-4 animate-fade-in-up relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(34,211,238,0.1) 100%)",
          border: "1px solid rgba(168,85,247,0.25)",
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #a855f7, #22d3ee)" }}
        >
          N
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-base">NovVPN Pro</p>
          <p className="text-white/50 text-xs">Подписка активна до 12 дек 2025</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 text-xs font-medium">Премиум</span>
          </div>
        </div>
        <Icon name="ChevronRight" size={18} className="text-white/30" />
      </div>

      {/* VPN settings */}
      <SettingSection title="VPN">
        <SettingRow
          icon="Swords"
          iconColor="#ef4444"
          label="Kill Switch"
          description="Блокирует трафик при разрыве VPN"
          right={<Toggle value={killSwitch} onChange={setKillSwitch} color="#ef4444" />}
        />
        <SettingRow
          icon="Zap"
          iconColor="#a855f7"
          label="Автоподключение"
          description="При запуске приложения"
          right={<Toggle value={autoConnect} onChange={setAutoConnect} />}
        />
        <SettingRow
          icon="EyeOff"
          iconColor="#22d3ee"
          label="DNS защита"
          description="Предотвращает утечку DNS"
          right={<Toggle value={dnsLeak} onChange={setDnsLeak} color="#22d3ee" />}
        />
        <SettingRow
          icon="GitBranch"
          iconColor="#f472b6"
          label="Split Tunneling"
          description="Выбрать приложения для VPN"
          right={<Toggle value={splitTunnel} onChange={setSplitTunnel} color="#f472b6" />}
        />
      </SettingSection>

      {/* Protocol */}
      <SettingSection title="Протокол">
        <div className="p-4">
          <p className="text-white/50 text-xs mb-3">Выберите протокол шифрования</p>
          <div className="grid grid-cols-2 gap-2">
            {protocols.map((p) => (
              <button
                key={p}
                onClick={() => setProtocol(p)}
                className="tap-effect rounded-2xl py-2.5 px-3 text-sm font-medium transition-all duration-200"
                style={{
                  background:
                    protocol === p
                      ? "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(34,211,238,0.2))"
                      : "rgba(255,255,255,0.05)",
                  border:
                    protocol === p
                      ? "1px solid rgba(168,85,247,0.5)"
                      : "1px solid rgba(255,255,255,0.08)",
                  color: protocol === p ? "#fff" : "rgba(255,255,255,0.5)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </SettingSection>

      {/* Offline & Sync */}
      <SettingSection title="Офлайн и синхронизация">
        <SettingRow
          icon="WifiOff"
          iconColor="#22d3ee"
          label="Офлайн-режим"
          description="Работа без интернета"
          right={<Toggle value={offlineMode} onChange={setOfflineMode} color="#22d3ee" />}
        />
        <SettingRow
          icon="RefreshCw"
          iconColor="#a855f7"
          label="Авто-синхронизация"
          description="Обновлять данные при подключении"
          right={<Toggle value={autoSync} onChange={setAutoSync} />}
        />
      </SettingSection>

      {/* Interface */}
      <SettingSection title="Интерфейс">
        <SettingRow
          icon="Bell"
          iconColor="#f472b6"
          label="Уведомления"
          description="Push-уведомления о статусе"
          right={<Toggle value={notifications} onChange={setNotifications} color="#f472b6" />}
        />
        <SettingRow
          icon="Moon"
          iconColor="#a855f7"
          label="Тёмная тема"
          description="Уже включена — рекомендуем"
          right={<Toggle value={darkMode} onChange={setDarkMode} />}
        />
        <SettingRow
          icon="Languages"
          iconColor="#22d3ee"
          label="Язык"
          description="Русский"
          right={<Icon name="ChevronRight" size={16} className="text-white/30" />}
        />
      </SettingSection>

      {/* About */}
      <SettingSection title="О приложении">
        <SettingRow
          icon="Info"
          iconColor="#a855f7"
          label="Версия"
          description="2.4.1 (build 247)"
          right={null}
        />
        <SettingRow
          icon="FileText"
          iconColor="#22d3ee"
          label="Политика конфиденциальности"
          right={<Icon name="ChevronRight" size={16} className="text-white/30" />}
        />
        <SettingRow
          icon="Star"
          iconColor="#f472b6"
          label="Оценить приложение"
          right={<Icon name="ChevronRight" size={16} className="text-white/30" />}
        />
      </SettingSection>

      {/* Logout */}
      <button
        className="tap-effect w-full rounded-3xl py-4 flex items-center justify-center gap-2 font-semibold text-sm"
        style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.2)",
          color: "#f87171",
        }}
      >
        <Icon name="LogOut" size={16} />
        Выйти из аккаунта
      </button>
    </div>
  );
};

export default SettingsScreen;
