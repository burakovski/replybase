export type Locale = "en" | "ru";

export const LOCALES: Locale[] = ["en", "ru"];
export const LOCALE_STORAGE_KEY = "replybase-locale";

export type Dictionary = {
  nav: {
    features: string;
    pricing: string;
    openApp: string;
    logIn: string;
    startFree: string;
    bots: string;
    billing: string;
    logOut: string;
  };
  theme: { light: string; dark: string; toggle: string };
  lang: { en: string; ru: string; toggle: string };
  landing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    livePreview: string;
    previewBot: string;
    ragReady: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    pillDocs: string;
    pillDocsSub: string;
    pillChat: string;
    pillChatSub: string;
    pillWidget: string;
    pillWidgetSub: string;
    featuresTitle: string;
    feature1Title: string;
    feature1Body: string;
    feature2Title: string;
    feature2Body: string;
    feature3Title: string;
    feature3Body: string;
    howTitle: string;
    stepLabel: string;
    steps: [string, string, string, string];
    pricingTitle: string;
    pricingSubtitle: string;
    choose: string;
    footerLeft: string;
    footerRight: string;
  };
  plans: Record<
    "free" | "starter" | "growth",
    { name: string; period: string; blurb: string; features: string[] }
  >;
  auth: {
    welcomeBack: string;
    createAccount: string;
    signupHint: string;
    email: string;
    password: string;
    passwordMin: string;
    name: string;
    workEmail: string;
    signingIn: string;
    logIn: string;
    creating: string;
    signUp: string;
    newHere: string;
    createAccountLink: string;
    haveAccount: string;
    logInLink: string;
    loginFailed: string;
    signupFailed: string;
  };
  app: {
    botsTitle: string;
    botsSubtitle: string;
    botNamePlaceholder: string;
    createBot: string;
    loading: string;
    noBots: string;
    open: string;
    createFailed: string;
    billingTitle: string;
    billingSubtitle: string;
    currentPlan: string;
    downgraded: string;
    upgraded: string;
    billingFailed: string;
    current: string;
    choosePlan: string;
    processing: string;
    created: string;
  };
};

