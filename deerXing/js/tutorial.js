const TUTORIAL_SAVE_KEY = "deerXingTutorialComplete";

export function createTutorialState() {
  let completed = false;
  let maxCompletedStep = -1;
  try {
    const raw = localStorage.getItem(TUTORIAL_SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed) {
        completed = parsed.completed === true;
        maxCompletedStep = Number.isInteger(parsed.maxCompletedStep) ? parsed.maxCompletedStep : -1;
      } else {
        completed = raw === "1";
        maxCompletedStep = completed ? 4 : -1;
      }
    }
  } catch (_err) {
    completed = false;
    maxCompletedStep = -1;
  }

  return {
    active: false,
    completed,
    maxCompletedStep,
    step: 0,
    stepTitle: "",
    stepHint: "",
    pressedSpace: false,
    toggledBlood: false,
  };
}

function stepText(step) {
  switch (step) {
    case 0:
      return {
        title: "Step 1/5: Move",
        hint: "Use WASD or Arrow keys. Move 3 times. Deer legs are optional but encouraged.",
      };
    case 1:
      return {
        title: "Step 2/5: Switch Deer",
        hint: "Press 2 to swap to Doe (smaller hitbox).",
      };
    case 2:
      return {
        title: "Step 3/5: Ability",
        hint: "Press 1 for Buck, then Space for ability. Bonk physics not included.",
      };
    case 3:
      return {
        title: "Step 4/5: Game Toggles",
        hint: "Press B to toggle blood effects.",
      };
    case 4:
      return {
        title: "Step 5/5: Cross The Road",
        hint: "Reach the top exit. Congratulations in advance.",
      };
    default:
      return { title: "Tutorial", hint: "You're done. Go cause tasteful road chaos." };
  }
}

function saveTutorialProgress(tutorialState) {
  try {
    localStorage.setItem(
      TUTORIAL_SAVE_KEY,
      JSON.stringify({
        completed: tutorialState.completed,
        maxCompletedStep: tutorialState.maxCompletedStep,
      }),
    );
  } catch (_err) {
    // Storage can fail in strict/privacy modes. Game still works.
  }
}

export function startTutorial(state, options = {}) {
  const forceFullReplay = options.forceFullReplay === true;
  state.tutorial.active = true;
  state.tutorial.step = forceFullReplay ? 0 : Math.min(4, Math.max(0, state.tutorial.maxCompletedStep + 1));
  state.tutorial.pressedSpace = false;
  state.tutorial.toggledBlood = false;
  if (forceFullReplay) {
    state.tutorial.completed = false;
    state.tutorial.maxCompletedStep = -1;
    saveTutorialProgress(state.tutorial);
  }
  const first = stepText(0);
  const current = stepText(state.tutorial.step);
  state.tutorial.stepTitle = current.title;
  state.tutorial.stepHint = current.hint;

  if (!forceFullReplay && state.tutorial.completed && state.tutorial.step === 4) {
    state.tutorial.stepHint = "Refresher lap: reach the top exit. Hold Shift+Enter in menu to replay full tutorial.";
  }
  return true;
}

export function stopTutorial(state) {
  state.tutorial.active = false;
}

export function tutorialOnKey(state, key) {
  if (!state.tutorial.active) return;
  if (key === " ") state.tutorial.pressedSpace = true;
  if (key === "b") state.tutorial.toggledBlood = true;
}

function advanceStep(state) {
  state.tutorial.maxCompletedStep = Math.max(state.tutorial.maxCompletedStep, state.tutorial.step);
  state.tutorial.step += 1;
  if (state.tutorial.step >= 5) {
    state.tutorial.active = false;
    state.tutorial.completed = true;
    state.tutorial.maxCompletedStep = 4;
    saveTutorialProgress(state.tutorial);
    return;
  }
  saveTutorialProgress(state.tutorial);
  const data = stepText(state.tutorial.step);
  state.tutorial.stepTitle = data.title;
  state.tutorial.stepHint = data.hint;
}

export function updateTutorial(state) {
  if (!state.tutorial.active) return;
  const step = state.tutorial.step;
  const reachedExit = state.deer.y <= state.level.exitPosition.y;

  if (step === 0 && state.steps >= 3) advanceStep(state);
  else if (step === 1 && state.deerType === "doe") advanceStep(state);
  else if (step === 2 && state.deerType === "buck" && state.tutorial.pressedSpace) advanceStep(state);
  else if (step === 3 && state.tutorial.toggledBlood) advanceStep(state);
  else if (step === 4 && reachedExit) advanceStep(state);
}

export function drawTutorialOverlay(ctx, state, width, height) {
  if (!state.tutorial.active) return;

  ctx.save();
  ctx.fillStyle = "rgba(8, 10, 14, 0.75)";
  ctx.fillRect(16, height - 128, width - 32, 110);
  ctx.strokeStyle = "rgba(126, 231, 135, 0.8)";
  ctx.strokeRect(16, height - 128, width - 32, 110);

  ctx.fillStyle = "#7ee787";
  ctx.font = "bold 20px Segoe UI, Arial";
  ctx.fillText(state.tutorial.stepTitle, 30, height - 92);

  ctx.fillStyle = "#e6edf3";
  ctx.font = "17px Segoe UI, Arial";
  ctx.fillText(state.tutorial.stepHint, 30, height - 58);

  ctx.fillStyle = "#8b949e";
  ctx.font = "14px Segoe UI, Arial";
  ctx.fillText("Tip: Press Enter in menu to start Tutorial mode any time.", 30, height - 30);
  ctx.restore();
}
