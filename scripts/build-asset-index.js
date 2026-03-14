#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const PUBLIC_ROOT = process.argv[2] || path.resolve(__dirname, '../../ux-simulator-application-core/src/public');
const OUTPUT_FILE = process.argv[3] || path.resolve(__dirname, '../data/catalog/asset_index.json');
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);

function toWebPath(absPath) {
  const rel = path.relative(PUBLIC_ROOT, absPath).replace(/\\/g, '/');
  return `/${rel}`;
}

function normalizeId(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function walkFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  const stack = [dir];
  while (stack.length > 0) {
    const cur = stack.pop();
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) {
        stack.push(full);
      } else if (e.isFile()) {
        out.push(full);
      }
    }
  }
  return out;
}

function guessPattern(fileNames) {
  if (!fileNames.length) return null;
  const m = fileNames[0].match(/^(.*?)(\d+)(\.[^.]+)$/);
  if (!m) return null;
  return `${m[1]}{index:${m[2].length}}${m[3]}`;
}

function main() {
  if (!fs.existsSync(PUBLIC_ROOT)) {
    throw new Error(`public root not found: ${PUBLIC_ROOT}`);
  }

  const allFiles = walkFiles(PUBLIC_ROOT).filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()));

  const sequenceRoot = path.join(PUBLIC_ROOT, 'ui', 'image_sequences');
  const sequenceDirs = fs.existsSync(sequenceRoot)
    ? fs.readdirSync(sequenceRoot, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => path.join(sequenceRoot, e.name)).sort()
    : [];

  const sequences = sequenceDirs.map((dirAbs) => {
    const files = walkFiles(dirAbs)
      .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b));

    const webFrames = files.map(toWebPath);
    const base = path.basename(dirAbs);
    const fileNames = files.map((f) => path.basename(f));

    const extSet = new Set(files.map((f) => path.extname(f).toLowerCase()));

    return {
      id: normalizeId(base),
      name: base,
      type: 'image_sequence',
      path: `/ui/image_sequences/${base}`,
      frameCount: files.length,
      extensions: [...extSet].sort(),
      namingPattern: guessPattern(fileNames),
      sampleFrames: {
        first: webFrames.slice(0, 3),
        last: webFrames.slice(-3),
      },
    };
  });

  const images = allFiles
    .filter((f) => !toWebPath(f).startsWith('/ui/image_sequences/'))
    .sort((a, b) => a.localeCompare(b))
    .map((f) => {
      const webPath = toWebPath(f);
      const parts = webPath.slice(1).split('/');
      const scope = (() => {
        if (parts[0] === 'assets') return 'assets';
        if (parts[0] === 'ui' && parts[1] === 'images') return 'ui/images';
        if (parts[0] === 'ui' && parts[1] === 'image_sequences') return 'ui/image_sequences';
        return parts.length > 1 ? `${parts[0]}/${parts[1]}` : parts[0];
      })();
      return {
        id: normalizeId(path.basename(f, path.extname(f))),
        name: path.basename(f),
        type: 'image',
        path: webPath,
        extension: path.extname(f).toLowerCase(),
        scope,
      };
    });

  const out = {
    indexVersion: '1.0.0',
    generatedDate: '2026-03-14',
    sourceRoot: 'ux-simulator-application-core/src/public',
    includeExtensions: [...IMAGE_EXTS],
    summary: {
      totalImageFiles: allFiles.length,
      indexedImages: images.length,
      indexedSequences: sequences.length,
    },
    images,
    sequences,
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(out, null, 2), 'utf-8');

  console.log(`CREATED: ${OUTPUT_FILE}`);
  console.log(`TOTAL_IMAGE_FILES: ${allFiles.length}`);
  console.log(`INDEXED_IMAGES: ${images.length}`);
  console.log(`INDEXED_SEQUENCES: ${sequences.length}`);
}

main();
