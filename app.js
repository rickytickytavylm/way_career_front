const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Для GitHub Pages укажи URL Railway в index.html: window.T_CAREER_API
const API_BASE = String(window.T_CAREER_API || "").replace(/\/$/, "");
const apiUrl = (path) => `${API_BASE}${path}`;

const icons = {
  feed: '<svg viewBox="0 0 24 24"><path d="M4 5.5h16M4 12h16M4 18.5h10"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12h18"/></svg>',
  growth: '<svg viewBox="0 0 24 24"><path d="M4 19V5M4 19h16M7 15l4-4 3 2 5-6"/></svg>',
  people: '<svg viewBox="0 0 24 24"><path d="M16 20v-1.6a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16 4.2a3.5 3.5 0 0 1 0 6.6M17 14.5a4 4 0 0 1 4 4V20"/></svg>',
  message: '<svg viewBox="0 0 24 24"><path d="M20 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4Z"/></svg>',
  bell: '<svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/></svg>',
  profile: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  chevron: '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
  camera: '<svg viewBox="0 0 24 24"><path d="M4 7h3l1.5-2h7L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="4"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>',
  comment: '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.6 9.6 0 0 1-4-.9L3 21l1.7-4.5A8.5 8.5 0 1 1 21 11.5Z"/></svg>',
  share: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>'
};

const DEMO_PHOTO =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=86";

const LOCAL_VISUAL_FALLBACK = {
  apparentPresentation: "Собранная и открытая подача",
  presentationStyle: "Профессиональная, без формальности",
  imageMood: "Уверенное и спокойное"
};

// Метод вынужденного выбора (ipsative forced-choice): в каждом раунде нужно
// отметить утверждение, наиболее и наименее похожее на человека. Это исключает
// социально одобряемые ответы («да, конечно, я креативный») и вскрывает
// реальный поведенческий паттерн — так строятся профессиональные ассессменты
// (Hogan, OPQ), а не анкеты интересов.
const PSYCH_ROUNDS = [
  [
    { dim: "innovation", text: "Я быстрее найду совершенно новый подход, чем улучшу то, что уже работает" },
    { dim: "structure", text: "Мне важнее выстроить понятную систему, чем придумывать новое с нуля" },
    { dim: "autonomy", text: "Лучше всего я работаю, когда сам решаю, что и как делать" },
    { dim: "impact", text: "Мне важнее результат для команды, чем моё личное решение" }
  ],
  [
    { dim: "innovation", text: "Я скорее предложу нестандартное решение, чем повторю проверенное" },
    { dim: "structure", text: "Мне комфортнее опираться на чёткий алгоритм действий" },
    { dim: "autonomy", text: "Я предпочитаю действовать без постоянных согласований" },
    { dim: "impact", text: "Мне важно, чтобы решение поддержала вся команда" }
  ],
  [
    { dim: "innovation", text: "Я легко меняю план на середине пути, если вижу более интересный вариант" },
    { dim: "structure", text: "Мне важно, чтобы у задачи был чёткий процесс от начала до конца" },
    { dim: "autonomy", text: "Мне некомфортно, когда каждое решение нужно с кем-то согласовывать" },
    { dim: "impact", text: "Мне важнее выстроить доверие в команде, чем быстро закрыть задачу" }
  ]
];

const DIM_LABELS = {
  innovation: "Склонность к новому",
  structure: "Опора на систему",
  autonomy: "Автономность",
  impact: "Ориентация на команду"
};

const FOCUS_OPTIONS = [
  "Найти новую роль",
  "Понять свои сильные стороны",
  "Вырасти в текущей роли",
  "Сменить профессию"
];

const SKILL_OPTIONS = ["Figma", "UX Research", "Product Design", "Аналитика", "Управление командой", "Стратегия", "Коммуникации", "AI-инструменты"];

const ROLE_SUGGESTIONS = [
  "Product Designer", "UX Researcher", "Product Manager", "Frontend-разработчик",
  "Backend-разработчик", "Аналитик данных", "Маркетолог", "Project Manager",
  "HR / Рекрутер", "QA-инженер", "DevOps-инженер", "Предприниматель"
];

const DIM_ARCHETYPES = {
  innovation: { name: "Визионер", description: "Видит возможности там, где другие видят ограничения, и быстро превращает идеи в эксперименты." },
  structure: { name: "Организатор", description: "Наводит порядок в сложном: выстраивает системы, процессы и предсказуемый результат." },
  autonomy: { name: "Исследователь", description: "Глубоко погружается в задачу и сильнее всего работает на независимой экспертизе." },
  impact: { name: "Коммуникатор", description: "Сильнее всего раскрывается через людей: команды, партнёрства и общие решения." }
};

const DIRECTIONS_BY_ROLE = [
  [/дизайн|design/i, ["Продуктовый дизайнер", "Дизайн-лид", "UX-исследователь", "Креативный директор"]],
  [/исслед|research/i, ["UX-исследователь", "Продуктовый аналитик", "Head of Research", "Стратег"]],
  [/продакт|product/i, ["Продакт-менеджер", "Владелец направления", "CPO-трек", "Стратег"]],
  [/front|фронт/i, ["Frontend-разработчик", "Техлид", "Design Engineer", "Архитектор интерфейсов"]],
  [/back|бэк/i, ["Backend-разработчик", "Техлид", "Архитектор систем", "Platform-инженер"]],
  [/данн|data|аналит/i, ["Аналитик данных", "Продуктовый аналитик", "Head of Data", "BI-эксперт"]],
  [/маркет|smm|бренд/i, ["Маркетолог", "Growth-менеджер", "Бренд-стратег", "CMO-трек"]],
  [/hr|рекрут|people/i, ["HR Business Partner", "Head of People", "Карьерный консультант", "Рекрутинг-лид"]],
  [/qa|тест/i, ["QA-инженер", "QA-лид", "Инженер качества", "Автоматизатор тестирования"]],
  [/devops|sre/i, ["DevOps-инженер", "SRE", "Platform-лид", "Архитектор инфраструктуры"]],
  [/предприним|founder|основател/i, ["Предприниматель", "Продакт-менеджер", "Стратег", "Венчурный партнёр"]],
  [/project|менеджер|руководител/i, ["Project Manager", "Программный директор", "Операционный лид", "Продакт-менеджер"]]
];

const GENERIC_DIRECTIONS = {
  innovation: ["Продакт-менеджер", "Стратег", "Исследователь", "Креативный лид"],
  structure: ["Project Manager", "Операционный лид", "Системный аналитик", "Продакт-менеджер"],
  autonomy: ["Исследователь", "Независимый эксперт", "Консультант", "Специалист-практик"],
  impact: ["Руководитель команды", "HR Business Partner", "Аккаунт-лид", "Коммуникационный лид"]
};

const WORK_STYLE_OPTIONS = {
  environment: ["Небольшие команды", "Кросс-функциональные команды", "Независимая работа", "Крупная организация"],
  pace: ["Высокий", "Средний", "Спокойный"],
  autonomy: ["Высокая", "Средняя", "Низкая"],
  tasks: ["Новые и сложные", "Понятные и системные", "Смешанные"]
};

const state = {
  step: 0,
  name: "",
  role: "",
  focus: "",
  experience: "",
  skills: [],
  resumeAttached: false,
  resumeLoading: false,
  resumeName: "",
  photoFile: null,
  photoUrl: "",
  cameraStream: null,
  visualProfile: null,
  visualBaseline: [],
  visualPortrait: null,
  psych: [null, null, null],
  psychScores: null,
  careerProfile: null,
  workStyleOverrides: {},
  route: "feed",
  data: { profile: null, feed: [], jobs: [], people: [], courses: [], messages: [], notifications: [] },
  activeDialog: 1,
  jobQuery: "",
  jobFormat: "",
  loading: false
};

function deriveBaselineTags(visualProfile) {
  const source = visualProfile || LOCAL_VISUAL_FALLBACK;
  return [source.apparentPresentation, source.presentationStyle, source.imageMood].filter(Boolean);
}

