# 퐁퐁두두 시리즈 공식 사이트

`olo-g.com/ponpondoodoo/` — 퐁퐁두두 **시리즈** 사이트. 지금 주인공은 퐁퐁두두2이고, 1편은 나중에 부수 섹션으로만 붙인다(2026-09-23 월하 결정). 주소에 "2"를 넣지 않은 것도 그래서다.

> ⚠️ **주소를 바꾸지 말 것.** ALT+G 2026(10/9) 시연 빌드 엔딩 QR이 `https://olo-g.com/ponpondoodoo/?from=altg`로 구워져 있다(ponpondoodoo2 리포 `Assets/Resources/AltgDemo/qr_home.png`).
> ⚠️ `ponpondoodoo2.olo-g.com` 서브도메인은 **게임 백엔드**(`/receipt`·`/applelink`·`/friend`)라 사이트로 쓰면 안 된다.

## 페이지

| 파일 (ko 기준, en/·ja/ 동일 구성) | 용도 |
|---|---|
| index.html | 홈 — 키아트, 스토어, 특징 4블록(사이니지 구성), 퐁퐁이 행렬, 트레일러, 링크, 게임 정보 |
| terms.html | 이용약관 (6장 27조, goraddy 2026.08 통합본 기반) |
| privacy.html | 개인정보처리방침 (11개 항, 퐁퐁두두2 실제 수집 항목·위탁사 기준) |
| support.html | 문의(메일 양식) · FAQ · **계정 및 데이터 삭제 안내(`support#delete`)** |
| style.css | 디자인 시스템 — 12개 페이지 공용. 일본어 차이는 `:lang(ja)` 블록에만 |
| assets/ | 웹용 에셋(webp), 폰트 woff2, og.jpg, favicon |

링크는 goraddy처럼 확장자 없이 쓴다(`terms`, `support`). GitHub Pages가 `.html`을 붙여 준다 — 로컬 `python3 -m http.server`에선 확장자 없는 주소가 404이니 미리보기는 `terms.html`로 연다.

**⚠️ HTML은 생성 파일이다.** 12개 페이지 전부 [`tools/render-ponpondoodoo.cjs`](../tools/render-ponpondoodoo.cjs)가 찍어낸다(홈 문구 `STR`, 하위 페이지 문구 `SUB`, 약관·개인정보 본문은 아래 txt). 고칠 땐 생성기나 txt를 고치고 다시 돌린다.

```bash
node tools/render-ponpondoodoo.cjs          # 12개 파일 생성
node tools/render-ponpondoodoo.cjs --check  # HTML이 생성 결과와 같은지 확인 (✓ 12줄이면 정상)
```

## 약관·개인정보

- **정본 = [`tools/ponpondoodoo-legal/`](../tools/ponpondoodoo-legal/)`{terms,privacy}_{ko,en,ja}.txt`.** 사이트에 공개되지 않는 위치다. 형식은 goraddy의 `Agreements/*.txt`와 같다(`##` 장·항, `###` 조, `N.` 번호 목록, 4칸 들여쓰기 = 한 단계, `•`/`-` 글머리).
- 2026-09-23에 goraddy 통합본(2026.08.24 시행)을 복사해 퐁퐁두두2에 맞게 고쳤다: 게임명, 확률형 아이템 조항(판매할 때만 고지 — 현재 유료 확률형 아이템 없음, 랜덤박스는 광고 보상), **제17조 3항 자동 갱신 구독** 신설, 개인정보의 로그인 방식(게스트+구글/애플, 이메일 로그인 없음)·친구 기능(닉네임·프로필 이미지·마을 정보 공개)·푸시 토큰·Firebase 구성·문의 채널(Gmail).
- **공고 2026.09.23 / 시행 2026.10.01.** 시행 전에는 상단에 "종전 버전 보기(노션)" 안내 띠가 뜨고, 시행일(KST 자정)이 지나면 스크립트가 띠를 스스로 숨긴다(`LEGAL_EFFECTIVE`).
- 다음 개정 때: txt 3개 언어를 같이 고치고 → 생성기의 날짜(`SUB.*.dates`, `band`, `LEGAL_EFFECTIVE`)와 txt 안 공고·시행일을 맞추고 → 최소 7일(불리한 변경이면 30일) 전에 게임 안 공지.
- ⚠️ 법률 검토는 받지 않은 상태다(goraddy 통합본과 같은 수준).

