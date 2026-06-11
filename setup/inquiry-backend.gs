/**
 * 고!래디 문의 수집 백엔드 v2 (Google Apps Script)
 *
 * 시트: "고래디 문의 접수" — 1행 헤더를 아래로 교체할 것:
 * 접수시각 | 유형 | 닉네임 | UID | 앱버전 | 기기/OS | 발생위치 | 주문번호 | 내용 | 첨부 | 출처 | 상태 | 답변메모
 *
 * 첨부 이미지: 드라이브의 "고래디 문의 첨부" 폴더(자동 생성)에 저장되고 시트엔 링크가 기록됨.
 *
 * 코드 수정 후엔 반드시: [배포] → [배포 관리] → 연필 → 버전 "새 버전" → 배포
 */

var SHEET_ID = '1tRmfAYqbOknDcFaX_DLeDNmcCSsvfgTBO_sztlIi5jY'; // 고래디 문의 접수
var ATTACH_FOLDER = '고래디 문의 첨부';

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheets()[0];
    var p = e.parameter;

    // 허니팟 (스팸 가드)
    if (p.website) return out('ok');
    // 내용 없는 제출 무시
    if (!p.body || String(p.body).trim().length < 2) return out('empty');

    // 첨부 이미지 (base64 JPEG, 폼에서 1600px 리사이즈 후 전송)
    var attachLinks = [];
    if (p.attach && p.attach.length > 100) {
      try {
        var base64 = String(p.attach).replace(/^data:image\/\w+;base64,/, '');
        var bytes = Utilities.base64Decode(base64);
        if (bytes.length < 8 * 1024 * 1024) { // 8MB 가드
          var folder = getOrCreateFolder(ATTACH_FOLDER);
          var name = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyMMdd_HHmmss') + '_' + String(p.nick || 'unknown').slice(0, 10) + '.jpg';
          var file = folder.createFile(Utilities.newBlob(bytes, 'image/jpeg', name));
          attachLinks.push(file.getUrl());
        }
      } catch (fe) { attachLinks.push('(첨부 저장 실패)'); }
    }
    if (p.video && String(p.video).trim()) attachLinks.push(String(p.video).trim().slice(0, 200));

    sheet.appendRow([
      new Date(),
      s(p.type, 20),
      s(p.nick, 30),
      s(p.uid, 50),
      s(p.ver, 20),
      s(p.device, 80),
      s(p.where, 60),
      s(p.order, 60),
      s(p.body, 3000),
      attachLinks.join('\n'),
      s(p.source, 10) || 'web',
      '신규',
      ''
    ]);

    return out('ok');
  } catch (err) {
    return out('error');
  }
}

function s(v, n) { return String(v || '').slice(0, n); }

function getOrCreateFolder(name) {
  var it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}

function out(msg) {
  return ContentService.createTextOutput(msg).setMimeType(ContentService.MimeType.TEXT);
}
