import { useState } from "react";
import Icon from "@/components/ui/icon";

const CHEF_IMG = "https://cdn.poehali.dev/projects/1d79fd3e-3cad-4f78-b7a6-26bb28e80a0c/bucket/3ad6f483-671f-4031-bac3-5d4339ac9a35.jpg";
const ZEFIR_IMG = "https://cdn.poehali.dev/projects/1d79fd3e-3cad-4f78-b7a6-26bb28e80a0c/bucket/f1283524-b4f5-47bf-9adc-7260bab4c2a4.jpg";
const TORT_IMG = "https://cdn.poehali.dev/projects/1d79fd3e-3cad-4f78-b7a6-26bb28e80a0c/bucket/08e21a28-173c-4775-bccf-9f393db37c16.jpg";
const TORT1_IMG = "https://cdn.poehali.dev/projects/1d79fd3e-3cad-4f78-b7a6-26bb28e80a0c/bucket/caef53f9-cc63-4ec9-8ef5-30b791b0cce5.jpg";

const catalog = [
  { id: 1, name: "Торт на заказ", price: "от 2 500 ₽/кг", emoji: "🎂", tag: "Хит", desc: "Многоярусные, свадебные, детские — любой сложности и тематики" },
  { id: 2, name: "Капкейки", price: "300 ₽/шт", emoji: "🧁", tag: "Популярно", desc: "Нежное тесто, пышный крем — идеальны для праздничных наборов" },
  { id: 3, name: "Зефир", price: "2 000 ₽ (д. 20 см)", emoji: "🌸", tag: "Новинка", desc: "Нежный домашний зефир — букеты и наборы для подарков" },
  { id: 4, name: "Медовик", price: "2 500 ₽/кг", emoji: "🍯", tag: "Любимый", desc: "Классический медовый торт с нежным сметанным кремом" },
  { id: 5, name: "Трюфели", price: "150 ₽/шт", emoji: "🍫", tag: "Must Have", desc: "Бельгийский шоколад, насыщенная начинка, ручная лепка" },
  { id: 6, name: "Торт-цифра", price: "2 500 ₽/кг", emoji: "🔢", tag: "Тренд", desc: "Стильный торт в форме цифры с живыми цветами и декором" },
  { id: 7, name: "Праздничный набор", price: "от 3 500 ₽", emoji: "🎁", tag: "Набор", desc: "Капкейки + торт бенто в одном наборе — идеально для небольшого праздника" },
  { id: 9, name: "Свадебные торты", price: "от 2 500 ₽/кг", emoji: "💍", tag: "Для свадьбы", desc: "Многоярусные торты с живыми цветами, мастикой и авторским декором" },
  { id: 10, name: "Меренговый рулет", price: "1 800 ₽/кг", emoji: "🍥", tag: "Нежно", desc: "Воздушная меренга с нежным кремом — лёгкий и изысканный десерт" },
];

const portfolio = [
  { id: 1, img: "https://cdn.poehali.dev/projects/1d79fd3e-3cad-4f78-b7a6-26bb28e80a0c/bucket/212a2d6d-1ed3-4ca6-bafa-3d4607f66e1d.jpg", title: "Свадебный торт 6 ярусов", desc: "Мастика, живые цветы, ручная лепка" },
  { id: 2, img: ZEFIR_IMG, title: "Букет из зефира", desc: "Нежный подарок на любой повод" },
  { id: 3, img: TORT_IMG, title: "Торт с ягодами", desc: "Шоколадный дриппинг, клубника, голубика" },
  { id: 4, img: TORT1_IMG, title: "Именинный торт", desc: "Авторское оформление с надписью" },
  { id: 5, img: "https://cdn.poehali.dev/projects/1d79fd3e-3cad-4f78-b7a6-26bb28e80a0c/bucket/aa359a14-205e-424c-9785-124e72edaa48.jpg", title: "Меренговый рулет", desc: "С ягодами и нежным кремом" },
];

