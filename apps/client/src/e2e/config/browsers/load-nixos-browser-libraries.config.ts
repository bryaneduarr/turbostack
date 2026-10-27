import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Playwright's browser builds expect the shared libraries of a regular Linux
// distribution, which NixOS keeps only in the Nix store.
const nixosLibraryPackages = [
  "alsa-lib",
  "at-spi2-core",
  "cairo",
  "cups.lib",
  "dbus.lib",
  "dbus-glib",
  "expat",
  "freetype",
  "stdenv.cc.cc.lib",
  "gdk-pixbuf",
  "glib.out",
  "gtk3",
  "libdrm.out",
  "libglvnd",
  "libxkbcommon",
  "mesa",
  "libgbm",
  "nspr",
  "nss",
  "pango.out",
  "systemd",
  "xorg.libX11",
  "xorg.libxcb",
  "xorg.libXcomposite",
  "xorg.libXcursor",
  "xorg.libXdamage",
  "xorg.libXext",
  "xorg.libXfixes",
  "xorg.libXi",
  "xorg.libXrandr",
  "xorg.libXrender",
  "xorg.libxshmfence",
  "xorg.libXtst",
];

const cachePath = fileURLToPath(
  new URL(
    "../../../../node_modules/.cache/playwright/nixos-library-path",
    import.meta.url,
  ),
);

function buildLibraryPath(): string {
  const storePaths = execFileSync(
    "nix",
    [
      "build",
      "--no-link",
      "--print-out-paths",
      ...nixosLibraryPackages.map((name) => `nixpkgs#${name}`),
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
  );
  return storePaths
    .split("\n")
    .map((storePath) => `${storePath.trim()}/lib`)
    .filter((libraryPath) => libraryPath !== "/lib" && existsSync(libraryPath))
    .join(":");
}

// Garbage collection can delete cached store paths, so a stale cache is rebuilt.
function readCachedLibraryPath(): string | null {
  if (!existsSync(cachePath)) return null;
  const libraryPath = readFileSync(cachePath, "utf8").trim();
  const complete =
    libraryPath !== "" &&
    libraryPath.split(":").every((entry) => existsSync(entry));
  return complete ? libraryPath : null;
}

function prependPath(name: string, libraryPath: string): void {
  const current = process.env[name];
  if (current?.startsWith(libraryPath)) return;
  process.env[name] =
    current === undefined || current === ""
      ? libraryPath
      : `${libraryPath}:${current}`;
}

export function loadNixosBrowserLibraries(): void {
  if (!existsSync("/etc/NIXOS")) return;
  let libraryPath = readCachedLibraryPath();
  if (libraryPath === null) {
    try {
      libraryPath = buildLibraryPath();
    } catch (error) {
      console.warn("Could not build the browser libraries with Nix.", error);
      return;
    }
    mkdirSync(dirname(cachePath), { recursive: true });
    writeFileSync(cachePath, libraryPath);
  }
  // nix-ld reads NIX_LD_LIBRARY_PATH; browser helper processes read LD_LIBRARY_PATH.
  prependPath("NIX_LD_LIBRARY_PATH", libraryPath);
  prependPath("LD_LIBRARY_PATH", libraryPath);
}
