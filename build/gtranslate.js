#!/bin/node

const fs = require('fs');
const translate = require('translate');

main(process.argv[2]);

function main(lang) {
  var localesIndex = fs.readFileSync('build/locales_index.txt');
  localesIndex = localesIndex.toString().split('\n');

  localesIndex.forEach(function (file, index) {
    if (file !== '' && file !== null) {
      console.log(`[translator] Translating "${file}"...`);

      var locale = fs.readFileSync(file);
      var filepath = file.replace('en-US', lang);
      var split = filepath.split('/');
      var formatted = filepath.replace('/' + split[split.length - 1], '');
      var localeLines = locale.toString().split('\n');

      fs.rm(filepath, (error) => {
        if (error) {
          console.log(error);
        }
      });

      localeLines.forEach(async function (line, lineIdx) {
        var params = line.split('=');
        params[0] = params[0].replaceAll(' ', '');
        var translation = '';
        var cachedText = '';

        var refetch = async () => {
          try {
            translation = await translate(params[1], {
              from: 'en',
              to: lang,
              engine: 'google',
              key: 'AIzaSyBJHGk4_lPVNEyL6-n_VkbfmOGuC2bd8dQ'
            });
            finalize();
          } catch (e) {
            console.log(`[translator] Failed to translate "${params[0]}"`);
            refetch();
          }
        };
        if (line.includes('=') && !line.startsWith('#')) {
          refetch();
        }

        function finalize() {
          cachedText += `${params[0]} = ${translation}\n`;
          fs.appendFileSync(filepath, cachedText);
          console.log(`[translator, ${params[0]}] Translated "${params[1]}" successfully to "${translation}"...`);
        }
      });
    }
  });
}
