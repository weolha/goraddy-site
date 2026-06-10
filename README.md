# 고!래디 공식 사이트

goraddy.olo-g.com 정적 사이트. 빌드 도구 없음 — HTML/CSS만. push하면 GitHub Pages가 자동 배포.

## 페이지

| 파일 | 용도 |
|---|---|
| index.html | 홈 — 키아트 히어로, 스토어 다운로드, 게임 특징, 새 소식, SPEC |
| notice.html | 공지사항 (업데이트/점검/이벤트) |
| notice-embed.html | **인게임 NoticeWebView 전용** 경량 공지 (네비 없음) |
| patch-notes.html | 패치노트 (GoRaddy repo `docs/liveops/패치노트.md` §B에서 변환) |
| probability.html | 확률 고지 (패치노트.md §C에서 변환) — **서버 드랍테이블 변경과 동시 갱신 필수** |
| support.html | 문의 (mailto 양식 + FAQ) |
| terms.html / privacy.html | 약관·개인정보처리방침 (⚠️ 초안 — 법률 검토 필요) |
| style.css | 디자인 시스템 (서울알림체 + 바다 팔레트 + 네이비 라인) |
| assets/ | 키아트·로고·스크린샷(webp), 서울알림체 woff2, 파비콘, OG 이미지 |

## 갱신 규칙

- **패치노트 원본은 GoRaddy repo의 `docs/liveops/패치노트.md`.** 새 버전 시: §B → patch-notes.html 새 `<article class="patch">` 블록 맨 위에, §A 요약 → notice.html + notice-embed.html 맨 위에, §C 변경 시 → probability.html 표 갱신.
- 에셋 추가 시: webp 변환·리사이즈(폭 900~1600) 후 assets/에. 원본 마케팅 에셋은 시놀로지 `4_고래/30_출시`.
- 커밋·푸시 → Pages 자동 배포 (1~2분).

## 배포 설정 (완료 상태 메모)

- Pages: Settings → Pages → Source `main` / root
- 임시 URL: https://weolha.github.io/goraddy-site/
- 커스텀 도메인(전환 예정): `goraddy.olo-g.com` → DNS CNAME `weolha.github.io` + Enforce HTTPS
- 도메인 전환 시 인게임 NoticeWebView가 즉시 새 사이트를 표시함. 웹뷰 URL은 `/notice-embed.html`로 교체 권장 (`Assets/Scripts/Scenes/Lobby/Mail/NoticeWebView.cs`)

## 로컬 미리보기

```
python3 -m http.server 8000
```
