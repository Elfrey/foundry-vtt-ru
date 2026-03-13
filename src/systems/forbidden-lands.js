export function init() {
  Hooks.on("ready", () => {
    game.settings.set(
      "forbidden-lands",
      "datasetDir",
      "modules/ru-ru/compendium/fbl/dataset/dataset-ru.json",
    );
    // Console.log('Активирован перевод конструктора Forbidden Lands')
  });
}
