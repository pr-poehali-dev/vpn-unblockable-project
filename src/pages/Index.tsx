import { useState, useEffect } from "react";
import HomeScreen from "@/components/screens/HomeScreen";
import VpnScreen from "@/components/screens/VpnScreen";
import SettingsScreen from "@/components/screens/SettingsScreen";
import BottomNav from "@/components/BottomNav";
import OfflineBanner from "@/components/OfflineBanner";
import AgeGate from "@/components/AgeGate";

export type Tab = "home" | "vpn" | "settings";

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const [ageVerified, setAgeVerified] = useState<boolean | null>(null);
  const [isAdult, setIsAdult] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncing(true);
      setTimeout(() => setSyncing(false), 2500);
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleAgeVerified = (adult: boolean) => {
    setIsAdult(adult);
    setAgeVerified(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a14]">
      <div
        className="relative w-full max-w-[390px] h-screen max-h-[844px] overflow-hidden flex flex-col"
        style={{ background: "linear-gradient(160deg, #0d0d1f 0%, #0a0a14 60%, #10061e 100%)" }}
      >
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-72 h-72 rounded-full opacity-20 animate-orb-float"
            style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)", top: "-60px", right: "-60px" }} />
          <div className="absolute w-56 h-56 rounded-full opacity-15 animate-orb-float"
            style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)", bottom: "80px", left: "-40px", animationDelay: "3s" }} />
          <div className="absolute w-40 h-40 rounded-full opacity-10 animate-orb-float"
            style={{ background: "radial-gradient(circle, #f472b6 0%, transparent 70%)", top: "40%", left: "30%", animationDelay: "6s" }} />
        </div>

        {/* Age Gate overlay */}
        {ageVerified === null && (
          <AgeGate onVerified={handleAgeVerified} />
        )}

        {/* Main App */}
        {ageVerified !== null && (
          <>
            <OfflineBanner isOnline={isOnline} syncing={syncing} />
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
              {activeTab === "home" && <HomeScreen isOnline={isOnline} isAdult={isAdult} />}
              {activeTab === "vpn" && <VpnScreen isOnline={isOnline} />}
              {activeTab === "settings" && (
                <SettingsScreen isAdult={isAdult} onAdultChange={setIsAdult} />
              )}
            </div>
            <BottomNav activeTab={activeTab} onChange={setActiveTab} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