// Детерминированная интерпретация структурированного визуального анализа:
// текстовые описания от vision-модели переводятся в маркеры подачи через
// ключевые слова. Это не «чтение характера по лицу», а рефлексия того,
// как человек себя презентует на фото.
const MARKER_KEYWORDS = {
  confidence: { label: "Уверенность", up: ["уверен", "решит", "собран", "прямой", "открытый взгляд"], down: ["неуверен", "застенч", "напряж"] },
  openness: { label: "Открытость", up: ["доброжелат", "улыб", "открыт", "тепл", "мягк"], down: ["серьёз", "сдержан", "нейтрал", "дистанц", "закрыт"] },
  formality: { label: "Формальность", up: ["делов", "формал", "строг", "профессионал", "официал"], down: ["неформал", "естествен", "расслаб", "повседнев"] },
  energy: { label: "Энергичность", up: ["энергич", "ярк", "динамич", "выразит", "жив"], down: ["спокой", "тих", "приглуш"] }
};

const VISUAL_TYPE_NAMES = {
  "confidence+formality": "Собранный лидерский тип",
  "confidence+openness": "Уверенный открытый тип",
  "confidence+energy": "Яркий уверенный тип",
  "formality+openness": "Дипломатичный тип",
  "formality+energy": "Структурный драйвовый тип",
  "openness+energy": "Вовлекающий тип"
};

const STRENGTH_BY_MARKER = {
  confidence: "Уверенная подача без давления",
  openness: "Располагающий, открытый контакт",
  formality: "Собранный профессиональный образ",
  energy: "Живая, заметная подача"
};

const COMMUNICATION_BY_MARKER = {
  confidence: "Говорит спокойно и по делу, держит позицию",
  openness: "Легко устанавливает контакт и доверие",
  formality: "Держит структуру и дистанцию в диалоге",
  energy: "Быстро вовлекает и держит внимание"
};

const SPHERE_BY_MARKER = {
  confidence: ["Переговоры и презентации", "Ответственные запуски"],
  openness: ["Работа с людьми и командами", "Клиентский сервис"],
  formality: ["Процессы и регламенты", "Работа с документами и рисками"],
  energy: ["Публичные выступления", "Запуски и питчи"]
};

function deriveVisualPortrait(visualProfile) {
  const source = visualProfile || LOCAL_VISUAL_FALLBACK;
  const text = Object.values(source).filter((value) => typeof value === "string").join(" ").toLowerCase();
  const markers = Object.entries(MARKER_KEYWORDS).map(([key, config]) => {
    let score = 55;
    config.up.forEach((word) => { if (text.includes(word)) score += 12; });
    config.down.forEach((word) => { if (text.includes(word)) score -= 12; });
    if (typeof source.confidence === "number") score += Math.round((source.confidence - 0.8) * 30);
    return { key, label: config.label, score: Math.max(24, Math.min(95, score)) };
  });
  const ranked = [...markers].sort((a, b) => b.score - a.score);
  const [first, second] = ranked;
  const typeName = VISUAL_TYPE_NAMES[`${first.key}+${second.key}`]
    || VISUAL_TYPE_NAMES[`${second.key}+${first.key}`]
    || "Сбалансированный тип";
  return {
    markers,
    typeName,
    strengths: [first, second].map((marker) => STRENGTH_BY_MARKER[marker.key]),
    communication: COMMUNICATION_BY_MARKER[first.key],
    spheres: [...new Set([...SPHERE_BY_MARKER[first.key], ...SPHERE_BY_MARKER[second.key]])].slice(0, 3)
  };
}

function computePsychScores(rounds) {
  const dims = Object.keys(DIM_LABELS);
  const raw = Object.fromEntries(dims.map((dim) => [dim, 0]));
  rounds.forEach((round) => {
    if (!round) return;
    if (round.most) raw[round.most] += 2;
    if (round.least) raw[round.least] -= 1;
  });
  const scores = {};
  dims.forEach((dim) => {
    scores[dim] = Math.max(0, Math.min(100, Math.round(((raw[dim] + 3) / 9) * 100)));
  });
  return scores;
}

function topDimensions(scores, count = 2) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([dim, score]) => ({ dim, label: DIM_LABELS[dim], score }));
}

function directionsFor(role, topDim) {
  const matched = DIRECTIONS_BY_ROLE.find(([pattern]) => pattern.test(role));
  const base = matched ? matched[1] : [role, ...GENERIC_DIRECTIONS[topDim]].filter(Boolean);
  return [...new Set(base)].slice(0, 4);
}

function deriveLocalProfile() {
  const scores = state.psychScores || computePsychScores(state.psych);
  const [first, second] = topDimensions(scores);
  const archetype = DIM_ARCHETYPES[first.dim];
  const baseMatch = Math.round(78 + first.score / 5);
  return {
    archetype: {
      name: archetype.name,
      description: archetype.description,
      confidence: Math.min(.95, .62 + first.score / 260)
    },
    traits: [
      { name: "Склонность к новому", score: scores.innovation },
      { name: "Системность", score: scores.structure },
      { name: "Самостоятельность", score: scores.autonomy },
      { name: "Ориентация на команду", score: scores.impact }
    ],
    workStyle: [
      scores.impact >= scores.autonomy ? "Кросс-функциональные команды" : "Небольшие команды",
      scores.innovation >= 55 ? "Высокий" : "Средний",
      scores.autonomy >= 60 ? "Высокая" : scores.autonomy >= 40 ? "Средняя" : "Низкая",
      scores.innovation >= scores.structure ? "Новые и сложные" : "Понятные и системные"
    ],
    careerDirections: directionsFor(state.role, first.dim).map((name, index) => ({
      name,
      match: Math.max(72, Math.min(96, baseMatch - index * 4 - (second.score < 40 ? 2 : 0)))
    })),
    source: "local"
  };
}

function currentProfile() {
  return state.careerProfile || deriveLocalProfile();
}

function hydrateIcons(root = document) {
  $$("[data-icon]", root).forEach((node) => {
    node.innerHTML = icons[node.dataset.icon] || "";
  });
}

function progress(step) {
  const total = steps.length;
  return `<div class="onboarding-progress" aria-label="Шаг ${Math.min(step + 1, total)} из ${total}">
    ${Array.from({ length: total }, (_, index) => `<span class="${index <= step ? "is-done" : ""}"></span>`).join("")}
  </div>`;
}

function shell(content, {
  wide = false,
  compact = false,
  photo = false,
  footer = true,
  secondary = "",
  primary = "Продолжить",
  disablePrimary = false
} = {}) {
  const contentClass = [
    "onboarding-content",
    wide ? "onboarding-content--wide" : "",
    compact ? "onboarding-content--compact" : "",
    photo ? "onboarding-content--photo" : ""
  ].filter(Boolean).join(" ");

  return `<div class="onboarding-shell">
    <div class="onboarding-top">
      <button class="brand" data-onboarding-home><span class="brand-mark">Т</span><span>Карьера</span></button>
      ${progress(state.step)}
    </div>
    <div class="${contentClass}">${content}</div>
    ${footer ? `<div class="onboarding-footer"><div class="onboarding-footer__inner">
      ${secondary ? `<button class="btn btn--ghost" data-secondary>${secondary}</button>` : ""}
      <button class="btn btn--primary" data-primary ${disablePrimary ? "disabled" : ""}>${primary}<span data-icon="arrow"></span></button>
    </div></div>` : ""}
  </div>`;
}

