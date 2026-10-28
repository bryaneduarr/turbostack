export const sourceFilePattern = /\.(ts|tsx|mts|cts)$/;

export const sourceRootPattern =
  /^((apps|packages|config)\/[a-z-]+\/|\.agents\/skills\/[a-z-]+\/|scripts\/)/;

export const ignoredPathPatterns: readonly RegExp[] = [
  /(^|\/)next-env\.d\.ts$/,
  /^packages\/database\/src\/migrations\//,
];

export const testFilePattern = /\.(test|e2e)\.tsx?$/;

export const unitTestFilePattern = /\.(test|spec)\.tsx?$/;

export const testSupportPattern = /\/(e2e|fixtures)\//;

export const maximumSourceLines = 200;

export const maximumFilesPerFolder = 10;

// Generated migrations and the repository and app root folders that hold tool configuration.
export const exemptFileCountFolderPatterns: readonly RegExp[] = [
  /^packages\/database\/src\/migrations(\/meta)?$/,
  /^(apps\/[a-z-]+)?$/,
];

export const typeDeclarationPattern =
  /^(export\s+)?(declare\s+)?(interface|type)\s+([A-Z]\w*)/;

export const maximumTestTypeLines = 10;
