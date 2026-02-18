#!/usr/bin/env node
/**
 * 复制 public 和 .next/static 到 standalone 目录，确保 CSS 和静态资源可被加载
 */
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const standaloneDir = path.join(projectRoot, ".next", "standalone");
const publicDir = path.join(projectRoot, "public");
const staticDir = path.join(projectRoot, ".next", "static");
const standalonePublic = path.join(standaloneDir, "public");
const standaloneStatic = path.join(standaloneDir, ".next", "static");

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(standaloneDir)) {
  if (fs.existsSync(publicDir)) {
    copyRecursive(publicDir, standalonePublic);
    console.log("Copied public to standalone");
  }
  if (fs.existsSync(staticDir)) {
    fs.mkdirSync(path.dirname(standaloneStatic), { recursive: true });
    copyRecursive(staticDir, standaloneStatic);
    console.log("Copied .next/static to standalone");
  }
}