function psychStep(roundIndex) {
  const round = PSYCH_ROUNDS[roundIndex];
  const answer = state.psych[roundIndex];
  const isLast = roundIndex === PSYCH_ROUNDS.length - 1;

  if (!answer?.most) {
    return shell(`
      <p class="onboarding-kicker">Уточняем профиль · Раунд ${roundIndex + 1} из ${PSYCH_ROUNDS.length}</p>
      <h2>Что ближе всего?</h2>
      <p class="onboarding-lead">Отметьте утверждение, которое точнее всего описывает, как вы обычно действуете.</p>
      <div class="psych-grid">
        ${round.map((item) => `<button class="psych-card" data-most="${item.dim}">${item.text}</button>`).join("")}
      </div>`, { secondary: "Назад", compact: true, disablePrimary: true });
  }

  if (!answer.least) {
    const chosen = round.find((item) => item.dim === answer.most);
    const rest = round.filter((item) => item.dim !== answer.most);
    return shell(`
      <p class="onboarding-kicker">Уточняем профиль · Раунд ${roundIndex + 1} из ${PSYCH_ROUNDS.length}</p>
      <h2>А что меньше всего?</h2>
      <p class="onboarding-lead">Из оставшихся вариантов отметьте тот, что меньше всего похож на вас.</p>
      <button class="psych-card psych-card--chosen" data-reset-round="${roundIndex}">
        <span class="psych-card__tag">Больше всего</span>${chosen.text}
      </button>
      <div class="psych-grid">
        ${rest.map((item) => `<button class="psych-card" data-least="${item.dim}">${item.text}</button>`).join("")}
      </div>`, { secondary: "Назад", compact: true, disablePrimary: true });
  }

  const most = round.find((item) => item.dim === answer.most);
  const least = round.find((item) => item.dim === answer.least);
  return shell(`
    <p class="onboarding-kicker">Уточняем профиль · Раунд ${roundIndex + 1} из ${PSYCH_ROUNDS.length}</p>
    <h2>Ответ зафиксирован</h2>
    <div class="psych-summary">
      <div class="psych-summary__row"><span class="psych-card__tag">Больше всего</span>${most.text}</div>
      <div class="psych-summary__row psych-summary__row--least"><span class="psych-card__tag psych-card__tag--least">Меньше всего</span>${least.text}</div>
    </div>
    <button class="rail-link" data-reset-round="${roundIndex}" style="margin-top:14px">Изменить ответ</button>`,
    { secondary: "Назад", compact: true, primary: isLast ? "Собрать профиль" : "Следующий раунд" });
}

