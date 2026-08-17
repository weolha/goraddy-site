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
 * 2. 발송 = 스크립트 소유 계정(현재 weolha@). SEND_AS 별칭을 등록하면 표시 주소가 goraddycs@ 로 바뀐다.
 *    수신 = 접수 알림·유저 회신 모두 goraddycs@ 그룹(멤버 지메일로 배달 + 아카이브 보관).
 *    첫 발송 시 Gmail 권한 승인 필요.
 *
 * 코드 수정 후엔 반드시: [배포] → [배포 관리] → 연필 → 버전 "새 버전" → 배포
 */

var SHEET_ID = '1tRmfAYqbOknDcFaX_DLeDNmcCSsvfgTBO_sztlIi5jY'; // 고래디 문의 접수
var ATTACH_FOLDER = '고래디 문의 첨부';
// 유저에게 노출되는 고!래디 CS 주소. 답장 메일의 replyTo 이자 문의 폼 폴백 주소다(접수 알림은 NOTIFY_TO).
// ⚠ 약관·개인정보에 표기되는 대표 주소(cs@olo-g.com)와는 다른 것이다 —
//    cs@ 는 오로지게임즈 전 게임의 CS 가 모이는 회사 창구이고,
//    고래디 문의 파이프라인(접수→초안→발송)은 이 전용 함에서 굴린다. 섞으면 관리가 안 된다.
var CS_MAIL = 'goraddycs@olo-g.com';

// 접수 알림 수신처. goraddycs@ 그룹으로 통일했다(2026-08-17 월하) —
// 멤버 구독이 '모든 이메일'이라 각 멤버 지메일로 배달되면서 그룹 아카이브에도 기록이 남고,
// 나중에 CS 담당이 늘어도 그룹에 넣기만 하면 된다.
// 개인 주소를 여기 박아 두면 그 사람이 안 볼 때 문의가 멈춘다.
var NOTIFY_TO = CS_MAIL;

// 유저에게 보이는 발신 주소. 메일은 이 스크립트를 소유한 계정(현재 weolha@)에서 나가는데,
// 그대로 두면 유저 답장 메일에 대표 개인 주소가 찍힌다.
// 소유 계정 Gmail 에 [설정 > 계정 > 다른 주소에서 메일 보내기]로 이 주소를 등록해 두면
// 발신 표시가 goraddycs@ 로 바뀐다. 등록 전이라면 '' 로 비워 둘 것(등록 안 된 주소를 쓰면 발송이 실패한다).
// 아래 sendMail 이 실패 시 별칭 없이 한 번 더 시도하므로, 등록을 깜빡해도 메일이 사라지진 않는다.
var SEND_AS = 'goraddycs@olo-g.com';
// TODO: 도메인 전환(goraddy.olo-g.com) 완료 시 이 값만 교체
var SITE_URL = 'https://weolha.github.io/goraddy-site';

// 새 문의가 들어오면 CS_MAIL 로 알림을 보낸다(2026-08-17 추가).
// 전엔 시트에 행만 쌓이고 아무 알림도 없어서, 시트를 직접 열어보기 전까지 접수를 몰랐다.
// 메일이 성가시면 false 로 끄면 된다(끄면 시트 「도구 > 알림 규칙」이라도 걸어 둘 것).
var NOTIFY_ON_NEW = true;

// 주의: 이모지(🐳 등)는 Gmail 일반 텍스트 발송에서 깨지므로 메일 문구에 사용 금지
var MAIL_KO = {
  subject: '[고!래디] 문의하신 내용에 답변드려요',
  hello: '님, 안녕하세요!\n\n', helloNoNick: '안녕하세요!\n\n',
  sign: '\n\n— 고!래디 운영팀 드림\n본 메일은 문의 답변 회신용입니다. 추가 문의: ' + SITE_URL + '/support.html',
  quoteTitle: '접수하신 문의'
};
var MAIL_EN = {
  subject: '[Go!Raddy] A reply to your inquiry',
  hello: ', hello!\n\n', helloNoNick: 'Hello!\n\n',
  sign: '\n\n— The Go!Raddy Team\nThis email is a reply to your support inquiry. Need more help? ' + SITE_URL + '/en/support.html',
  quoteTitle: 'Your inquiry'
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
      } catch (fe) { attachLinks.push('(첨부 저장 실패: ' + String(fe).slice(0, 120) + ')'); }
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
    var row = sheet.getLastRow();
    var ticket = 'GR-' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyMMdd') + '-' + row;

    // 접수 알림. 발송이 실패해도 접수 자체는 성공으로 끝나야 하므로 통째로 감싼다.
    if (NOTIFY_ON_NEW) {
      try { notifyNewInquiry(ticket, row, p, attachLinks); } catch (me) {}
    }

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

  // 접수번호(접수시각 기준, doPost와 동일 규칙) + 문의 원문 인용
  var time = sheet.getRange(row, COL.time).getValue();
  var type = String(sheet.getRange(row, COL.type).getValue());
  var inqBody = String(sheet.getRange(row, COL.body).getValue());
  var dateStr = time instanceof Date ? Utilities.formatDate(time, 'Asia/Seoul', 'yyMMdd') : '';
  var ticket = 'GR-' + dateStr + '-' + row;
  var quote = '\n\n────────────────\n' + L.quoteTitle + ' (' + ticket +
    (time instanceof Date ? ' · ' + Utilities.formatDate(time, 'Asia/Seoul', 'yyyy-MM-dd HH:mm') : '') + ')\n' +
    (type ? '· ' + type + '\n' : '') + inqBody;

  var body = (nick ? nick + L.hello : L.helloNoNick) + memo + L.sign + quote;
  // replyTo 명시: 발송 계정과 무관하게 유저 회신은 항상 CS 메일함으로
  sendMail(email, L.subject + ' (' + ticket + ')', body, { name: '고!래디 Go! Raddy', replyTo: CS_MAIL });

  sheet.getRange(row, COL.status).setValue('답변완료');
  sheet.getRange(row, COL.repliedAt).setValue(new Date());
  return json({ ok: true, row: row, sentTo: email.replace(/^(..).*(@.*)$/, '$1***$2') });
}

