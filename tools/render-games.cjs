#!/usr/bin/env node
/*
 * 게임 목록 블록 생성기 — assets/games.js(단일 데이터)에서 정적 HTML 블록을 찍어낸다.
 * 정적 HTML/SEO를 유지하면서 "신작=데이터 한 줄"을 달성하기 위한 도구.
 *
 *   node tools/render-games.cjs gmini ko        # 홈 미니그리드(루트, 한국어)
 *   node tools/render-games.cjs gmini en        # 홈 미니그리드(en/, 영어)
 *   node tools/render-games.cjs --check         # 현재 index/en index의 gmini와 일치 검증
 *
 * 출력 블록을 해당 정적 파일의 마커 사이에 붙여넣는다(또는 dev가 자동화).
 * 설계 근거: docs/marketing/회사사이트_IA_확장계획.md §5
 */
const fs = require('fs');
const path = require('path');
const GAMES = require(path.join(__dirname, '..', 'assets', 'games.js'));

// 홈 미니그리드 한 항목. base='' (루트) | '../' (en/)
function gminiItem(g, lang, base) {
  const isEn = lang === 'en';
  const name = isEn ? g.nameEn : g.name;
  const genre = isEn ? g.genreEn : g.genreKo;
  const sub = `${genre} · ${g.year}`;
  const icon = base + g.icon;
  let href, ext = '';
  if (g.tier === 'flagship') {
    href = base + (isEn ? g.siteEn : g.site);
  } else {
    href = g.store.play; ext = ' target="_blank" rel="noopener"';
  }
  return `      <a href="${href}"${ext}><span class="ic" style="background-image:url('${icon}')"></span><span><strong>${name}</strong><span>${sub}</span></span></a>`;
}

function gmini(lang, base) {
  return GAMES.map(g => gminiItem(g, lang, base)).join('\n');
}

// --- CLI ---
const [, , cmd, langArg] = process.argv;

if (cmd === '--check') {
  const root = path.join(__dirname, '..');
  const cases = [
    { file: 'index.html', lang: 'ko', base: '' },
    { file: path.join('en', 'index.html'), lang: 'en', base: '../' },
  ];
  let allOk = true;
  for (const c of cases) {
    const html = fs.readFileSync(path.join(root, c.file), 'utf8');
    const m = html.match(/<div class="gmini reveal">([\s\S]*?)<\/div>/);
    if (!m) { console.log(`✗ ${c.file}: gmini 블록 못 찾음`); allOk = false; continue; }
    const current = m[1].trim().replace(/\s+/g, ' ');
    const generated = gmini(c.lang, c.base).trim().replace(/\s+/g, ' ');
    const ok = current === generated;
    allOk = allOk && ok;
    console.log(`${ok ? '✓' : '✗'} ${c.file} (${c.lang}) gmini ${ok ? '일치' : '불일치'}`);
    if (!ok) {
      console.log('  --- 현재 ---\n  ' + current);
      console.log('  --- 생성 ---\n  ' + generated);
    }
  }
  process.exit(allOk ? 0 : 1);
}

if (cmd === 'gmini') {
  const lang = langArg === 'en' ? 'en' : 'ko';
  const base = lang === 'en' ? '../' : '';
  console.log(gmini(lang, base));
} else {
  console.log('usage: node tools/render-games.cjs gmini [ko|en] | --check');
}
