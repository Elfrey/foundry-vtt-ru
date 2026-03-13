import { setupBabele } from "../shared.js";

export function init() {
  setupBabele("dragonbane");

  registerConverters();
}

function registerConverters() {
  let translationMap = null;

  const getTranslationMap = () => {
    if (translationMap) {
      return translationMap;
    }

    try {
      const { translations } = game.babele;

      if (!translations || translations.length < 1) {
        // Console.warn('Dragonbane: No Babele translations found')
        return null;
      }

      // Create a simple key:value mapping
      const map = {};

      for (const translation of translations) {
        if (translation.entries) {
          for (const packName of Object.keys(translation.entries)) {
            const packData = translation.entries[packName];

            if (packData?.items) {
              for (const originalName of Object.keys(packData.items)) {
                const item = packData.items[originalName];
                if (item?.name) {
                  map[originalName] = item.name;
                }
              }
            }
          }
        }
      }

      if (Object.keys(map).length === 0) {
        return null;
      }

      translationMap = map;
      return map;
    } catch (error) {
      console.warn("Dragonbane: Error creating translation map:", error);
      return null;
    }
  };

  game.babele.registerConverters({
    translateItemList(list) {
      if (!list || typeof list !== "string") {
        return list || "";
      }

      const map = getTranslationMap();
      if (!map) {
        return list;
      }

      return list
        .split(",")
        .map((item) => {
          const trimmedItem = item.trim();
          return map[trimmedItem] || trimmedItem;
        })
        .toSorted((a, b) => a.localeCompare(b))
        .join(", ");
    },
  });
}
