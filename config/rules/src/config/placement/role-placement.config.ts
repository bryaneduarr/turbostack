// Roles missing here may live in any architectural root.
export const rolePlacements: ReadonlyMap<string, readonly RegExp[]> = new Map([
  ["action", [/^apps\/[a-z-]+\/src\/actions\//]],
  ["check", [/^config\/rules\/src\/checks\//]],
  ["column", [/^packages\/database\/src\/columns\//]],
  ["component", [/^(apps|packages)\/[a-z-]+\/src\/components\//]],
  ["contract", [/^apps\/server\/src\/routes\//]],
  ["e2e", [/^apps\/client\/src\/e2e\//]],
  ["fixture", [/^apps\/client\/src\/e2e\//]],
  ["handler", [/^apps\/server\/src\/(routes|middleware)\//]],
  ["hook", [/^(apps|packages)\/[a-z-]+\/src\/hooks\//]],
  [
    "interface",
    [
      /^packages\/schemas\/src\//,
      /^(apps|packages|config)\/[a-z-]+\/src\/types\//,
      /^\.agents\/skills\/[a-z-]+\/src\/types\//,
    ],
  ],
  ["middleware", [/^apps\/server\/src\/middleware\//]],
  ["route", [/^packages\/schemas\/src\/server\/routes\//]],
  ["router", [/^apps\/server\/src\/routes\//]],
  ["schema", [/^packages\/schemas\/src\//]],
  ["table", [/^packages\/database\/src\/tables\//]],
]);
