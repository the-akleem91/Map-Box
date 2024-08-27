module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // [
      //   "module:react-native-dotenv",
      //   {
      //     envName: "APP_ENV",
      //     moduleName: "@env",
      //     path: ".env",
      //     safe: false,
      //     allowUndefined: true,
      //     verbose: false,
      //   },
      // ],
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
          },
          extensions: [
            ".ios.ts",
            ".android.ts",
            ".ts",
            ".ios.tsx",
            ".android.tsx",
            ".tsx",
            ".jsx",
            ".js",
            ".json",
          ],
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