const steps = [
  () => shell(`
    <p class="onboarding-kicker">Карьерный профиль</p>
    <h1>Поймите, где вы можете быть сильнее всего</h1>
    <p class="onboarding-lead">Фото, несколько ответов и опыт — и станет ясно, куда двигаться дальше.</p>
    <div class="welcome-visual">
      <div class="welcome-visual__portrait"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=420&q=80" alt=""></div>
      <div class="welcome-visual__portrait"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=420&q=80" alt=""></div>
      <div class="welcome-visual__portrait"><img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=420&q=80" alt=""></div>
    </div>`, { primary: "Начать" }),
  () => shell(`
    <div class="photo-layout">
      <div class="camera-frame" data-camera-frame>
        ${state.cameraStream
          ? `<video autoplay playsinline muted></video><span class="face-guide" aria-hidden="true"></span>`
          : state.photoUrl
            ? `<img src="${state.photoUrl}" alt="Предпросмотр фотографии"><span class="face-guide" aria-hidden="true"></span>`
            : `<div class="camera-placeholder"><span data-icon="camera"></span><strong>Камера или загрузка</strong><span>Лицо по центру кадра</span></div>`}
      </div>
      <div class="photo-copy">
        <p class="onboarding-kicker">Шаг 1 · Визуальная база</p>
        <h2>Начнём с фотографии</h2>
        <p class="onboarding-lead">Она станет первым сигналом вашего профиля. Дальше уточним детали через несколько коротких ситуаций.</p>
        <div class="photo-actions">
          <button class="btn btn--dark" data-camera>${state.cameraStream ? "Сделать снимок" : "Сделать фото"}</button>
          <button class="btn btn--soft" data-upload>Загрузить</button>
        </div>
        <p class="photo-note">Оцениваем композицию и подачу — это один из нескольких сигналов, не диагноз характера.</p>
      </div>
    </div>`, {
    wide: true,
    photo: true,
    secondary: "Назад",
    primary: "Анализировать",
    disablePrimary: !(state.photoUrl || state.photoFile)
  }),
  () => `<div class="onboarding-shell scan-screen">
    <div class="onboarding-top"><button class="brand"><span class="brand-mark">Т</span><span>Карьера</span></button>${progress(2)}</div>
    <div class="scan-layout">
      <div class="scan-portrait">
        <img src="${state.photoUrl || DEMO_PHOTO}" alt="">
        <span class="scan-vignette" aria-hidden="true"></span>
        <span class="scan-frame" aria-hidden="true"></span>
        <span class="scan-line" aria-hidden="true"></span>
      </div>
      <div class="scan-copy">
        <p class="onboarding-kicker">Визуальная экспертиза</p>
        <h2>Считываем первые сигналы</h2>
        <div class="scan-status">
          ${["Подготавливаем изображение", "Считываем визуальные признаки", "Оцениваем самопрезентацию", "Формируем первое впечатление"].map((item, index) => `<div class="scan-status__item ${index === 0 ? "is-active" : ""}" data-scan="${index}">${item}</div>`).join("")}
        </div>
      </div>
    </div>
  </div>`,
  () => {
    const portrait = state.visualPortrait || deriveVisualPortrait(state.visualProfile);
    return shell(`
      <div class="portrait-layout">
        <div class="portrait-photo">
          <img src="${state.photoUrl || DEMO_PHOTO}" alt="Ваш портрет">
          <span class="scan-frame" aria-hidden="true"></span>
          <span class="portrait-photo__badge">10+ визуальных признаков</span>
        </div>
        <div class="portrait-copy">
          <p class="onboarding-kicker">Первое впечатление</p>
          <h2>${portrait.typeName}</h2>
          <p class="onboarding-lead">Так вас считывает камера — по композиции, мимике и стилю подачи.</p>
          <div class="trait-list trait-list--compact">
            ${portrait.markers.map((marker) => `<div class="trait-row"><div class="trait-row__top"><span>${marker.label}</span><strong>${marker.score}</strong></div><div class="trait-bar"><span style="width:${marker.score}%"></span></div></div>`).join("")}
          </div>
        </div>
      </div>
      <div class="portrait-details">
        <div class="source-card"><small>Сильные стороны подачи</small><strong>${portrait.strengths.join(" · ")}</strong></div>
        <div class="source-card"><small>Стиль коммуникации</small><strong>${portrait.communication}</strong></div>
        <div class="source-card"><small>Где это работает</small><strong>${portrait.spheres.join(" · ")}</strong></div>
      </div>
      <p class="disclaimer">Это рефлексия подачи на фото, а не диагноз характера. Дальше несколько ситуаций уточнят профиль.</p>`,
      { wide: true, compact: true, secondary: "Переснять фото", primary: "Уточнить профиль" });
  },
  () => psychStep(0),
  () => psychStep(1),
  () => psychStep(2),
  () => {
    const canContinue = state.resumeAttached && state.role.trim() && state.experience && state.skills.length > 0 && state.focus;
    const resumeBlock = state.resumeLoading
      ? `<div class="resume-card resume-card--loading" aria-live="polite">
          <span class="resume-card__spinner" aria-hidden="true"></span>
          <div><strong>Читаем резюме</strong><small>Достаём роль, опыт и навыки</small></div>
        </div>`
      : state.resumeAttached
        ? `<div class="resume-card resume-card--done">
            <span class="resume-card__icon" aria-hidden="true">✓</span>
            <div class="resume-card__meta">
              <strong>${state.resumeName}</strong>
              <small>Резюме добавлено · роль и навыки подставлены</small>
            </div>
            <button class="rail-link" data-detach-resume type="button">Убрать</button>
          </div>`
        : `<button class="resume-card resume-card--action" data-attach-resume type="button">
            <span class="resume-card__icon" aria-hidden="true">+</span>
            <div class="resume-card__meta">
              <strong>Прикрепить демо-резюме</strong>
              <small>Обязательно · дальше подберём направления из опыта</small>
            </div>
          </button>`;

    return shell(`
      <p class="onboarding-kicker">Карьерный паспорт</p>
      <h2>Добавим опыт и фокус</h2>
      <p class="onboarding-lead">Прикрепите резюме — по нему точнее подберём направления и людей.</p>
      <div class="field">
        <label>Резюме</label>
        ${resumeBlock}
      </div>
      <div class="field">
        <label for="name-input">Как вас зовут</label>
        <input id="name-input" class="text-input" value="${state.name}" placeholder="Имя" autocomplete="off">
      </div>
      <div class="field">
        <label for="role-input">Текущая роль</label>
        <input id="role-input" class="text-input" value="${state.role}" placeholder="Например, Product Designer" autocomplete="off" ${state.resumeAttached ? "" : "disabled"}>
        <div class="suggestions">
          ${ROLE_SUGGESTIONS.map((item) => `<button class="chip ${state.role === item ? "is-selected" : ""}" data-role="${item}" ${state.resumeAttached ? "" : "disabled"}>${item}</button>`).join("")}
        </div>
      </div>
      <div class="field">
        <label>Опыт в текущей роли</label>
        <div class="focus-list">
          ${["До года", "1–3 года", "3–5 лет", "5+ лет"].map((item) => `<button class="focus-row ${state.experience === item ? "is-selected" : ""}" data-experience="${item}" ${state.resumeAttached ? "" : "disabled"}>${item}</button>`).join("")}
        </div>
      </div>
      <div class="field">
        <label>Ключевые навыки</label>
        <div class="suggestions">
          ${SKILL_OPTIONS.map((item) => `<button class="chip ${state.skills.includes(item) ? "is-selected" : ""}" data-skill="${item}" ${state.resumeAttached ? "" : "disabled"}>${item}</button>`).join("")}
        </div>
      </div>
      <div class="field">
        <label>Что сейчас важнее всего?</label>
        <div class="focus-list">
          ${FOCUS_OPTIONS.map((item) => `<button class="focus-row ${state.focus === item ? "is-selected" : ""}" data-focus="${item}" ${state.resumeAttached ? "" : "disabled"}>${item}</button>`).join("")}
        </div>
      </div>`, {
      secondary: "Назад",
      compact: true,
      primary: "Собрать профиль",
      disablePrimary: !canContinue
    });
  },
  () => {
    const profile = currentProfile();
    const topDims = topDimensions(state.psychScores || computePsychScores(state.psych));
    return shell(`
      <p class="onboarding-kicker">Ваш профиль</p>
      <div class="result-hero">
        <div>
          <div class="archetype-name">${profile.archetype.name}</div>
          <div class="archetype-description">${profile.archetype.description}</div>
          <div class="verdict-sources">
            <div class="source-card"><small>Визуальный сигнал</small><strong>${(state.visualPortrait || deriveVisualPortrait(state.visualProfile)).typeName}</strong></div>
            <div class="source-card"><small>Психометрика</small><strong>${topDims.map((d) => d.label).join(" · ")}</strong></div>
            <div class="source-card"><small>Резюме и опыт</small><strong>${state.resumeAttached ? `${state.role} · ${state.experience}` : (state.role || "—")}</strong></div>
          </div>
          <p class="disclaimer">Соединяем несколько независимых сигналов. Ни один из них по отдельности не определяет вашу личность.</p>
        </div>
        <div class="trait-list">
          ${profile.traits.map((trait) => `<div class="trait-row"><div class="trait-row__top"><span>${trait.name}</span><strong>${trait.score}</strong></div><div class="trait-bar"><span style="width:${trait.score}%"></span></div></div>`).join("")}
        </div>
      </div>`, { wide: true, secondary: "Назад", primary: "Как мне комфортнее работать" });
  },
  () => {
    const values = currentProfile().workStyle;
    const cards = [
      { key: "environment", label: "Среда", value: state.workStyleOverrides.environment || values[0] },
      { key: "pace", label: "Темп", value: state.workStyleOverrides.pace || values[1] },
      { key: "autonomy", label: "Автономность", value: state.workStyleOverrides.autonomy || values[2] },
      { key: "tasks", label: "Тип задач", value: state.workStyleOverrides.tasks || values[3] }
    ];
    return shell(`
      <p class="onboarding-kicker">Рабочий стиль</p>
      <h2>Как вам комфортнее работать</h2>
      <p class="onboarding-lead">Нажмите на карточку, чтобы уточнить вариант. Это не жёсткие рамки — скорее среда, в которой вам проще раскрыть сильные стороны.</p>
      <div class="work-grid">
        ${cards.map((card) => `<button class="work-card" data-work-style="${card.key}"><small>${card.label}</small><strong>${card.value}</strong></button>`).join("")}
      </div>`, { secondary: "Назад", primary: "Посмотреть направления" });
  },
  () => {
    const directions = currentProfile().careerDirections;
    const [main, ...others] = directions;
    return shell(`
      <p class="onboarding-kicker">Карьерные направления</p>
      <h2>Мы нашли несколько направлений</h2>
      <div class="match-feature">
        <div class="match-feature__score">${main.match}% совпадение</div>
        <h3>${main.name}</h3>
        <div class="reason-list"><span>сильная визуальная составляющая</span><span>работа с неопределённостью</span><span>самостоятельность</span><span>влияние на продукт</span></div>
      </div>
      <div class="other-matches">${others.map((item) => `<div class="other-match"><strong>${item.name}</strong><span>${item.match}%</span></div>`).join("")}</div>`,
      { secondary: "Назад", primary: "Создать профиль" });
  },
  () => shell(`
    <div class="profile-ready">
      <img class="profile-ready__photo" src="${state.photoUrl || DEMO_PHOTO}" alt="${state.name || "Мария"}">
      <p class="onboarding-kicker">Ваш профиль готов</p>
      <h2>${state.name || "Мария"}</h2>
      <div class="profile-ready__meta">${state.role || "Product Designer"} · ${currentProfile().archetype.name}</div>
      <div class="profile-ready__stats">
        <span><strong>${state.skills.length || 14}</strong><small>навыков</small></span>
        <span><strong>${state.experience || "7 лет"}</strong><small>опыта</small></span>
        <span><strong>94%</strong><small>заполнено</small></span>
      </div>
    </div>`, { secondary: "Назад", primary: "Перейти в Т-Карьеру" })
];

const LAST_STEP = steps.length - 1;
const PHOTO_STEP = 1;
const SCAN_STEP = 2;
const CONTEXT_STEP = 7;

function renderOnboarding() {
  const root = $("#onboarding");
  root.className = state.step === SCAN_STEP ? "onboarding scan-screen" : "onboarding";
  root.innerHTML = steps[state.step]();
  hydrateIcons(root);
  bindOnboarding();
  if (state.step === SCAN_STEP) runVisualScan();
  if (state.cameraStream) {
    const video = $("video", root);
    if (video) video.srcObject = state.cameraStream;
  }
}

