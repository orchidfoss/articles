#!/bin/node
const fs = require('fs');
const translate = require('translate');

translate.engine = 'google';
translate.key = 'AIzaSyBJHGk4_lPVNEyL6-n_VkbfmOGuC2bd8dQ';

var languages = [
  "af",
  "ar",
  "da",
  "de",
  "el",
  "es",
  "fi",
  "fr",
  "ga",
  "he",
  "hi",
  "hu",
  "id",
  "ja",
  "ko",
  "ku",
  "lv",
  "nl",
  "no",
  "pt",
  "zh"
];
main(languages[0], 0);

function main(lang, index) {
  var localesIndex = fs.readFileSync('bin/locales_index.txt');
  localesIndex = localesIndex.toString().split('\n');

  localesIndex.forEach(function (file, idx) {
    if (file !== '' && file !== null) {
      console.log(`[translator] Translating "${file}"...`);

      var locale = fs.readFileSync(file);
      var filepath = file.replace('en-US', lang);
      var split = filepath.split('/');
      var formatted = filepath.replace('/' + split[split.length - 1], '');

      if (fs.existsSync(file.replace('en-US', lang))) {
        fs.unlinkSync(file.replace('en-US', lang));
      }
      translateLocale(formatted, filepath, locale.toString(), lang);
    }

    if (idx === localesIndex.length - 1) {
      if ((index + 1) <= languages.length) {
        main(languages[index + 1], index + 1);
      }
    }
  });

  function translateLocale(filepath, filename, text, lang) {
    var localeLines = text.split('\n');

    localeLines.forEach(function (line, index) {
      var params = line.split('=');
      params[0] = params[0].replace(' ', '');
      var translation = '';
      var cachedText = '';

      (async function () {
        if (line.includes('=') && !line.startsWith('#')) {
          refetch();
        }
      })();

      async function refetch() {
        try {
          translation = await translate(params[1], lang);
          finalize();
        } catch (e) {
          console.log(`[translator] Failed to translate "${params[0]}"`);
          refetch();
        }
      }

      function finalize() {
        cachedText += `${params[0]} = ${translation}\n`;
        fs.mkdirSync(filepath, { recursive: true });
        fs.appendFileSync(filename, cachedText);
        console.log(`[translator] Translated "${params[0]}" successfully to "${translation}"...`);
      }
    });
  }
}
