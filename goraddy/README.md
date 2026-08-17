# 고!래디 공식 사이트

goraddy.olo-g.com 정적 사이트. 빌드 도구 없음 — HTML/CSS만. push하면 GitHub Pages가 자동 배포.

## 페이지

| 파일 | 용도 |
|---|---|
| index.html | 홈 — 키아트 히어로, 스토어 다운로드, 게임 특징, 새 소식, SPEC |
| notice.html | 공지사항 (업데이트/점검/이벤트) |
| notice-embed.html | **인게임 NoticeWebView 전용** 경량 공지 (네비 없음). 로케일별로 `notice-embed-en.html` / `notice-embed-ja.html` |
| patch-notes.html | 패치노트 (GoRaddy repo `docs/liveops/패치노트.md` §B에서 변환) |
| probability.html | 확률 고지 (패치노트.md §C에서 변환) — **서버 드랍테이블 변경과 동시 갱신 필수** |
| support.html | 문의 (mailto 양식 + FAQ) |
| terms.html / privacy.html | 약관·개인정보처리방침 (⚠️ 초안 — 법률 검토 필요). **본문은 손으로 고치지 말 것** — 정본은 GoRaddy repo의 `Assets/Addressables/Agreements/{terms,privacy}_{ko,en,ja}.txt`이고, ko/en/ja 6개 페이지는 그걸 변환해 떨군 것이다. 구조는 약관 6장/27조, 개인정보 11/10으로 3개 국어가 일치해야 한다 |
| go/index.html | **QR/단축링크 리다이렉트** `/go/<코드>` — UA 보고 Play(referrer)/App Store(ct)/홈 분기. 코드 체계는 GoRaddy repo `docs/marketing/마케팅_링크체계.md` (새 코드는 문서에 먼저 추가 → `CODES` 반영). ⚠️ `GA_MEASUREMENT_ID`·`APPLE_PT` 치환 잔여 |
| 404.html | 404 + `/go/<코드>` 경로를 `/go/?c=<코드>`로 재작성하는 폴백 |
| en/*.html | **영어 버전** (글로벌 유저용) — KR 7개 페이지와 1:1 대응. 스토어 버튼은 국가 없는 범용 링크 |
| ja/*.html | **일본어 버전** — KR 7개 페이지와 1:1 대응. 스토어 버튼은 JP 링크(`?hl=ja`, `apps.apple.com/jp`). `ja/ja.css`가 폰트와 `word-break`를 일본어용으로 덮어씀 (`keep-all`은 한국어 전용이라 일본어에서 줄바꿈이 깨짐) |
| privacy-policy/en·ko/ | **스토어 등록 개인정보처리방침 URL 경로** (`/privacy-policy/en`, `/privacy-policy/ko`) → privacy.html로 리다이렉트. **삭제 금지** — App Store/Play에 이 URL이 등록돼 있음 |
| style.css | 디자인 시스템 (서울알림체 + 바다 팔레트 + 네이비 라인) |
| assets/ | 키아트·로고·스크린샷(webp), 서울알림체 woff2, 파비콘, OG 이미지 |

## 갱신 규칙

- **패치노트 원본은 GoRaddy repo의 `docs/liveops/패치노트.md`.** 새 버전 시: §B → patch-notes.html 새 `<article class="patch">` 블록 맨 위에, §A 요약 → notice.html + notice-embed.html 맨 위에, §C 변경 시 → probability.html 표 갱신.
- **EN 동기화 (KR 갱신 시 같이):** patch-notes.html의 `<details class="en">` 영문을 en/patch-notes.html 새 article로, 공지 요약 영문을 en/notice.html 맨 위에, 확률 변경 시 en/probability.html 표 갱신, 새 소식이면 index.html과 en/index.html의 news-list도 양쪽 갱신. 명칭은 스토어 영문 표기 기준(Whale Snack, Krill, Bubble, Marine, Infinite Parade 등).
- **JA 동기화 (EN과 같은 타이밍):** ja/patch-notes.html·ja/notice.html·ja/probability.html·ja/index.html의 news-list를 함께 갱신하고, 인게임 공지는 notice-embed-ja.html도 같이. ⚠️ **유닛·버블·스테이지·아이템 고유명사는 반드시 GoRaddy repo의 `Assets/Localization/GameTexts.csv`(ja 열) 또는 `docs/localization/일본어_용어집_2026-07-21.md`의 「일본어 확정」 열에서 찾아 쓴다.** 직역으로는 안 나오는 확정 표기가 많다(고래깡→`クジラせん`, 포탑→`タレット`, 복복이→`プクプク`, 붕어빵→`プンオパン`, 급류 돌파→`激流突破チャレンジ`). 2026-08-17 전수 대조 완료.
- 에셋 추가 시: webp 변환·리사이즈(폭 900~1600) 후 assets/에. 원본 마케팅 에셋은 시놀로지 `4_고래/30_출시`.
- 커밋·푸시 → Pages 자동 배포 (1~2분).

## 문의 수집 (구글 시트 백엔드)

문의 폼 제출은 Apps Script 웹 앱을 거쳐 구글 시트에 쌓인다.

- 설치: [setup/inquiry-backend.gs](setup/inquiry-backend.gs) 상단 주석의 5단계 (시트 생성 → Apps Script 붙여넣기 → 웹 앱 배포 → URL 복사)
- 배포 URL을 `support.html`의 `ENDPOINT` 상수에 입력해야 폼이 활성화됨. 미입력 상태에선 이메일(goraddycs@olo-g.com) 폴백으로 동작
- 시트 컬럼: 접수시각 | 유형 | 닉네임 | 기기 | 내용 | 상태(신규/확인중/답변완료) | 답변메모
- 허니팟 필드로 단순 스팸 차단

## SEO (검색 색인)

- **sitemap·robots는 사이트 루트**(`/sitemap.xml`, `/robots.txt`)에 있다 — 회사+게임 전체 URL과 ko/en/ja hreflang 대응 포함. 새 페이지 추가 시 `sitemap.xml`에도 등록.
- **언어 자동 전환:** KR 페이지 `<head>` 최상단 스크립트가 `?lang=` → `localStorage('olog_lang')` → `navigator.language` 순으로 판단해 `en/` 또는 `ja/`로 리다이렉트한다. 한국어 브라우저는 그대로 두고, 일본어(`ja*`)는 JA, 그 외는 EN. EN/JA 페이지의 스크립트는 리다이렉트 없이 언어 선택만 저장한다. 페이지를 추가하면 이 스크립트의 `P`(슬러그)도 맞춰야 한다.
- **언어 선택 UI:** 헤더의 `.langsel` — **현재 언어를 보여주는 버튼 1개 + 드롭다운**이다. 언어마다 칩을 두면 언어가 늘 때마다 헤더가 좁아지고 모바일에서 메뉴를 덮어서 2026-08-17에 바꿨다. `nav.menu` **바깥**에 있어 가로 스크롤과 무관하다(예전 `position:sticky` 고정 꼼수 제거). 패널 링크는 `class="lang" lang="xx"`를 유지해야 자동 전환 스크립트가 선택을 저장한다 — **클래스를 바꾸면 선호 언어가 저장되지 않는다.** 현재 언어에는 `aria-current="true"`. 전체메뉴 햄버거와 같은 토글 스크립트를 쓰며 하나를 열면 다른 하나가 닫힌다.
- patch-notes(ko/en): canonical + OpenGraph/Twitter 카드 + JSON-LD(Organization·VideoGame·CollectionPage·BreadcrumbList) 적용됨.
- 게임 하위 페이지(공지·확률·문의·약관·개인정보)에 canonical 적용됨. 새 페이지엔 canonical 누락 주의.
- 배포 후 1회: Google Search Console에 `https://olo-g.com/sitemap.xml` 제출.

## 배포 설정 (완료 상태 메모)

- Pages: Settings → Pages → Source `main` / root
- 임시 URL: https://weolha.github.io/goraddy-site/
- 커스텀 도메인(전환 예정): `goraddy.olo-g.com` → DNS CNAME `weolha.github.io` + Enforce HTTPS
- 도메인 전환 시 인게임 NoticeWebView가 즉시 새 사이트를 표시함. 웹뷰 URL은 `/notice-embed.html`로 교체 권장 (`Assets/Scripts/Scenes/Lobby/Mail/NoticeWebView.cs`)

## 로컬 미리보기

```
python3 -m http.server 8000
```
