import React, { useState, useRef, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play,
  Square,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  Terminal,
  Code2,
  Loader2,
  Maximize2,
  Minimize2,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Info,
  Zap,
} from 'lucide-react';

/* ─────────────────────────── language catalogue ─────────────────────────── */
const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', monaco: 'javascript', ext: 'js', engine: 'js',      icon: '🟨' },
  { id: 'typescript', label: 'TypeScript', monaco: 'typescript', ext: 'ts', engine: 'ts',      icon: '🔷' },
  { id: 'python',     label: 'Python',     monaco: 'python',     ext: 'py', engine: 'python',  icon: '🐍' },
  { id: 'html',       label: 'HTML/CSS',   monaco: 'html',       ext: 'html', engine: 'html',  icon: '🌐' },
  { id: 'json',       label: 'JSON',       monaco: 'json',       ext: 'json', engine: 'json',  icon: '📋' },
  { id: 'sql',        label: 'SQL',        monaco: 'sql',        ext: 'sql', engine: 'sql',    icon: '🗄️' },
  { id: 'markdown',   label: 'Markdown',   monaco: 'markdown',   ext: 'md', engine: 'markdown', icon: '📝' },
  { id: 'css',        label: 'CSS',        monaco: 'css',        ext: 'css', engine: 'css',    icon: '🎨' },
  { id: 'c',          label: 'C',          monaco: 'c',          ext: 'c',  engine: 'native',  icon: '⚙️' },
  { id: 'cpp',        label: 'C++',        monaco: 'cpp',        ext: 'cpp', engine: 'native', icon: '⚡' },
  { id: 'java',       label: 'Java',       monaco: 'java',       ext: 'java', engine: 'native', icon: '☕' },
  { id: 'go',         label: 'Go',         monaco: 'go',         ext: 'go', engine: 'native',  icon: '🐹' },
  { id: 'rust',       label: 'Rust',       monaco: 'rust',       ext: 'rs', engine: 'native',  icon: '🦀' },
  { id: 'php',        label: 'PHP',        monaco: 'php',        ext: 'php', engine: 'native', icon: '🐘' },
  { id: 'ruby',       label: 'Ruby',       monaco: 'ruby',       ext: 'rb', engine: 'native',  icon: '💎' },
];

