/**
 * 고!래디 문의 수집·답변 백엔드 v3 (Google Apps Script)
 *
 * 시트: "고래디 문의 접수" — 1행 헤더 (v3에서 14·15열 추가, 기존 행은 그대로 둬도 됨):
 * 접수시각 | 유형 | 닉네임 | UID | 앱버전 | 기기/OS | 발생위치 | 주문번호 | 내용 | 첨부 | 출처 | 상태 | 답변메모 | 이메일 | 답변시각
 *
 * 첨부 이미지: 드라이브의 "고래디 문의 첨부" 폴더(자동 생성)에 저장되고 시트엔 링크가 기록됨.
 * 접수 응답: {ok:true, ticket:"GR-yyMMdd-행번호"} JSON — 폼이 접수번호를 유저에게 표시.
 *
 * ── v3 신규: 답변 API (doGet) ─────────────────────────────
 * 운영 도구(Claude 등)가 GET으로 호출. 모든 호출에 token 필수.
 *   ?action=list&status=신규&token=...          → 해당 상태 문의 목록(JSON)
 *   ?action=draft&row=5&text=...&token=...      → 5행 답변메모 저장, 상태→확인중
 *   ?action=send&row=5&token=...                → 5행 답변메모를 이메일로 발송, 상태→답변완료
 *
 * 설정 (최초 1회):
 * 1. Apps Script 편집기 → 프로젝트 설정 → 스크립트 속성 → API_TOKEN 추가
 *    (값: 긴 무작위 문자열. 이 토큰이 있으면 발송까지 가능하므로 외부 공개 금지)
 * 2. 발송 메일은 이 스크립트를 소유한 Google 계정(= goraddycs@olo-g.com 권장)으로 나감.
 *    첫 발송 시 Gmail 권한 승인 필요.
 *
 * 코드 수정 후엔 반드시: [배포] → [배포 관리] → 연필 → 버전 "새 버전" → 배포
 */

var SHEET_ID = '1tRmfAYqbOknDcFaX_DLeDNmcCSsvfgTBO_sztlIi5jY'; // 고래디 문의 접수
var ATTACH_FOLDER = '고래디 문의 첨부';
var CS_MAIL = 'goraddycs@olo-g.com'; // 회신 수신 주소 (replyTo)
var MAIL_KO = {
  subject: '[고!래디] 문의하신 내용에 답변드려요',
  hello: '님, 안녕하세요!\n\n', helloNoNick: '안녕하세요!\n\n',
  sign: '\n\n— 고!래디 운영팀 드림 🐳\n본 메일은 문의 답변 회신용입니다. 추가 문의: https://goraddy.olo-g.com/support.html'
};
var MAIL_EN = {
  subject: '[Go!Raddy] A reply to your inquiry',
  hello: ', hello!\n\n', helloNoNick: 'Hello!\n\n',
  sign: '\n\n— The Go!Raddy Team 🐳\nThis email is a reply to your support inquiry. Need more help? https://goraddy.olo-g.com/en/support.html'
};

// 컬럼 인덱스 (1-based)
var COL = { time: 1, type: 2, nick: 3, uid: 4, ver: 5, device: 6, where: 7, order: 8,
            body: 9, attach: 10, source: 11, status: 12, memo: 13, email: 14, repliedAt: 15 };

// ───────────────────────── 문의 접수 (사이트 폼) ─────────────────────────
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    var p = e.parameter;

    // 허니팟 (스팸 가드) — 봇에게는 성공처럼 응답
    if (p.website) return json({ ok: true });
    // 내용 없는 제출 무시
    if (!p.body || String(p.body).trim().length < 2) return json({ ok: false, error: 'empty' });

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
      '',
      s(p.email, 80),
      ''
    ]);

    // 접수번호: GR-yyMMdd-행번호 (행번호로 시트에서 바로 찾을 수 있음)
    var ticket = 'GR-' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyMMdd') + '-' + sheet.getLastRow();
    return json({ ok: true, ticket: ticket });
  } catch (err) {
    return json({ ok: false, error: 'server' });
  }
}

