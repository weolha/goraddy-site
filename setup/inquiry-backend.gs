/**
 * 고!래디 문의 수집 백엔드 (Google Apps Script)
 *
 * 설치 방법 (5분):
 * 1. Google Drive에서 새 스프레드시트 생성 — 이름: "고래디 문의 접수"
 * 2. 1행에 헤더 입력: 접수시각 | 유형 | 닉네임 | 기기 | 내용 | 상태 | 답변메모
 * 3. 메뉴 [확장 프로그램] → [Apps Script] → 이 파일 내용 전체 붙여넣기
 * 4. [배포] → [새 배포] → 유형: 웹 앱
 *    - 실행 계정: 나
 *    - 액세스 권한: 모든 사용자
 * 5. 배포 후 나오는 웹 앱 URL을 복사해서
 *    site의 support.html 상단 ENDPOINT 상수에 붙여넣기
 *
 * 이후 재배포 시: [배포] → [배포 관리] → 연필 아이콘 → 버전: 새 버전 → 배포
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var p = e.parameter;

    // 간단 스팸 가드: 허니팟 필드가 차 있으면 무시
    if (p.website) return out('ok');

    // 내용 없는 제출 무시
    if (!p.body || String(p.body).trim().length < 2) return out('empty');

    sheet.appendRow([
      new Date(),
      String(p.type || '').slice(0, 20),
      String(p.nick || '').slice(0, 30),
      String(p.device || '').slice(0, 60),
      String(p.body || '').slice(0, 3000),
      '신규',   // 상태: 신규 → 확인중 → 답변완료
      ''        // 답변메모
    ]);

    return out('ok');
  } catch (err) {
    return out('error');
  }
}

function out(msg) {
  return ContentService.createTextOutput(msg).setMimeType(ContentService.MimeType.TEXT);
}
