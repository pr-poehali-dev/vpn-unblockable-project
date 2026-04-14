import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  isOnline: boolean;
  isAdult: boolean;
}

const stats = [
  { label: "Трафик", value: "12.4 GB", icon: "Activity", color: "#a855f7" },
  { label: "Сессий", value: "847", icon: "Zap", color: "#22d3ee" },
  { label: "Заблок.", value: "2,391", icon: "ShieldOff", color: "#f472b6" },
];

const recentActivity = [
  { app: "Instagram", action: "Разблокировано", time: "2 мин", color: "#f472b6" },
  { app: "Telegram", action: "Защищён", time: "5 мин", color: "#22d3ee" },
  { app: "YouTube", action: "Ускорен", time: "12 мин", color: "#a855f7" },
  { app: "TikTok", action: "Разблокировано", time: "1 ч", color: "#f472b6" },
];

const HomeScreen = ({ isOnline, isAdult }: Props) => {
  const [notificationsOn, setNotificationsOn] = useState(true);

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <p className="text-xs text-white/40 font-medium tracking-widest uppercase">Добро пожаловать</p>
          <h1 className="text-2xl font-bold gradient-text-warm mt-0.5">
            NovVPN {!isAdult && <span className="text-sm font-medium text-cyan-400 ml-1">👶 Детский</span>}
          </h1>
        </div>
        <button
          className="tap-effect relative w-10 h-10 rounded-2xl glass flex items-center justify-center"
          onClick={() => setNotificationsOn(!notificationsOn)}
        >
          <Icon
            name={notificationsOn ? "Bell" : "BellOff"}
            size={18}
            className="text-white/70"
          />
          {notificationsOn && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500" />
          )}
        </button>
      </div>

      {/* Kids mode banner */}
      {!isAdult && (
        <div
          className="rounded-2xl px-4 py-3 flex items-center gap-3 animate-fade-in"
          style={{
            background: "linear-gradient(135deg, rgba(34,211,238,0.12) 0%, rgba(168,85,247,0.12) 100%)",
            border: "1px solid rgba(34,211,238,0.25)",
          }}
        >
          <Icon name="Baby" size={18} className="text-cyan-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-cyan-300 text-xs font-semibold">Детский безопасный режим</p>
            <p className="text-white/40 text-xs">Взрослый контент заблокирован</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      )}

      {/* Status Card */}
      <div
        className="rounded-3xl p-5 animate-fade-in-up relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(168,85,247,0.25) 0%, rgba(34,211,238,0.15) 100%)",
          border: "1px solid rgba(168,85,247,0.3)",
        }}
      >
        <div className="absolute inset-0 shimmer-bg opacity-30 pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{
                  background: isOnline ? "#22d3ee" : "#ef4444",
                  boxShadow: isOnline
                    ? "0 0 8px rgba(34,211,238,0.8)"
                    : "0 0 8px rgba(239,68,68,0.8)",
                }}
              />
              <span className="text-xs font-semibold" style={{ color: isOnline ? "#22d3ee" : "#ef4444" }}>
                {isOnline ? "Онлайн" : "Офлайн"}
              </span>
            </div>
            <p className="text-white font-bold text-lg">Защита активна</p>
            <p className="text-white/50 text-xs mt-0.5">Нидерланды — Amsterdam #4</p>
          </div>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse-glow"
            style={{
              background: "linear-gradient(135deg, #a855f7, #22d3ee)",
            }}
          >
            <Icon name="Shield" size={28} className="text-white" />
          </div>
        </div>

        {/* Speed bar */}
        <div className="mt-4 relative z-10">
          <div className="flex justify-between text-xs text-white/50 mb-1.5">
            <span>Скорость</span>
            <span className="text-cyan-400 font-semibold">94 Мбит/с</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10">
            <div
              className="h-full rounded-full"
              style={{
                width: "76%",
                background: "linear-gradient(90deg, #a855f7, #22d3ee)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 animate-fade-in-up delay-100">
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass rounded-2xl p-3.5 flex flex-col items-center gap-2"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `${s.color}22` }}
            >
              <Icon name={s.icon} size={16} style={{ color: s.color }} />
            </div>
            <span className="text-white font-bold text-sm">{s.value}</span>
            <span className="text-white/40 text-[10px]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="animate-fade-in-up delay-200">
        <p className="text-xs text-white/40 font-semibold tracking-widest uppercase mb-3">
          Последняя активность
        </p>
        <div className="space-y-2">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="glass rounded-2xl px-4 py-3 flex items-center gap-3 tap-effect"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{ background: `${item.color}22`, color: item.color }}
              >
                {item.app[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{item.app}</p>
                <p className="text-white/40 text-xs">{item.action}</p>
              </div>
              <span className="text-white/30 text-xs">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;