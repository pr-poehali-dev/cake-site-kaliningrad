import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const CHAT_URL = "https://functions.poehali.dev/e1f3097d-d860-4b1b-bd2f-a01138bbba4e";

interface Message { id: number; sender: string; text: string; createdAt: string; }

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(() => localStorage.getItem("chat_order_id"));
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [name, setName] = useState(() => localStorage.getItem("chat_name") || "");
  const [phone, setPhone] = useState(() => localStorage.getItem("chat_phone") || "");
  const [step, setStep] = useState<"intro" | "chat">(orderId ? "chat" : "intro");
  const [sending, setSending] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ORDERS_URL = "https://functions.poehali.dev/657ce97d-c9a3-494e-ac00-38311c63a47e";

  const loadMessages = async (oid: string) => {
    const res = await fetch(`${CHAT_URL}?orderId=${oid}`);
    if (!res.ok) return;
    const data: Message[] = await res.json();
    setMessages(prev => {
      const hasNewAdmin = data.some(m => m.sender === "admin" && !prev.find(p => p.id === m.id));
      if (hasNewAdmin && !open) setHasNew(true);
      return data;
    });
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (!orderId) return;
    loadMessages(orderId);
    pollRef.current = setInterval(() => loadMessages(orderId), 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [orderId]);

  const startChat = async () => {
    if (!name.trim() || !phone.trim()) return;
    localStorage.setItem("chat_name", name);
    localStorage.setItem("chat_phone", phone);
    // Создаём заявку-обёртку для чата
    const res = await fetch(ORDERS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), phone: phone.trim(), type: "Чат с сайта", comment: "Написали через виджет чата" }),
    });
    const data = await res.json();
    const oid = String(data.orderId);
    localStorage.setItem("chat_order_id", oid);
    setOrderId(oid);
    setStep("chat");
  };

  const sendMessage = async () => {
    if (!text.trim() || !orderId) return;
    setSending(true);
    const msg = text.trim();
    setText("");
    await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, sender: "client", text: msg }),
    });
    await loadMessages(orderId);
    setSending(false);
  };

  const handleOpen = () => {
    setOpen(true);
    setHasNew(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      {open && (
        <div className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-pink-100 flex flex-col overflow-hidden" style={{ height: 480 }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-orange-400 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🎂</div>
              <div>
                <p className="font-bold text-white text-sm">Елена</p>
                <p className="text-pink-100 text-xs">Кондитер · Обычно отвечает за 1-2 часа</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <Icon name="X" size={18} />
            </button>
          </div>

          {step === "intro" ? (
            <div className="flex-1 flex flex-col justify-center p-6 gap-4">
              <p className="text-gray-600 text-sm text-center">Привет! Оставь имя и телефон — и я отвечу в чате.</p>
              <input
                type="text" placeholder="Ваше имя" value={name}
                onChange={e => setName(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <input
                type="tel" placeholder="+7 (___) ___-__-__" value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === "Enter" && startChat()}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <button
                onClick={startChat}
                disabled={!name.trim() || !phone.trim()}
                className="py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold text-sm disabled:opacity-50 hover:from-pink-600 hover:to-orange-500 transition-all"
              >
                Начать чат
              </button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-6">
                    Напишите ваш вопрос — Елена ответит в ближайшее время!
                  </div>
                )}
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${msg.sender === "client" ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"}`}>
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-0.5 ${msg.sender === "client" ? "text-pink-100" : "text-gray-400"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
              {/* Input */}
              <div className="p-3 border-t border-gray-100 flex gap-2 bg-white">
                <input
                  type="text" value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Напишите сообщение..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim() || sending}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white flex items-center justify-center disabled:opacity-50 hover:from-pink-600 hover:to-orange-500 transition-all flex-shrink-0"
                >
                  <Icon name="Send" size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Bubble button */}
      <button
        onClick={handleOpen}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 shadow-xl hover:shadow-pink-300 hover:scale-110 transition-all flex items-center justify-center relative"
      >
        <span className="text-2xl">{open ? "✕" : "💬"}</span>
        {hasNew && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>
    </div>
  );
}