## 명칭·문구 규칙

- 구글 플레이 '교사 추천(Teacher Approved)'은 **쓰지 않는다** — 예전에 받았다가 회수된 것으로 보임(2026-09-24 스토어 페이지에 없음, 월하 확인). 수상·선정 표기는 '앱스토어 피처드'만.
- 출시 국가: **한국·미국·일본**. 운영 중단 채널(공식 X `@ponpondoodoo2`, 캐릭터 테스트 사이트)은 **링크하지 않는다**(2026-09-23 월하). 외부 링크는 OST 플레이리스트와 트레일러만.

- 게임명: ko **퐁퐁두두2** / en **ponpondoodoo** / ja **ポンポンドゥードゥー** (각 스토어 표기. 해외는 숫자 없음 — 1편이 한국 전용 출시였기 때문). 영문은 소문자 `ponpondoodoo` 그대로 — "PonPonDoodoo 2"·"PonPon Doodoo" 쓰지 말 것(2026-09-23 월하 확인)
- 고유명사는 게임 `LocalizationTable` 기준: 이스랜드·잉크·돌보미 / Ysland·Ink·Caretaker / イースランド·インク·シッター
- 대외 문구는 **새로 쓰지 않는다.** 출처 = 시놀로지 `00_지원사업 및 행사/자료/소개문.pages`(공식 소개문 국·영문) → ALT+G 사이니지 캡슐 제목 → 스토어 설명. 일본어 특징 설명 4줄은 공식 한국어 문장을 옮긴 번역이다(일본어 원문 없음).
- 실적: 45만 다운로드는 **1편** 실적 — 2편 사이트에서 단독으로 쓰지 말 것.

## 폰트

| 용도 | ko / en | ja |
|---|---|---|
| 견출 | **GameFont**(= 온글잎 몽몽데이즈, 게임·사이니지와 같은 파일) | **Kiwi Maru Medium**(게임과 같음, SIL OFL) |
| 본문 | Pretendard | 시스템 일본어 고딕 |

- 두 폰트 모두 서브셋이다: GameFont = KS X 1001 한글 2,350자 + 라틴(540KB), Kiwi Maru = 가나 + JIS 1수준 한자(908KB). 목록 밖 글자는 본문 폰트로 떨어진다. 제목에 드문 글자(예: 똠·햏)나 2수준 한자를 쓰면 그 글자만 자형이 튄다.
- ja 페이지는 GameFont를 받지 않고, ko/en 페이지는 Kiwi Maru를 받지 않는다. 새 스타일에 `font-family: 'PonFont'`를 넣을 땐 `:lang(ja)` 덮어쓰기도 같이 넣을 것.
- 온글잎 몽몽데이즈 웹 임베딩 사용 — 월하 확인 완료(2026-09-23).

## 에셋 출처

원본은 시놀로지 `2_퐁퐁두두2/`. 변환 규칙: webp, 알파 여백 trim, 폭 500~1600.

