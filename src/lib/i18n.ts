export type Locale = "en" | "ru";

export const LOCALES: Locale[] = ["en", "ru"];
export const LOCALE_STORAGE_KEY = "replybase-locale";

export type Dictionary = {
  nav: {
    product: string;
    pricing: string;
    faq: string;
    openApp: string;
    logIn: string;
    startFree: string;
    bots: string;
    billing: string;
    logOut: string;
    myBots: string;
    planBilling: string;
    upgradePlan: string;
    online: string;
    logOutAccount: string;
  };
  theme: { toggle: string };
  lang: { en: string; ru: string; toggle: string };
  landing: {
    eyebrow: string;
    title: string;
    titleLead: string;
    titleMark: string;
    titleMid: string;
    titleUnderlineA: string;
    titleUnderlineB: string;
    titleTail: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    heroNote: string;
    trustLine: string;
    trust1: string;
    trust2: string;
    trust3: string;
    problemEyebrow: string;
    problemTitleLead: string;
    problemTitleHighlightA: string;
    problemTitleMid: string;
    problemTitleHighlightB: string;
    problemTitleTail: string;
    problemSub: string;
    problemImageAlt: string;
    planIncludes: string;
    howTitle: string;
    steps: { title: string; body: string }[];
    featuresTitle: string;
    featuresSubtitle: string;
    featuresImageAlt: string;
    featuresReadMore: string;
    features: { title: string; body: string }[];
    modelsEyebrow: string;
    modelsTitle: string;
    modelsBody: string;
    modelsFootnote: string;
    useCasesTitle: string;
    useCases: { title: string; body: string }[];
    pricingTitle: string;
    pricingSubtitle: string;
    pricingNote: string;
    contactUs: string;
    faqTitle: string;
    faqs: { q: string; a: string }[];
    stillQuestions: string;
    stillQuestionsHint: string;
    emailPlaceholder: string;
    contactSubject: string;
    sendQuestion: string;
    thanksContact: string;
    finalTitle: string;
    finalCta: string;
    finalNote: string;
    previewBot: string;
    previewOnline: string;
    previewSource: string;
    previewAsk: string;
    previewSend: string;
    q1: string;
    a1: string;
    a1Source: string;
    q2: string;
    a2: string;
    a2Source: string;
    q3: string;
    a3: string;
    footerProduct: string;
    footerPricing: string;
    footerFaq: string;
    footerContact: string;
    footerPrint: string;
  };
  plans: Record<
    "free" | "starter" | "growth",
    {
      name: string;
      period: string;
      blurb: string;
      features: string[];
      cta: string;
    }
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
    confirmTitle: string;
    confirmHint: string;
    codeLabel: string;
    codePlaceholder: string;
    verifying: string;
    verify: string;
    resendCode: string;
    resending: string;
    resent: string;
    resendIn: string;
    verifyFailed: string;
    emailNotConfirmed: string;
    changeEmail: string;
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
    botNameTooShort: string;
    billingTitle: string;
    billingSubtitle: string;
    explorePlans: string;
    comparePlans: string;
    compareAllPlans: string;
    yourCurrentPlan: string;
    upgrade: string;
    popular: string;
    includes: string;
    everythingIn: string;
    billedMonthly: string;
    perMonth: string;
    embedUpsellTitle: string;
    embedUpsellBody: string;
    currentPlan: string;
    currentPlanLabel: string;
    billingMockNote: string;
    downgraded: string;
    upgraded: string;
    billingFailed: string;
    charLimitHint: string;
    current: string;
    choosePlan: string;
    processing: string;
    created: string;
    backToBots: string;
    myBots: string;
    managePlan: string;
    upgradeForEmbed: string;
    editBot: string;
    editBotTitle: string;
    botNameLabel: string;
    saveBotName: string;
    savingBotName: string;
    deleteBot: string;
    deletingBot: string;
    deleteBotConfirm: string;
    renameFailed: string;
    deleteFailed: string;
    documentsTitle: string;
    documentsHint: string;
    docTitlePlaceholder: string;
    docContentPlaceholder: string;
    pasteOrDescribe: string;
    instructionsTitle: string;
    instructionsHint: string;
    toneTitle: string;
    instructionsPlaceholder: string;
    fallbackTitle: string;
    fallbackPlaceholder: string;
    instructionsSave: string;
    instructionsSaving: string;
    instructionsSaved: string;
    instructionsCancel: string;
    instructionsFailed: string;
    attachFile: string;
    attachHint: string;
    dropHint: string;
    uploading: string;
    fileReadFailed: string;
    fileTooShort: string;
    fileTooLarge: string;
    uploadIndex: string;
    deleteDoc: string;
    viewDoc: string;
    closeDoc: string;
    noDocuments: string;
    chatTitle: string;
    chatPlaceholder: string;
    send: string;
    noAnswer: string;
    contactOperator: string;
    contactOperatorSubject: string;
    contactOperatorSent: string;
    embedTitle: string;
    embedHintLead: string;
    embedHintTrail: string;
    openPlayground: string;
    copyCode: string;
    copied: string;
    embedGated: string;
    upgradeMock: string;
    unlockScript: string;
    loadFailed: string;
    uploadFailed: string;
    chatFailed: string;
  };
};

