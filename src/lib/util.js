/**
 * Get the first value that isn't null or undefined
 * @returns {any} the first actual value
 */
function first() {
  const args = Array.from(arguments);
  return args.find(v => typeof v !== 'undefined' && v !== null);
}

module.exports = { first };
