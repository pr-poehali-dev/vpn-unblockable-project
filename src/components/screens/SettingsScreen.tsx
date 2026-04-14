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

interface SettingsProps {
  isAdult: boolean;
  onAdultChange: (v: boolean) => void;
}

const SettingsScreen = ({ isAdult, onAdultChange }: SettingsProps) => {
  const [killSwitch, setKillSwitch] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);
  const [dnsLeak, setDnsLeak] = useState(true);
  const [splitTunnel, setSplitTunnel] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [protocol, setProtocol] = useState("WireGuard");

  // Kids mode
  const [kidsMode, setKidsMode] = useState(!isAdult);
  const [blockAdult, setBlockAdult] = useState(true);
  const [blockGambling, setBlockGambling] = useState(true);
  const [blockSocial, setBlockSocial] = useState(false);
  const [safeSearch, setSafeSearch] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [pinSet, setPinSet] = useState(false);
  const [pinValue, setPinValue] = useState("");

  const CORRECT_PIN = "1234";

  const handleKidsModeToggle = (v: boolean) => {
    if (!v && pinSet) {
      setShowPinModal(true);
      return;
    }
    setKidsMode(v);
    onAdultChange(!v);
  };

  const handlePinSubmit = () => {
    if (pin === CORRECT_PIN || pin === pinValue) {
      setPinError(false);
      setPin("");
      setShowPinModal(false);
      setKidsMode(false);
      onAdultChange(true);
    } else {
      setPinError(true);
      setPin("");
      setTimeout(() => setPinError(false), 800);
    }
  };

  const handleSetPin = () => {
    if (pinValue.length === 4) {
      setPinSet(true);
      setPinValue(pinValue);
    }
  };

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

      {/* Kids Protection */}
      <SettingSection title="Детская защита">
        <SettingRow
          icon="Baby"
          iconColor="#22d3ee"
          label="Детский режим"
          description={kidsMode ? "Включён — контент фильтруется" : "Выключен — доступ без ограничений"}
          right={<Toggle value={kidsMode} onChange={handleKidsModeToggle} color="#22d3ee" />}
        />
        {kidsMode && (
          <>
            <SettingRow
              icon="ShieldX"
              iconColor="#ef4444"
              label="Блокировка 18+ контента"
              description="Сайты для взрослых"
              right={<Toggle value={blockAdult} onChange={setBlockAdult} color="#ef4444" />}
            />
            <SettingRow
              icon="Dices"
              iconColor="#f472b6"
              label="Блокировка азартных игр"
              description="Казино, ставки, лотереи"
              right={<Toggle value={blockGambling} onChange={setBlockGambling} color="#f472b6" />}
            />
            <SettingRow
              icon="MessagesSquare"
              iconColor="#a855f7"
              label="Ограничить соцсети"
              description="Instagram, TikTok, Twitter"
              right={<Toggle value={blockSocial} onChange={setBlockSocial} />}
            />
            <SettingRow
              icon="Search"
              iconColor="#22d3ee"
              label="Безопасный поиск"
              description="Google SafeSearch принудительно"
              right={<Toggle value={safeSearch} onChange={setSafeSearch} color="#22d3ee" />}
            />
            <div className="px-4 pb-4 pt-1">
              {!pinSet ? (
                <div className="space-y-2">
                  <p className="text-xs text-white/40">Установить PIN для защиты настроек</p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="4 цифры"
                      value={pinValue}
                      onChange={(e) => setPinValue(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      className="flex-1 rounded-2xl px-3 py-2.5 text-white text-sm font-bold outline-none text-center tracking-widest"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                    <button
                      onClick={handleSetPin}
                      disabled={pinValue.length !== 4}
                      className="tap-effect px-4 py-2.5 rounded-2xl text-white text-sm font-semibold transition-opacity"
                      style={{
                        background: "linear-gradient(135deg, #a855f7, #22d3ee)",
                        opacity: pinValue.length !== 4 ? 0.4 : 1,
                      }}
                    >
                      Сохранить
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-2xl px-3 py-2"
                  style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)" }}>
                  <Icon name="Lock" size={14} className="text-cyan-400" />
                  <span className="text-cyan-400 text-xs font-medium">PIN-защита установлена</span>
                </div>
              )}
            </div>
          </>
        )}
      </SettingSection>

      {/* PIN modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-[390px] rounded-t-3xl p-6 space-y-4 animate-slide-up"
            style={{ background: "linear-gradient(160deg, #0d0d1f, #10061e)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(168,85,247,0.2)" }}>
                <Icon name="Lock" size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-white font-bold">Введите PIN</p>
                <p className="text-white/40 text-xs">Для отключения детского режима</p>
              </div>
            </div>
            <input
              type="password"
              maxLength={4}
              placeholder="• • • •"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
              autoFocus
              className="w-full rounded-2xl px-4 py-4 text-center text-white text-2xl font-bold outline-none tracking-widest transition-all"
              style={{
                background: pinError ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.07)",
                border: pinError ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.12)",
              }}
            />
            {pinError && (
              <div className="flex items-center justify-center gap-2 animate-fade-in">
                <Icon name="AlertCircle" size={14} className="text-red-400" />
                <span className="text-red-400 text-sm">Неверный PIN</span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowPinModal(false); setPin(""); }}
                className="tap-effect flex-1 py-3.5 rounded-2xl text-white/60 font-semibold text-sm"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}>
                Отмена
              </button>
              <button
                onClick={handlePinSubmit}
                className="tap-effect flex-1 py-3.5 rounded-2xl text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #a855f7, #22d3ee)" }}>
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}

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