function bindOnboarding() {
  $$("[data-role]").forEach((button) => button.addEventListener("click", () => {
    if (button.disabled) return;
    state.role = button.dataset.role;
    renderOnboarding();
  }));
  $("#name-input")?.addEventListener("input", (event) => {
    state.name = event.target.value;
  });
  $("#role-input")?.addEventListener("input", (event) => {
    state.role = event.target.value;
    const primary = $("[data-primary]");
    if (primary) primary.disabled = !(state.resumeAttached && state.role.trim() && state.experience && state.skills.length > 0 && state.focus);
  });
  $$("[data-experience]").forEach((button) => button.addEventListener("click", () => {
    if (button.disabled) return;
    state.experience = button.dataset.experience;
    renderOnboarding();
  }));
  $$("[data-skill]").forEach((button) => button.addEventListener("click", () => {
    if (button.disabled) return;
    const value = button.dataset.skill;
    state.skills = state.skills.includes(value) ? state.skills.filter((item) => item !== value) : [...state.skills, value];
    renderOnboarding();
  }));
  $$("[data-focus]").forEach((button) => button.addEventListener("click", () => {
    if (button.disabled) return;
    state.focus = button.dataset.focus;
    renderOnboarding();
  }));
  $("[data-attach-resume]")?.addEventListener("click", () => attachDemoResume());
  $("[data-detach-resume]")?.addEventListener("click", () => {
    state.resumeAttached = false;
    state.resumeName = "";
    renderOnboarding();
  });
  $$("[data-work-style]").forEach((button) => button.addEventListener("click", () => {
    openWorkStyleSheet(button.dataset.workStyle);
  }));
  $$("[data-most]").forEach((button) => button.addEventListener("click", () => {
    const roundIndex = state.step - 4;
    state.psych[roundIndex] = { most: button.dataset.most, least: null };
    renderOnboarding();
  }));
  $$("[data-least]").forEach((button) => button.addEventListener("click", () => {
    const roundIndex = state.step - 4;
    state.psych[roundIndex] = { ...state.psych[roundIndex], least: button.dataset.least };
    renderOnboarding();
  }));
  $$("[data-reset-round]").forEach((button) => button.addEventListener("click", () => {
    state.psych[Number(button.dataset.resetRound)] = null;
    renderOnboarding();
  }));
  $("[data-secondary]")?.addEventListener("click", () => {
    stopCamera();
    if (state.step === SCAN_STEP + 1) { state.step = PHOTO_STEP; }
    else state.step = Math.max(0, state.step - 1);
    renderOnboarding();
  });
  $("[data-primary]")?.addEventListener("click", async (event) => {
    if (state.step === PHOTO_STEP) {
      if (!state.photoUrl && !state.photoFile) {
        showToast("Сделайте или загрузите фотографию");
        return;
      }
      stopCamera();
      state.step = SCAN_STEP;
      renderOnboarding();
      return;
    }
    if (state.step === CONTEXT_STEP) {
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = "Считаем...";
      await runSynthesis();
      state.step = CONTEXT_STEP + 1;
      renderOnboarding();
      return;
    }
    if (state.step === LAST_STEP) {
      enterApp();
      return;
    }
    state.step = Math.min(LAST_STEP, state.step + 1);
    renderOnboarding();
  });
  $("[data-onboarding-home]")?.addEventListener("click", () => {
    stopCamera();
    state.step = 0;
    renderOnboarding();
  });
  $("[data-upload]")?.addEventListener("click", () => $("#photo-input").click());
  $("[data-camera]")?.addEventListener("click", () => state.cameraStream ? capturePhoto() : startCamera());
}

async function startCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    showToast("Камера недоступна. Загрузите фотографию.");
    $("#photo-input").click();
    return;
  }
  try {
    state.cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 } }, audio: false });
    renderOnboarding();
  } catch {
    showToast("Не удалось открыть камеру. Проверьте разрешение.");
  }
}

function capturePhoto() {
  const video = $("video");
  if (!video?.videoWidth) return;
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  canvas.toBlob((blob) => {
    state.photoFile = new File([blob], "portrait.jpg", { type: "image/jpeg" });
    state.photoUrl = URL.createObjectURL(blob);
    stopCamera();
    renderOnboarding();
  }, "image/jpeg", .9);
}

function stopCamera() {
  state.cameraStream?.getTracks().forEach((track) => track.stop());
  state.cameraStream = null;
}

$("#photo-input").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 8 * 1024 * 1024) return showToast("Фотография должна быть меньше 8 МБ");
  state.photoFile = file;
  state.photoUrl = URL.createObjectURL(file);
  if (state.step !== PHOTO_STEP) state.step = PHOTO_STEP;
  renderOnboarding();
});

async function runVisualScan() {
  if (state.loading) return;
  state.loading = true;
  const statusPromise = new Promise((resolve) => {
    [0, 1, 2, 3].forEach((index) => setTimeout(() => {
      $$("[data-scan]").forEach((node, nodeIndex) => {
        node.classList.toggle("is-active", nodeIndex === index);
        node.classList.toggle("is-done", nodeIndex < index);
      });
      if (index === 3) setTimeout(resolve, 850);
    }, index * 950));
  });
  const apiPromise = (async () => {
    if (!state.photoFile) throw new Error("no-photo");
    const body = new FormData();
    body.append("photo", state.photoFile);
    body.append("assessment", JSON.stringify({}));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
      const response = await fetch(apiUrl("/api/profile/analyze"), {
        method: "POST",
        body,
        signal: controller.signal
      });
      if (!response.ok) throw new Error("analysis");
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  })().catch(() => ({ visualProfile: LOCAL_VISUAL_FALLBACK }));

  const [, result] = await Promise.all([statusPromise, apiPromise]);
  state.visualProfile = result.visualProfile || LOCAL_VISUAL_FALLBACK;
  state.visualBaseline = deriveBaselineTags(state.visualProfile);
  // DeepSeek (или fallback) наполняет поля итога после fal; клиент — запасной вариант
  state.visualPortrait = result.visualPortrait || deriveVisualPortrait(state.visualProfile);
  state.loading = false;
  state.step = SCAN_STEP + 1;
  renderOnboarding();
}

function attachDemoResume() {
  if (state.resumeLoading || state.resumeAttached) return;
  state.resumeLoading = true;
  renderOnboarding();
  setTimeout(() => {
    const demo = {
      name: state.name.trim() || "Мария",
      role: state.role.trim() || "Product Designer",
      experience: state.experience || "3–5 лет",
      skills: state.skills.length ? state.skills : ["Figma", "UX Research", "Product Design", "Аналитика", "Стратегия"],
      focus: state.focus || "Найти новую роль",
      fileName: "demo-resume-maria.pdf"
    };
    state.name = demo.name;
    state.role = demo.role;
    state.experience = demo.experience;
    state.skills = demo.skills;
    state.focus = demo.focus;
    state.resumeName = demo.fileName;
    state.resumeAttached = true;
    state.resumeLoading = false;
    renderOnboarding();
  }, 1400);
}

async function runSynthesis() {
  state.psychScores = computePsychScores(state.psych);
  try {
    const response = await fetch(apiUrl("/api/profile/generate"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visualProfile: state.visualProfile || LOCAL_VISUAL_FALLBACK,
        assessment: { focus: state.focus, psychScores: state.psychScores, resumeAttached: state.resumeAttached },
        experience: `${state.role} · ${state.experience}`,
        skills: state.skills,
        careerPreferences: [state.focus],
        resume: state.resumeAttached ? { name: state.resumeName, source: "demo" } : null
      })
    });
    if (!response.ok) throw new Error("generate");
    const result = await response.json();
    state.careerProfile = result.careerProfile || deriveLocalProfile();
  } catch {
    state.careerProfile = deriveLocalProfile();
  }
}

function openWorkStyleSheet(key) {
  const options = WORK_STYLE_OPTIONS[key];
  const current = state.workStyleOverrides[key] || currentProfile().workStyle[["environment", "pace", "autonomy", "tasks"].indexOf(key)];
  $("#modal-root").innerHTML = `<div class="modal-backdrop" data-close-modal>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="work-style-title">
      <div class="modal__header"><h2 id="work-style-title">${{ environment: "Среда", pace: "Темп", autonomy: "Автономность", tasks: "Тип задач" }[key]}</h2><button class="modal__close" data-close-modal aria-label="Закрыть">×</button></div>
      <div class="modal__body">
        <div class="focus-list">
          ${options.map((option) => `<button class="focus-row ${current === option ? "is-selected" : ""}" data-work-style-option="${option}">${option}</button>`).join("")}
        </div>
      </div>
    </div>
  </div>`;
  $$("[data-close-modal]").forEach((node) => node.addEventListener("click", (event) => {
    if (event.target === node) closeModal();
  }));
  $$("[data-work-style-option]").forEach((button) => button.addEventListener("click", () => {
    state.workStyleOverrides[key] = button.dataset.workStyleOption;
    closeModal();
    renderOnboarding();
  }));
}

