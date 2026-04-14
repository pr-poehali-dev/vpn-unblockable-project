import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  isOnline: boolean;
}

const servers = [
  { country: "Нидерланды", city: "Amsterdam", flag: "🇳🇱", ping: 12, load: 34 },
  { country: "Германия", city: "Frankfurt", flag: "🇩🇪", ping: 18, load: 55 },
  { country: "Финляндия", city: "Helsinki", flag: "🇫🇮", ping: 22, load: 41 },
  { country: "США", city: "New York", flag: "🇺🇸", ping: 89, load: 72 },
  { country: "Япония", city: "Tokyo", flag: "🇯🇵", ping: 132, load: 28 },
  { country: "Сингапур", city: "Singapore", flag: "🇸🇬", ping: 98, load: 19 },
];

const VpnScreen = ({ isOnline }: Props) => {
  const [connected, setConnected] = useState(true);
  const [selectedServer, setSelectedServer] = useState(0);
  const [connecting, setConnecting] = useState(false);

  const toggleVpn = () => {
    if (!isOnline && !connected) return;
    setConnecting(true);
    setTimeout(() => {
      setConnected((c) => !c);
      setConnecting(false);
    }, 1800);
  };

  const pingColor = (ping: number) =>
    ping < 30 ? "#22d3ee" : ping < 80 ? "#a855f7" : "#f472b6";

  const loadColor = (load: number) =>
    load < 40 ? "#22d3ee" : load < 65 ? "#a855f7" : "#f472b6";

  return (
    <div className="px-4 pt-4 pb-6 space-y-5">
      {/* Header */}
      <div className="animate-fade-in">
        <p className="text-xs text-white/40 font-medium tracking-widest uppercase">Соединение</p>
        <h1 className="text-2xl font-bold text-white mt-0.5">VPN</h1>
      </div>

      {/* Big connect button */}
      <div className="flex flex-col items-center pt-2 pb-2 animate-fade-in-up">
        <button
          onClick={toggleVpn}
          disabled={connecting}
          className="tap-effect relative w-36 h-36 rounded-full flex items-center justify-center"
          style={{
            background: connected
              ? "linear-gradient(135deg, #a855f7 0%, #22d3ee 100%)"
              : "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            boxShadow: connected
              ? "0 0 50px rgba(168,85,247,0.5), 0 0 100px rgba(34,211,238,0.2)"
              : "0 0 30px rgba(0,0,0,0.5)",
            border: connected
              ? "2px solid rgba(168,85,247,0.6)"
              : "2px solid rgba(255,255,255,0.1)",
            transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {/* Outer ring */}
          {connected && (
            <div
              className="absolute inset-0 rounded-full animate-pulse-glow pointer-events-none"
              style={{ border: "1px solid rgba(168,85,247,0.3)" }}
            />
          )}
          <div className="flex flex-col items-center gap-1">
            {connecting ? (
              <div className="animate-spin-slow">
                <Icon name="Loader2" size={40} className="text-white" />
              </div>
            ) : (
              <Icon
                name={connected ? "ShieldCheck" : "ShieldOff"}
                size={40}
                className="text-white"
              />
            )}
            <span className="text-white/80 text-xs font-semibold mt-1">
              {connecting ? "Подключение..." : connected ? "Отключить" : "Подключить"}
            </span>
          </div>
        </button>

        {/* Status */}
        <div className="mt-4 flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: connecting ? "#f472b6" : connected ? "#22d3ee" : "#ef4444",
              boxShadow: `0 0 8px ${connecting ? "#f472b6" : connected ? "#22d3ee" : "#ef4444"}`,
              animation: connecting ? "pulse 1s infinite" : "none",
            }}
          />
          <span className="text-white/60 text-sm font-medium">
            {connecting
              ? "Устанавливаем соединение..."
              : connected
              ? `${servers[selectedServer].flag} ${servers[selectedServer].city} — ${servers[selectedServer].ping} мс`
              : "Не подключено"}
          </span>
        </div>

        {/* Connection stats */}
        {connected && !connecting && (
          <div className="flex gap-6 mt-3 animate-fade-in">
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1">
                <Icon name="ArrowDown" size={12} className="text-cyan-400" />
                <span className="text-white font-semibold text-sm">↓ 84 Мб/с</span>
              </div>
              <span className="text-white/30 text-xs">Входящий</span>
            </div>
            <div className="w-px bg-white/10" />
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1">
                <Icon name="ArrowUp" size={12} className="text-purple-400" />
                <span className="text-white font-semibold text-sm">↑ 31 Мб/с</span>
              </div>
              <span className="text-white/30 text-xs">Исходящий</span>
            </div>
          </div>
        )}
      </div>

      {/* Servers list */}
      <div className="animate-fade-in-up delay-200">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-white/40 font-semibold tracking-widest uppercase">Серверы</p>
          <span className="text-xs text-purple-400 font-medium">{servers.length} доступно</span>
        </div>
        <div className="space-y-2">
          {servers.map((s, i) => {
            const isSelected = selectedServer === i;
            return (
              <button
                key={i}
                onClick={() => setSelectedServer(i)}
                className="tap-effect w-full rounded-2xl px-4 py-3.5 flex items-center gap-3 transition-all duration-300"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(34,211,238,0.1) 100%)"
                    : "rgba(255,255,255,0.04)",
                  border: isSelected
                    ? "1px solid rgba(168,85,247,0.4)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <span className="text-2xl">{s.flag}</span>
                <div className="flex-1 text-left">
                  <p className="text-white text-sm font-semibold">{s.country}</p>
                  <p className="text-white/40 text-xs">{s.city}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-bold" style={{ color: pingColor(s.ping) }}>
                      {s.ping} мс
                    </p>
                    <p className="text-[10px] text-white/30">пинг</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold" style={{ color: loadColor(s.load) }}>
                      {s.load}%
                    </p>
                    <p className="text-[10px] text-white/30">нагр.</p>
                  </div>
                  {isSelected && (
                    <Icon name="Check" size={16} className="text-purple-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VpnScreen;