const en: Dictionary = {
  nav: {
    features: "Features",
    pricing: "Pricing",
    openApp: "Open app",
    logIn: "Log in",
    startFree: "Start free",
    bots: "Bots",
    billing: "Billing",
    logOut: "Log out",
  },
  theme: { light: "Light", dark: "Dark", toggle: "Toggle theme" },
  lang: { en: "EN", ru: "RU", toggle: "Language" },
  landing: {
    eyebrow: "For SaaS teams shipping support without a ticket queue",
    title: "Turn your docs into an embeddable chatbot",
    subtitle:
      "Upload help articles and product guides. Replybase answers inside your app — and as a widget on your website — using only your knowledge base.",
    ctaPrimary: "Build your first bot",
    ctaSecondary: "See how it works",
    livePreview: "Live preview",
    previewBot: "Acme Docs Bot",
    ragReady: "RAG ready",
    q1: "How do I rotate API keys?",
    a1: "Open Settings → API Keys → Rotate. Old keys expire in 24 hours. Source: Security guide §4.",
    q2: "Can I embed this on our marketing site?",
    a2: "Yes — paste one script tag. Widget answers from the same docs.",
    pillDocs: "Docs",
    pillDocsSub: "upload",
    pillChat: "Chat",
    pillChatSub: "in-app",
    pillWidget: "Widget",
    pillWidgetSub: "embed",
    featuresTitle: "Focused MVP. No feature bloat.",
    feature1Title: "Docs → knowledge",
    feature1Body:
      "Paste help articles or policies. We chunk them for retrieval so answers stay grounded.",
    feature2Title: "ChatGPT-like chat",
    feature2Body:
      "Test the assistant inside the app before you show it to customers.",
    feature3Title: "One-line embed",
    feature3Body:
      "Drop a script on any site. Same bot, same knowledge, branded launcher.",
    howTitle: "How teams use it",
    stepLabel: "Step",
    steps: [
      "Create a bot for one product area",
      "Upload 3–10 core docs",
      "Ask hard questions in-app",
      "Embed on pricing / docs pages",
    ],
    pricingTitle: "Pricing",
    pricingSubtitle:
      "Paid plans unlock the embeddable widget. Billing in the app is a Stripe test mock — no live charges.",
    choose: "Choose",
    footerLeft: "Replybase — Paralect Product Academy test MVP",
    footerRight: "Niche: SaaS help docs → support chatbot",
  },
  plans: {
    free: {
      name: "Free",
      period: "forever",
      blurb: "Try Replybase on one help center.",
      features: [
        "1 chatbot",
        "Up to 3 documents",
        "50 chat replies / month",
        "In-app chat only",
      ],
    },
    starter: {
      name: "Starter",
      period: "/ month",
      blurb: "Ship an embeddable widget on your marketing site.",
      features: [
        "3 chatbots",
        "30 documents",
        "2,000 replies / month",
        "Embeddable website widget",
        "Custom brand color",
      ],
    },
    growth: {
      name: "Growth",
      period: "/ month",
      blurb: "For SaaS teams with multiple products or locales.",
      features: [
        "10 chatbots",
        "200 documents",
        "15,000 replies / month",
        "Embed widget + priority replies",
        "Remove Replybase badge",
      ],
    },
  },
  auth: {
    welcomeBack: "Welcome back",
    createAccount: "Create account",
    signupHint: "Start on Free. Upgrade later to unlock the embed widget.",
    email: "Email",
    password: "Password",
    passwordMin: "Password (min 6)",
    name: "Name",
    workEmail: "Work email",
    signingIn: "Signing in…",
    logIn: "Log in",
    creating: "Creating…",
    signUp: "Sign up",
    newHere: "New here?",
    createAccountLink: "Create account",
    haveAccount: "Already have an account?",
    logInLink: "Log in",
    loginFailed: "Login failed",
    signupFailed: "Signup failed",
  },
  app: {
    botsTitle: "Your chatbots",
    botsSubtitle: "One bot = one knowledge base. Keep scope tight.",
    botNamePlaceholder: "Bot name, e.g. Acme Help Center",
    createBot: "Create bot",
    loading: "Loading…",
    noBots: "No bots yet. Create one and upload a few docs.",
    open: "Open",
    createFailed: "Could not create bot",
    billingTitle: "Billing",
    billingSubtitle:
      "Stripe test mock — no live payments. Paid plans gate the embeddable widget.",
    currentPlan: "Current plan",
    downgraded: "Downgraded to Free.",
    upgraded: "Mock Stripe charge succeeded. Embed unlocked.",
    billingFailed: "Billing failed",
    current: "Current plan",
    choosePlan: "Choose",
    processing: "Processing…",
    created: "Created",
  },
};