async function loadData() {
  const endpoints = ["profile", "feed", "jobs", "people", "courses", "messages", "notifications"];
  const results = await Promise.all(endpoints.map(async (name) => {
    const response = await fetch(apiUrl(`/api/${name}`));
    if (!response.ok) throw new Error(name);
    return [name, await response.json()];
  }));
  results.forEach(([name, value]) => { state.data[name] = value; });
}

async function enterApp() {
  localStorage.setItem("t-career-onboarded-v2", "true");
  $("#onboarding").classList.add("is-hidden");
  $("#app").classList.remove("is-hidden");
  try {
    if (!state.data.profile) await loadData();
  } catch (error) {
    console.error("loadData failed", error);
    showToast("Не удалось загрузить часть данных");
  }

  if (!state.data.profile) {
    state.data.profile = {
      fullName: state.name.trim() || "Мария",
      role: state.role.trim() || "Product Designer",
      city: "Москва",
      photo: state.photoUrl || DEMO_PHOTO,
      archetype: state.careerProfile?.archetype?.name || "Визионер",
      completion: 94,
      strengths: [],
      experience: [],
      skills: state.skills.length ? state.skills : ["Figma", "UX", "Product Design"],
      education: "— · —",
      workStyle: {
        environment: state.workStyleOverrides.environment || "Небольшие команды",
        pace: state.workStyleOverrides.pace || "Высокий",
        autonomy: state.workStyleOverrides.autonomy || "Высокая",
        tasks: state.workStyleOverrides.tasks || "Новые и сложные"
      }
    };
  }
  if (!Array.isArray(state.data.feed)) state.data.feed = [];
  if (!Array.isArray(state.data.jobs)) state.data.jobs = [];
  if (!Array.isArray(state.data.people)) state.data.people = [];
  if (!Array.isArray(state.data.courses)) state.data.courses = [];
  if (!Array.isArray(state.data.messages)) state.data.messages = [];
  if (!Array.isArray(state.data.notifications)) state.data.notifications = [];

  if (state.photoUrl) state.data.profile.photo = state.photoUrl;
  if (state.name.trim()) state.data.profile.fullName = state.name.trim();
  if (state.role.trim()) state.data.profile.role = state.role.trim();
  if (state.skills.length) state.data.profile.skills = state.skills;
  const profile = state.careerProfile;
  if (profile?.archetype?.name) state.data.profile.archetype = profile.archetype.name;
  if (profile?.workStyle) {
    state.data.profile.workStyle = {
      environment: state.workStyleOverrides.environment || profile.workStyle[0],
      pace: state.workStyleOverrides.pace || profile.workStyle[1],
      autonomy: state.workStyleOverrides.autonomy || profile.workStyle[2],
      tasks: state.workStyleOverrides.tasks || profile.workStyle[3]
    };
  }

  $$("[data-profile-photo]").forEach((image) => {
    image.src = state.data.profile?.photo || state.photoUrl || DEMO_PHOTO;
  });
  navigate("feed");
  history.replaceState({ route: "feed" }, "", "/");
}

function pageHeader(title, subtitle = "", action = "") {
  return `<div class="page-header"><div><h1>${title}</h1>${subtitle ? `<p>${subtitle}</p>` : ""}</div>${action}</div>`;
}

function postCard(post) {
  return `<article class="card post-card" data-post="${post.id}">
    <div class="post-author">
      <img src="${post.avatar}" alt="">
      <div class="post-author__meta"><strong>${post.author}</strong><small>${post.role} · ${post.time}</small></div>
      <button class="post-more" aria-label="Ещё">···</button>
    </div>
    <p class="post-text">${post.text}</p>
    ${post.image ? `<img class="post-image" src="${post.image}" alt="Иллюстрация к публикации">` : ""}
    <div class="post-actions">
      <button class="post-action ${post.liked ? "is-active" : ""}" data-like="${post.id}"><span data-icon="heart"></span><span>${post.likes}</span></button>
      <button class="post-action" data-comment="${post.id}"><span data-icon="comment"></span><span>${post.comments}</span></button>
      <button class="post-action" data-share="${post.id}"><span data-icon="share"></span><span>Поделиться</span></button>
    </div>
  </article>`;
}

function renderFeed() {
  const profile = state.data.profile;
  return `<div class="content-wrap">
    ${pageHeader("Лента", "Идеи, люди и команды из вашего профессионального окружения")}
    <form class="card composer" id="post-form">
      <img src="${profile.photo}" alt="">
      <textarea name="text" rows="1" placeholder="Поделитесь наблюдением или вопросом"></textarea>
      <button class="btn btn--primary btn--small" type="submit">Опубликовать</button>
    </form>
    <div class="feed">${state.data.feed.map(postCard).join("")}</div>
  </div>`;
}

function jobCard(job) {
  return `<article class="card job-card" data-job="${job.id}" tabindex="0">
    <div class="job-card__top"><div><h3>${job.title}</h3><p class="job-company">${job.company}</p></div><span class="match-badge">${job.match}% совпадение</span></div>
    <div class="job-details"><span>${job.city}</span><span>${job.format}</span><span>${job.experience}</span></div>
    <div class="job-salary">${job.salary}</div>
    <div class="job-tags">${job.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
  </article>`;
}

function filteredJobs() {
  return state.data.jobs.filter((job) => {
    const query = state.jobQuery.toLowerCase();
    const matchesQuery = !query || [job.title, job.company, ...job.tags].some((value) => value.toLowerCase().includes(query));
    const matchesFormat = !state.jobFormat || job.format === state.jobFormat;
    return matchesQuery && matchesFormat;
  });
}

function renderCareer() {
  return `<div class="content-wrap content-wrap--wide">
    <section class="career-hero"><h1>Следующий шаг может быть ближе, чем кажется</h1><p>Подобрали роли, где ваш опыт, рабочий стиль и интересы складываются в сильное совпадение.</p><span class="career-hero__mark">Т</span></section>
    <div class="section-title"><h2>Подходящие вам вакансии</h2><span>${filteredJobs().length} вариантов</span></div>
    <div class="search-row"><div class="search-box"><span data-icon="search"></span><input class="search-input" id="job-search" value="${state.jobQuery}" placeholder="Роль, навык или компания"></div></div>
    <div class="filter-row">${["", "Удалённо", "Гибрид"].map((format) => `<button class="filter-button ${state.jobFormat === format ? "is-active" : ""}" data-format="${format}">${format || "Все форматы"}</button>`).join("")}<button class="filter-button" data-toast="Фильтры по городу, опыту и зарплате готовы">Ещё фильтры</button></div>
    <div class="jobs-list" id="jobs-list">${filteredJobs().map(jobCard).join("") || `<div class="card job-card"><h3>Ничего не нашли</h3><p class="job-company">Попробуйте изменить запрос или сбросить фильтр.</p></div>`}</div>
  </div>`;
}

function personCard(person) {
  return `<article class="card person-card">
    <div class="person-card__top">
      <img class="person-card__photo" src="${person.photo}" alt="">
      <div><h3>${person.name}</h3><p>${person.role}<br>${person.company}</p><span class="archetype-pill">${person.archetype}</span></div>
    </div>
    <div class="person-card__skills">${person.skills.join(" · ")}</div>
    <div class="person-card__footer">
      <div class="person-card__match">${person.match}% профессионального совпадения</div>
      <button class="btn ${person.followed ? "btn--followed" : "btn--dark"} btn--small" data-follow="${person.id}">${person.followed ? "Подписан" : "Подписаться"}</button>
    </div>
  </article>`;
}

function renderPeople() {
  return `<div class="content-wrap content-wrap--wide">
    ${pageHeader("Люди", "Находите профессионалов, с которыми интересно расти и делать новое")}
    <div class="search-row"><div class="search-box"><span data-icon="search"></span><input id="people-search" class="search-input" placeholder="Имя, роль или навык"></div></div>
    <div class="filter-row"><button class="filter-button is-active">Для вас</button><button class="filter-button" data-toast="Показываем людей из продуктового дизайна">Из вашей сферы</button><button class="filter-button" data-toast="Показываем контакты второго круга">Общие контакты</button></div>
    <div class="people-grid" id="people-grid">${state.data.people.map(personCard).join("")}</div>
  </div>`;
}

