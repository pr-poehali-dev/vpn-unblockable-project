import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  onVerified: (isAdult: boolean) => void;
}

type Step = "intro" | "dob" | "challenge" | "result";

const BLOCKED_YEARS = 3; // не пускаем если < 18 лет назад

function calcAge(day: string, month: string, year: string): number {
  const birth = new Date(Number(year), Number(month) - 1, Number(day));
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

// Простая капча: арифметический вопрос
function genChallenge() {
  const ops = ["+", "-", "×"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 9) + 1;
  let b = Math.floor(Math.random() * 9) + 1;
  if (op === "-" && b > a) [a, b] = [b, a];
  const answer = op === "+" ? a + b : op === "-" ? a - b : a * b;
  return { question: `${a} ${op} ${b} = ?`, answer };
}

const AgeGate = ({ onVerified }: Props) => {
  const [step, setStep] = useState<Step>("intro");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");
  const [challenge, setChallenge] = useState(genChallenge);
  const [challengeInput, setChallengeInput] = useState("");
  const [challengeError, setChallengeError] = useState(false);
  const [shakeDob, setShakeDob] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [isAdultResult, setIsAdultResult] = useState<boolean | null>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  // Countdown timer for lockout
  useEffect(() => {
    if (!locked) return;
    if (lockTimer <= 0) { setLocked(false); return; }
    const t = setTimeout(() => setLockTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [locked, lockTimer]);

  const shake = () => {
    setShakeDob(true);
    setTimeout(() => setShakeDob(false), 500);
  };

  const handleDobNext = () => {
    setError("");
    const d = Number(day), m = Number(month), y = Number(year);
    if (!day || !month || !year) { setError("Заполните все поля"); shake(); return; }
    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > new Date().getFullYear()) {
      setError("Некорректная дата"); shake(); return;
    }
    const age = calcAge(day, month, year);
    if (age < 0 || age > 120) { setError("Некорректная дата"); shake(); return; }

    setIsAdultResult(age >= 18);
    setChallenge(genChallenge());
    setChallengeInput("");
    setChallengeError(false);
    setStep("challenge");
  };

  const handleChallenge = () => {
    if (locked) return;
    if (challengeInput.trim() !== String(challenge.answer)) {
      setChallengeError(true);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 3) {
        setLocked(true);
        setLockTimer(30);
      }
      setTimeout(() => setChallengeError(false), 600);
      setChallengeInput("");
      setChallenge(genChallenge());
      return;
    }
    setAttempts(0);
    setStep("result");
    setTimeout(() => onVerified(isAdultResult!), 1200);
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(160deg, #0d0d1f 0%, #0a0a14 60%, #10061e 100%)" }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full opacity-20 animate-orb-float"
          style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)", top: "-40px", right: "-40px" }} />
        <div className="absolute w-48 h-48 rounded-full opacity-15 animate-orb-float"
          style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)", bottom: "60px", left: "-30px", animationDelay: "3s" }} />
      </div>

      {/* INTRO */}
      {step === "intro" && (
        <div className="w-full max-w-sm space-y-6 animate-fade-in-up text-center">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center animate-pulse-glow"
              style={{ background: "linear-gradient(135deg, #a855f7, #22d3ee)" }}>
              <Icon name="ShieldCheck" size={44} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-display">Проверка возраста</h1>
            <p className="text-white/50 text-sm mt-2 leading-relaxed">
              Часть контента в интернете предназначена только для совершеннолетних. Мы защищаем детей от нежелательных материалов.
            </p>
          </div>
          <div className="space-y-3 text-left">
            {[
              { icon: "Shield", color: "#a855f7", text: "Защита от взрослого контента" },
              { icon: "Baby", color: "#22d3ee", text: "Детский безопасный режим" },
              { icon: "Lock", color: "#f472b6", text: "PIN-защита настроек родителей" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 glass rounded-2xl px-4 py-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}22` }}>
                  <Icon name={item.icon} size={16} style={{ color: item.color }} />
                </div>
                <span className="text-white/80 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep("dob")}
            className="tap-effect w-full py-4 rounded-3xl font-bold text-white text-base"
            style={{ background: "linear-gradient(135deg, #a855f7, #22d3ee)" }}>
            Подтвердить возраст
          </button>
          <button onClick={() => onVerified(false)} className="tap-effect text-white/30 text-sm">
            Пропустить — детский режим
          </button>
        </div>
      )}

      {/* DATE OF BIRTH */}
      {step === "dob" && (
        <div className="w-full max-w-sm space-y-6 animate-fade-in-up">
          <button onClick={() => setStep("intro")} className="tap-effect flex items-center gap-2 text-white/40 text-sm mb-2">
            <Icon name="ArrowLeft" size={16} />
            Назад
          </button>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.3)" }}>
              <Icon name="CalendarDays" size={28} className="text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Дата рождения</h2>
            <p className="text-white/40 text-sm mt-1">Введите вашу реальную дату рождения</p>
          </div>

          <div
            className={`flex gap-3 transition-all duration-150 ${shakeDob ? "translate-x-2" : ""}`}
            style={{ animation: shakeDob ? "shake 0.4s ease" : "none" }}
          >
            {/* Day */}
            <div className="flex-1">
              <label className="text-xs text-white/40 font-medium mb-1.5 block">День</label>
              <input
                type="number"
                placeholder="ДД"
                min={1} max={31}
                value={day}
                onChange={(e) => {
                  const v = e.target.value.slice(0, 2);
                  setDay(v);
                  if (v.length === 2) monthRef.current?.focus();
                }}
                className="w-full rounded-2xl px-3 py-3.5 text-center text-white text-lg font-bold outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>
            {/* Month */}
            <div className="flex-1">
              <label className="text-xs text-white/40 font-medium mb-1.5 block">Месяц</label>
              <input
                ref={monthRef}
                type="number"
                placeholder="ММ"
                min={1} max={12}
                value={month}
                onChange={(e) => {
                  const v = e.target.value.slice(0, 2);
                  setMonth(v);
                  if (v.length === 2) yearRef.current?.focus();
                }}
                className="w-full rounded-2xl px-3 py-3.5 text-center text-white text-lg font-bold outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>
            {/* Year */}
            <div className="flex-[1.6]">
              <label className="text-xs text-white/40 font-medium mb-1.5 block">Год</label>
              <input
                ref={yearRef}
                type="number"
                placeholder="ГГГГ"
                min={1900} max={new Date().getFullYear()}
                value={year}
                onChange={(e) => setYear(e.target.value.slice(0, 4))}
                className="w-full rounded-2xl px-3 py-3.5 text-center text-white text-lg font-bold outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 animate-fade-in">
              <Icon name="AlertCircle" size={14} className="text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <div className="glass rounded-2xl px-4 py-3 flex items-start gap-3">
            <Icon name="Info" size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-white/40 text-xs leading-relaxed">
              Данные не сохраняются и не передаются третьим лицам. Проверка происходит локально на устройстве.
            </p>
          </div>

          <button
            onClick={handleDobNext}
            className="tap-effect w-full py-4 rounded-3xl font-bold text-white text-base"
            style={{ background: "linear-gradient(135deg, #a855f7, #22d3ee)" }}>
            Продолжить
          </button>
        </div>
      )}

      {/* ANTI-FRAUD CHALLENGE */}
      {step === "challenge" && (
        <div className="w-full max-w-sm space-y-6 animate-fade-in-up text-center">
          <div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.3)" }}>
              <Icon name="Bot" size={28} className="text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Защита от ботов</h2>
            <p className="text-white/40 text-sm mt-1">Докажите, что вы человек</p>
          </div>

          <div
            className="rounded-3xl p-8 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(34,211,238,0.12) 0%, rgba(168,85,247,0.12) 100%)",
              border: `1px solid ${challengeError ? "rgba(239,68,68,0.5)" : "rgba(34,211,238,0.25)"}`,
              transition: "border-color 0.2s",
            }}
          >
            <p className="text-white/50 text-sm mb-2">Решите пример</p>
            <p className="text-4xl font-bold gradient-text font-display">{challenge.question}</p>
          </div>

          <input
            type="number"
            placeholder="Ваш ответ"
            value={challengeInput}
            onChange={(e) => setChallengeInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleChallenge()}
            disabled={locked}
            className="w-full rounded-2xl px-4 py-4 text-center text-white text-xl font-bold outline-none transition-all"
            style={{
              background: challengeError ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.07)",
              border: challengeError ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.1)",
            }}
          />

          {locked ? (
            <div className="flex items-center justify-center gap-2 animate-fade-in">
              <Icon name="Timer" size={14} className="text-red-400" />
              <span className="text-red-400 text-sm font-medium">
                Слишком много попыток. Подождите {lockTimer} сек.
              </span>
            </div>
          ) : challengeError ? (
            <div className="flex items-center justify-center gap-2 animate-fade-in">
              <Icon name="X" size={14} className="text-red-400" />
              <span className="text-red-400 text-sm">Неверно. Осталось попыток: {3 - attempts}</span>
            </div>
          ) : null}

          <button
            onClick={handleChallenge}
            disabled={locked || !challengeInput}
            className="tap-effect w-full py-4 rounded-3xl font-bold text-white text-base transition-opacity"
            style={{
              background: "linear-gradient(135deg, #a855f7, #22d3ee)",
              opacity: locked || !challengeInput ? 0.4 : 1,
            }}>
            Подтвердить
          </button>
        </div>
      )}

      {/* RESULT */}
      {step === "result" && (
        <div className="w-full max-w-sm text-center space-y-4 animate-fade-in-up">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto animate-pulse-glow"
            style={{
              background: isAdultResult
                ? "linear-gradient(135deg, #a855f7, #22d3ee)"
                : "linear-gradient(135deg, #22d3ee, #f472b6)",
            }}
          >
            <Icon name={isAdultResult ? "Unlock" : "Baby"} size={44} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isAdultResult ? "Доступ разрешён" : "Детский режим"}
          </h2>
          <p className="text-white/50 text-sm">
            {isAdultResult
              ? "Возраст подтверждён. Входим в приложение..."
              : "Включён безопасный режим. Нежелательный контент заблокирован."}
          </p>
          <div className="flex justify-center">
            <div className="w-8 h-8 animate-spin-slow">
              <Icon name="Loader2" size={32} className="text-purple-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgeGate;
