# OLO-G 통합 사이트 (회사 + 고!래디)

`olo-g.com` 정적 사이트. 빌드 도구 없음 — HTML/CSS만. push하면 GitHub Pages 자동 배포.

향후 배포 구조: **루트 = 회사 사이트(OLO-G), `/goraddy/` = 게임 사이트(고!래디)**.
즉 `olo-g.com` = 회사, `olo-g.com/goraddy` = 게임.

## 구조

```
/                         ← 회사 사이트 (OLO-G)
├─ index.html             홈 — 로고 히어로, 행복 3단계, 대표작 쇼케이스, 비전, CTA
├─ about.html             소개 — 이름·미션·비전·가치(4축 8덕목)·타임라인
├─ games.html             게임 — 고!래디·퐁퐁두두 시리즈·차기작
├─ contact.html           문의 — 사업/보도/채용, SNS, 사업자 정보
├─ en/index.html          English 원페이지
├─ 404.html               회사 404 + /go/<코드> 딥링크 폴백(루트에서 서브패스까지 대응)
├─ style.css, assets/     회사 디자인 시스템·로고·파비콘
│
└─ goraddy/               ← 게임 사이트 (고!래디) — 통째로 이동됨
   ├─ index.html, notice.html, patch-notes.html, probability.html ...
   ├─ go/, privacy-policy/, setup/, en/, style.css, assets/
   └─ README.md           게임 사이트 운영 문서(패치노트 갱신 규칙 등) — 게임 작업은 이 문서 참고
```

## 갱신 규칙

- **회사 사이트:** 콘텐츠 출처는 노션 "OLO-G" 허브 + 사내 계획서 `GoRaddy repo docs/marketing/회사사이트_OLOG_계획.md`.
- **게임 사이트:** 패치노트·공지·확률 갱신 등 모든 규칙은 `goraddy/README.md` 참고. (원본은 GoRaddy repo `docs/liveops/패치노트.md`)
- 커밋·푸시 → Pages 자동 배포(1~2분).

## 배포 전 TODO

- **도메인:** GitHub Pages 커스텀 도메인을 `olo-g.com` 루트로 설정(현재는 임시 사이트 운영 중, 미배포).
- **스토어 URL:** App Store/Play 등록 `privacy-policy` 경로가 `goraddy.olo-g.com/...`이면 `olo-g.com/goraddy/...`로 갱신하거나 `goraddy.olo-g.com → olo-g.com/goraddy` 리다이렉트 유지.
- **마케팅 `/go/` 링크:** 기존 `goraddy.olo-g.com/go/<코드>` → 신규 `olo-g.com/goraddy/go/<코드>`. 코드 체계 문서(`GoRaddy repo docs/marketing/마케팅_링크체계.md`)·QR 갱신 필요. (루트 404 폴백은 양쪽 경로 모두 대응)
- **회사 사이트 콘텐츠:** 대표자명·통신판매업 신고번호(마포 이전 후) 확인, 퐁퐁두두 시리즈 정보 확정.
- **GA4:** 회사/게임 웹 스트림 분리.
