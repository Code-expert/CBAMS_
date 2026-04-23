const fs = require('fs');
const path = require('path');
const https = require('https');

const PAGES_DIR = path.join(__dirname, 'src', 'pages');
const COMP_DIR = path.join(__dirname, 'src', 'componenets');
const LANG_FILE = path.join(__dirname, 'src', 'constants', 'languages.js');

const filesToScan = [
  path.join(PAGES_DIR, 'Setting.jsx'),
  path.join(PAGES_DIR, 'MarketplaceTab.jsx'),
  path.join(PAGES_DIR, 'AnalyticsTab.jsx'),
  path.join(COMP_DIR, 'Dashboard', 'Community.jsx')
];

// Basic regex to find t("...") or t('...')
const regex = /t\((["'])(.*?)\1\)/g;

async function extractKeys() {
  const keys = new Set();
  
  for (const file of filesToScan) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      let match;
      while ((match = regex.exec(content)) !== null) {
        keys.add(match[2]);
      }
    }
  }
  return Array.from(keys);
}

async function translateText(text, targetLang) {
  // Free google translate API route
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          let translated = '';
          for (let i = 0; i < json[0].length; i++) {
            translated += json[0][i][0];
          }
          resolve(translated);
        } catch (e) {
          resolve(text); // Fallback to English
        }
      });
    }).on('error', () => resolve(text));
  });
}

const langs = ['en', 'hi', 'pa', 'mr', 'gu', 'ta', 'te', 'kn', 'ml', 'bn'];

async function run() {
  console.log("Extracting keys...");
  const keys = await extractKeys();
  console.log(`Found ${keys.length} keys to translate.`);

  let langFileContent = fs.readFileSync(LANG_FILE, 'utf8');

  for (const lang of langs) {
    if (lang === 'en') continue;
    
    console.log(`Translating for ${lang}...`);
    // Find the translation object for this lang in languages.js
    // We will do a simple string manipulation
    const langHeader = `${lang}: {`;
    const headerIdx = langFileContent.indexOf(langHeader);
    
    if (headerIdx === -1) continue;

    let injections = '';
    
    for (const key of keys) {
      // Very basic check if key exists
      if (!langFileContent.includes(`"${key}":`) && !langFileContent.includes(`'${key}':`)) {
         // Translate
         const translated = await translateText(key, lang);
         // Build safely escaped string
         const safeKey = JSON.stringify(key);
         const safeVal = JSON.stringify(translated);
         injections += `\n    ${safeKey}: ${safeVal},`;
         // Small delay to prevent rate limit
         await new Promise(r => setTimeout(r, 200));
      }
    }
    
    // Inject right after the header
    langFileContent = langFileContent.slice(0, headerIdx + langHeader.length) + injections + langFileContent.slice(headerIdx + langHeader.length);
  }

  // Also add to EN
  console.log(`Adding missing keys to EN...`);
  const enHeader = `en: {`;
  const enHeaderIdx = langFileContent.indexOf(enHeader);
  if (enHeaderIdx !== -1) {
    let enInjections = '';
    for (const key of keys) {
       if (!langFileContent.includes(`"${key}":`) && !langFileContent.includes(`'${key}':`)) {
           const safeKey = JSON.stringify(key);
           enInjections += `\n    ${safeKey}: ${safeKey},`;
       }
    }
    langFileContent = langFileContent.slice(0, enHeaderIdx + enHeader.length) + enInjections + langFileContent.slice(enHeaderIdx + enHeader.length);
  }

  fs.writeFileSync(LANG_FILE, langFileContent);
  console.log("Successfully updated languages.js with new translations!");
}

run();
