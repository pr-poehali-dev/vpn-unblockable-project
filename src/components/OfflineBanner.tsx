import Icon from "@/components/ui/icon";

interface Props {
  isOnline: boolean;
  syncing: boolean;
}

const OfflineBanner = ({ isOnline, syncing }: Props) => {
  if (isOnline && !syncing) return null;

  return (
    <div
      className="relative z-20 mx-3 mt-3 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 animate-slide-down"
      style={{
        background: syncing
          ? "linear-gradient(135deg, rgba(34,211,238,0.15) 0%, rgba(168,85,247,0.15) 100%)"
          : "linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(168,85,247,0.1) 100%)",
        border: syncing
          ? "1px solid rgba(34,211,238,0.3)"
          : "1px solid rgba(239,68,68,0.3)",
      }}
    >
      {syncing ? (
        <>
          <div className="animate-spin-slow">
            <Icon name="RefreshCw" size={14} className="text-cyan-400" />
          </div>
          <span className="text-xs font-medium text-cyan-300">Синхронизация данных...</span>
          <div className="ml-auto flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-cyan-400 animate-sync-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <Icon name="WifiOff" size={14} className="text-red-400" />
          <span className="text-xs font-medium text-red-300">Офлайн-режим</span>
          <span className="ml-auto text-xs text-red-400/60">данные сохранены</span>
        </>
      )}
    </div>
  );
};

export default OfflineBanner;
