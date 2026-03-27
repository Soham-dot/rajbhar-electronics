#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const repoRoot = process.cwd();
const SOURCE_ROOTS = ["app", "components", "lib"];
const VALID_EXTENSIONS = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json"];
const INDEX_EXTENSIONS = ["index.ts", "index.tsx", "index.js", "index.jsx", "index.mjs", "index.cjs"];

const isSourceFile = (filePath) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(filePath);

function walk(dirPath) {
  if (!fs.existsSync(dirPath)) return [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const absolute = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(absolute));
      continue;
    }

    if (entry.isFile() && isSourceFile(absolute)) {
      files.push(absolute);
    }
  }

  return files;
}

function findImportSpecifiers(content) {
  const specifiers = [];
  const patterns = [
    /import\s+[\s\S]*?\sfrom\s+["']([^"']+)["']/g,
    /export\s+[\s\S]*?\sfrom\s+["']([^"']+)["']/g,
    /import\(\s*["']([^"']+)["']\s*\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      const raw = match[1];
      if (!raw) continue;
      specifiers.push(raw);
    }
  }

  return specifiers;
}

function resolveImport(importerFile, specifier) {
  let basePath;

  if (specifier.startsWith("@/")) {
    basePath = path.resolve(repoRoot, specifier.slice(2));
  } else if (specifier.startsWith("./") || specifier.startsWith("../")) {
    basePath = path.resolve(path.dirname(importerFile), specifier);
  } else {
    return null;
  }

  const candidates = [];

  for (const ext of VALID_EXTENSIONS) {
    candidates.push(`${basePath}${ext}`);
  }

  for (const indexFile of INDEX_EXTENSIONS) {
    candidates.push(path.join(basePath, indexFile));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return { unresolved: basePath };
}

function isTracked(relativePath) {
  try {
    execFileSync("git", ["ls-files", "--error-unmatch", relativePath], {
      cwd: repoRoot,
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

function formatRelative(absolutePath) {
  return path.relative(repoRoot, absolutePath).replace(/\\/g, "/");
}

const sourceFiles = SOURCE_ROOTS.flatMap((root) => walk(path.join(repoRoot, root)));
const unresolved = [];
const untracked = [];

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf8");
  const specifiers = findImportSpecifiers(content);

  for (const specifier of specifiers) {
    const resolved = resolveImport(file, specifier);
    if (!resolved) continue;

    if (typeof resolved === "object" && "unresolved" in resolved) {
      unresolved.push({
        importer: formatRelative(file),
        specifier,
        lookedFor: formatRelative(resolved.unresolved),
      });
      continue;
    }

    const relativeResolved = formatRelative(resolved);
    if (!isTracked(relativeResolved)) {
      untracked.push({
        importer: formatRelative(file),
        specifier,
        resolved: relativeResolved,
      });
    }
  }
}

if (unresolved.length === 0 && untracked.length === 0) {
  console.log("OK: all local imports resolve to tracked files.");
  process.exit(0);
}

if (unresolved.length > 0) {
  console.error("Unresolved local imports:");
  for (const item of unresolved) {
    console.error(`- ${item.importer} imports \"${item.specifier}\" (no file found near ${item.lookedFor})`);
  }
}

if (untracked.length > 0) {
  console.error("Untracked imported files:");
  for (const item of untracked) {
    console.error(`- ${item.importer} imports \"${item.specifier}\" -> ${item.resolved} (not tracked by git)`);
  }
}

process.exit(1);
