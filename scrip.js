(() => {
const SELECTORS = {
  app: ".app",
  startJourney: "#startJourney",
  goToLetter: "#goToLetter",
  memoryScroll: ".memory-scroll",
  memoryStep: "[data-memory-step]",
  memoryScene: ".memory-scene",
  memoryNumber: "[data-memory-number]",
  memoryTitle: "[data-memory-title]",
  memoryText: "[data-memory-text]",
  memoryDetail: "[data-memory-detail]",
  memoryDot: "[data-memory-dot]",
  memoryCard: "[data-memory-card]",
  memoryButton: ".memory-card__button, .memory-card__unlock",
  memoryHidden: ".memory-card__hidden",
  memoryProgressText: "#memoryProgressText",
  memoryProgressBar: "#memoryProgressBar",
  jokeChip: "[data-joke]",
  jokeResult: "#jokeResult",
  finalLetter: ".final-letter",
  finalLetterBadge: ".final-letter__badge",
  letterTarget: ".final-letter .card-shell",
  completionNote: ".completion-note",
  card: "#birthdayCard",
  cardToggle: "#cardToggle",
  closeCard: "#closeCard",
  confettiLayer: "#confettiLayer",
};

const JOKE_MESSAGES = {
  "Un free": "Una frase normal para cualquiera, pero peligrosa para nuestros horarios.",
  "un-free": "Una frase normal para cualquiera, pero peligrosa para nuestros horarios.",
  Pipilandia: "No sé quién autorizó ese nombre, pero ya quedó.",
  pipilandia: "No sé quién autorizó ese nombre, pero ya quedó.",
  "A sus órdenes, jefa": "Yo no elegí obedecer. Bueno, un poco sí.",
  jefa: "Yo no elegí obedecer. Bueno, un poco sí.",
  "Ya listo calisto": "No sé por qué daba gracia, pero daba.",
  calisto: "No sé por qué daba gracia, pero daba.",
  "Lesto mameta": "Esto no se explica. Se respeta.",
  mameta: "Esto no se explica. Se respeta.",
  Jeanpipi: "Mi nombre deformado oficialmente. Gracias, supongo.",
  jeanpipi: "Mi nombre deformado oficialmente. Gracias, supongo.",
  "Dúo dinámico": "No sé si dinámico, pero dúo sí.",
  "duo-dinamico": "No sé si dinámico, pero dúo sí.",
  "Solo el mejor dúo": "Sin pruebas, pero con mucha seguridad.",
  "mejor-duo": "Sin pruebas, pero con mucha seguridad.",
};

const DEFAULT_JOKE_MESSAGE = "Este recuerdo todavía está en modo secreto.";
const CONFETTI_COOLDOWN = 1500;
const confettiColors = ["#ff4f8b", "#ffd166", "#4dd8ff", "#9b5cff", "#5dffbf"];
const scrollMemories = [
  {
    number: "01",
    title: "El inicio del caos",
    text: "Bueno, creo que todo empezó más o menos por ahí, con un “un free” que parecía normal.",
    detail: "Y es que al inicio era solo jugar, esperar, molestar un rato y ya. Pero no sé, de alguna forma se fue quedando la costumbre.",
  },
  {
    number: "02",
    title: "La jefa, básicamente",
    text: "No sé en qué momento apareciste como la jefa, pero pasó.",
    detail: "A sus órdenes, jefa. Suena tonto, aunque siendo sinceros, ya quedó como parte del lore.",
  },
  {
    number: "03",
    title: "Los nombres raros",
    text: "Jeanpipi, pipi, Romi, loca… o sea, si alguien más lee eso, no entiende nada.",
    detail: "Pero creo que justo por eso tiene gracia. No todo tiene que explicarse; algunas cosas solo tienen sentido porque son nuestras.",
  },
  {
    number: "04",
    title: "Cuando jugar era la excusa",
    text: "Al inicio era Free o Ludo, sí, pero después ya parecía más una excusa para hablar.",
    detail: "Aunque bueno, tampoco voy a mentir: perder igual daba cólera, más si alguien renegaba.",
  },
  {
    number: "05",
    title: "El dúo",
    text: "De alguna forma terminamos siendo dúo dinámico.",
    detail: "Tú renegando, yo molestando, y aun así funcionando. Raro, pero efectivo.",
  },
  {
    number: "06",
    title: "El desorden de siempre",
    text: "Tareas, sueño, clases, cansancio, mensajes random… todo mezclado.",
    detail: "No era algo perfecto ni ordenado, pero creo que justamente por eso se sentía real.",
  },
  {
    number: "07",
    title: "Esto no costó plata",
    text: "No es el regalo más caro, ni el más perfecto, ni nada de eso.",
    detail: "Pero sí tiene tiempo, memoria y un poco de nosotros. Y bueno, eso para mí vale más.",
  },
];

let app;
let startJourneyButton;
let goToLetterButton;
let memoryScroll;
let memorySteps = [];
let memoryScene;
let memoryNumber;
let memoryTitle;
let memoryText;
let memoryDetail;
let memoryDots = [];
let memoryCards = [];
let memoryProgressText;
let memoryProgressBar;
let jokeChips = [];
let jokeResult;
let finalLetter;
let finalLetterBadge;
let letterTarget;
let completionNote;
let card;
let cardToggle;
let closeCard;
let confettiLayer;
let lastConfettiTime = 0;
let hasOpenedFinalLetter = false;
let activeMemoryIndex = 0;
let memoryObserver;
let memoryChangeTimer;

function init() {
  app = document.querySelector(SELECTORS.app);
  startJourneyButton = document.querySelector(SELECTORS.startJourney);
  goToLetterButton = document.querySelector(SELECTORS.goToLetter);
  memoryScroll = document.querySelector(SELECTORS.memoryScroll);
  memorySteps = Array.from(document.querySelectorAll(SELECTORS.memoryStep));
  memoryScene = document.querySelector(SELECTORS.memoryScene);
  memoryNumber = document.querySelector(SELECTORS.memoryNumber);
  memoryTitle = document.querySelector(SELECTORS.memoryTitle);
  memoryText = document.querySelector(SELECTORS.memoryText);
  memoryDetail = document.querySelector(SELECTORS.memoryDetail);
  memoryDots = Array.from(document.querySelectorAll(SELECTORS.memoryDot));
  memoryCards = Array.from(document.querySelectorAll(SELECTORS.memoryCard));
  memoryProgressText = document.querySelector(SELECTORS.memoryProgressText);
  memoryProgressBar = document.querySelector(SELECTORS.memoryProgressBar);
  jokeChips = Array.from(document.querySelectorAll(SELECTORS.jokeChip));
  jokeResult = document.querySelector(SELECTORS.jokeResult);
  finalLetter = document.querySelector(SELECTORS.finalLetter);
  finalLetterBadge = document.querySelector(SELECTORS.finalLetterBadge);
  letterTarget = document.querySelector(SELECTORS.letterTarget);
  completionNote = document.querySelector(SELECTORS.completionNote);
  card = document.querySelector(SELECTORS.card);
  cardToggle = document.querySelector(SELECTORS.cardToggle);
  closeCard = document.querySelector(SELECTORS.closeCard);
  confettiLayer = document.querySelector(SELECTORS.confettiLayer);

  setupStartJourney();
  setupGoToLetter();
  setupMemoryScroll();
  setupInsideJokes();
  setupFinalCard();
  updateMemoryScene(0, { immediate: true });
}

function setupStartJourney() {
  if (!startJourneyButton || !memoryScroll) {
    return;
  }

  startJourneyButton.addEventListener("click", handleStartJourney);
}

function handleStartJourney(event) {
  event.preventDefault();
  document.body.classList.add("journey-started");
  app?.classList.add("journey-started");

  memoryScroll.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function setupGoToLetter() {
  if (!goToLetterButton) {
    return;
  }

  goToLetterButton.addEventListener("click", (event) => {
    event.preventDefault();
    const target = letterTarget || finalLetter;

    target?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
}

function setupMemoryScroll() {
  if (!memorySteps.length || !scrollMemories.length) {
    setupMemoryCards();
    updateMemoryProgress(0);
    return;
  }

  memorySteps.forEach((step, index) => {
    step.dataset.memoryStep = String(index);
  });

  if (!("IntersectionObserver" in window)) {
    window.addEventListener("scroll", updateMemoryFromScroll, { passive: true });
    updateMemoryFromScroll();
    return;
  }

  memoryObserver = new IntersectionObserver(handleMemoryIntersections, {
    root: null,
    threshold: 0.1,
    rootMargin: "-38% 0px -38% 0px",
  });

  memorySteps.forEach((step) => memoryObserver.observe(step));
}

function handleMemoryIntersections(entries) {
  const visibleEntry = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visibleEntry) {
    return;
  }

  const nextIndex = Number(visibleEntry.target.dataset.memoryStep);
  updateMemoryScene(nextIndex);
}

function updateMemoryFromScroll() {
  if (!memorySteps.length) {
    return;
  }

  const viewportCenter = window.innerHeight / 2;
  let closestIndex = activeMemoryIndex;
  let closestDistance = Number.POSITIVE_INFINITY;

  memorySteps.forEach((step, index) => {
    const rect = step.getBoundingClientRect();
    const stepCenter = rect.top + rect.height / 2;
    const distance = Math.abs(stepCenter - viewportCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  updateMemoryScene(closestIndex);
}

function updateMemoryScene(index, options = {}) {
  const total = scrollMemories.length;
  const safeIndex = Math.min(Math.max(index, 0), total - 1);
  const memory = scrollMemories[safeIndex];

  if (!memory) {
    updateMemoryProgress(0);
    return;
  }

  if (safeIndex === activeMemoryIndex && !options.immediate) {
    updateMemoryProgress(safeIndex);
    return;
  }

  activeMemoryIndex = safeIndex;
  memorySteps.forEach((step, stepIndex) => {
    step.classList.toggle("is-active", stepIndex === safeIndex);
  });
  memoryDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === safeIndex);
  });

  if (options.immediate || !memoryScene) {
    renderMemory(memory);
  } else {
    window.clearTimeout(memoryChangeTimer);
    memoryScene.classList.add("is-changing");
    memoryChangeTimer = window.setTimeout(() => {
      renderMemory(memory);
      memoryScene.classList.remove("is-changing");
    }, 160);
  }

  updateMemoryProgress(safeIndex);
}

function renderMemory(memory) {
  if (memoryNumber) {
    memoryNumber.textContent = memory.number;
  }

  if (memoryTitle) {
    memoryTitle.textContent = memory.title;
  }

  if (memoryText) {
    memoryText.textContent = memory.text;
  }

  if (memoryDetail) {
    memoryDetail.textContent = memory.detail;
  }
}

function setupMemoryCards() {
  memoryCards.forEach((memoryCard, index) => {
    const button = memoryCard.querySelector(SELECTORS.memoryButton);
    const hiddenContent = memoryCard.querySelector(SELECTORS.memoryHidden);

    memoryCard.dataset.unlocked = memoryCard.dataset.unlocked || "false";

    if (button && hiddenContent) {
      const hiddenId = hiddenContent.id || `memory-detail-${index + 1}`;
      hiddenContent.id = hiddenId;
      hiddenContent.setAttribute("aria-hidden", String(!isMemoryUnlocked(memoryCard)));
      button.setAttribute("aria-controls", hiddenId);
      button.setAttribute("aria-expanded", String(isMemoryUnlocked(memoryCard)));
    }

    if (button) {
      button.addEventListener("click", () => unlockMemoryCard(memoryCard));
    }

    syncMemoryCardState(memoryCard);
  });
}

function unlockMemoryCard(memoryCard) {
  if (!memoryCard || isMemoryUnlocked(memoryCard)) {
    return;
  }

  memoryCard.classList.add("is-unlocked");
  memoryCard.dataset.unlocked = "true";
  syncMemoryCardState(memoryCard);

  updateMemoryProgress();
}

function syncMemoryCardState(memoryCard) {
  if (!memoryCard) {
    return;
  }

  const button = memoryCard.querySelector(SELECTORS.memoryButton);
  const hiddenContent = memoryCard.querySelector(SELECTORS.memoryHidden);
  const isUnlocked = isMemoryUnlocked(memoryCard);

  memoryCard.classList.toggle("is-unlocked", isUnlocked);
  memoryCard.dataset.unlocked = String(isUnlocked);

  if (hiddenContent) {
    hiddenContent.hidden = !isUnlocked;
    hiddenContent.setAttribute("aria-hidden", String(!isUnlocked));
  }

  if (button) {
    button.textContent = isUnlocked ? "Recuerdo desbloqueado" : "Desbloquear recuerdo";
    button.setAttribute("aria-expanded", String(isUnlocked));
    button.setAttribute("aria-disabled", String(isUnlocked));
  }
}

function isMemoryUnlocked(memoryCard) {
  return memoryCard?.classList.contains("is-unlocked") || memoryCard?.dataset.unlocked === "true";
}

function updateMemoryProgress(index = activeMemoryIndex) {
  const total = scrollMemories.length || memoryCards.length;
  const current = total > 0 ? Math.min(Math.max(index + 1, 1), total) : 0;
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  if (memoryProgressText) {
    memoryProgressText.textContent = `${current} de ${total} recuerdos`;
  }

  if (memoryProgressBar) {
    memoryProgressBar.style.width = `${percentage}%`;
  }

  if (total > 0 && current === total) {
    unlockFinalLetter();
  }
}

function unlockFinalLetter() {
  document.body.classList.add("all-memories-unlocked");
  app?.classList.add("all-memories-unlocked");
  finalLetter?.classList.add("is-ready");
  finalLetter?.setAttribute("data-ready", "true");

  if (finalLetterBadge) {
    finalLetterBadge.textContent = "Carta final desbloqueada";
  }
}

function setupInsideJokes() {
  jokeChips.forEach((chip) => {
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", () => showJoke(chip));
  });
}

function showJoke(chip) {
  if (!chip) {
    return;
  }

  jokeChips.forEach((currentChip) => {
    const isActive = currentChip === chip;
    currentChip.classList.toggle("is-active", isActive);
    currentChip.setAttribute("aria-pressed", String(isActive));
  });

  const jokeKey = chip.dataset.joke;
  const jokeLabel = chip.textContent.trim();
  const message = JOKE_MESSAGES[jokeKey] || JOKE_MESSAGES[jokeLabel] || DEFAULT_JOKE_MESSAGE;

  if (jokeResult) {
    jokeResult.textContent = message;
  }
}

function setupFinalCard() {
  if (cardToggle) {
    cardToggle.addEventListener("click", () => {
      setCardOpen(!card?.classList.contains("is-open"));
    });
  }

  if (closeCard) {
    closeCard.addEventListener("click", () => {
      setCardOpen(false);
      cardToggle?.focus();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && card?.classList.contains("is-open")) {
      setCardOpen(false);
    }
  });
}

function setCardOpen(isOpen) {
  if (!card) {
    return;
  }

  card.classList.toggle("is-open", isOpen);
  cardToggle?.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    document.body.classList.add("letter-opened");
    app?.classList.add("letter-opened");

    if (!hasOpenedFinalLetter) {
      hasOpenedFinalLetter = true;
      completionNote?.classList.add("is-visible");
    }

    launchConfetti();
  }
}

function launchConfetti() {
  if (!confettiLayer) {
    return;
  }

  const now = Date.now();

  if (now - lastConfettiTime < CONFETTI_COOLDOWN) {
    return;
  }

  lastConfettiTime = now;

  const pieces = 70;

  for (let index = 0; index < pieces; index += 1) {
    const piece = document.createElement("span");
    const color = confettiColors[index % confettiColors.length];
    const left = Math.random() * 100;
    const delay = Math.random() * 0.35;
    const duration = 2.6 + Math.random() * 1.8;
    const drift = `${Math.random() * 220 - 110}px`;
    const spin = `${Math.random() * 900 + 360}deg`;

    piece.className = "confetti";
    piece.style.left = `${left}vw`;
    piece.style.color = color;
    piece.style.background = color;
    piece.style.animationDelay = `${delay}s`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.setProperty("--drift", drift);
    piece.style.setProperty("--spin", spin);

    if (index % 3 === 0) {
      piece.style.borderRadius = "50%";
      piece.style.width = "9px";
      piece.style.height = "9px";
    }

    confettiLayer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
})();