const services = [
  { icon: "Cake", title: "Торты на заказ", desc: "Свадебные, детские, юбилейные — воплощу любую идею" },
  { icon: "Heart", title: "Десерты для мероприятий", desc: "Полная комплектация стола сладостями для вашего праздника" },
  { icon: "Gift", title: "Подарочные наборы", desc: "Красиво упакованные наборы сладостей с персональной открыткой" },

  { icon: "Truck", title: "Доставка по Калининграду и области", desc: "Привезём ваш заказ в удобное время по городу и Калининградской области" },
];

const reviews = [
  { name: "Анна К.", text: "Заказывала торт на свадьбу — был просто восхитительным! Все гости восхищались вкусом и оформлением. Елена — настоящий мастер своего дела!", stars: 5 },
  { name: "Марина С.", text: "Брала капкейки для детского праздника, дети были в восторге. Красиво, вкусно, доставили вовремя. Буду заказывать ещё!", stars: 5 },
  { name: "Дмитрий П.", text: "Подарочный набор трюфелей маме на День Рождения. Она была тронута. Качество шоколада — отменное, упаковка роскошная.", stars: 5 },
  { name: "Светлана Р.", text: "Торт-цифра на юбилей был идеальным! Доставка строго в срок, вкус нежнейший. Рекомендую всем!", stars: 5 },
];

const faqs = [
  { q: "Как сделать предзаказ?", a: "Напишите мне в Telegram @dessert_nikitina или ВКонтакте, укажите дату, тип изделия и пожелания. Я рассчитаю стоимость и подтвержу заказ." },
  { q: "Есть ли доставка?", a: "Да, доставляю по всему Калининграду и Калининградской области. Стоимость зависит от района и удалённости. Самовывоз тоже доступен." },
  { q: "Можно ли указать аллергию или диетические требования?", a: "Обязательно! Работаю с безглютеновыми, без сахара и веганскими вариантами. Уточните при заказе." },
  { q: "Как происходит оплата?", a: "Предоплата 50% при подтверждении, остаток — при получении. Принимаю переводы на карту." },
];

