const initialState = {
  turn: 1,
  dateIndex: 0,
  politicalPower: 45,
  stability: 58,
  warSupport: 42,
  escalation: 36,
  completedFocuses: [],
  factions: {
    natoLoyalists: 52,
    neutralists: 47,
    sovietEnvoys: 24,
    reunificationBloc: 38,
  },
  eventLog: [
    "Emergency broadcasts confirm a limited nuclear exchange. Bonn convenes an all-party survival cabinet.",
    "Moscow offers security guarantees if Germany abandons NATO logistics corridors.",
  ],
};

const months = ["Nov 1983", "Dec 1983", "Jan 1984", "Feb 1984", "Mar 1984", "Apr 1984", "May 1984", "Jun 1984"];

const factionLabels = {
  natoLoyalists: "NATO Loyalists",
  neutralists: "Neutralists",
  sovietEnvoys: "Soviet Negotiators",
  reunificationBloc: "Reunification Bloc",
};

const focuses = [
  {
    id: "restore-command",
    title: "Restore Federal Command",
    description: "Reconnect state governments, emergency services, and Bundeswehr commanders under a single crisis authority.",
    cost: 20,
    effects: { stability: 8, warSupport: 2, factions: { neutralists: 4, reunificationBloc: -2 } },
    objective: "Federal command channels restored",
    log: "Federal command channels are restored. Regional leaders cautiously accept Bonn's emergency authority.",
  },
  {
    id: "secret-moscow",
    title: "Open Secret Talks with Moscow",
    description: "Probe Soviet terms for German security, reunification, and survival outside the NATO chain of command.",
    cost: 25,
    effects: { stability: -4, escalation: 5, warSupport: 6, factions: { natoLoyalists: -8, sovietEnvoys: 14, reunificationBloc: 5 } },
    objective: "Moscow channel opened",
    log: "Back-channel envoys cross into East Berlin. Rumors of Soviet guarantees unsettle NATO loyalists.",
  },
  {
    id: "rally-nato",
    title: "Rally the NATO Remnants",
    description: "Bind Britain, France, and surviving U.S. command nodes to a renewed defense of Central Europe.",
    cost: 25,
    effects: { stability: -2, escalation: 3, warSupport: 10, factions: { natoLoyalists: 13, neutralists: -5, sovietEnvoys: -4 } },
    objective: "NATO corridor secured",
    log: "NATO air corridors reopen under heavy guard. Allied officers return to German planning rooms.",
  },
  {
    id: "european-pact",
    title: "Propose a European Survival Pact",
    description: "Build an independent European bloc that can negotiate with both superpowers from a position of unity.",
    cost: 30,
    effects: { stability: 4, escalation: -4, warSupport: -2, factions: { neutralists: 12, natoLoyalists: -3, sovietEnvoys: -3 } },
    objective: "European pact proposal drafted",
    log: "Paris and London receive a German proposal for a neutral European survival pact.",
  },
];

const actions = [
  {
    id: "rationing",
    title: "Emergency Rationing",
    description: "+6 stability, costs 12 political power.",
    cost: 12,
    effects: { stability: 6, factions: { neutralists: 2 } },
    log: "Ration books and fuel controls calm panic buying in major cities.",
  },
  {
    id: "mobilize",
    title: "Mobilize Territorial Defense",
    description: "+8 war support, +2 escalation, costs 16 political power.",
    cost: 16,
    effects: { warSupport: 8, escalation: 2, factions: { natoLoyalists: 4, reunificationBloc: 4 } },
    log: "Territorial defense units report for duty along rail hubs and border crossings.",
  },
  {
    id: "deescalate",
    title: "Backchannel De-escalation",
    description: "-6 escalation, -2 war support, costs 18 political power.",
    cost: 18,
    effects: { escalation: -6, warSupport: -2, factions: { neutralists: 5, natoLoyalists: -2 } },
    log: "Swiss intermediaries carry German de-escalation proposals to both nuclear blocs.",
  },
];