/* ─────────────────────────── default snippets ───────────────────────────── */
const DEFAULT_CODE = {
  javascript: `// JavaScript - runs directly in the browser
console.log("🚀 Hello from JavaScript!");

// Example: Fibonacci sequence
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

for (let i = 0; i <= 10; i++) {
  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);
}

// Array manipulation
const crops = ['Rice', 'Wheat', 'Maize', 'Cotton'];
const sorted = [...crops].sort();
console.log("Sorted crops:", sorted.join(', '));`,

  typescript: `// TypeScript - transpiled via Babel in the browser
interface Crop {
  name: string;
  yieldPerHectare: number;
  season: 'Kharif' | 'Rabi' | 'Zaid';
}

const crops: Crop[] = [
  { name: 'Rice',   yieldPerHectare: 3.5, season: 'Kharif' },
  { name: 'Wheat',  yieldPerHectare: 3.2, season: 'Rabi'   },
  { name: 'Maize',  yieldPerHectare: 2.8, season: 'Kharif' },
  { name: 'Cotton', yieldPerHectare: 1.8, season: 'Kharif' },
];

function topCrops(list: Crop[], season: string): Crop[] {
  return list
    .filter(c => c.season === season)
    .sort((a, b) => b.yieldPerHectare - a.yieldPerHectare);
}

const kharifTop = topCrops(crops, 'Kharif');
console.log("Top Kharif Crops:");
kharifTop.forEach(c =>
  console.log(\`  \${c.name}: \${c.yieldPerHectare} t/ha\`)
);`,

  python: `# Python - powered by Pyodide (WebAssembly)
print("🐍 Hello from Python!")

# Crop yield calculation
crops = {
    "Rice": {"area": 10, "yield_per_ha": 3.5},
    "Wheat": {"area": 8, "yield_per_ha": 3.2},
    "Maize": {"area": 5, "yield_per_ha": 2.8},
}

print("\\n📊 Crop Yield Report:")
print("-" * 35)
total = 0
for name, data in crops.items():
    harvest = data["area"] * data["yield_per_ha"]
    total += harvest
    print(f"  {name:8s}: {harvest:6.1f} tonnes")

print("-" * 35)
print(f"  {'Total':8s}: {total:6.1f} tonnes")

# List comprehension
squares = [x**2 for x in range(1, 6)]
print(f"\\nSquares: {squares}")`,

  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farm Dashboard Preview</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: rgba(255,255,255,0.08);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 20px;
      padding: 32px;
      color: white;
      max-width: 400px;
      width: 100%;
      text-align: center;
    }
    h1 { font-size: 1.8rem; margin-bottom: 8px; }
    p  { opacity: 0.7; margin-bottom: 24px; font-size: 0.95rem; }
    .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .metric {
      background: rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 16px;
    }
    .metric .value { font-size: 1.6rem; font-weight: 700; color: #6ee7b7; }
    .metric .label { font-size: 0.8rem; opacity: 0.6; margin-top: 4px; }
    .badge {
      display: inline-block;
      background: #6ee7b7;
      color: #0f2027;
      border-radius: 999px;
      padding: 4px 14px;
      font-weight: 700;
      font-size: 0.8rem;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size:3rem;margin-bottom:12px">🌾</div>
    <h1>Farm Dashboard</h1>
    <p>Your farm metrics at a glance</p>
    <div class="metrics">
      <div class="metric"><div class="value">86%</div><div class="label">Crop Health</div></div>
      <div class="metric"><div class="value">42°C</div><div class="label">Soil Temp</div></div>
      <div class="metric"><div class="value">74%</div><div class="label">Humidity</div></div>
      <div class="metric"><div class="value">12.4</div><div class="label">Yield (T/ha)</div></div>
    </div>
    <span class="badge">✅ All Systems Normal</span>
  </div>
</body>
</html>`,

  json: `{
  "farm": {
    "name": "Green Valley Farm",
    "owner": "Ramesh Kumar",
    "location": {
      "state": "Punjab",
      "district": "Ludhiana",
      "coordinates": { "lat": 30.9010, "lng": 75.8573 }
    },
    "area_hectares": 25.5,
    "crops": [
      {
        "name": "Wheat",
        "season": "Rabi",
        "area_ha": 12,
        "expected_yield_t": 38.4,
        "status": "growing"
      },
      {
        "name": "Rice",
        "season": "Kharif",
        "area_ha": 10,
        "expected_yield_t": 35.0,
        "status": "harvested"
      }
    ],
    "soil_health": {
      "pH": 6.8,
      "nitrogen": "medium",
      "phosphorus": "high",
      "potassium": "medium"
    }
  }
}`,

  sql: `-- SQL - powered by sql.js (SQLite in WebAssembly)
CREATE TABLE IF NOT EXISTS crops (
  id        INTEGER PRIMARY KEY,
  name      TEXT NOT NULL,
  season    TEXT,
  area_ha   REAL,
  yield_t   REAL,
  price_inr REAL
);

INSERT INTO crops VALUES
  (1, 'Rice',   'Kharif', 10.0, 35.0, 2183),
  (2, 'Wheat',  'Rabi',   12.0, 38.4, 2275),
  (3, 'Maize',  'Kharif',  5.0, 14.0, 1850),
  (4, 'Cotton', 'Kharif',  8.0, 14.4, 6620),
  (5, 'Barley', 'Rabi',    3.0,  9.9, 1735);

-- Total revenue per crop
SELECT
  name,
  season,
  area_ha,
  yield_t,
  ROUND(yield_t * price_inr, 0) AS revenue_inr
FROM crops
ORDER BY revenue_inr DESC;`,

  markdown: `# 🌾 CBAMS Agricultural Report

## Executive Summary

The **Crop-Based Agricultural Management System** (CBAMS) delivers
AI-powered insights for modern farming.

---

## Key Metrics

| Metric            | Value      | Status  |
|-------------------|------------|---------|
| Active Crops      | 12         | ✅ Good |
| Avg Health Score  | 86%        | ✅ Good |
| Disease Alerts    | 2          | ⚠️ Watch |
| Yield Forecast    | 42.3 T/ha  | ✅ Good |

## Crop Health Status

- **Rice** — Healthy, no disease detected
- **Wheat** — Slight chlorosis observed → apply nitrogen
- **Maize** — *Leaf blight* detected — **immediate action required**
- **Cotton** — Healthy

## Recommendations

1. Apply **urea** (80 kg/ha) to the Wheat field this week
2. Use **Mancozeb** fungicide on the Maize crop
3. Monitor soil moisture daily during the dry spell
4. Schedule an **expert consultation** for Cotton

> 💡 *Early detection saves up to 40% of potential crop losses.*`,

  css: `/* CSS Demo — live preview in the panel */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #0d1117;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}

.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 600px;
  width: 100%;
}

.card {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(110, 231, 183, 0.15);
}

.card .icon { font-size: 2.5rem; margin-bottom: 12px; }
.card .label { color: #6ee7b7; font-weight: 600; font-size: 0.9rem; }
.card .value { color: white; font-size: 1.5rem; font-weight: 700; margin-top: 4px; }`,

  c: `// C — requires a server-side compiler
// This editor supports syntax highlighting for C.
// To execute, you need a backend compilation service.

#include <stdio.h>
#include <math.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    printf("Fibonacci Sequence:\\n");
    for (int i = 0; i <= 10; i++) {
        printf("fib(%d) = %d\\n", i, fibonacci(i));
    }

    // Crop yield calculation
    double area = 10.5;      // hectares
    double yield_rate = 3.8; // tonnes/ha
    printf("\\nEstimated yield: %.2f tonnes\\n", area * yield_rate);
    return 0;
}`,

  cpp: `// C++ — requires a server-side compiler
// This editor supports syntax highlighting for C++.

#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

struct Crop {
    std::string name;
    double yield_per_ha;
    int area;
};

int main() {
    std::vector<Crop> crops = {
        {"Rice",   3.5, 10},
        {"Wheat",  3.2,  8},
        {"Maize",  2.8,  5},
        {"Cotton", 1.8,  7},
    };

    std::sort(crops.begin(), crops.end(), [](const Crop& a, const Crop& b) {
        return a.yield_per_ha > b.yield_per_ha;
    });

    std::cout << "Crops by yield (desc):" << std::endl;
    for (const auto& c : crops) {
        std::cout << "  " << c.name
                  << ": " << c.yield_per_ha * c.area
                  << " tonnes total" << std::endl;
    }
    return 0;
}`,

  java: `// Java — requires a server-side compiler
// This editor supports syntax highlighting for Java.

import java.util.*;
import java.util.stream.*;

public class FarmAnalysis {
    record Crop(String name, double yieldPerHa, int area) {
        double totalYield() { return yieldPerHa * area; }
    }

    public static void main(String[] args) {
        List<Crop> crops = List.of(
            new Crop("Rice",   3.5, 10),
            new Crop("Wheat",  3.2,  8),
            new Crop("Maize",  2.8,  5),
            new Crop("Cotton", 1.8,  7)
        );

        System.out.println("Crop Yield Analysis:");
        crops.stream()
             .sorted(Comparator.comparingDouble(Crop::totalYield).reversed())
             .forEach(c -> System.out.printf("  %-8s: %.1f tonnes%n",
                                             c.name(), c.totalYield()));

        double total = crops.stream().mapToDouble(Crop::totalYield).sum();
        System.out.printf("Total: %.1f tonnes%n", total);
    }
}`,

  go: `// Go — requires a server-side compiler
// This editor supports syntax highlighting for Go.

package main

import (
    "fmt"
    "sort"
)

type Crop struct {
    Name       string
    YieldPerHa float64
    Area       int
}

func (c Crop) TotalYield() float64 {
    return c.YieldPerHa * float64(c.Area)
}

func main() {
    crops := []Crop{
        {"Rice",   3.5, 10},
        {"Wheat",  3.2, 8},
        {"Maize",  2.8, 5},
        {"Cotton", 1.8, 7},
    }

    sort.Slice(crops, func(i, j int) bool {
        return crops[i].TotalYield() > crops[j].TotalYield()
    })

    fmt.Println("🌾 Crop Yield Ranking:")
    for _, c := range crops {
        fmt.Printf("  %-8s: %.1f tonnes\\n", c.Name, c.TotalYield())
    }
}`,

  rust: `// Rust — requires a server-side compiler
// This editor supports syntax highlighting for Rust.

fn fibonacci(n: u64) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

struct Crop {
    name: String,
    yield_per_ha: f64,
    area: f64,
}

impl Crop {
    fn total_yield(&self) -> f64 {
        self.yield_per_ha * self.area
    }
}

fn main() {
    println!("Fibonacci (first 10):");
    for i in 0..=10 {
        println!("  fib({}) = {}", i, fibonacci(i));
    }

    let crops = vec![
        Crop { name: "Rice".into(),   yield_per_ha: 3.5, area: 10.0 },
        Crop { name: "Wheat".into(),  yield_per_ha: 3.2, area: 8.0  },
    ];

    println!("\\nCrop Yields:");
    for c in &crops {
        println!("  {}: {:.1} tonnes", c.name, c.total_yield());
    }
}`,

  php: `<?php
// PHP — requires a server-side interpreter
// This editor supports syntax highlighting for PHP.

$crops = [
    ['name' => 'Rice',   'yield' => 3.5, 'area' => 10],
    ['name' => 'Wheat',  'yield' => 3.2, 'area' => 8],
    ['name' => 'Maize',  'yield' => 2.8, 'area' => 5],
    ['name' => 'Cotton', 'yield' => 1.8, 'area' => 7],
];

usort($crops, fn($a, $b) =>
    ($b['yield'] * $b['area']) <=> ($a['yield'] * $a['area'])
);

echo "🌾 Crop Yield Ranking:\\n";
$total = 0;
foreach ($crops as $crop) {
    $t = $crop['yield'] * $crop['area'];
    $total += $t;
    printf("  %-8s: %.1f tonnes\\n", $crop['name'], $t);
}
printf("Total: %.1f tonnes\\n", $total);`,

  ruby: `# Ruby — requires a server-side interpreter
# This editor supports syntax highlighting for Ruby.

crops = [
  { name: 'Rice',   yield_per_ha: 3.5, area: 10 },
  { name: 'Wheat',  yield_per_ha: 3.2, area: 8  },
  { name: 'Maize',  yield_per_ha: 2.8, area: 5  },
  { name: 'Cotton', yield_per_ha: 1.8, area: 7  },
]

puts "🌾 Crop Yield Report"
puts "-" * 30

crops
  .map { |c| c.merge(total: c[:yield_per_ha] * c[:area]) }
  .sort_by { |c| -c[:total] }
  .each { |c| printf "  %-8s: %5.1f tonnes\n", c[:name], c[:total] }

total = crops.sum { |c| c[:yield_per_ha] * c[:area] }
puts "-" * 30
printf "  %-8s: %5.1f tonnes\n", "Total", total`,
};

/* ───────────────────────────── helpers ─────────────────────────────────── */
const LOG_LEVELS = { log: 'log', warn: 'warn', error: 'error', info: 'info' };

function buildConsoleHtml(entries) {
  return entries.map(e => {
    const cls =
      e.level === 'error' ? 'color:#ff6b6b' :
      e.level === 'warn'  ? 'color:#ffd93d' :
      e.level === 'info'  ? 'color:#74c0fc' :
                            'color:#a9dc76';
    const icon =
      e.level === 'error' ? '✖' :
      e.level === 'warn'  ? '⚠' :
      e.level === 'info'  ? 'ℹ' : '›';
    return `<div style="display:flex;gap:8px;align-items:flex-start;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
      <span style="${cls};flex-shrink:0;font-size:12px">${icon}</span>
      <span style="${cls};white-space:pre-wrap;word-break:break-all;font-size:13px;line-height:1.5">${escHtml(e.text)}</span>
    </div>`;
  }).join('');
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function stringify(val) {
  if (val === undefined) return 'undefined';
  if (val === null)      return 'null';
  if (typeof val === 'function') return val.toString();
  try { return JSON.stringify(val, null, 2); } catch { return String(val); }
}

/* ─────────────────────── engine implementations ────────────────────────── */

/** Run JS code in a sandboxed iframe, collect console output */
function runJavaScript(code, addLog) {
  return new Promise((resolve) => {
    const iframeEl = document.createElement('iframe');
    iframeEl.style.display = 'none';
    iframeEl.sandbox = 'allow-scripts';
    document.body.appendChild(iframeEl);

    const logs = [];
    const timeout = setTimeout(() => {
      cleanup();
      addLog({ level: 'error', text: 'Execution timed out (5s)' });
      resolve('timeout');
    }, 5000);

    const handler = (e) => {
      if (e.data?.source !== '__cbams_sandbox__') return;
      if (e.data.type === 'log') {
        addLog({ level: e.data.level, text: e.data.text });
        logs.push(e.data);
      } else if (e.data.type === 'done') {
        cleanup();
        resolve('done');
      } else if (e.data.type === 'error') {
        addLog({ level: 'error', text: e.data.text });
        cleanup();
        resolve('error');
      }
    };
    window.addEventListener('message', handler);

    const cleanup = () => {
      clearTimeout(timeout);
      window.removeEventListener('message', handler);
      document.body.removeChild(iframeEl);
    };

    const escaped = code.replace(/`/g, '\\`').replace(/\$/g, '\\$');

    iframeEl.srcdoc = `
      <script>
        const parent = window.parent;
        const _log = (level, args) => {
          const text = args.map(a => {
            if (typeof a === 'object' && a !== null) {
              try { return JSON.stringify(a, null, 2); } catch { return String(a); }
            }
            return String(a);
          }).join(' ');
          parent.postMessage({ source: '__cbams_sandbox__', type: 'log', level, text }, '*');
        };
        console.log   = (...a) => _log('log',   a);
        console.warn  = (...a) => _log('warn',  a);
        console.error = (...a) => _log('error', a);
        console.info  = (...a) => _log('info',  a);
        try {
          eval(\`${escaped}\`);
          parent.postMessage({ source: '__cbams_sandbox__', type: 'done' }, '*');
        } catch(e) {
          parent.postMessage({ source: '__cbams_sandbox__', type: 'error', text: e.message }, '*');
        }
      <\/script>`;
  });
}