const ru: Dictionary = {
  nav: {
    features: "Возможности",
    pricing: "Цены",
    openApp: "Открыть приложение",
    logIn: "Войти",
    startFree: "Начать бесплатно",
    bots: "Боты",
    billing: "Оплата",
    logOut: "Выйти",
  },
  theme: { light: "Светлая", dark: "Тёмная", toggle: "Сменить тему" },
  lang: { en: "EN", ru: "RU", toggle: "Язык" },
  landing: {
    eyebrow: "Для SaaS-команд, которым нужна поддержка без очереди тикетов",
    title: "Превратите документы в встраиваемого чат-бота",
    subtitle:
      "Загрузите help-статьи и гайды. Replybase отвечает внутри приложения и виджетом на сайте — только по вашей базе знаний.",
    ctaPrimary: "Создать первого бота",
    ctaSecondary: "Как это работает",
    livePreview: "Живой превью",
    previewBot: "Acme Docs Bot",
    ragReady: "RAG готов",
    q1: "Как ротировать API-ключи?",
    a1: "Откройте Settings → API Keys → Rotate. Старые ключи истекают через 24 часа. Источник: Security guide §4.",
    q2: "Можно встроить на маркетинговый сайт?",
    a2: "Да — один script-тег. Виджет отвечает по тем же документам.",
    pillDocs: "Docs",
    pillDocsSub: "загрузка",
    pillChat: "Чат",
    pillChatSub: "в приложении",
    pillWidget: "Виджет",
    pillWidgetSub: "embed",
    featuresTitle: "Сфокусированный MVP. Без лишних фич.",
    feature1Title: "Docs → знания",
    feature1Body:
      "Вставьте статьи или политики. Мы режем их на чанки для поиска — ответы остаются grounded.",
    feature2Title: "Чат как в ChatGPT",
    feature2Body:
      "Проверьте ассистента внутри приложения, прежде чем показывать клиентам.",
    feature3Title: "Embed в одну строку",
    feature3Body:
      "Вставьте скрипт на любой сайт. Тот же бот, те же знания, свой launcher.",
    howTitle: "Как этим пользуются команды",
    stepLabel: "Шаг",
    steps: [
      "Создайте бота под одну продуктовую область",
      "Загрузите 3–10 ключевых документов",
      "Задайте сложные вопросы в приложении",
      "Встройте на pricing / docs страницы",
    ],
    pricingTitle: "Цены",
    pricingSubtitle:
      "Платные тарифы открывают embed-виджет. Billing в приложении — mock Stripe, без реальных списаний.",
    choose: "Выбрать",
    footerLeft: "Replybase — тестовый MVP для Paralect Product Academy",
    footerRight: "Ниша: SaaS help docs → support-чатбот",
  },
  plans: {
    free: {
      name: "Free",
      period: "навсегда",
      blurb: "Попробуйте Replybase на одном help center.",
      features: [
        "1 чат-бот",
        "До 3 документов",
        "50 ответов в чате / месяц",
        "Только чат в приложении",
      ],
    },
    starter: {
      name: "Starter",
      period: "/ месяц",
      blurb: "Встраиваемый виджет на маркетинговый сайт.",
      features: [
        "3 чат-бота",
        "30 документов",
        "2 000 ответов / месяц",
        "Встраиваемый виджет",
        "Свой цвет бренда",
      ],
    },
    growth: {
      name: "Growth",
      period: "/ месяц",
      blurb: "Для SaaS-команд с несколькими продуктами или локалями.",
      features: [
        "10 чат-ботов",
        "200 документов",
        "15 000 ответов / месяц",
        "Embed + приоритетные ответы",
        "Без бейджа Replybase",
      ],
    },
  },
  auth: {
    welcomeBack: "С возвращением",
    createAccount: "Создать аккаунт",
    signupHint:
      "Старт на Free. Позже можно апгрейднуть и открыть embed-виджет.",
    email: "Email",
    password: "Пароль",
    passwordMin: "Пароль (мин. 6)",
    name: "Имя",
    workEmail: "Рабочий email",
    signingIn: "Входим…",
    logIn: "Войти",
    creating: "Создаём…",
    signUp: "Зарегистрироваться",
    newHere: "Впервые здесь?",
    createAccountLink: "Создать аккаунт",
    haveAccount: "Уже есть аккаунт?",
    logInLink: "Войти",
    loginFailed: "Не удалось войти",
    signupFailed: "Не удалось зарегистрироваться",
  },
  app: {
    botsTitle: "Ваши чат-боты",
    botsSubtitle: "Один бот = одна база знаний. Держите scope узким.",
    botNamePlaceholder: "Имя бота, напр. Acme Help Center",
    createBot: "Создать бота",
    loading: "Загрузка…",
    noBots: "Ботов пока нет. Создайте одного и загрузите несколько документов.",
    open: "Открыть",
    createFailed: "Не удалось создать бота",
    billingTitle: "Оплата",
    billingSubtitle:
      "Mock Stripe — без реальных платежей. Платные тарифы открывают embed-виджет.",
    currentPlan: "Текущий тариф",
    downgraded: "Понижено до Free.",
    upgraded: "Mock-оплата Stripe прошла. Embed разблокирован.",
    billingFailed: "Ошибка оплаты",
    current: "Текущий тариф",
    choosePlan: "Выбрать",
    processing: "Обработка…",
    created: "Создан",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, ru };

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "ru";
}
