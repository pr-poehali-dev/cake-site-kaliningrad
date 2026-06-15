import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const ORDERS_URL = "https://functions.poehali.dev/657ce97d-c9a3-494e-ac00-38311c63a47e";
const CHAT_URL = "https://functions.poehali.dev/e1f3097d-d860-4b1b-bd2f-a01138bbba4e";
const UPLOAD_URL = "https://functions.poehali.dev/13231e85-281a-4c17-8331-d6549790a887";
const STORAGE_URL = "https://functions.poehali.dev/51b01867-45fb-4694-85ce-7447dd93fa9e";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:        { label: "Новая",      color: "bg-blue-100 text-blue-700" },
  confirmed:  { label: "Подтверждена", color: "bg-yellow-100 text-yellow-700" },
  in_work:    { label: "В работе",   color: "bg-orange-100 text-orange-700" },
  done:       { label: "Готово",     color: "bg-green-100 text-green-700" },
  cancelled:  { label: "Отменена",   color: "bg-red-100 text-red-700" },
};

interface Order {
  id: string; name: string; phone: string; date: string; type: string;
  comment: string; promo: string; print: string; photoUrl: string;
  estimatedPrice: string; kg: string; qty: string; status: string; createdAt: string;
}
interface Message { id: number; sender: string; text: string; createdAt: string; }