| 에셋 | 원본 |
|---|---|
| 특징 섹션 그림(personality-*, question-ui, evolution-tree, egg1~4, ponpon-crowd, deco-*, fun-*; 미사용 fun-blob·fun-mini-lava·fun-mini-space는 2026-09-23 삭제) | ALT+G 사이니지 `1_사이니지.ai`에 임베드된 래스터를 PyMuPDF로 추출. ⚠️ **사이니지 이미지는 인쇄용 DeviceCMYK라 RGB 원본보다 약간 탁하다** — 월하 판단으로 이 섹션은 그대로 둠(2026-09-23). 나중에 교체한다면 RGB 원본 후보: 슬라이더 `1_출시/피그마용/4 페이지.png`, 진화 트리 `피그마용/characters.png`, 물음표 `피그마용/레이어 70.png`, 오락기 `22_굿즈/현수막배너/배너/레이어_20.png`, 질문 화면 `1_출시/screenshots/스샷/IMG_0102 1.png` |
| logo.webp · walking.webp | RGB 원본 `1_출시/대표이미지/title.png` · `walking.png` |
| keyart.webp · og.jpg | **게임 빌드 타이틀과 동일하게 합성**: ponpondoodoo2 리포 `Assets/MyAsset/Image/UI/12_Title/newtitle.png`(배경 타원) 위에 `titleimage2.png`(앞 캐릭터)를 `Login.unity`의 RectTransform 값(TitleImg_Back/Front 위치·크기)대로 겹침. 시놀로지 사본 = `1_출시/대표이미지/게임타이틀_빌드사용본/`(원본 3장 + 합성본 `game_title_composite.png`). ⚠️ `1_출시/대표이미지/maintitle.png`는 흰 안개를 씌운 **흐린 별도 버전**이고, 인쇄용 PDF(테이블커버·사이니지) 추출본은 CMYK라 더 탁하다 — 둘 다 쓰지 말 것(2026-09-23 교체 이력) |
| chars/c01~c27 | `2_홍보/4_사이트/characters/character1~27.png`(모두 600×600 캔버스, 캐릭터 체구 비율대로 그려져 있음) — 흰 배경을 flood fill로 투명화하고 **캔버스 기준 같은 배율(0.5)로 축소 후 trim**. 그래서 이미지 크기 차이 = 실제 체구 차이. 크기표 `tools/ponpondoodoo-chars.json`을 생성기가 읽어 절반 크기로 표시(레티나 2배). 다시 뽑으면 json도 갱신 |
| icon.webp · favicon.png | `1_출시/app icon.png` |
| 폰트 | ponpondoodoo2 리포 `Assets/MyAsset/Fonts/GameFont.ttf`·`KiwiMaru-Medium.ttf` |

## 동작 메모

- **언어 자동 전환:** KR 페이지만 `?lang=` → `localStorage('olog_lang')` → 브라우저 언어 순으로 `en/`·`ja/`로 보낸다(goraddy와 같은 키라 선택이 공유된다). 리다이렉트 때 **쿼리를 유지**한다 — 일본어 브라우저로 QR을 찍어도 `?from=altg`가 살아 있다.
- **`?from=altg`:** 상단에 ALT+G 환영 배너를 띄운다.
- **GA4 (코드 준비 완료, ID 대기):** 생성기 맨 위 `GA_ID`에 측정 ID를 넣고 다시 생성하면 12페이지 전부에 켜진다. 비어 있으면 GA 코드가 아예 안 들어간다. 이벤트 = 자동 page_view(쿼리 포함) · `altg_visit`(부스 QR 유입) · `store_click{store,lang,place}` · `trailer_play` · `ost_click`.
  - ID 발급: 퐁퐁두두2 Firebase 프로젝트의 GA4 속성 → 관리 → 데이터 스트림 → **웹** 추가(`olo-g.com`) → `G-…` 복사.
  - ⚠️ `goraddy/go`의 `G-QERZLTF3XD`는 고!래디 QR 측정용 — 쓰면 두 게임 데이터가 섞인다.
- **스토어 버튼:** UA로 iOS/Android를 판별해 해당 버튼에 노란 테두리. 링크는 ko=KR, en=국가 없는 범용, ja=`apps.apple.com/jp`·`hl=ja`.
- **트레일러:** 클릭할 때만 youtube-nocookie iframe을 붙인다(첫 화면 무게 절약).
- **게임 연결:** 퐁퐁두두2 리포 `LegalLinks.cs`가 `terms?lang=ko|en|ja`·`privacy?lang=…`·`support?lang=…`를 연다(게임에서 고른 언어로 열리게). 1.210부터 반영. 구버전 앱은 계속 노션을 여니 **노션 페이지는 지우지 말 것.**
- **문의:** `cs@olo-g.com` (확정, 2026-09-23).

## 남은 일

1. **[월하] 스토어 등록 URL 교체 — 1.210 빌드 제출 때.** 개인정보 URL → `https://olo-g.com/ponpondoodoo/privacy`, Play '계정 삭제 URL' → `…/support#delete`. 체크리스트 = ponpondoodoo2 리포 `docs/release_notes/NEXT_BUILD_스토어URL_교체.md`
2. 패치노트·공지 페이지 — 원본 `ponpondoodoo2/docs/release_notes/`
3. 퐁퐁두두 1편 부수 섹션