// ───────────────────────── 답변 API (운영 도구) ─────────────────────────
function doGet(e) {
  var p = e.parameter || {};
  var token = PropertiesService.getScriptProperties().getProperty('API_TOKEN');
  if (!token || p.token !== token) return json({ error: 'unauthorized' });

  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

    if (p.action === 'list')  return apiList(sheet, p);
    if (p.action === 'draft') return apiDraft(sheet, p);
    if (p.action === 'send')  return apiSend(sheet, p);
    return json({ error: 'unknown action' });
  } catch (err) {
    return json({ error: String(err) });
  }
}

// 목록: ?action=list&status=신규 (status 생략 시 신규+확인중)
function apiList(sheet, p) {
  var values = sheet.getDataRange().getValues();
  var want = p.status ? [p.status] : ['신규', '확인중'];
  var rows = [];
  for (var i = 1; i < values.length; i++) { // 0행 = 헤더
    var v = values[i];
    if (want.indexOf(String(v[COL.status - 1])) === -1) continue;
    rows.push({
      row: i + 1,
      time: v[COL.time - 1] instanceof Date ? Utilities.formatDate(v[COL.time - 1], 'Asia/Seoul', 'yyyy-MM-dd HH:mm') : String(v[COL.time - 1]),
      type: v[COL.type - 1], nick: v[COL.nick - 1], uid: v[COL.uid - 1],
      ver: v[COL.ver - 1], device: v[COL.device - 1], where: v[COL.where - 1],
      order: v[COL.order - 1], body: v[COL.body - 1], attach: v[COL.attach - 1],
      source: v[COL.source - 1], status: v[COL.status - 1], memo: v[COL.memo - 1],
      email: v[COL.email - 1] ? '있음' : '' // 목록엔 주소 자체를 노출하지 않음
    });
  }
  return json({ count: rows.length, inquiries: rows });
}

// 초안 저장: ?action=draft&row=5&text=...
function apiDraft(sheet, p) {
  var row = parseInt(p.row, 10);
  if (!row || row < 2 || row > sheet.getLastRow()) return json({ error: 'bad row' });
  if (!p.text || !String(p.text).trim()) return json({ error: 'empty text' });
  sheet.getRange(row, COL.memo).setValue(String(p.text).slice(0, 5000));
  if (sheet.getRange(row, COL.status).getValue() === '신규') sheet.getRange(row, COL.status).setValue('확인중');
  return json({ ok: true, row: row });
}

// 발송: ?action=send&row=5 — 답변메모를 해당 행 이메일로 발송
function apiSend(sheet, p) {
  var row = parseInt(p.row, 10);
  if (!row || row < 2 || row > sheet.getLastRow()) return json({ error: 'bad row' });

  var email = String(sheet.getRange(row, COL.email).getValue()).trim();
  var memo = String(sheet.getRange(row, COL.memo).getValue()).trim();
  var nick = String(sheet.getRange(row, COL.nick).getValue()).trim();
  var status = String(sheet.getRange(row, COL.status).getValue());
  var source = String(sheet.getRange(row, COL.source).getValue());

  if (!email || email.indexOf('@') === -1) return json({ error: 'no email' });
  if (!memo) return json({ error: 'no draft' });
  if (status === '답변완료') return json({ error: 'already sent' }); // 중복 발송 가드

  // 영어 문의(source: web-en / ingame-en)는 영어 인사·서명·제목
  var L = source.indexOf('en') !== -1 ? MAIL_EN : MAIL_KO;
  var body = (nick ? nick + L.hello : L.helloNoNick) + memo + L.sign;
  // replyTo 명시: 발송 계정과 무관하게 유저 회신은 항상 CS 메일함으로
  GmailApp.sendEmail(email, L.subject, body, { name: '고!래디 Go! Raddy', replyTo: CS_MAIL });

  sheet.getRange(row, COL.status).setValue('답변완료');
  sheet.getRange(row, COL.repliedAt).setValue(new Date());
  return json({ ok: true, row: row, sentTo: email.replace(/^(..).*(@.*)$/, '$1***$2') });
}

// ───────────────────────── 유틸 ─────────────────────────
function s(v, n) { return String(v || '').slice(0, n); }

function getOrCreateFolder(name) {
  var it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