const regionIntel = {
  "United Kingdom": "NATO-aligned. The government is intact, but naval bases are on maximum alert after strikes across the Atlantic.",
  France: "NATO-aligned but wary. Paris is debating whether Europe can rely on a wounded United States.",
  "West Germany": "Contested political heartland. Refugees, mobilization orders, and reunification demands are straining public trust.",
  "East Germany": "Warsaw Pact staging ground. Soviet advisors are promising stability if Germany accepts a new settlement.",
  Poland: "Warsaw Pact corridor. Rail lines carry fuel, armor, and rumors of a westward offensive.",
  Scandinavia: "Neutral-leaning. Governments are preparing civil defense shelters and quiet mediation offers.",
  Baltics: "Soviet-controlled. Communications blackouts suggest internal security sweeps.",
  "Fallout corridor": "Danger zone. Tactical detonations and damaged reactors have made movement costly and politically explosive.",
};

let state = structuredClone(initialState);
let toastTimeout;

const clamp = (value) => Math.max(0, Math.min(100, value));
const formatEffect = ([key, value]) => `${value > 0 ? "+" : ""}${value} ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`;

function applyEffects(effects) {
  state.stability = clamp(state.stability + (effects.stability ?? 0));
  state.warSupport = clamp(state.warSupport + (effects.warSupport ?? 0));
  state.escalation = clamp(state.escalation + (effects.escalation ?? 0));

  Object.entries(effects.factions ?? {}).forEach(([key, value]) => {
    state.factions[key] = clamp(state.factions[key] + value);
  });
}

function spendPoliticalPower(cost) {
  if (state.politicalPower < cost) {
    showToast(`Not enough political power. You need ${cost} PP.`);
    return false;
  }
  state.politicalPower -= cost;
  return true;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 2600);
}

function setGameVisible(isVisible) {
  document.querySelector("#briefing-screen").classList.toggle("hidden", isVisible);
  document.querySelector("#game-shell").classList.toggle("hidden", !isVisible);
}

function renderStatus() {
  document.querySelector("#turn").textContent = state.turn;
  document.querySelector("#date").textContent = months[state.dateIndex % months.length];
  document.querySelector("#political-power").textContent = state.politicalPower;
  document.querySelector("#stability").textContent = `${state.stability}%`;
  document.querySelector("#escalation").textContent = `${state.escalation}%`;
  document.querySelector("#power-bar").style.width = `${Math.min(state.politicalPower, 100)}%`;
  document.querySelector("#stability-bar").style.width = `${state.stability}%`;
  document.querySelector("#escalation-bar").style.width = `${state.escalation}%`;
}

function createCard(item, buttonLabel, onClick, disabled = false, className = "") {
  const card = document.createElement("div");
  card.className = `card ${className}`.trim();
  const effects = Object.entries(item.effects)
    .filter(([key]) => key !== "factions")
    .map(formatEffect)
    .map((effect) => `<span class="effect-pill">${effect}</span>`)
    .join("");

  card.innerHTML = `
    <div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="focus-effects">${effects}</div>
    </div>
  `;

  const button = document.createElement("button");
  button.className = "card-button";
  button.textContent = buttonLabel;
  button.disabled = disabled;
  button.addEventListener("click", onClick);
  card.append(button);
  return card;
}

function renderFocuses() {
  const list = document.querySelector("#focus-list");
  list.replaceChildren();

  focuses.forEach((focus) => {
    const completed = state.completedFocuses.includes(focus.id);
    const unaffordable = state.politicalPower < focus.cost;
    const label = completed ? "Completed" : `Start (${focus.cost} PP)`;

    list.append(
      createCard(
        focus,
        label,
        () => {
          if (!spendPoliticalPower(focus.cost)) return;
          state.completedFocuses.push(focus.id);
          applyEffects(focus.effects);
          state.eventLog.unshift(focus.log);
          document.querySelector("#current-objective").textContent = focus.objective;
          document.querySelector("#objective-detail").textContent = "Advance the month to test the political consequences of this decision.";
          showToast(focus.objective);
          render();
        },
        completed || unaffordable,
        completed ? "focus-card active" : "focus-card",
      ),
    );
  });
}

