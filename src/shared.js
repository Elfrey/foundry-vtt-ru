export function setupBabele(id) {
  if (!game.settings.get("ru-ru", "compendiumTranslation")) {
    return;
  }

  const { title } = game.system;

  if (game.babele) {
    game.babele.register({
      dir: `compendium/${id}`,
      lang: "ru",
      module: "ru-ru",
    });

    game.settings.set("babele", "showOriginalName", true);
  } else {
    new Dialog({
      buttons: {
        done: {
          label: "Хорошо",
        },
      },
      content: `<p>Для перевода библиотек <b>${title}</b> требуется активировать модули <b>Babele и libWrapper</b><p>`,
      title: "Перевод библиотек",
    }).render(true);
  }
}

export function translateValue(value, translations) {
  return translations[value.trim()] || value;
}

export function translateList(value, translations) {
  return value
    .split(", ")
    .map((item) => translateValue(item, translations))
    .join(", ");
}

export function parseParentheses(str) {
  const regex = /^(\S+(?:\s+\S+)*)\s+\(([^)]+)\)$/;
  const match = str.match(regex);

  if (match) {
    return {
      main: match[1],
      sub: match[2],
    };
  }

  return {
    main: str.trim(),
    sub: null,
  };
}
