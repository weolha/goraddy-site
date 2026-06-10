# 고!래디 공식 사이트 (site/)

goraddy.olo-g.com에 올릴 정적 사이트. 빌드 도구 없음 — HTML/CSS만.

## 페이지

| 파일 | 용도 |
|---|---|
| index.html | 홈 — 게임 소개, 스토어 다운로드, 섹션 타일 |
| notice.html | 공지사항 (업데이트/점검/이벤트) |
| notice-embed.html | **인게임 NoticeWebView 전용** 경량 공지 (네비 없음) |
| patch-notes.html | 패치노트 (docs/liveops/패치노트.md §B에서 변환) |
| probability.html | 확률 고지 (패치노트.md §C에서 변환) — **서버 드랍테이블 변경과 동시 갱신 필수** |
| support.html | 문의 (mailto 양식 + FAQ) |
| terms.html / privacy.html | 약관·개인정보처리방침 (⚠️ 초안 — 법률 검토 필요) |
| style.css | 공통 스타일 (고래디 네이비 테마) |

## 갱신 규칙 (자동화)

- **원본은 docs/liveops/패치노트.md.** 새 버전 추가 시: §B → patch-notes.html 새 `<article class="patch">` 블록을 맨 위에, §A 요약 → notice.html + notice-embed.html 새 공지를 맨 위에, §C 변경 시 → probability.html 표 갱신.
- 커밋·푸시하면 GitHub Pages가 자동 배포.

## 배포 (최초 1회 설정)

GitHub Pages는 **공개 repo**(또는 유료 플랜의 비공개 repo)에서만 동작. 게임 repo가 비공개이므로 **사이트 전용 공개 repo 분리를 권장**:

1. GitHub에서 공개 repo `goraddy-site` 생성
2. 이 폴더 내용물을 그 repo 루트로 복사 후 push
3. repo Settings → Pages → Source: `main` branch `/` (root)
4. Settings → Pages → Custom domain: `goraddy.olo-g.com` 입력
5. DNS에서 `goraddy.olo-g.com` CNAME을 `<계정명>.github.io`로 변경 (전환 전 임시 `*.github.io` URL로 충분히 검증!)
6. 루트에 `CNAME` 파일(내용: `goraddy.olo-g.com`)이 자동 생성되는지 확인

## 인게임 웹뷰

`Assets/Scripts/Scenes/Lobby/Mail/NoticeWebView.cs`가 `https://goraddy.olo-g.com/`을 로드.
도메인 전환 후 그대로 새 사이트 홈이 보임. **웹뷰 표시 품질을 높이려면 URL을 `https://goraddy.olo-g.com/notice-embed.html`로 교체 권장** (클라이언트 한 줄 수정).

## 로컬 미리보기

```
cd site && python3 -m http.server 8000
```