function renderActions() {
  const list = document.querySelector("#action-list");
  list.replaceChildren();

  actions.forEach((action) => {
    list.append(
      createCard(
        action,
        "Approve",
        () => {
          if (!spendPoliticalPower(action.cost)) return;
          applyEffects(action.effects);
          state.eventLog.unshift(action.log);
          showToast(action.title);
          render();
        },
        state.politicalPower < action.cost,
      ),
    );
  });
}

function renderFactions() {
  const list = document.querySelector("#faction-list");
  list.replaceChildren();

  Object.entries(state.factions).forEach(([key, value]) => {
    const row = document.createElement("div");
    row.className = "faction-row";
    row.innerHTML = `
      <div class="faction-header"><strong>${factionLabels[key]}</strong><span>${value}%</span></div>
      <div class="progress-track"><span class="progress-fill" style="width: ${value}%"></span></div>
    `;
    list.append(row);
  });
}

function renderObjectives() {
  const list = document.querySelector("#objective-list");
  list.replaceChildren();

  const objectives = [
    { title: "Maintain stability", detail: `Keep stability above 35%. Current: ${state.stability}%`, complete: state.stability >= 35 },
    { title: "Avoid uncontrolled escalation", detail: `Keep escalation below 70%. Current: ${state.escalation}%`, complete: state.escalation < 70 },
    { title: "Define Germany's path", detail: `Complete 2 national focuses. Current: ${state.completedFocuses.length}/2`, complete: state.completedFocuses.length >= 2 },
  ];

  objectives.forEach((objective) => {
    const card = document.createElement("div");
    card.className = "objective-card";
    card.innerHTML = `<h3>${objective.complete ? "✓" : "○"} ${objective.title}</h3><p>${objective.detail}</p>`;
    list.append(card);
  });
}

function renderLog() {
  const log = document.querySelector("#event-log");
  log.replaceChildren();

  state.eventLog.slice(0, 8).forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = entry;
    log.append(item);
  });
}

function advanceTurn() {
  state.turn += 1;
  state.dateIndex += 1;
  state.politicalPower += 18;
  state.escalation = clamp(state.escalation + Math.floor(Math.random() * 5) - 1);

  const monthlyEvents = [
    "Refugee columns from the inner German border overwhelm local authorities.",
    "Shortwave operators report confused U.S. retaliation orders from surviving command bunkers.",
    "Soviet armored formations conduct exercises near the Fulda corridor.",
    "European ministers ask Germany to clarify whether it seeks alliance, neutrality, or reunification.",
    "Civil defense crews mark new fallout hot spots along damaged industrial corridors.",
  ];

  state.eventLog.unshift(monthlyEvents[state.turn % monthlyEvents.length]);
  showToast(`Advanced to ${months[state.dateIndex % months.length]}`);
  render();
}

function resetGame() {
  state = structuredClone(initialState);
  document.querySelector("#region-detail").textContent = "Select a region to inspect its current strategic situation.";
  document.querySelector("#current-objective").textContent = "Stabilize the Federal Republic";
  document.querySelector("#objective-detail").textContent = "Complete a focus or cabinet action, then advance the month to see the crisis evolve.";
  setGameVisible(false);
  render();
}

function render() {
  renderStatus();
  renderFocuses();
  renderActions();
  renderFactions();
  renderObjectives();
  renderLog();
}

document.querySelector("#next-turn").addEventListener("click", advanceTurn);
document.querySelector("#new-game").addEventListener("click", resetGame);
document.querySelector("#start-session").addEventListener("click", () => setGameVisible(true));
document.querySelector("#skip-briefing").addEventListener("click", () => setGameVisible(true));
document.querySelector("#briefing-toggle").addEventListener("click", () => setGameVisible(false));

document.querySelectorAll(".region").forEach((region) => {
  region.addEventListener("click", () => {
    document.querySelector("#region-detail").textContent = regionIntel[region.dataset.region];
  });
});

render();
