module.exports = {
  lineEnding: "lf",
  // Control the line ending. See options at https://github.com/ryanve/eol

  locales: ["en", "fr"],
  // An array of the locales in your applications

  output: "src/locales/$LOCALE/$NAMESPACE.json",
  // Supports $LOCALE and $NAMESPACE injection
  // Supports JSON (.json) and YAML (.yml) file formats
  // Where to write the locale files relative to process.cwd()

  sort: true,
  // Whether or not to sort the catalog. Can also be a [compareFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#parameters)

  defaultValue: (locale, namespace, key) => `::${key}`,
};