function renderDevelopment() {
  return `<div class="content-wrap content-wrap--wide">
    ${pageHeader("Развитие", "Не просто курсы — конкретные шаги к следующей роли")}
    <section class="development-score">
      <div class="score-ring"><strong>82%</strong></div>
      <div><h2>Вы близки к роли Lead Product Designer</h2><p>Сильная продуктовая база уже есть. Больше всего вырастет готовность через лидерство и стратегию.</p></div>
    </section>
    <div class="section-title"><h2>Что поможет сделать следующий шаг</h2><button data-toast="План развития сохранён в профиле">Мой план</button></div>
    <div class="course-grid">${state.data.courses.map((course) => `<article class="course-card"><span class="course-card__boost">+${course.boost}% к готовности</span><h3>${course.title}</h3><p>${course.provider} · ${course.duration}</p><button class="btn btn--soft btn--small" data-course="${course.id}">Добавить в план</button></article>`).join("")}</div>
  </div>`;
}

function dialogList() {
  return state.data.messages.map((dialog) => `<button class="dialog-item ${dialog.id === state.activeDialog ? "is-active" : ""}" data-dialog="${dialog.id}">
    <img src="${dialog.avatar}" alt=""><span class="dialog-item__copy"><strong>${dialog.person}</strong><small>${dialog.last}</small></span>${dialog.unread ? `<span class="unread">${dialog.unread}</span>` : ""}
  </button>`).join("");
}

function conversation(dialog) {
  const person = state.data.people.find((item) => item.name === dialog.person);
  const followed = Boolean(person?.followed);
  return `<section class="conversation">
    <div class="conversation__header">
      <button class="icon-button back-dialogs" data-back-dialogs style="display:none"><span data-icon="back"></span></button>
      <img src="${dialog.avatar}" alt=""><div class="conversation__identity"><strong>${dialog.person}</strong><small>${dialog.role}</small></div>
      ${person ? `<button class="btn ${followed ? "btn--followed" : "btn--dark"} btn--small conversation__follow" data-follow="${person.id}">${followed ? "Подписан" : "Подписаться"}</button>` : ""}
    </div>
    <div class="messages">${dialog.messages.map((message) => `<div class="message ${message.own ? "is-own" : ""}">${message.text}<time>${message.time}</time></div>`).join("")}</div>
    <form class="message-form" id="message-form"><input name="text" autocomplete="off" placeholder="Сообщение"><button class="btn btn--primary btn--small" type="submit">Отправить</button></form>
  </section>`;
}

function renderMessages() {
  const active = state.data.messages.find((item) => item.id === state.activeDialog) || state.data.messages[0];
  return `<div class="content-wrap content-wrap--wide">
    <div class="messages-layout ${window.innerWidth > 768 ? "show-conversation" : ""}">
      <aside class="dialogs"><div class="dialogs__header"><h1>Сообщения</h1><div class="search-box"><span data-icon="search"></span><input class="search-input" placeholder="Поиск"></div></div>${dialogList()}</aside>
      ${conversation(active)}
    </div>
  </div>`;
}

function renderNotifications() {
  return `<div class="content-wrap">
    ${pageHeader("Уведомления", "", `<button class="btn btn--soft btn--small" data-read-all>Прочитать все</button>`)}
    <div class="notification-list">${state.data.notifications.map((item) => `<article class="card notification-item ${item.read ? "" : "is-unread"}"><div class="notification-icon"><span data-icon="${item.type === "job" ? "briefcase" : item.type === "message" ? "message" : item.type === "course" ? "growth" : "people"}"></span></div><div><p>${item.text}</p><small>${item.time}</small></div></article>`).join("")}</div>
  </div>`;
}

function renderProfile() {
  const profile = state.data.profile;
  return `<div class="content-wrap content-wrap--wide">
    <section class="profile-hero">
      <img class="profile-hero__photo" src="${profile.photo}" alt="${profile.fullName}">
      <div><h1>${profile.fullName}</h1><p>${profile.role} · ${profile.city}</p><span class="profile-hero__archetype">${profile.archetype}</span></div>
      <div class="completion"><div class="completion__ring"><strong>${profile.completion}%</strong></div><small>профиль заполнен</small></div>
    </section>
    <div class="profile-layout">
      <div>
        <section class="card profile-section"><h2>Карьерный профиль</h2><div class="strength-list">${profile.strengths.map((item) => `<div class="strength-item">${item}</div>`).join("")}</div></section>
        <section class="card profile-section" style="margin-top:18px"><h2>Опыт</h2><div class="timeline">${profile.experience.map((item) => `<div class="timeline-item"><strong>${item.role}</strong><span>${item.company}</span><small>${item.period}</small></div>`).join("")}</div></section>
        <section class="card profile-section" style="margin-top:18px"><h2>Навыки</h2><div class="skills">${profile.skills.map((skill) => `<span>${skill}</span>`).join("")}</div></section>
      </div>
      <div>
        <section class="toggle-row"><div><strong>Открыта к предложениям</strong><div class="photo-note">Видят подходящие компании</div></div><button class="toggle" aria-label="Открыта к предложениям"><span></span></button></section>
        <section class="card profile-section" style="margin-top:18px"><h2>Рабочий стиль</h2><div class="style-list">${Object.entries({ "Среда": profile.workStyle.environment, "Темп": profile.workStyle.pace, "Автономность": profile.workStyle.autonomy, "Задачи": profile.workStyle.tasks }).map(([key, value]) => `<div class="style-row"><span>${key}</span><strong>${value}</strong></div>`).join("")}</div></section>
        <section class="card profile-section" style="margin-top:18px"><h2>Образование</h2><strong>${profile.education.split(" · ")[0]}</strong><p class="job-company">${profile.education.split(" · ")[1]}</p></section>
        <button class="btn btn--soft btn--block" style="margin-top:18px" data-toast="Редактор профиля откроется в полной версии">Редактировать профиль</button>
      </div>
    </div>
  </div>`;
}

const routeRenderers = {
  feed: renderFeed,
  career: renderCareer,
  people: renderPeople,
  development: renderDevelopment,
  messages: renderMessages,
  notifications: renderNotifications,
  profile: renderProfile
};

function renderRightRail() {
  const rail = $("#right-rail");
  if (!state.data.people.length || ["messages", "profile"].includes(state.route)) {
    rail.innerHTML = "";
    return;
  }
  rail.innerHTML = `<div class="right-rail__sticky">
    <section class="rail-card"><h3>Вам может быть интересно</h3>
      <button class="rail-metric" data-route="people"><strong>Люди</strong><span>3 новых</span></button>
      <button class="rail-metric" data-route="career"><strong>Вакансии</strong><span>5 подходящих</span></button>
      <button class="rail-metric" data-route="development"><strong>Развитие</strong><span>2 шага</span></button>
    </section>
    <section class="rail-card"><h3>Люди рядом</h3><div class="rail-list">
      ${state.data.people.slice(0, 3).map((person) => `<div class="rail-person"><img src="${person.photo}" alt=""><span class="rail-person__meta"><strong>${person.name}</strong><small>${person.role}</small></span><button class="rail-link" data-follow="${person.id}">+</button></div>`).join("")}
    </div></section>
    <section class="rail-card"><h3>Ваш профиль</h3><p class="job-company">Заполнен на 94%. Добавьте портфолио, чтобы повысить видимость для команд.</p><button class="rail-link" data-route="profile">Открыть профиль</button></section>
  </div>`;
}

function navigate(route, push = true) {
  if (!routeRenderers[route]) route = "feed";
  state.route = route;
  $("#main-content").innerHTML = routeRenderers[route]();
  $$("[data-route]").forEach((button) => button.classList.toggle("is-active", button.dataset.route === route));
  hydrateIcons($("#main-content"));
  bindPage();
  renderRightRail();
  bindGlobalActions();
  $("#main-content").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (push) history.pushState({ route }, "", `#${route}`);
}

