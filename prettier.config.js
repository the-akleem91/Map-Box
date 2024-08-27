/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: "lf",
  printWidth: 80,
  tabWidth: 2,
  //   trailingComma: "es5",
  singleQuote: false,
  semi: true,
  importOrder: ["<THIRD_PARTY_MODULES>", "^@/", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderSortByType: true,
};