/** Transpile TypeScript via Babel, then run as JS */
async function runTypeScript(code, addLog) {
  try {
    // Lazy-load Babel standalone
    if (!window.Babel) {
      addLog({ level: 'info', text: 'Loading TypeScript transpiler (Babel)…' });
      await new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/@babel/standalone@7/babel.min.js';
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    const result = window.Babel.transform(code, {
      presets: ['typescript'],
      filename: 'code.ts',
    });
    return runJavaScript(result.code, addLog);
  } catch (e) {
    addLog({ level: 'error', text: `TypeScript error: ${e.message}` });
    return 'error';
  }
}

/** Python via Pyodide */
let pyodideInstance = null;
async function runPython(code, addLog) {
  try {
    if (!pyodideInstance) {
      addLog({ level: 'info', text: '⏳ Loading Python runtime (Pyodide)… this may take ~10s on first run.' });
      if (!window.loadPyodide) {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      });
    }

    const logs = [];
    // Redirect stdout/stderr
    pyodideInstance.globals.set('__cbams_logs__', logs);

    const wrappedCode = `
import sys, io
_buf = io.StringIO()
sys.stdout = _buf
sys.stderr = _buf
try:
${code.split('\n').map(l => '    ' + l).join('\n')}
except Exception as e:
    import traceback
    print("Error:", traceback.format_exc())
finally:
    sys.stdout = sys.__stdout__
    sys.stderr = sys.__stderr__
__cbams_output__ = _buf.getvalue()
`;
    await pyodideInstance.runPythonAsync(wrappedCode);
    const output = pyodideInstance.globals.get('__cbams_output__');
    if (output) {
      output.split('\n').filter(Boolean).forEach(line => {
        const isErr = line.startsWith('Error:') || line.includes('Traceback');
        addLog({ level: isErr ? 'error' : 'log', text: line });
      });
    }
    return 'done';
  } catch (e) {
    addLog({ level: 'error', text: `Python error: ${e.message}` });
    return 'error';
  }
}