export default function Admin() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() => sessionStorage.getItem("admin_token") || "");
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [tab, setTab] = useState<"orders" | "portfolio">("orders");
  const [portfolioFiles, setPortfolioFiles] = useState<{key: string; url: string}[]>([]);
  const [portfolioUploading, setPortfolioUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const login = async () => {
    setLoginError("");
    const res = await fetch(ORDERS_URL, { headers: { "X-Admin-Token": password } });
    if (res.ok) {
      sessionStorage.setItem("admin_token", password);
      setToken(password);
    } else {
      setLoginError("Неверный пароль");
    }
  };

  const loadOrders = async () => {
    const res = await fetch(ORDERS_URL, { headers: { "X-Admin-Token": token } });
    if (res.ok) setOrders(await res.json());
  };

  const loadPortfolio = async () => {
    const res = await fetch(STORAGE_URL);
    if (res.ok) {
      const all = await res.json();
      setPortfolioFiles(all.filter((f: {key: string}) => f.key.startsWith("portfolio/")));
    }
  };

  const uploadPortfolioPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPortfolioUploading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64, name: `portfolio/${file.name}` }),
      });
      if (res.ok) await loadPortfolio();
      setPortfolioUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const loadMessages = async (orderId: string) => {
    const res = await fetch(`${CHAT_URL}?orderId=${orderId}`);
    if (res.ok) setMessages(await res.json());
  };

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    setSending(true);
    await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Token": token },
      body: JSON.stringify({ orderId: selected.id, sender: "admin", text: reply.trim() }),
    });
    setReply("");
    await loadMessages(selected.id);
    setSending(false);
  };

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(ORDERS_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Admin-Token": token },
      body: JSON.stringify({ id: orderId, status }),
    });
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status } : null);
  };

  useEffect(() => { if (token) { loadOrders(); loadPortfolio(); } }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selected) return;
    loadMessages(selected.id);
    pollRef.current = setInterval(() => loadMessages(selected.id), 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selected?.id]);

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase()) || o.phone.includes(search);
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎂</div>
            <h1 className="text-2xl font-black text-gray-800">Панель управления</h1>
            <p className="text-gray-400 text-sm mt-1">Заявки и переписка с покупателями</p>
          </div>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 mb-3"
          />
          {loginError && <p className="text-red-400 text-sm mb-3 text-center">{loginError}</p>}
          <button
            onClick={login}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 transition-all"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎂</span>
          <div>
            <h1 className="font-black text-gray-800 text-lg leading-tight">Панель управления</h1>
            <p className="text-xs text-gray-400">{orders.length} заявок</p>
          </div>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem("admin_token"); setToken(""); setSelected(null); }}
          className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
        >
          <Icon name="LogOut" size={16} /> Выйти
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-6 flex gap-1">
        <button onClick={() => setTab("orders")} className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === "orders" ? "border-pink-500 text-pink-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
          📋 Заявки
        </button>
        <button onClick={() => setTab("portfolio")} className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === "portfolio" ? "border-pink-500 text-pink-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
          📸 Портфолио
        </button>
      </div>

      {/* Portfolio tab */}
      {tab === "portfolio" && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-black text-gray-800 text-xl">Фото портфолио</h2>
                <p className="text-gray-400 text-sm mt-1">Загруженные фото автоматически появятся в галерее на сайте</p>
              </div>
              <label className={`flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold text-sm cursor-pointer hover:from-pink-600 hover:to-orange-500 transition-all ${portfolioUploading ? "opacity-60 pointer-events-none" : ""}`}>
                <Icon name="Upload" size={16} />
                {portfolioUploading ? "Загружаем..." : "Добавить фото"}
                <input type="file" accept="image/*" className="hidden" onChange={uploadPortfolioPhoto} disabled={portfolioUploading} />
              </label>
            </div>
            {portfolioFiles.length === 0 ? (
              <div className="text-center py-20 text-gray-300">
                <Icon name="Image" size={48} className="mx-auto mb-3" />
                <p>Нет загруженных фото. Нажми «Добавить фото»!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {portfolioFiles.map(f => (
                  <div key={f.key} className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-square">
                    <img src={f.url} alt={f.key} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className={`flex flex-1 overflow-hidden ${tab !== "orders" ? "hidden" : ""}`} style={{ height: "calc(100vh - 113px)" }}>
        {/* LEFT: orders list */}
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-100 bg-white flex flex-col flex-shrink-0">
          <div className="p-4 space-y-2 border-b border-gray-100">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по имени или телефону..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white text-gray-700"
            >
              <option value="all">Все статусы</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-12">Заявок нет</div>
            )}
            {filtered.map(order => {
              const st = STATUS_LABELS[order.status] || STATUS_LABELS.new;
              const isActive = selected?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setSelected(order)}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${isActive ? "bg-pink-50 border-l-4 border-l-pink-400" : "hover:bg-gray-50"}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-gray-800 text-sm">{order.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${st.color}`}>{st.label}</span>
                  </div>
                  <div className="text-xs text-gray-400">{order.phone}</div>
                  {order.type && <div className="text-xs text-gray-500 mt-1 truncate">{order.type}</div>}
                  {order.estimatedPrice && <div className="text-xs text-pink-600 font-semibold mt-0.5">{order.estimatedPrice}</div>}
                  <div className="text-xs text-gray-300 mt-1">{new Date(order.createdAt).toLocaleString("ru")}</div>
                </div>
              );
            })}
          </div>
          <div className="p-4 border-t border-gray-100">
            <button onClick={loadOrders} className="w-full text-sm text-pink-500 hover:text-pink-700 flex items-center justify-center gap-1">
              <Icon name="RefreshCw" size={14} /> Обновить
            </button>
          </div>
        </div>

        {/* RIGHT: order detail + chat */}
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-gray-300 flex-col gap-3">
            <Icon name="MessageSquare" size={48} />
            <p className="text-lg">Выберите заявку слева</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Order info */}
            <div className="bg-white border-b border-gray-100 p-5 flex-shrink-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="font-black text-gray-800 text-lg">{selected.name}</h2>
                  <a href={`tel:${selected.phone}`} className="text-pink-500 text-sm hover:underline">{selected.phone}</a>
                </div>
                <select
                  value={selected.status}
                  onChange={e => updateStatus(selected.id, e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white"
                >
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                {selected.type && <span className="bg-gray-100 px-3 py-1 rounded-full">🎂 {selected.type}</span>}
                {selected.estimatedPrice && <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-semibold">{selected.estimatedPrice}</span>}
                {selected.date && <span className="bg-gray-100 px-3 py-1 rounded-full">📅 {selected.date}</span>}
                {selected.print && <span className="bg-gray-100 px-3 py-1 rounded-full">{selected.print === "С фотопечатью" ? "🖼️ С фотопечатью" : "🎂 Без печати"}</span>}
                {selected.kg && selected.kg !== "1" && <span className="bg-gray-100 px-3 py-1 rounded-full">⚖️ {selected.kg} кг</span>}
                {selected.qty && selected.qty !== "6" && <span className="bg-gray-100 px-3 py-1 rounded-full">🔢 {selected.qty} шт</span>}
                {selected.promo && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">🎟️ {selected.promo}</span>}
              </div>
              {selected.comment && (
                <p className="mt-2 text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2">{selected.comment}</p>
              )}
              {selected.photoUrl && (
                <a href={selected.photoUrl} target="_blank" rel="noopener noreferrer">
                  <img src={selected.photoUrl} alt="Фото для печати" className="mt-2 h-20 rounded-xl object-cover border border-pink-200 hover:opacity-80 transition-opacity" />
                </a>
              )}
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-gray-300 text-sm py-8">Сообщений пока нет. Напиши первой!</div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${msg.sender === "admin" ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"}`}>
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === "admin" ? "text-pink-100" : "text-gray-400"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply input */}
            <div className="bg-white border-t border-gray-100 p-4 flex gap-3">
              <input
                type="text"
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendReply()}
                placeholder="Напишите ответ покупателю..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
              />
              <button
                onClick={sendReply}
                disabled={!reply.trim() || sending}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold text-sm disabled:opacity-50 hover:from-pink-600 hover:to-orange-500 transition-all flex items-center gap-2"
              >
                <Icon name="Send" size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

}