const navItems = [
  { label: "Каталог", href: "#catalog" },
  { label: "Портфолио", href: "#portfolio" },
  { label: "Услуги", href: "#services" },
  { label: "Обо мне", href: "#about" },
  { label: "Отзывы", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакты", href: "#contacts" },
];

const ORDERS_URL = "https://functions.poehali.dev/657ce97d-c9a3-494e-ac00-38311c63a47e";
const REVIEWS_URL = "https://functions.poehali.dev/f390fd27-baad-4ac7-8dc8-a9eeae8be2bb";

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", date: "", type: "", comment: "", promo: "" });
  const [submitted, setSubmitted] = useState(false);
  const [userReviews, setUserReviews] = useState<{name: string; text: string; stars: number}[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: "", phone: "", text: "", stars: 5 });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const loadReviews = async () => {
    try {
      const res = await fetch(REVIEWS_URL);
      const data = await res.json();
      if (Array.isArray(data)) setUserReviews(data);
    } catch (e) {
      console.error(e);
    }
  };

  useState(() => { loadReviews(); });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError("");
    setReviewLoading(true);
    try {
      const res = await fetch(REVIEWS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setReviewError(data.error || "Ошибка");
      } else {
        setReviewForm({ name: "", phone: "", text: "", stars: 5 });
        setReviewSubmitted(true);
        loadReviews();
      }
    } catch (e) {
      console.error(e);
      setReviewError("Ошибка сети, попробуйте позже");
    }
    setReviewLoading(false);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
  };

  const VALID_PROMO = "ЗЕФИРНОЕ ЛЕТО";
  const promoValid = form.promo.trim() === VALID_PROMO;
  const promoEntered = form.promo.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(ORDERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch (e) {
      console.error(e);
    }
    setSubmitted(true);
  };

  return (
    <div className="font-body bg-white text-gray-900 overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <a href="#hero" className="flex items-center gap-2">
            <span className="text-2xl">🎂</span>
            <span className="font-display text-xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent">
              Елена Никитина
            </span>
          </a>
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((n) => (
              <button key={n.href} onClick={() => scrollTo(n.href)} className="text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors">
                {n.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setOrderOpen(true)}
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 transition-all shadow-lg shadow-pink-200"
          >
            <Icon name="ShoppingBag" size={16} />
            Заказать
          </button>
          <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-pink-100 px-4 py-4 flex flex-col gap-3">
            {navItems.map((n) => (
              <button key={n.href} onClick={() => { scrollTo(n.href); setMenuOpen(false); }} className="text-base font-medium text-gray-700 py-1 text-left">
                {n.label}
              </button>
            ))}
            <button
              onClick={() => { setOrderOpen(true); setMenuOpen(false); }}
              className="mt-2 w-full py-3 rounded-full font-bold text-white bg-gradient-to-r from-pink-500 to-orange-400"
            >
              Оформить заказ
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-pink-200/40 to-orange-200/30 blur-3xl -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-rose-200/30 to-pink-100/40 blur-3xl translate-y-1/4 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center py-20">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-sm font-semibold mb-6">
              <span>🍰</span> Волшебное лакомство из Калининграда
            </div>
            <h1 className="font-display text-5xl lg:text-7xl font-black leading-tight mb-6">
              Торты и{" "}
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 bg-clip-text text-transparent">
                сладости
              </span>{" "}
              с душой
            </h1>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-lg">
              Авторские торты на заказ, капкейки, макаруны и десерты для ваших особых моментов. Доставка по Калининграду.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setOrderOpen(true)}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-lg bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 transition-all shadow-xl shadow-pink-300/50"
              >
                <Icon name="Sparkles" size={20} />
                Сделать предзаказ
              </button>
              <button
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-pink-600 text-lg bg-white border-2 border-pink-200 hover:border-pink-400 transition-all"
              >
                Смотреть каталог
              </button>
            </div>
            <div className="mt-10 flex items-center gap-8">
              <div className="text-center">
                <div className="font-display text-3xl font-black text-pink-500">5+</div>
                <div className="text-sm text-gray-400">лет опыта</div>
              </div>
              <div className="w-px h-10 bg-pink-100" />
              <div className="text-center">
                <div className="font-display text-3xl font-black text-rose-500">500+</div>
                <div className="text-sm text-gray-400">заказов</div>
              </div>
              <div className="w-px h-10 bg-pink-100" />
              <div className="text-center">
                <div className="font-display text-3xl font-black text-orange-400">100%</div>
                <div className="text-sm text-gray-400">натурально</div>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-orange-300 rounded-3xl blur-2xl opacity-30 scale-105" />
              <img
                src="https://cdn.poehali.dev/projects/1d79fd3e-3cad-4f78-b7a6-26bb28e80a0c/bucket/212a2d6d-1ed3-4ca6-bafa-3d4607f66e1d.jpg"
                alt="Елена Никитина — кондитер"
                className="relative w-full h-[520px] object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-pink-50">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">5.0 рейтинг</div>
                    <div className="text-xs text-gray-400">200+ отзывов</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-600 text-sm font-semibold mb-4">
              🍬 Каталог
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black">Торты и сладости</h2>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">Всё готовится вручную из натуральных ингредиентов</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalog.map((item) => (
              <div key={item.id} className="group relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-6 hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 border border-pink-100 hover:border-pink-200 hover:-translate-y-1">
                {item.tag && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {item.tag}
                  </span>
                )}
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3 className="font-display text-xl font-bold mb-1">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-pink-600 text-lg">{item.price}</span>
                  <button
                    onClick={() => setOrderOpen(true)}
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-white border-2 border-pink-200 text-pink-600 text-sm font-semibold hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all"
                  >
                    Заказать
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" className="py-24 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-4">
              📸 Портфолио
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black">Готовые работы</h2>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">Каждый заказ — отдельная история и особый повод</p>
          </div>
          {/* VIDEO REELS */}
          <div className="mb-10 flex justify-center gap-6 flex-wrap">
            <div className="relative w-[280px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white" style={{aspectRatio: '9/16'}}>
              <iframe
                src="https://vk.com/video_ext.php?oid=157357002&id=456239081&hd=2"
                width="100%"
                height="100%"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="relative w-[280px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white" style={{aspectRatio: '9/16'}}>
              <iframe
                src="https://vk.com/video_ext.php?oid=157357002&id=456239157&hd=2"
                width="100%"
                height="100%"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {portfolio.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-2xl cursor-pointer">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <h3 className="text-white font-bold text-sm">{item.title}</h3>
                  <p className="text-white/70 text-xs mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="https://vk.com/id157357002"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
            >
              <Icon name="ExternalLink" size={18} />
              Смотреть все работы ВКонтакте
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 text-sm font-semibold mb-4">
              ✨ Услуги
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black">Что я делаю</h2>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">Полный спектр кондитерских услуг для любого события</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-3xl bg-gradient-to-br from-gray-50 to-pink-50/50 border border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                  <Icon name={s.icon} size={22} className="text-white" fallback="Star" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-rose-300 rounded-3xl blur-2xl opacity-20 scale-105" />
            <img
              src={CHEF_IMG}
              alt="Елена Никитина — кондитер"
              className="relative w-full h-[500px] object-cover rounded-3xl shadow-2xl"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-sm font-semibold mb-6">
              👩‍🍳 О кондитере
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black mb-6">Привет! Я — Елена</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Кондитер из Калининграда с более чем 5-летним опытом создания авторских тортов и десертов. Каждое изделие — это маленькое произведение искусства, сделанное с любовью и вниманием к деталям.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Я использую только натуральные ингредиенты, без консервантов. Для меня важно, чтобы каждый клиент получил именно то, о чём мечтал — будь то свадебный торт или скромный подарок любимому человеку.
            </p>
            <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6 mb-8 space-y-4">
              <p className="text-gray-700 text-base leading-relaxed">
                🇮🇹 <span className="font-semibold">Моей гордостью</span> было изготовление торта в Италии, на вилле Санта Барбара. Его высота была <span className="font-bold text-pink-500">1.72 м!</span>
              </p>
              <p className="text-gray-700 text-base leading-relaxed">
                🌸 А сейчас я делаю особенно много <span className="font-semibold">зефирных букетов</span> — особенно к праздникам. Это моя фишка и настоящая любовь! Вариантов огромное множество, а изготовление — быстрое.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Натуральные ингредиенты", icon: "Leaf" },
                { label: "Индивидуальный подход", icon: "Heart" },
                { label: "Доставка по городу", icon: "Truck" },
                { label: "Любая сложность", icon: "Sparkles" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-pink-100">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={16} className="text-white" fallback="Check" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-600 text-sm font-semibold mb-4">
              ⭐ Отзывы
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black">Говорят клиенты</h2>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">Более 200 довольных клиентов по всему Калининграду</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...userReviews, ...reviews].map((r, i) => (
              <div key={i} className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-6 border border-pink-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <span key={j} className="text-orange-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm">
                    {r.name[0]}
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">{r.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* REVIEW FORM */}
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 border border-pink-100">
            <h3 className="font-display text-2xl font-bold mb-2 text-center">Оставить отзыв</h3>
            <p className="text-gray-400 text-sm text-center mb-1">Поделитесь впечатлениями — это важно для нас!</p>
            <p className="text-gray-400 text-xs text-center mb-6">Отзыв могут оставить только клиенты, оформившие заказ</p>
            {reviewSubmitted ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🙏</div>
                <p className="font-bold text-gray-800">Спасибо за отзыв!</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label>
                    <input
                      type="text"
                      required
                      value={reviewForm.name}
                      onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                      placeholder="Как вас зовут?"
                      className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Телефон из заказа</label>
                    <input
                      type="tel"
                      required
                      value={reviewForm.phone}
                      onChange={e => setReviewForm({ ...reviewForm, phone: e.target.value })}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Оценка</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, stars: star })}
                        className={`text-3xl transition-transform hover:scale-110 ${star <= reviewForm.stars ? 'text-orange-400' : 'text-gray-200'}`}
                      >★</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ваш отзыв</label>
                  <textarea
                    required
                    value={reviewForm.text}
                    onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })}
                    placeholder="Расскажите о вашем заказе..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 resize-none"
                  />
                </div>
                {reviewError && (
                  <p className="text-red-500 text-sm text-center">❌ {reviewError}</p>
                )}
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 transition-all shadow-lg shadow-pink-200 disabled:opacity-60"
                >
                  {reviewLoading ? "Отправляем..." : "Отправить отзыв"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* PREORDER CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 p-12 text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <div className="text-5xl mb-6">🎂</div>
              <h2 className="font-display text-3xl lg:text-5xl font-black text-white mb-4">Готовы сделать заказ?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Оставьте заявку сейчас и выберите удобную дату доставки. Отвечаю быстро!</p>
              <button
                onClick={() => setOrderOpen(true)}
                className="inline-flex items-center gap-2 px-10 py-5 rounded-full font-bold text-pink-600 text-lg bg-white hover:bg-pink-50 transition-all shadow-xl"
              >
                <Icon name="Sparkles" size={22} />
                Оформить предзаказ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-sm font-semibold mb-4">
              💬 FAQ
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black">Частые вопросы</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-gray-800 pr-4">{item.q}</span>
                  <Icon
                    name={openFaq === i ? "ChevronUp" : "ChevronDown"}
                    size={20}
                    className="flex-shrink-0 text-pink-400"
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-pink-50 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-600 text-sm font-semibold mb-4">
              📍 Контакты
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-black">Напишите мне</h2>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">Отвечаю в течение нескольких часов</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <a
                href="tel:+79118542528"
                className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 hover:border-pink-300 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <Icon name="Phone" size={22} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-0.5">Телефон</div>
                  <div className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors">+7 911 854-25-28</div>
                </div>
                <Icon name="ChevronRight" size={18} className="ml-auto text-gray-300 group-hover:text-pink-400" />
              </a>
              <a
                href="https://t.me/dessert_nikitina"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center">
                  <Icon name="Send" size={22} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-0.5">Telegram</div>
                  <div className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">@dessert_nikitina</div>
                </div>
                <Icon name="ChevronRight" size={18} className="ml-auto text-gray-300 group-hover:text-blue-400" />
              </a>
              <a
                href="https://vk.com/id157357002"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Icon name="Users" size={22} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-0.5">ВКонтакте</div>
                  <div className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">vk.com/id157357002</div>
                </div>
                <Icon name="ChevronRight" size={18} className="ml-auto text-gray-300 group-hover:text-blue-500" />
              </a>
              <a
                href="https://www.instagram.com/dessert_nikitina"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-100 hover:border-pink-300 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 flex items-center justify-center">
                  <Icon name="Instagram" size={22} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-0.5">Instagram</div>
                  <div className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors">@dessert_nikitina</div>
                </div>
                <Icon name="ChevronRight" size={18} className="ml-auto text-gray-300 group-hover:text-pink-400" />
              </a>
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <Icon name="MapPin" size={22} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-0.5">Город</div>
                  <div className="font-bold text-gray-800">Калининград</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 border border-pink-100">
              <h3 className="font-display text-2xl font-bold mb-6">Оставьте заявку</h3>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🎉</div>
                  <h4 className="font-bold text-xl text-gray-800 mb-2">Заявка отправлена!</h4>
                  <p className="text-gray-500">Елена свяжется с вами в ближайшее время</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Как вас зовут?"
                      className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий</label>
                    <textarea
                      value={form.comment}
                      onChange={e => setForm({ ...form, comment: e.target.value })}
                      placeholder="Что хотите заказать? Дата, пожелания..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Промокод</label>
                    <input
                      type="text"
                      value={form.promo}
                      onChange={e => setForm({ ...form, promo: e.target.value.toUpperCase() })}
                      placeholder="Введите промокод (если есть)"
                      className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 text-gray-800 tracking-widest font-mono transition-all ${promoEntered ? promoValid ? 'border-green-400 focus:ring-green-300' : 'border-red-300 focus:ring-red-200' : 'border-pink-200 focus:ring-pink-300'}`}
                    />
                    {promoEntered && promoValid && (
                      <p className="mt-1.5 text-green-600 text-sm font-semibold flex items-center gap-1">🎉 Промокод применён — скидка 15%!</p>
                    )}
                    {promoEntered && !promoValid && (
                      <p className="mt-1.5 text-red-400 text-sm flex items-center gap-1">❌ Промокод не найден</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 transition-all shadow-lg shadow-pink-200"
                  >
                    Отправить заявку
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🎂</span>
            <span className="font-display text-xl font-bold bg-gradient-to-r from-pink-400 to-orange-300 bg-clip-text text-transparent">
              Елена Никитина
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-6">Кондитер из Калининграда · Авторские торты и десерты</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="tel:+79118542528" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">+7 911 854-25-28</a>
            <span className="text-gray-700">·</span>
            <a href="https://t.me/dessert_nikitina" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Telegram</a>
            <span className="text-gray-700">·</span>
            <a href="https://vk.com/id157357002" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">ВКонтакте</a>
            <span className="text-gray-700">·</span>
            <a href="https://www.instagram.com/dessert_nikitina" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">Instagram</a>
          </div>
          <p className="text-gray-600 text-xs mt-8">© 2024 Елена Никитина. Все права защищены.</p>
        </div>
      </footer>

      {/* PREORDER MODAL */}
      {orderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-orange-400 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold">Предзаказ 🎂</h2>
                <button onClick={() => setOrderOpen(false)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Icon name="X" size={18} />
                </button>
              </div>
              <p className="text-white/80 text-sm mt-1">Выберите дату и укажите детали</p>
            </div>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🎉</div>
                  <h4 className="font-bold text-xl text-gray-800 mb-2">Заявка принята!</h4>
                  <p className="text-gray-500 mb-6">Елена свяжется с вами в ближайшее время</p>
                  <button onClick={() => { setOrderOpen(false); setSubmitted(false); }} className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-pink-500 to-orange-400">
                    Закрыть
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Ваше имя"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+7 (___) ___-__-__"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Дата доставки</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      min={new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Тип изделия</label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 bg-white"
                    >
                      <option value="">Выберите...</option>
                      <option>Торт на заказ</option>
                      <option>Капкейки</option>
                      <option>Зефир</option>
                      <option>Медовик</option>
                      <option>Трюфели</option>
                      <option>Торт-цифра</option>
                      <option>Праздничный набор</option>
                      <option>Свадебный торт</option>
                      <option>Меринговый рулет</option>
                      <option>Другое</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Пожелания и персонализация</label>
                    <textarea
                      value={form.comment}
                      onChange={e => setForm({ ...form, comment: e.target.value })}
                      placeholder="Тематика, цвет, надпись, количество порций, аллергии..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-800 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Промокод</label>
                    <input
                      type="text"
                      value={form.promo}
                      onChange={e => setForm({ ...form, promo: e.target.value.toUpperCase() })}
                      placeholder="Введите промокод (если есть)"
                      className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 text-gray-800 tracking-widest font-mono transition-all ${promoEntered ? promoValid ? 'border-green-400 focus:ring-green-300' : 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-pink-300'}`}
                    />
                    {promoEntered && promoValid && (
                      <p className="mt-1.5 text-green-600 text-sm font-semibold flex items-center gap-1">🎉 Промокод применён — скидка 15%!</p>
                    )}
                    {promoEntered && !promoValid && (
                      <p className="mt-1.5 text-red-400 text-sm flex items-center gap-1">❌ Промокод не найден</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 transition-all shadow-lg shadow-pink-200"
                  >
                    Отправить заявку
                  </button>
                  <p className="text-center text-xs text-gray-400">Минимальный срок заказа торта — 3 дня</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}