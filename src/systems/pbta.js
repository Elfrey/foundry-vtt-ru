import { setupBabele } from "../shared.js";

export const init = () => {
  if (game.modules.get("masks-newgeneration-unofficial")?.active) {
    setupBabele("pbta/masks");
  }
};