/** JSON formatter */
function runJSON(code, addLog) {
  try {
    const parsed = JSON.parse(code);
    const pretty = JSON.stringify(parsed, null, 2);
    addLog({ level: 'info', text: '✅ Valid JSON' });
    const lines = pretty.split('\n');
    addLog({ level: 'log', text: pretty });
    return Promise.resolve('done');
  } catch (e) {
    addLog({ level: 'error', text: `JSON parse error: ${e.message}` });
    return Promise.resolve('error');
  }
}

/** SQL via sql.js */
let sqlJsDb = null;
async function runSQL(code, addLog) {
  try {
    if (!window.initSqlJs) {
      addLog({ level: 'info', text: '⏳ Loading SQL.js (SQLite in WebAssembly)…' });
      await new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/sql-wasm.js';
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    if (!sqlJsDb) {
      const SQL = await window.initSqlJs({
        locateFile: file => `https://cdn.jsdelivr.net/npm/sql.js@1.12.0/dist/${file}`,
      });
      sqlJsDb = new SQL.Database();
    }

    const statements = code.split(';').map(s => s.trim()).filter(Boolean);
    let outputLines = [];

    for (const stmt of statements) {
      const results = sqlJsDb.exec(stmt + ';');
      if (results.length > 0) {
        const { columns, values } = results[0];
        // Header
        outputLines.push(columns.join(' | '));
        outputLines.push(columns.map(() => '---').join(' | '));
        // Rows
        values.forEach(row => outputLines.push(row.join(' | ')));
        outputLines.push(`(${values.length} row${values.length !== 1 ? 's' : ''})`);
      } else {
        outputLines.push(`✅ Statement executed: ${stmt.substring(0, 40)}${stmt.length > 40 ? '…' : ''}`);
      }
    }

    outputLines.forEach(l => addLog({ level: 'log', text: l }));
    return 'done';
  } catch (e) {
    addLog({ level: 'error', text: `SQL error: ${e.message}` });
    return 'error';
  }
}

/** Markdown preview (returns HTML string, not logs) */
async function renderMarkdown(code, addLog) {
  if (!window.marked) {
    addLog({ level: 'info', text: 'Loading Markdown renderer…' });
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/marked@12/marked.min.js';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  const html = window.marked.parse(code);
  return html;
}

/* ─────────────────────────────── main component ─────────────────────────── */
export default function Playground() {
  const langObj = LANGUAGES[0];
  const [selectedLang, setSelectedLang]   = useState(langObj);
  const [code, setCode]                   = useState(DEFAULT_CODE.javascript);
  const [logs, setLogs]                   = useState([]);
  const [running, setRunning]             = useState(false);
  const [runTime, setRunTime]             = useState(null);
  const [copied, setCopied]               = useState(false);
  const [langDropdown, setLangDropdown]   = useState(false);
  const [fullscreen, setFullscreen]       = useState(false);
  const [previewHtml, setPreviewHtml]     = useState('');
  const [activePanel, setActivePanel]     = useState('output'); // 'output' | 'preview'
  const [fontSize, setFontSize]           = useState(14);
  const outputRef                         = useRef(null);

  const addLog = useCallback((entry) => {
    setLogs(prev => [...prev, entry]);
  }, []);

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [logs]);

  const selectLanguage = (lang) => {
    setSelectedLang(lang);
    setCode(DEFAULT_CODE[lang.id] || `// ${lang.label} code here\n`);
    setLogs([]);
    setPreviewHtml('');
    setLangDropdown(false);
    // Switch to preview for visual langs
    if (['html', 'css', 'markdown'].includes(lang.id)) {
      setActivePanel('preview');
    } else {
      setActivePanel('output');
    }
  };

  const runCode = async () => {
    setRunning(true);
    setLogs([]);
    setPreviewHtml('');
    const start = performance.now();

    const { engine, id } = selectedLang;

    try {
      if (engine === 'js') {
        await runJavaScript(code, addLog);
      } else if (engine === 'ts') {
        await runTypeScript(code, addLog);
      } else if (engine === 'python') {
        await runPython(code, addLog);
      } else if (engine === 'html') {
        setPreviewHtml(code);
        setActivePanel('preview');
        addLog({ level: 'info', text: '✅ HTML rendered in Preview panel' });
      } else if (engine === 'css') {
        // Wrap in demo HTML
        const html = `<!DOCTYPE html><html><head><style>${code}</style></head><body>
          <div class="container">
            ${Array.from({length:6}, (_,i) => `<div class="card"><div class="icon">${['🌾','🌿','🌱','🍃','🌻','🌴'][i]}</div><div class="label">Metric ${i+1}</div><div class="value">${(Math.random()*100).toFixed(1)}%</div></div>`).join('')}
          </div>
        </body></html>`;
        setPreviewHtml(html);
        setActivePanel('preview');
        addLog({ level: 'info', text: '✅ CSS applied in Preview panel' });
      } else if (engine === 'json') {
        await runJSON(code, addLog);
      } else if (engine === 'sql') {
        await runSQL(code, addLog);
      } else if (engine === 'markdown') {
        const html = await renderMarkdown(code, addLog);
        const full = `<!DOCTYPE html><html><head>
          <meta charset="utf-8"/>
          <style>
            body{font-family:'Segoe UI',system-ui,sans-serif;max-width:680px;margin:40px auto;padding:0 20px;color:#1a1a2e;line-height:1.7}
            h1,h2,h3{color:#1a1a2e;margin-top:1.5em}
            a{color:#4ade80}
            table{border-collapse:collapse;width:100%}
            th,td{border:1px solid #ddd;padding:8px 12px;text-align:left}
            th{background:#f0fdf4}
            code{background:#f0f0f0;padding:2px 6px;border-radius:4px;font-family:monospace}
            blockquote{border-left:4px solid #4ade80;margin:0;padding:0 16px;color:#555}
            hr{border:none;border-top:1px solid #ddd;margin:24px 0}
          </style>
        </head><body>${html}</body></html>`;
        setPreviewHtml(full);
        setActivePanel('preview');
        addLog({ level: 'info', text: '✅ Markdown rendered in Preview panel' });
      } else {
        // Native/compiled languages
        addLog({
          level: 'info',
          text: `ℹ️ ${selectedLang.label} requires a server-side compiler/interpreter.\n\nThis playground runs code entirely in the browser (no external APIs).\nClient-side engines available: JavaScript, TypeScript, Python, HTML, CSS, JSON, SQL, Markdown.\n\nTo run ${selectedLang.label}, you can:\n  • Use the CBAMS backend execution endpoint\n  • Set up a local compiler and connect it\n  • Use the editor for syntax highlighting while writing code`,
        });
      }
    } finally {
      const elapsed = ((performance.now() - start) / 1000).toFixed(3);
      setRunTime(elapsed);
      setRunning(false);
    }
  };

  const clearOutput = () => { setLogs([]); setPreviewHtml(''); setRunTime(null); };
  const resetCode   = () => { setCode(DEFAULT_CODE[selectedLang.id] || ''); setLogs([]); };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `code.${selectedLang.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isNative   = selectedLang.engine === 'native';
  const hasPreview = ['html', 'css', 'markdown', 'native'].includes(selectedLang.engine) || previewHtml;

  return (
    <div
      className={`${fullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-[#0d1117] text-white flex flex-col`}
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#161b22] flex-shrink-0">
        {/* Left: logo + lang picker */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold text-white/90 tracking-wide">CBAMS Playground</span>
          </div>

          <div className="h-5 w-px bg-white/10" />

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdown(p => !p)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm transition-all"
            >
              <span>{selectedLang.icon}</span>
              <span className="text-white/90">{selectedLang.label}</span>
              <ChevronDown className="w-4 h-4 text-white/40" />
            </button>

            {langDropdown && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#1c2128] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-1.5 grid grid-cols-1 gap-0.5 max-h-80 overflow-y-auto">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => selectLanguage(lang)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                        selectedLang.id === lang.id
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'hover:bg-white/5 text-white/70 hover:text-white'
                      }`}
                    >
                      <span className="text-base w-5 text-center">{lang.icon}</span>
                      <span>{lang.label}</span>
                      {lang.engine === 'native' && (
                        <span className="ml-auto text-xs text-white/25 font-normal">server</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2">
          {/* Font size */}
          <div className="flex items-center gap-1 text-xs text-white/40 mr-1">
            <button onClick={() => setFontSize(s => Math.max(10, s-1))} className="w-5 h-5 hover:text-white/70 rounded">A-</button>
            <span className="w-6 text-center text-white/60">{fontSize}</span>
            <button onClick={() => setFontSize(s => Math.min(22, s+1))} className="w-5 h-5 hover:text-white/70 rounded">A+</button>
          </div>

          <button onClick={copyCode}     title="Copy code"
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={downloadCode} title="Download"
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all">
            <Download className="w-4 h-4" />
          </button>
          <button onClick={resetCode}    title="Reset to default"
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={() => setFullscreen(f => !f)} title="Toggle fullscreen"
            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all">
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className="w-px h-5 bg-white/10" />

          {/* Run button */}
          <button
            onClick={running ? undefined : runCode}
            disabled={running}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              running
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-400/30'
            }`}
          >
            {running ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Running…</>
            ) : (
              <><Play className="w-4 h-4 fill-current" /> Run</>
            )}
          </button>
        </div>
      </div>

      {/* ── MAIN SPLIT ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ── EDITOR ── */}
        <div className="flex-1 min-w-0 border-r border-white/10 flex flex-col">
          {/* editor header */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-[#0d1117] flex-shrink-0">
            <Code2 className="w-4 h-4 text-white/30" />
            <span className="text-xs text-white/40 font-medium">
              {`main.${selectedLang.ext}`}
            </span>
          </div>

          <div className="flex-1 min-h-0">
            <Editor
              language={selectedLang.monaco}
              value={code}
              onChange={v => setCode(v || '')}
              theme="vs-dark"
              options={{
                fontSize,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'gutter',
                padding: { top: 16, bottom: 16 },
                wordWrap: 'on',
                tabSize: 2,
                smoothScrolling: true,
                cursorSmoothCaretAnimation: 'on',
                bracketPairColorization: { enabled: true },
                autoClosingBrackets: 'always',
                formatOnPaste: true,
              }}
              height="100%"
            />
          </div>
        </div>

        {/* ── OUTPUT / PREVIEW PANEL ── */}
        <div className="w-[45%] min-w-0 flex flex-col bg-[#0d1117]">
          {/* Panel tabs */}
          <div className="flex items-center gap-0 border-b border-white/10 flex-shrink-0 bg-[#161b22]">
            <button
              onClick={() => setActivePanel('output')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
                activePanel === 'output'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Console Output
              {logs.length > 0 && (
                <span className="bg-white/10 text-white/60 rounded-full px-1.5 py-0.5 text-xs leading-none ml-1">
                  {logs.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActivePanel('preview')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all ${
                activePanel === 'preview'
                  ? 'border-emerald-400 text-white'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              <span className="text-sm">🖥️</span>
              Preview
            </button>

            <div className="ml-auto flex items-center gap-2 pr-3">
              {runTime && (
                <span className="text-xs text-white/30 font-mono">{runTime}s</span>
              )}
              {logs.length > 0 && (
                <button
                  onClick={clearOutput}
                  className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-all"
                  title="Clear output"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Panel content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {/* Console */}
            {activePanel === 'output' && (
              <div
                ref={outputRef}
                className="h-full overflow-y-auto p-4 font-mono text-sm"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#30363d transparent' }}
              >
                {logs.length === 0 && !running && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20">
                    <Terminal className="w-10 h-10" />
                    <p className="text-sm">Press <kbd className="bg-white/10 px-2 py-0.5 rounded text-white/40 text-xs">Run</kbd> to execute your code</p>
                    {isNative && (
                      <div className="mt-4 text-xs text-center text-white/30 max-w-xs leading-relaxed">
                        <span className="text-amber-400">⚠</span> {selectedLang.label} requires server-side execution.
                      </div>
                    )}
                  </div>
                )}
                {running && logs.length === 0 && (
                  <div className="flex items-center justify-center h-full gap-3 text-white/30">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                    <span className="text-sm">Executing…</span>
                  </div>
                )}
                <div className="space-y-0.5">
                  {logs.map((log, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 items-start py-1 px-2 rounded text-sm leading-relaxed ${
                        log.level === 'error' ? 'bg-red-500/5 text-red-400' :
                        log.level === 'warn'  ? 'bg-amber-500/5 text-amber-300' :
                        log.level === 'info'  ? 'bg-blue-500/5 text-blue-300' :
                                                'text-[#a9dc76]'
                      }`}
                    >
                      <span className="flex-shrink-0 mt-0.5 opacity-60">
                        {log.level === 'error' ? <AlertCircle className="w-3.5 h-3.5" /> :
                         log.level === 'warn'  ? <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> :
                         log.level === 'info'  ? <Info className="w-3.5 h-3.5" /> :
                                                <span className="text-xs text-white/20">›</span>}
                      </span>
                      <pre className="whitespace-pre-wrap break-words font-mono text-[13px] flex-1">{log.text}</pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview iframe */}
            {activePanel === 'preview' && (
              <div className="h-full w-full">
                {previewHtml ? (
                  <iframe
                    srcDoc={previewHtml}
                    sandbox="allow-scripts allow-same-origin"
                    className="w-full h-full border-none bg-white"
                    title="Preview"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20">
                    <span className="text-4xl">🖥️</span>
                    <p className="text-sm">Preview appears here for HTML, CSS, and Markdown</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM STATUS BAR ── */}
      <div className="flex items-center gap-4 px-4 py-1.5 border-t border-white/5 bg-[#161b22] text-xs text-white/30 flex-shrink-0">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${running ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
          {running ? 'Running' : 'Ready'}
        </span>
        <span>{selectedLang.icon} {selectedLang.label}</span>
        {selectedLang.engine === 'python' && (
          <span className="flex items-center gap-1"><span className="text-blue-400">⚡</span>Pyodide (WASM)</span>
        )}
        {selectedLang.engine === 'ts' && (
          <span className="flex items-center gap-1"><span className="text-blue-400">⚡</span>Babel Transpiler</span>
        )}
        {selectedLang.engine === 'sql' && (
          <span className="flex items-center gap-1"><span className="text-blue-400">⚡</span>sql.js (SQLite WASM)</span>
        )}
        {selectedLang.engine === 'native' && (
          <span className="flex items-center gap-1 text-amber-400/60">⚠ Needs server-side compiler</span>
        )}
        <span className="ml-auto">CBAMS v1.0 · In-Browser Execution</span>
      </div>

      {/* Close dropdown on outside click */}
      {langDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setLangDropdown(false)} />
      )}
    </div>
  );
}
