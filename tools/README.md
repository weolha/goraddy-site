# tools/ — 사이트 유지보수 도구

## render-games.cjs — 게임 목록 생성기

게임 목록의 **단일 데이터 소스**는 [`assets/games.js`](../assets/games.js)다.
정적 HTML(SEO)을 유지하면서 "신작 추가 = 데이터 한 줄"을 만들기 위한 생성기.

### 쓰는 법

```bash
# 1) 게임을 추가/수정하려면 assets/games.js 배열만 고친다 (연도 내림차순 유지)
# 2) 블록 HTML을 찍어낸다
node tools/render-games.cjs gmini ko     # 홈(루트) 미니그리드 — 한국어
node tools/render-games.cjs gmini en     # 홈(en/) 미니그리드 — 영어
# 3) 출력 블록을 해당 파일의 <div class="gmini reveal"> … </div> 안에 붙여넣는다
#    - index.html (ko), en/index.html (en)
```

### 일치 검증 (적용 후 안전 확인)

```bash
node tools/render-games.cjs --check
# index.html(ko)·en/index.html(en)의 현재 gmini가 데이터에서 생성한 것과 일치하는지 확인.
# ✓ 두 줄이면 데이터와 정적 HTML이 동기화된 상태. ✗면 어긋난 것.
```

### 현재 커버 범위 / 확장

- ✅ `gmini` (홈 미니그리드, ko·en) — 생성·검증 완료.
- ⏳ 확장 후보(같은 패턴으로 추가): 홈 시트 `d-games`(gcat), `games.html` 풀 카드. 각 surface가 쓰는 필드(짧은 설명/긴 설명/수상)는 `games.js`에 필드를 더해 분기.
- ⚠️ **클라이언트 런타임 렌더로 바꾸지 말 것** — games.html의 게임 설명·수상은 SEO 자산이라 정적 HTML로 둔다. 이 생성기는 "데이터→정적 HTML"을 찍어내는 빌드 보조이지, 페이지를 JS로 그리는 게 아니다.

설계 근거: [docs/marketing/회사사이트_IA_확장계획.md §5·§6](../../GoRaddy/docs/marketing/회사사이트_IA_확장계획.md)
