import { setupBabele, translateValue } from "../shared.js";

/* Data */

const EXCEPTIONS = {
  "Arcane Background (Any)": "Мистический дар (любой)",
  "Arcane Background (Gifted)": "Мистический дар (феномен)",
  "Arcane Background (Magic)": "Мистический дар (магия)",
  "Arcane Background (Miracles)": "Мистический дар (чудеса)",
  "Arcane Background (Psionics)": "Мистический дар (псионика)",
  "Arcane Background (Weird Science)": "Мистический дар (безумная наука)",
  "Expert in affected Trait": "Профессионал+ в выбранном параметре",
  "Professional in affected Trait": "Профессионал в выбранном параметре",
  "Tough as Nails": "Несгибаемый",
  "Work the Room": "Заводила",
  "arcane skill": "мистический навык",
  "maximum die type possible in affected Trait": "максимальное значение выбранного параметра",
};

const CATEGORIES = {
  Background: "Предыстории",
  Combat: "Боевые",
  Leadership: "Лидерские",
  Legendary: "Легендарные",
  Power: "Мистические",
  Professional: "Профессиональные",
  Social: "Социальные",
  Weird: "Сверхъестественные",
};

const RANKS = {
  Heroic: "Герой",
  Novice: "Новичок",
  Seasoned: "Закалённый",
  Veteran: "Ветеран",
};

const RANGES = {
  "Cone Template": "конусный шаблон",
  "Large Blast Template": "большой шаблон",
  "Medium Blast Template": "средний шаблон",
  "Self": "на себя",
  "Sm": "СМК",
  "Sm x 2": "СМК×2",
  "Small Blast Template": "малый шаблон",
  "Smarts x5 (Sound); Smarts (Silence)": "СМК×5 (звук); СМК (тишина)",
  "Touch": "касание",
};

const DURATIONS = {
  "10 minutes": "10 минут",
  "30 Minutes": "30 минут",
  "5": "5 минут",
  "5 (boost); Instant (lower)": "5 (усилить); мгновенное (ослабить)",
  "5 (detect), one hour (conceal)": "5 (обнаружение); 1 час (скрытие)",
  "5 minutes": "5 минут",
  "A brief conversation of about five minutes": "до 5 минут (короткая беседа)",
  "Instant": "мгновенное",
  "Instant (Sound); 5 (Silence)": "мгновенное (звук); 5 (тишина)",
  "Instant (slot); 5 (speed)": "мгновенное (замедление); 5 (ускорение)",
  "One Minute": "1 минута",
  "One Round": "1 раунд",
  "One day": "1 день",
  "One hour": "1 час",
  "Special": "особое",
  "Until the end of the victim's next turn": "до конца следующего хода цели",
};

export function init() {
  game.settings.register("ru-ru", "setupRules", {
    config: true,
    default: true,
    hint: "Автоматический перевод стандартных навыков и других настроек системы SWADE. Отключите, если желаете внести изменения вручную.",
    name: "(SWADE) Перевод настроек системы",
    restricted: true,
    scope: "world",
    type: Boolean,
  });

  if (game.modules.get("swade-core-rules")?.active) {
    setupBabele("swade/core");
  } else if (game.modules.get("swpf-core-rules")?.active) {
    setupBabele("swade/swpf");
  } else {
    setupBabele("swade/basic");
  }

  registerConverters();

  Hooks.on("ready", () => {
    if (game.modules.get("swade-core-rules")?.active) {
      ui.notifications.info(
        "Обнаружен модуль SWADE Core Rules. Перевод базовой библиотеки был отключен во избежание конфликтов.",
      );
    }
    if (game.modules.get("swpf-core-rules")?.active) {
      ui.notifications.info(
        "Обнаружен модуль Savage Pathfinder. Перевод базовой библиотеки был отключен во избежание конфликтов.",
      );
    }
    setupRules();
  });
}

function registerConverters() {
  if (!game.babele) {
    return;
  }

  game.babele.registerConverters({
    convertCategory: (value) => {
      if (!value) {
        return;
      }
      return translateValue(value, CATEGORIES);
    },

    convertDuration: (value) => {
      if (!value) {
        return;
      }
      return translateValue(value, DURATIONS);
    },

    convertRange: (value) => {
      if (!value) {
        return;
      }
      return translateValue(value, RANGES);
    },

    convertRank: (value) => {
      if (!value) {
        return;
      }
      return translateValue(value, RANKS);
    },

    convertRequirements: (requirements) => {
      if (!requirements) {
        return;
      }

      let packEdges = "swade.edges";
      let packHindrances = "swade.hindrances";
      let packSkills = "swade.skills";

      if (game.modules.get("swade-core-rules")?.active) {
        packEdges = "swade-core-rules.swade-edges";
        packHindrances = "swade-core-rules.swade-hindrances";
        packSkills = "swade-core-rules.swade-skills";
      }

      if (game.modules.get("swpf-core-rules")?.active) {
        packEdges = "swpf-core-rules.swpf-edges";
        packHindrances = "swpf-core-rules.swpf-hindrances";
        packSkills = "swpf-core-rules.swpf-skills";
      }

      const { packs } = game.babele;
      const translatedEdges = packs.find((pack) => pack.metadata.id === packEdges).translations;
      const translatedHindrances = packs.find(
        (pack) => pack.metadata.id === packHindrances,
      ).translations;
      const translatedSkills = packs.find((pack) => pack.metadata.id === packSkills).translations;

      return requirements.map((data) => {
        if (!data.label) {
          return data;
        }

        const translatedLabel =
          EXCEPTIONS[data.label] ||
          translatedEdges[data.label]?.name ||
          translatedHindrances[data.label]?.name ||
          translatedSkills[data.label]?.name;

        if (translatedLabel) {
          data.label = translatedLabel;
        }

        return data;
      });
    },
  });
}

function setupRules() {
  if (game.settings.get("ru-ru", "setupRules")) {
    // SWADE Core
    game.settings.set(
      "swade",
      "coreSkills",
      "Атлетика, Внимание, Осведомлённость, Скрытность, Убеждение",
    );

    game.settings.set(
      "swade",
      "vehicleSkills",
      "Верховая езда, Вождение, Пилотирование, Судовождение",
    );

    // SWADE Core
    if (game.modules.get("swade-core-rules")?.active) {
      game.settings.set("swade", "coreSkillsCompendium", "swade-core-rules.swade-skills");
    }

    // Savage Pathfinder
    if (game.modules.get("swpf-core-rules")?.active) {
      game.settings.set("swade", "coreSkillsCompendium", "swpf-core-rules.swpf-skills");
      game.settings.set("swade", "currencyName", "зм");
    }

    // Deadlands
    if (game.modules.get("deadlands-core-rules")?.active) {
      game.settings.set("swade", "currencyName", "$");
    }
  }
}