const en: Dictionary = {
  nav: {
    product: "Product",
    pricing: "Pricing",
    faq: "FAQ",
    openApp: "Open app",
    logIn: "Log in",
    startFree: "Start free",
    bots: "Bots",
    billing: "Billing",
    logOut: "Log out",
    myBots: "My bots",
    planBilling: "Plan & billing",
    upgradePlan: "Upgrade plan",
    online: "Online",
    logOutAccount: "Log out",
  },
  theme: { toggle: "Toggle theme" },
  lang: { en: "EN", ru: "RU", toggle: "Language" },
  landing: {
    eyebrow:
      "For SaaS teams tired of answering the same 20 questions in support",
    title: "Turn your docs into a support agent that actually knows your product",
    titleLead: "Turn ",
    titleMark: "your docs",
    titleMid: " into a ",
    titleUnderlineA: "support",
    titleUnderlineB: "agent",
    titleTail: " that actually knows your product",
    subtitle:
      "Upload your help center, API docs, or product guides. Replybase answers questions inside your app and on your website — using only what you gave it, nothing invented.",
    ctaPrimary: "Start free — no credit card",
    ctaSecondary: "See pricing",
    heroNote: "Free plan includes 1 bot, 3 documents, 50 replies/month.",
    trustLine:
      "Answers are grounded in your documents. If it's not in your docs, Replybase says so instead of guessing.",
    trust1: "Retrieval-based, not open-ended",
    trust2: "Sources shown with every answer",
    trust3: "No hallucinated pricing, policies, or steps",
    problemEyebrow: "The old way",
    problemTitleLead: "Now you",
    problemTitleHighlightA: "don’t have to choose",
    problemTitleMid: "between",
    problemTitleHighlightB: "generic AI chatbots",
    problemTitleTail: " and endless FAQ tickets.",
    problemSub:
      "We finally built a support agent that only answers from your docs.",
    problemImageAlt:
      "Desk with help docs and a laptop — the same support questions keep coming back",
    planIncludes: "plan includes",
    howTitle: "From docs to deployed bot in under 10 minutes",
    steps: [
      {
        title: "Upload your docs",
        body: "Paste help articles, policies, or product guides. Replybase chunks and indexes them for retrieval.",
      },
      {
        title: "Test it like a user would",
        body: "Ask hard questions in the built-in chat before anyone else sees it.",
      },
      {
        title: "Embed it anywhere",
        body: "One script tag. Same bot, same knowledge, your branding.",
      },
      {
        title: "See what people actually ask",
        body: "Every conversation is logged so you know what's missing from your docs.",
      },
    ],
    featuresTitle: "Built for teams who already have documentation",
    featuresSubtitle:
      "Grounded support infrastructure you can ship in days, not quarters",
    featuresImageAlt:
      "Documentation on screen with a chat widget answering from the knowledge base",
    featuresReadMore: "Learn more",
    features: [
      {
        title: "Grounded answers, not guesses",
        body: "Replybase only answers from what you upload. When it doesn't know, it says so and can hand off to a human — instead of making something up.",
      },
      {
        title: "Embed widget that matches your brand",
        body: "One line of code adds a chat launcher to any page. Custom color, custom name, no visible “powered by” on paid plans.",
      },
      {
        title: "Conversation history you can learn from",
        body: "Every question is logged. Use it to find gaps in your docs before customers complain about them.",
      },
      {
        title: "Multiple bots, one account",
        body: "Run a separate bot per product, plan tier, or language without duplicating setup.",
      },
    ],
    modelsEyebrow: "Supported models",
    modelsTitle: "Bring the model your team already trusts",
    modelsBody:
      "Retrieval and grounding work the same no matter which model answers. Choose OpenAI, Anthropic, or Google Gemini per bot — switch anytime, no re-indexing your docs.",
    modelsFootnote: "+ Bring your own API key on the Growth plan",
    useCasesTitle: "Where teams put Replybase",
    useCases: [
      {
        title: "Docs pages",
        body: "Answer “how do I…” questions without a support ticket.",
      },
      {
        title: "Pricing pages",
        body: "Handle plan and feature questions before a sales call.",
      },
      {
        title: "In-app help",
        body: "Replace a stale FAQ modal with something that actually answers.",
      },
      {
        title: "Onboarding",
        body: "New users get unstuck without waiting on support hours.",
      },
    ],
    pricingTitle: "Pick a pricing that fits your needs",
    pricingSubtitle:
      "Every plan starts free to try. Upgrade when you need the embed widget — Stripe test mode in this demo.",
    pricingNote: "Need more documents or replies?",
    contactUs: "Contact us",
    faqTitle: "FAQ",
    faqs: [
      {
        q: "Will it make things up?",
        a: "No. Replybase only answers from documents you upload. If the answer isn't in your docs, it says so instead of guessing.",
      },
      {
        q: "Do I need a developer to embed it?",
        a: "No. One script tag on any page. Most teams add it themselves in a few minutes.",
      },
      {
        q: "Can I see what people are asking?",
        a: "Yes. Every conversation is logged in your dashboard so you can spot gaps in your documentation.",
      },
      {
        q: "What happens if I go over my plan's limits?",
        a: "You'll get a warning before hitting the cap, with an option to upgrade — the bot won't just stop answering mid-month.",
      },
      {
        q: "Is my data used to train any models?",
        a: "No. Your documents are only used to answer questions inside your account.",
      },
    ],
    stillQuestions: "Still have questions?",
    stillQuestionsHint: "Leave your email — we'll get back within one business day.",
    emailPlaceholder: "you@company.com",
    contactSubject: "Replybase question",
    sendQuestion: "Send",
    thanksContact: "Thanks — your mail client should open next.",
    finalTitle: "Your docs already have the answers. Let them work.",
    finalCta: "Start free — no credit card",
    finalNote: "Free plan is enough to test on one help center today.",
    previewBot: "Acme Docs Bot",
    previewOnline: "Online",
    previewSource: "Source:",
    previewAsk: "Ask from your docs…",
    previewSend: "Send",
    q1: "How do I rotate API keys?",
    a1: "Open Settings → API Keys → Rotate. Old keys expire after 24 hours.",
    a1Source: "Security guide, §4 Key rotation",
    q2: "Can I embed this on our marketing site?",
    a2: "Yes — paste one script tag in your site's <head>. Same bot, same knowledge base, no separate setup.",
    a2Source: "Getting started, §2 Embedding",
    q3: "Do you support SSO login?",
    a3: "Not in your docs yet. I can flag this for your team, or you can add it to the knowledge base.",
    footerProduct: "Product",
    footerPricing: "Pricing",
    footerFaq: "FAQ",
    footerContact: "Contact",
    footerPrint:
      "Built as a product MVP for Paralect Product Academy — billing runs on Stripe test mode, no live charges.",
  },
  plans: {
    free: {
      name: "Free",
      period: "",
      blurb: "For trying Replybase on one help center.",
      features: [
        "1 chatbot",
        "Up to 3 documents",
        "50 replies / month",
        "In-app chat only",
      ],
      cta: "Start free",
    },
    starter: {
      name: "Starter",
      period: "/mo",
      blurb: "For shipping your first embeddable widget.",
      features: [
        "3 chatbots",
        "30 documents",
        "2,000 replies / month",
        "Embeddable website widget",
        "Custom brand color",
      ],
      cta: "Choose Starter",
    },
    growth: {
      name: "Growth",
      period: "/mo",
      blurb: "For teams with multiple products or languages.",
      features: [
        "10 chatbots",
        "200 documents",
        "15,000 replies / month",
        "Priority response speed",
        "Remove Replybase badge",
      ],
      cta: "Choose Growth",
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
    creating: "Creating account…",
    signUp: "Sign up",
    newHere: "New here?",
    createAccountLink: "Create account",
    haveAccount: "Already have an account?",
    logInLink: "Log in",
    loginFailed: "Login failed",
    signupFailed: "Signup failed",
    confirmTitle: "Enter confirmation code",
    confirmHint: "We sent a code to {email}. Enter it to finish signup.",
    codeLabel: "Confirmation code",
    codePlaceholder: "6-digit code",
    verifying: "Verifying…",
    verify: "Confirm",
    resendCode: "Resend code",
    resending: "Sending…",
    resent: "Code sent again",
    resendIn: "Resend in {s}s",
    verifyFailed: "Incorrect code",
    emailNotConfirmed: "Confirm your email with the code we sent you.",
    changeEmail: "Use a different email",
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
    botNameTooShort: "Bot name must be at least 2 characters.",
    billingTitle: "Plan & billing",
    billingSubtitle:
      "Upgrade to unlock the embeddable widget. Billing runs in Stripe test mode — no live charges.",
    explorePlans: "Explore plans",
    comparePlans: "Compare all Replybase plans",
    compareAllPlans: "Compare all plans",
    yourCurrentPlan: "Your current plan",
    upgrade: "Upgrade",
    popular: "Popular",
    includes: "Includes",
    everythingIn: "Everything in",
    billedMonthly: "billed monthly",
    perMonth: "per workspace / month",
    embedUpsellTitle: "Embed widget",
    embedUpsellBody:
      "Upgrade to put your bot on any website with one script tag.",
    currentPlan: "Current plan",
    currentPlanLabel: "You’re on",
    billingMockNote: "Mock Stripe — no live charges",
    downgraded: "You’re back on the Free plan.",
    upgraded: "Payment went through. The embed widget is unlocked.",
    billingFailed: "Couldn’t change the plan. Try again.",
    charLimitHint: "No more than {n} characters.",
    current: "Current plan",
    choosePlan: "Downgrade",
    processing: "Processing…",
    created: "Created",
    backToBots: "← All bots",
    myBots: "My bots",
    managePlan: "Manage plan",
    upgradeForEmbed: "Upgrade for embed",
    editBot: "Edit",
    editBotTitle: "Edit bot",
    botNameLabel: "Bot name",
    saveBotName: "Save name",
    savingBotName: "Saving…",
    deleteBot: "Delete bot",
    deletingBot: "Deleting…",
    deleteBotConfirm:
      "Delete this bot and all its documents? This can’t be undone.",
    renameFailed: "Couldn’t rename the bot.",
    deleteFailed: "Couldn’t delete the bot.",
    documentsTitle: "Documents",
    documentsHint:
      "Knowledge only — articles the bot can quote. Tone and the “no match” reply are in Instructions above.",
    docTitlePlaceholder: "Document title",
    docContentPlaceholder:
      "Paste the article text.\n\nHeadings and numbered steps help the bot find the right passage.",
    pasteOrDescribe: "or describe the document",
    instructionsTitle: "Instructions",
    instructionsHint:
      "Tone is for answers from your docs. Fallback is what the bot says when nothing matches — the contact-operator button still appears.",
    toneTitle: "Tone",
    instructionsPlaceholder:
      "Short, polite. Prices only from the docs.",
    fallbackTitle: "If the answer isn’t in the docs",
    fallbackPlaceholder:
      "Not in the knowledge base. Rephrase or contact an operator.",
    instructionsSave: "Save",
    instructionsSaving: "Saving…",
    instructionsSaved: "Saved",
    instructionsCancel: "Cancel",
    instructionsFailed: "Could not save instructions",
    attachFile: "Attach file",
    attachHint: ".txt, .md, .csv, .json, .pdf, .docx",
    dropHint: "Drop file to attach",
    uploading: "Uploading…",
    fileReadFailed:
      "Could not read that file. Use txt, md, pdf, or docx.",
    fileTooShort: "File is too short (need at least 20 characters).",
    fileTooLarge: "File is too large (max 4 MB).",
    uploadIndex: "Add",
    deleteDoc: "Delete",
    viewDoc: "Open document",
    closeDoc: "Close",
    noDocuments: "No documents yet.",
    chatTitle: "In-app chat",
    chatPlaceholder: "Ask from your docs…",
    send: "Send",
    noAnswer:
      "I can't answer that right now. Please rephrase your question or contact an operator.",
    contactOperator: "Contact operator",
    contactOperatorSubject: "Support request from Replybase chat",
    contactOperatorSent: "Request marked for the operator.",
    embedTitle: "Embeddable widget",
    embedHintLead: "Paste this before",
    embedHintTrail: "on any site.",
    openPlayground: "Open widget playground",
    copyCode: "Copy code",
    copied: "Copied",
    embedGated: "Embed is gated behind Starter/Growth.",
    upgradeMock: "Upgrade with mock Stripe",
    unlockScript: "to unlock the script tag.",
    loadFailed: "Failed to load",
    uploadFailed: "Upload failed",
    chatFailed: "Chat failed",
  },
};

const ru: Dictionary = {
  nav: {
    product: "Продукт",
    pricing: "Цены",
    faq: "FAQ",
    openApp: "Открыть приложение",
    logIn: "Войти",
    startFree: "Начать бесплатно",
    bots: "Боты",
    billing: "Оплата",
    logOut: "Выйти",
    myBots: "Мои боты",
    planBilling: "Тариф и оплата",
    upgradePlan: "Upgrade plan",
    online: "Online",
    logOutAccount: "Выйти из аккаунта",
  },
  theme: { toggle: "Сменить тему" },
  lang: { en: "EN", ru: "RU", toggle: "Язык" },
  landing: {
    eyebrow:
      "Для SaaS-команд, которым надоело отвечать на одни и те же 20 вопросов в поддержке",
    title:
      "Превратите документы в агента поддержки, который реально знает ваш продукт",
    titleLead: "Превратите ",
    titleMark: "ваши документы",
    titleMid: " в ",
    titleUnderlineA: "агента",
    titleUnderlineB: "поддержки",
    titleTail: ", который реально знает ваш продукт",
    subtitle:
      "Загрузите help center, API-доки или продуктовые гайды. Replybase отвечает внутри приложения и на сайте — только по тому, что вы загрузили, без выдумок.",
    ctaPrimary: "Начать бесплатно — без карты",
    ctaSecondary: "Смотреть тарифы",
    heroNote: "Free: 1 бот, 3 документа, 50 ответов в месяц.",
    trustLine:
      "Ответы опираются на ваши документы. Если ответа нет в доках — Replybase так и скажет, а не будет угадывать.",
    trust1: "Retrieval, не open-ended чат",
    trust2: "Источники рядом с каждым ответом",
    trust3: "Без выдуманных цен, политик и шагов",
    problemEyebrow: "The old way",
    problemTitleLead: "Теперь",
    problemTitleHighlightA: "не нужно выбирать",
    problemTitleMid: "между",
    problemTitleHighlightB: "обычными AI-чатботами",
    problemTitleTail: " и бесконечными FAQ-тикетами.",
    problemSub:
      "Мы сделали агента поддержки, который отвечает только по вашим документам.",
    problemImageAlt:
      "Стол с документацией и ноутбуком — одни и те же вопросы поддержки возвращаются снова",
    planIncludes: "включает",
    howTitle: "От документов до бота на сайте меньше чем за 10 минут",
    steps: [
      {
        title: "Загрузите документы",
        body: "Пастите статьи, политики или гайды. Replybase режет и индексирует их для поиска.",
      },
      {
        title: "Проверьте как пользователь",
        body: "Задайте сложные вопросы во встроенном чате, прежде чем кто-то ещё увидит бота.",
      },
      {
        title: "Встройте куда угодно",
        body: "Один script-тег. Тот же бот, те же знания, ваш бренд.",
      },
      {
        title: "Смотрите, о чём реально спрашивают",
        body: "Каждый диалог логируется — видно, чего не хватает в документации.",
      },
    ],
    featuresTitle: "Для команд, у которых уже есть документация",
    featuresSubtitle:
      "Инфраструктура grounded-поддержки, которую можно запустить за дни, а не кварталы",
    featuresImageAlt:
      "Документация на экране и чат-виджет, отвечающий по базе знаний",
    featuresReadMore: "Подробнее",
    features: [
      {
        title: "Grounded-ответы, не догадки",
        body: "Replybase отвечает только по загруженному. Если не знает — скажет и может передать человеку, а не выдумает.",
      },
      {
        title: "Embed-виджет под ваш бренд",
        body: "Одна строка кода добавляет launcher на любую страницу. Свой цвет, своё имя, без «powered by» на платных тарифах.",
      },
      {
        title: "История диалогов, из которой учатся",
        body: "Каждый вопрос логируется. Находите дыры в доках до жалоб клиентов.",
      },
      {
        title: "Несколько ботов в одном аккаунте",
        body: "Отдельный бот на продукт, тариф или язык — без дублирования настройки.",
      },
    ],
    modelsEyebrow: "Supported models",
    modelsTitle: "Подключайте модель, которой уже доверяет команда",
    modelsBody:
      "Retrieval и grounding работают одинаково, какой бы моделью ни отвечали. OpenAI, Anthropic или Google Gemini — на бота, смена в любой момент без переиндексации документов.",
    modelsFootnote: "+ Свой API-ключ на тарифе Growth",
    useCasesTitle: "Куда команды ставят Replybase",
    useCases: [
      {
        title: "Docs-страницы",
        body: "Ответы на «как сделать…» без тикета в поддержку.",
      },
      {
        title: "Pricing",
        body: "Вопросы по планам и фичам до звонка с sales.",
      },
      {
        title: "Help внутри продукта",
        body: "Вместо устаревшего FAQ-модала — ответы по делу.",
      },
      {
        title: "Онбординг",
        body: "Новые пользователи не ждут часов работы поддержки.",
      },
    ],
    pricingTitle: "Выберите тариф под свои задачи",
    pricingSubtitle:
      "Старт бесплатный. Апгрейд, когда нужен embed — в демо биллинг на Stripe test mode.",
    pricingNote: "Нужно больше документов или ответов?",
    contactUs: "Написать нам",
    faqTitle: "FAQ",
    faqs: [
      {
        q: "Он будет выдумывать?",
        a: "Нет. Replybase отвечает только по загруженным документам. Если ответа нет — скажет об этом, а не угадает.",
      },
      {
        q: "Нужен разработчик для embed?",
        a: "Нет. Один script-тег на любой странице. Обычно команды вставляют сами за несколько минут.",
      },
      {
        q: "Можно видеть, о чём спрашивают?",
        a: "Да. Все диалоги в дашборде — видно пробелы в документации.",
      },
      {
        q: "Что если превышу лимиты тарифа?",
        a: "Предупредим до лимита и предложим апгрейд — бот не «умрёт» посреди месяца без предупреждения.",
      },
      {
        q: "Мои данные идут в обучение моделей?",
        a: "Нет. Документы используются только для ответов внутри вашего аккаунта.",
      },
    ],
    stillQuestions: "Остались вопросы?",
    stillQuestionsHint: "Оставьте email — ответим в течение рабочего дня.",
    emailPlaceholder: "имя@компания.com",
    contactSubject: "Вопрос по Replybase",
    sendQuestion: "Отправить",
    thanksContact: "Спасибо — сейчас откроется почтовый клиент.",
    finalTitle: "В ваших документах уже есть ответы. Пусть они работают.",
    finalCta: "Начать бесплатно — без карты",
    finalNote: "Free-тарифа хватит, чтобы проверить на одном help center сегодня.",
    previewBot: "Acme Docs Bot",
    previewOnline: "Онлайн",
    previewSource: "Источник:",
    previewAsk: "Спросите по документам…",
    previewSend: "Отправить",
    q1: "Как ротировать API-ключи?",
    a1: "Откройте Settings → API Keys → Rotate. Старые ключи истекают через 24 часа.",
    a1Source: "Security guide, §4 Key rotation",
    q2: "Можно встроить на маркетинговый сайт?",
    a2: "Да — один script-тег в <head> сайта. Тот же бот, та же база знаний, без отдельной настройки.",
    a2Source: "Getting started, §2 Embedding",
    q3: "Поддерживаете ли вы SSO-логин?",
    a3: "В ваших документах этого пока нет. Могу отметить вопрос для команды — или добавьте ответ в базу знаний.",
    footerProduct: "Продукт",
    footerPricing: "Цены",
    footerFaq: "FAQ",
    footerContact: "Контакт",
    footerPrint:
      "Продуктовый MVP для Paralect Product Academy — биллинг на Stripe test mode, без реальных списаний.",
  },
  plans: {
    free: {
      name: "Free",
      period: "",
      blurb: "Чтобы попробовать Replybase на одном help center.",
      features: [
        "1 чат-бот",
        "До 3 документов",
        "50 ответов / месяц",
        "Только чат в приложении",
      ],
      cta: "Начать бесплатно",
    },
    starter: {
      name: "Starter",
      period: "/мес",
      blurb: "Чтобы запустить первый встраиваемый виджет.",
      features: [
        "3 чат-бота",
        "30 документов",
        "2 000 ответов / месяц",
        "Встраиваемый виджет",
        "Свой цвет бренда",
      ],
      cta: "Выбрать Starter",
    },
    growth: {
      name: "Growth",
      period: "/мес",
      blurb: "Для команд с несколькими продуктами или языками.",
      features: [
        "10 чат-ботов",
        "200 документов",
        "15 000 ответов / месяц",
        "Приоритетная скорость ответа",
        "Без бейджа Replybase",
      ],
      cta: "Выбрать Growth",
    },
  },
  auth: {
    welcomeBack: "С возвращением",
    createAccount: "Создать аккаунт",
    signupHint:
      "Старт на Free. Позже можно апгрейднуть и открыть embed-виджет.",
    email: "Эл. почта",
    password: "Пароль",
    passwordMin: "Пароль (мин. 6)",
    name: "Имя",
    workEmail: "Рабочая эл. почта",
    signingIn: "Входим…",
    logIn: "Войти",
    creating: "Создаём аккаунт…",
    signUp: "Зарегистрироваться",
    newHere: "Впервые здесь?",
    createAccountLink: "Создать аккаунт",
    haveAccount: "Уже есть аккаунт?",
    logInLink: "Войти",
    loginFailed: "Не удалось войти",
    signupFailed: "Не удалось зарегистрироваться",
    confirmTitle: "Введите код подтверждения",
    confirmHint: "Мы отправили код на {email}. Введите его, чтобы завершить регистрацию.",
    codeLabel: "Код подтверждения",
    codePlaceholder: "6 цифр",
    verifying: "Проверяем…",
    verify: "Подтвердить",
    resendCode: "Отправить код ещё раз",
    resending: "Отправляем…",
    resent: "Код отправлен снова",
    resendIn: "Повтор через {s} с",
    verifyFailed: "Неверный код",
    emailNotConfirmed: "Подтвердите почту кодом из письма.",
    changeEmail: "Указать другой email",
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
    botNameTooShort: "Имя бота — минимум 2 символа.",
    billingTitle: "Тариф и оплата",
    billingSubtitle:
      "Апгрейд открывает embed-виджет. Оплата в Stripe test mode — без реальных списаний.",
    explorePlans: "Explore plans",
    comparePlans: "Сравните все тарифы Replybase",
    compareAllPlans: "Compare all plans",
    yourCurrentPlan: "Your current plan",
    upgrade: "Upgrade",
    popular: "Popular",
    includes: "Includes",
    everythingIn: "Everything in",
    billedMonthly: "ежемесячно",
    perMonth: "за workspace / месяц",
    embedUpsellTitle: "Embed-виджет",
    embedUpsellBody:
      "Апгрейд — бот на любом сайте одним script-тегом.",
    currentPlan: "Текущий тариф",
    currentPlanLabel: "Сейчас у вас",
    billingMockNote: "Mock Stripe — без реальных списаний",
    downgraded: "Вы снова на тарифе Free.",
    upgraded: "Оплата прошла. Embed-виджет разблокирован.",
    billingFailed: "Не удалось сменить тариф. Попробуйте ещё раз.",
    charLimitHint: "Не более {n} символов.",
    current: "Current plan",
    choosePlan: "Downgrade",
    processing: "Processing…",
    created: "Создан",
    backToBots: "← Все боты",
    myBots: "Мои боты",
    managePlan: "Управление тарифом",
    upgradeForEmbed: "Апгрейд для embed",
    editBot: "Редактировать",
    editBotTitle: "Редактировать бота",
    botNameLabel: "Имя бота",
    saveBotName: "Сохранить имя",
    savingBotName: "Сохраняем…",
    deleteBot: "Удалить бота",
    deletingBot: "Удаляем…",
    deleteBotConfirm:
      "Удалить этого бота и все его документы? Это нельзя отменить.",
    renameFailed: "Не удалось переименовать бота.",
    deleteFailed: "Не удалось удалить бота.",
    documentsTitle: "Документы",
    documentsHint:
      "Только база знаний — статьи, из которых бот цитирует. Тон и ответ «не найдено» — в блоке «Инструкции» выше.",
    docTitlePlaceholder: "Название документа",
    docContentPlaceholder:
      "Вставьте текст статьи.\n\nЗаголовки и нумерованные шаги помогают боту находить нужный фрагмент.",
    pasteOrDescribe: "или опишите документ",
    instructionsTitle: "Инструкции",
    instructionsHint:
      "Тон — как бот отвечает по документам. Fallback — что сказать, если в базе ничего нет. Кнопка «связаться с оператором» остаётся.",
    toneTitle: "Тон",
    instructionsPlaceholder:
      "Коротко, на «вы». Цены только из документов.",
    fallbackTitle: "Если ответа нет в документах",
    fallbackPlaceholder:
      "Этого нет в базе. Переформулируйте или свяжитесь с оператором.",
    instructionsSave: "Сохранить",
    instructionsSaving: "Сохраняем…",
    instructionsSaved: "Сохранено",
    instructionsCancel: "Отменить",
    instructionsFailed: "Не удалось сохранить инструкции",
    attachFile: "Прикрепить файл",
    attachHint: ".txt, .md, .csv, .json, .pdf, .docx",
    dropHint: "Отпустите файл, чтобы прикрепить",
    uploading: "Загружаем…",
    fileReadFailed:
      "Не удалось прочитать файл. Нужен txt, md, pdf или docx.",
    fileTooShort: "Файл слишком короткий (нужно минимум 20 символов).",
    fileTooLarge: "Файл слишком большой (макс. 4 МБ).",
    uploadIndex: "Добавить",
    deleteDoc: "Удалить",
    viewDoc: "Открыть документ",
    closeDoc: "Закрыть",
    noDocuments: "Документов пока нет.",
    chatTitle: "Чат в приложении",
    chatPlaceholder: "Спросите по вашим документам…",
    send: "Отправить",
    noAnswer:
      "На этот ответ я не смогу вам сейчас ответить. Переформулируйте ваш вопрос или свяжитесь с оператором.",
    contactOperator: "Связаться с оператором",
    contactOperatorSubject: "Запрос в поддержку из чата Replybase",
    contactOperatorSent: "Запрос передан оператору.",
    embedTitle: "Встраиваемый виджет",
    embedHintLead: "Вставьте это перед",
    embedHintTrail: "на любом сайте.",
    openPlayground: "Открыть playground виджета",
    copyCode: "Копировать код",
    copied: "Скопировано",
    embedGated: "Embed доступен на тарифах Starter/Growth.",
    upgradeMock: "Апгрейд через mock Stripe",
    unlockScript: "чтобы открыть script-тег.",
    loadFailed: "Не удалось загрузить",
    uploadFailed: "Не удалось загрузить документ",
    chatFailed: "Ошибка чата",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, ru };

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "ru";
}
