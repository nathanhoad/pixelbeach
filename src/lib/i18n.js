let locale;
let translations;

// TODO: rework this so that it doesn't hard code where the translations are

module.exports = function(key, args) {
  if (!translations || locale !== localStorage.getItem('language')) {
    locale = localStorage.getItem('language');
    translations = require('../game/i18n/' + locale + '.json');
  }

  // Use object notation
  let path = key.split('.');
  let translation = translations[path[0]];
  while (path.length > 1) {
    path = path.slice(1);
    translation = translation[path[0]];
  }

  if (!translation) throw new Error('No translation found for ' + key);

  if (typeof translation === 'object') {
    // Find the first numerical arg to use for the pluralizer
    let count = Object.keys(args).find(k => typeof args[k] === 'number');

    if (count === 1 && translation.one) {
      translation = translation.one;
    } else if (count === 0 && translation.zero) {
      translation = translation.zero;
    } else if (translation.other) {
      translation = translation.other;
    } else {
      throw new Error('No translation found for ' + key);
    }
  }

  if (!args) return translation;

  // Replace any args
  return Object.keys(args).reduce((t, k) => {
    return t.replace('{' + k + '}', args[k]);
  }, translation);
};