// ───────────────────────── 최초 1회: 권한 승인 ─────────────────────────
// 웹앱 호출로는 권한 창이 안 뜸. 편집기에서 이 함수를 직접 실행 → 권한 검토 → 허용.
// 실행 후 CS 메일함에 테스트 메일이 도착하면 Gmail 발송 권한 승인 완료.
function authorizeGmailTest() {
  sendMail(NOTIFY_TO, '[고!래디] Gmail 권한 승인 테스트',
    '이 메일이 도착하면 발송 권한이 정상 승인된 것입니다.\n' +
    '보낸사람이 ' + (SEND_AS || '(별칭 미설정)') + ' 으로 찍혔는지 확인하세요 — 개인 주소로 찍혔다면 별칭 등록이 안 된 것입니다.');
}

// ───────────────────────── 유틸 ─────────────────────────
// 메일 발송 공통 창구. SEND_AS 별칭이 등록돼 있으면 그 주소로 보내고,
// 등록 전이라 거부당하면 별칭 없이 한 번 더 보낸다(메일을 놓치는 것보다 낫다).
function sendMail(to, subject, body, opts) {
  opts = opts || {};
  if (SEND_AS) {
    try {
      var withAlias = {};
      for (var k in opts) withAlias[k] = opts[k];
      withAlias.from = SEND_AS;
      GmailApp.sendEmail(to, subject, body, withAlias);
      return;
    } catch (e) { /* 별칭 미등록 — 아래로 폴백 */ }
  }
  GmailApp.sendEmail(to, subject, body, opts);
}

// 새 문의 알림 메일 — 시트를 열지 않아도 내용까지 바로 보이게 본문에 다 넣는다.
function notifyNewInquiry(ticket, row, p, attachLinks) {
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit#gid=0&range=A' + row;
  var lines = [
    '접수번호: ' + ticket,
    '유형: ' + (s(p.type, 20) || '-'),
    '닉네임: ' + (s(p.nick, 30) || '-') + '   UID: ' + (s(p.uid, 50) || '-'),
    '앱버전: ' + (s(p.ver, 20) || '-') + '   기기: ' + (s(p.device, 80) || '-'),
    '발생위치: ' + (s(p.where, 60) || '-') + '   주문번호: ' + (s(p.order, 60) || '-'),
    '회신 이메일: ' + (s(p.email, 80) || '(없음 — 답장 불가)'),
    '출처: ' + (s(p.source, 10) || 'web'),
    '',
    '── 내용 ──',
    s(p.body, 1500),
    ''
  ];
  if (attachLinks && attachLinks.length) lines.push('첨부: ' + attachLinks.join(' , '), '');
  lines.push('시트에서 열기: ' + sheetUrl);

  // 유저 이메일이 있으면 이 알림에 그대로 [답장]해서 보낼 수 있게 replyTo 를 유저로 건다.
  // 급한 건은 이게 제일 빠르다. 다만 그렇게 보내면 시트 상태가 '신규'로 남으므로 손으로 닫아야 한다.
  var userMail = s(p.email, 80);
  var opts = { name: '고!래디 문의 알림' };
  if (userMail && userMail.indexOf('@') !== -1) {
    opts.replyTo = userMail;
    lines.push('', '※ 이 메일에 그대로 [답장]하면 유저에게 바로 갑니다(회신처: ' + userMail + ').',
               '   단 그 경우 시트 상태는 「신규」로 남으니 처리 후 「답변완료」로 바꿔 주세요.',
               '   접수번호·서명까지 붙여 정식으로 보내려면 답변 API(send)를 쓰세요.');
  }

  sendMail(NOTIFY_TO, '[고!래디 문의] ' + ticket + ' ' + (s(p.type, 20) || ''), lines.join('\n'), opts);
}

function s(v, n) { return String(v || '').slice(0, n); }

function getOrCreateFolder(name) {
  var it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