function bindPage() {
  $("#post-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const textarea = $("textarea", event.currentTarget);
    const text = textarea.value.trim();
    if (!text) return;
    const response = await fetch(apiUrl("/api/posts"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
    if (response.ok) {
      state.data.feed.unshift(await response.json());
      navigate("feed", false);
      showToast("Публикация добавлена");
    }
  });
  $$("[data-like]").forEach((button) => button.addEventListener("click", () => {
    const post = state.data.feed.find((item) => item.id === Number(button.dataset.like));
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    const count = button.querySelector("span:last-child");
    count.textContent = post.likes;
    button.classList.toggle("is-active", post.liked);
  }));
  $$("[data-comment]").forEach((button) => button.addEventListener("click", () => showToast("Комментарии откроются в полной версии")));
  $$("[data-share]").forEach((button) => button.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(location.href); showToast("Ссылка скопирована"); } catch { showToast("Публикация готова к отправке"); }
  }));
  $$("[data-job]").forEach((card) => {
    const open = () => openJob(Number(card.dataset.job));
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => { if (event.key === "Enter") open(); });
  });
  $("#job-search")?.addEventListener("input", (event) => {
    state.jobQuery = event.target.value;
    $("#jobs-list").innerHTML = filteredJobs().map(jobCard).join("");
    hydrateIcons($("#jobs-list"));
    $$("[data-job]", $("#jobs-list")).forEach((card) => card.addEventListener("click", () => openJob(Number(card.dataset.job))));
  });
  $$("[data-format]").forEach((button) => button.addEventListener("click", () => {
    state.jobFormat = button.dataset.format;
    navigate("career", false);
  }));
  $("#people-search")?.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const result = state.data.people.filter((person) => [person.name, person.role, person.company, ...person.skills].some((value) => value.toLowerCase().includes(query)));
    $("#people-grid").innerHTML = result.map(personCard).join("");
    bindFollow();
  });
  bindFollow();
  $$("[data-course]").forEach((button) => button.addEventListener("click", () => {
    button.textContent = "В плане";
    button.className = "btn btn--dark btn--small";
    showToast("Добавлено в план развития");
  }));
  $$("[data-dialog]").forEach((button) => button.addEventListener("click", () => {
    state.activeDialog = Number(button.dataset.dialog);
    const dialog = state.data.messages.find((item) => item.id === state.activeDialog);
    dialog.unread = 0;
    navigate("messages", false);
    $(".messages-layout").classList.add("show-conversation");
  }));
  $("[data-back-dialogs]")?.addEventListener("click", () => $(".messages-layout").classList.remove("show-conversation"));
  $("#message-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = $("input", event.currentTarget);
    const text = input.value.trim();
    if (!text) return;
    const response = await fetch(apiUrl("/api/messages"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dialogId: state.activeDialog, text }) });
    if (response.ok) {
      const dialog = state.data.messages.find((item) => item.id === state.activeDialog);
      dialog.messages.push(await response.json());
      dialog.last = text;
      navigate("messages", false);
      $(".messages-layout").classList.add("show-conversation");
      requestAnimationFrame(() => { const box = $(".messages"); box.scrollTop = box.scrollHeight; });
    }
  });
  $("[data-read-all]")?.addEventListener("click", () => {
    state.data.notifications.forEach((item) => { item.read = true; });
    navigate("notifications", false);
    showToast("Все уведомления прочитаны");
  });
}

function bindFollow() {
  $$("[data-follow]").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    const person = state.data.people.find((item) => item.id === Number(button.dataset.follow));
    if (!person) return;
    person.followed = !person.followed;
    if (person.followed) showToast("Спасибо за знакомство");
    else showToast("Подписка отменена");
    if (state.route === "people") navigate("people", false);
    else if (state.route === "messages") navigate("messages", false);
    else {
      button.textContent = person.followed ? "✓" : "+";
      button.classList.toggle("is-followed", person.followed);
    }
  }));
}

function bindGlobalActions() {
  $$("[data-route]").forEach((button) => {
    button.onclick = () => navigate(button.dataset.route);
  });
  $$("[data-toast]").forEach((button) => {
    button.onclick = () => showToast(button.dataset.toast);
  });
  bindFollow();
}

function openJob(id) {
  const job = state.data.jobs.find((item) => item.id === id);
  if (!job) return;
  const reasons = job.reasons || { skills: 96, experience: 93, workStyle: 91, interests: 88 };
  const companyMark = (job.company || "Т").trim().charAt(0).toUpperCase();
  $("#modal-root").innerHTML = `<div class="modal-backdrop" data-close-modal>
    <div class="modal modal--job" role="dialog" aria-modal="true" aria-labelledby="job-title">
      <div class="modal__header">
        <div class="job-modal__brand"><span class="job-modal__mark">${companyMark}</span><div><h2 id="job-title">${job.title}</h2><p class="job-company">${job.company} · ${job.city} · ${job.format}</p></div></div>
        <button class="modal__close" data-close-modal aria-label="Закрыть">×</button>
      </div>
      <div class="modal__body">
        <div class="job-modal__salary">${job.salary}</div>
        <div class="job-modal__score">
          <div><small>Совпадение с профилем</small><strong>${job.match}%</strong></div>
          <div class="job-modal__ring" style="--match:${job.match}"><span>${job.match}</span></div>
        </div>
        <h3>Почему вам подходит</h3>
        <div class="reason-bars">${Object.entries({ "Навыки": reasons.skills, "Опыт": reasons.experience, "Рабочий стиль": reasons.workStyle, "Интересы": reasons.interests }).map(([label, score]) => `<div class="reason-bar"><div class="reason-bar__top"><span>${label}</span><strong>${score}%</strong></div><div class="reason-bar__line"><span style="width:${score}%"></span></div></div>`).join("")}</div>
        <p class="job-modal__desc">${job.description}</p>
        <div class="job-tags">${job.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      </div>
      <div class="modal__actions">
        <button class="btn ${job.applied ? "btn--applied" : "btn--primary"}" data-apply>${job.applied ? "Отклик отправлен" : "Откликнуться"}</button>
        <button class="btn ${job.saved ? "btn--followed" : "btn--soft"}" data-save-job>${job.saved ? "Сохранено" : "Сохранить"}</button>
      </div>
    </div>
  </div>`;
  $$("[data-close-modal]").forEach((node) => node.addEventListener("click", (event) => {
    if (event.target === node) closeModal();
  }));
  $("[data-apply]").addEventListener("click", (event) => {
    if (job.applied) return;
    job.applied = true;
    const button = event.currentTarget;
    button.className = "btn btn--applied";
    button.textContent = "Отклик отправлен";
    showToast("Отклик отправлен команде");
  });
  $("[data-save-job]").addEventListener("click", (event) => {
    job.saved = !job.saved;
    const button = event.currentTarget;
    button.className = `btn ${job.saved ? "btn--followed" : "btn--soft"}`;
    button.textContent = job.saved ? "Сохранено" : "Сохранить";
    showToast(job.saved ? "Вакансия сохранена" : "Вакансия убрана из сохранённых");
  });
}

function closeModal() {
  $("#modal-root").innerHTML = "";
}

function showToast(text) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = text;
  $("#toast-root").append(toast);
  setTimeout(() => toast.remove(), 2800);
}

window.addEventListener("popstate", (event) => {
  if (!$("#app").classList.contains("is-hidden")) navigate(event.state?.route || location.hash.slice(1) || "feed", false);
});
window.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });

hydrateIcons();

// Принудительный сброс старого онбординга/кеша сессии — всех ведём заново.
["t-career-onboarded", "t-career-profile", "t-career-state"].forEach((key) => {
  try { localStorage.removeItem(key); } catch (_) { /* ignore */ }
});

const shouldShowApp = location.pathname !== "/demo" && localStorage.getItem("t-career-onboarded-v2") === "true";
if (shouldShowApp) {
  enterApp();
} else {
  renderOnboarding();
}
