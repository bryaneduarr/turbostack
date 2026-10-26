import { optionalChainingCheck } from "@workspace/rules/checks/absence/optional-chaining.check";
import { zeroFallbackCheck } from "@workspace/rules/checks/absence/zero-fallback.check";
import { commentStyleCheck } from "@workspace/rules/checks/comments/comment-style.check";
import { suppressionCommentCheck } from "@workspace/rules/checks/comments/suppression-comment.check";
import { commitMessageCheck } from "@workspace/rules/checks/commits/commit-message.check";
import { aliasExportCheck } from "@workspace/rules/checks/contracts/alias-export.check";
import { interfaceDocumentationCheck } from "@workspace/rules/checks/contracts/interface-documentation.check";
import { interfaceFileContentCheck } from "@workspace/rules/checks/contracts/interface-file-content.check";
import { schemaFieldDocumentationCheck } from "@workspace/rules/checks/contracts/schema-field-documentation.check";
import { testLocalTypesCheck } from "@workspace/rules/checks/contracts/test-local-types.check";
import { typeDeclarationPlacementCheck } from "@workspace/rules/checks/contracts/type-declaration-placement.check";
import { rootDependenciesCheck } from "@workspace/rules/checks/dependencies/root-dependencies.check";
import { runtimeDevDependencyCheck } from "@workspace/rules/checks/dependencies/runtime-dev-dependency.check";
import { workspaceProtocolCheck } from "@workspace/rules/checks/dependencies/workspace-protocol.check";
import { exampleDataCheck } from "@workspace/rules/checks/examples/example-data.check";
import { fileNameCheck } from "@workspace/rules/checks/naming/file-name.check";
import { folderNameCheck } from "@workspace/rules/checks/naming/folder-name.check";
import { rolePlacementCheck } from "@workspace/rules/checks/placement/role-placement.check";
import { routeDefinitionCheck } from "@workspace/rules/checks/routes/route-definition.check";
import { fileLengthCheck } from "@workspace/rules/checks/size/file-length.check";
import { folderFileCountCheck } from "@workspace/rules/checks/size/folder-file-count.check";
import { testRunnerCheck } from "@workspace/rules/checks/testing/test-runner.check";
import type { RuleCheck } from "@workspace/rules/types/checks/rule-check.interface";

export const enabledChecks: readonly RuleCheck[] = [
  fileNameCheck,
  folderNameCheck,
  rolePlacementCheck,
  fileLengthCheck,
  folderFileCountCheck,
  typeDeclarationPlacementCheck,
  testLocalTypesCheck,
  interfaceFileContentCheck,
  interfaceDocumentationCheck,
  schemaFieldDocumentationCheck,
  routeDefinitionCheck,
  commentStyleCheck,
  suppressionCommentCheck,
  exampleDataCheck,
  testRunnerCheck,
  rootDependenciesCheck,
  workspaceProtocolCheck,
  aliasExportCheck,
  zeroFallbackCheck,
  optionalChainingCheck,
  runtimeDevDependencyCheck,
  commitMessageCheck,
];
