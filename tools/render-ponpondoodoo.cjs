#!/usr/bin/env node
/*
 * 퐁퐁두두 시리즈 사이트 생성기 — ponpondoodoo/{index,en/index,ja/index}.html
 * ---------------------------------------------------------------
 * 세 언어 페이지는 구조가 같고 문구만 다르다. 손으로 3벌을 고치면 반드시 어긋나므로
 * 템플릿 1개 + 언어별 문구(STR)로 정적 HTML을 찍어낸다. (render-games.cjs와 같은 원칙:
 * 결과물은 JS 런타임 렌더가 아닌 정적 HTML — SEO 자산.)
 *
 *   node tools/render-ponpondoodoo.cjs          세 파일 생성(덮어쓰기)
 *   node tools/render-ponpondoodoo.cjs --check  현재 파일이 생성 결과와 같은지만 확인
 *
 * ⚠️ 생성된 HTML을 직접 고치지 말 것 — 다음 생성 때 덮인다. 문구는 아래 STR, 구조는 page().
 * 대외 문구 출처: 시놀로지 `00_지원사업 및 행사/자료/소개문.pages`(공식 소개문 국·영문),
 * ALT+G 2026 사이니지 캡슐 제목, 스토어 설명(ko/en/ja). 고유명사는 게임 LocalizationTable 기준
 * (ko 이스랜드·잉크·돌보미 / en Ysland·Ink·Caretaker / ja イースランド·インク·シッター).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'ponpondoodoo');
const BASE = 'https://olo-g.com/ponpondoodoo/';
const APP_ID = '6445818248';
const PKG = 'com.ologgames.ponpondoodoo2';
const YT = 'EPKgzmQz-ak'; // 공식 애니메이션 트레일러
const OST = 'https://youtube.com/playlist?list=PLWgOZVBH_79UrZrzA5u2sDYmbCNWAPXtN'; // ponpondoodoo 2nd album
// 종전(2024) 약관·개인정보 — 노션. 인게임 SettingPanel이 1.210 전까지 이 URL을 연다. 시행일 전 안내 띠에서 링크한다
const OLD_TERMS = 'https://olog.notion.site/ee395d8b243d4778ac88c33ea2d62145';
const OLD_PRIVACY = 'https://olog.notion.site/bcee3608a5844db4b888027e46a55098';
const LEGAL_DIR = path.join(__dirname, 'ponpondoodoo-legal'); // 약관·개인정보 정본(txt, ko/en/ja)
const LEGAL_EFFECTIVE = '2026-10-01'; // 시행일 — 이 날짜가 지나면 '시행 전' 안내 띠가 스스로 숨는다
const CS_MAIL = 'cs@olo-g.com';
// GA4 측정 ID — 퐁퐁두두2 GA4 속성의 '웹' 데이터 스트림 ID를 넣으면 전 페이지에서 켜진다. 비어 있으면 GA 코드 자체를 안 넣는다.
// ⚠️ goraddy/go의 G-QERZLTF3XD(고!래디 QR 측정)는 쓰지 말 것 — 두 게임 데이터가 섞인다.
// 이벤트: page_view(자동, ?from=altg 포함) · altg_visit · store_click{store,lang,place} · trailer_play · ost_click
const GA_ID = '';

const STR = {
  ko: {
    dir: '', htmlLang: 'ko', label: '한국어',
    title: '퐁퐁두두2 — 공식 사이트',
    name: '퐁퐁두두2',
    desc: '하루 10분, 나의 성격을 알아가는 힐링 키우기 게임 퐁퐁두두2 공식 사이트. 잔잔한 음악과 함께 몽글몽글한 퐁퐁이를 키워보세요.',
    ogDesc: '하루 10분, 나의 성격을 알아가는 힐링 키우기 게임. 잔잔한 음악과 함께 몽글몽글한 퐁퐁이를 키워보세요.',
    nav: ['게임 소개', '퐁퐁이', '영상', '다운로드'], langAria: '언어 선택',
    visit: '<b>ALT+G에서 만나서 반가워요!</b> 이제 내 폰에서 나만의 퐁퐁이를 키워보세요.',
    heroAlt: '퐁퐁두두2 키 비주얼 — 돌보미와 퐁퐁이들',
    h1: '하루 10분, 나의 성격을 알아가는 힐링 키우기',
    lead: '잔잔한 BGM, 몽글몽글한 그래픽과 함께 귀여운 퐁퐁이들을 키워보세요.',
    tags: ['힐링', '키우기', '성격 테스트', 'iOS · Android'],
    play: 'https://play.google.com/store/apps/details?id=' + PKG,
    appstore: 'https://apps.apple.com/kr/app/id' + APP_ID,
    storyCap: '이스랜드에 오신 것을 환영해요',
    story: '위기에 빠진 이스랜드는 영웅님만을 기다립니다.<br>귀여운 퐁퐁이들을 돌봐주고 마을을 예쁘게 가꿔나가는 돌보미가 되어주세요.',
    f1: '성격에 따른 나만의 메인 캐릭터',
    f1d: '나를 나타내기 — 나의 성격에 따라 나만의 메인 캐릭터가 정해져요. 과연 나는 어떤 돌보미일까요?',
    f2: '질문에 답해 퐁퐁이를 키운다',
    f2d: '성격을 물어보는 질문이 나오며, 대답에 따라 캐릭터들이 진화해 나를 표현합니다.',
    feed: '먹이', eggs: '다양한 알들',
    f3: '마음껏 꾸민다',
    f3d: '배경 및 캐릭터 꾸미기를 통해 내 개성과 취향을 드러낼 수 있습니다.',
    f4: '즐거운 시간을 보낸다',
    photo: '사진 찍기', photoD: '마을과 캐릭터들의 사진을 직접 게임 내에서 편집하고 저장할 수 있습니다.',
    friend: '친구 사귀기', friendD: '친구들의 홈에 방문해 나와 어떻게 다른지 비교할 수 있습니다.',
    mini: '미니게임', miniD: '간단하지만 중독성있는 미니게임을 즐기고 잉크를 모을 수 있습니다.',
    closing: '게임 곳곳에 재미있는 디테일들이 숨어 있으니 찾아보세요.',
    friendsH: '이스랜드의 퐁퐁이들', friendsSub: '퐁퐁이를 톡 눌러보세요!',
    videoH: '공식 애니메이션 트레일러', videoAria: '트레일러 재생',
    badges: ['앱스토어 피처드 선정', '한국 · 미국 · 일본 출시'], ost: 'OST 앨범 듣기',
    infoH: '게임 정보',
    spec: [['타이틀', '퐁퐁두두2'], ['장르', '힐링 키우기'], ['플랫폼', 'iOS (App Store) / Android (Google Play)'],
      ['가격', '무료 (일부 유료 아이템 포함)'], ['지원 언어', '한국어 · English · 日本語'], ['출시', '2024년 2월'],
      ['개발', 'OLO-G Games Inc. (오로지게임즈)']],
    dlH: '지금 이스랜드로 떠나요', dlSub: '무료로 다운로드하고 퐁퐁이를 만나보세요.',
    terms: '이용약관', privacy: '개인정보처리방침', contact: '문의', company: '오로지게임즈 ↗',
  },
  en: {
    dir: 'en', htmlLang: 'en', label: 'English',
    title: 'ponpondoodoo — Official Site',
    name: 'ponpondoodoo',
    desc: 'Official site of ponpondoodoo, a cute, relaxing game that teaches you about your own personality. Listen to relaxing music and watch ponpons waddle around.',
    ogDesc: 'A cute, relaxing game that teaches you about your own personality. Listen to relaxing music and watch ponpons waddle around.',
    nav: ['Features', 'Ponpons', 'Trailer', 'Download'], langAria: 'Select language',
    visit: '<b>Thanks for playing at ALT+G!</b> Now raise your very own ponpons on your phone.',
    heroAlt: 'ponpondoodoo key visual — the Caretakers and their ponpons',
    h1: 'With just 10 minutes a day, a day of exhaustion melts away',
    lead: 'A cute, relaxing game that teaches you about your own personality. Listen to relaxing music and watch ponpons waddle around.',
    tags: ['Healing', 'Raising', 'Personality test', 'iOS · Android'],
    play: 'https://play.google.com/store/apps/details?id=' + PKG + '&hl=en',
    appstore: 'https://apps.apple.com/app/id' + APP_ID,
    storyCap: 'Welcome to Ysland',
    story: 'Ysland is in trouble and waiting for its hero.<br>Become a Caretaker who looks after the adorable ponpons and makes the village beautiful.',
    f1: 'Personality based Main Character',
    f1d: 'Your main character is decided by your own personality. What kind of Caretaker are you?',
    f2: 'Raise ponpons by answering questions',
    f2d: 'Questions about personality are asked, and ponpons evolve based on the answers, to represent the player.',
    feed: 'Feed', eggs: 'Various Eggs',
    f3: 'Decorate as you want',
    f3d: 'By customizing home and characters, players can reveal their personalities and preferences.',
    f4: 'Have Fun',
    photo: 'Take Pictures', photoD: 'Edit and save photos of your village and ponpons right inside the game.',
    friend: 'Make Friends', friendD: 'Visit your friends’ homes and see how different they are from yours.',
    mini: 'Minigames', miniD: 'Enjoy simple but addictive minigames and collect Ink.',
    closing: 'The game is full of little details to find — have fun discovering them!',
    friendsH: 'The ponpons of Ysland', friendsSub: 'Give a ponpon a tap!',
    videoH: 'Official Animated Trailer', videoAria: 'Play trailer',
    badges: ['Featured on the App Store', 'Out now in Korea, the US & Japan'], ost: 'Listen to the soundtrack',
    infoH: 'Game Info',
    spec: [['Title', 'ponpondoodoo (퐁퐁두두2 in Korea)'], ['Genre', 'Healing · Raising'], ['Platform', 'iOS (App Store) / Android (Google Play)'],
      ['Price', 'Free (offers in-app purchases)'], ['Languages', 'English · 한국어 · 日本語'], ['Released', 'February 2024'],
      ['Developer', 'OLO-G Games Inc.']],
    dlH: 'Come visit Ysland', dlSub: 'Download for free and meet your ponpons.',
    terms: 'Terms of Service', privacy: 'Privacy Policy', contact: 'Contact', company: 'OLO-G Games ↗',
  },
  ja: {
    dir: 'ja', htmlLang: 'ja', label: '日本語',
    title: 'ポンポンドゥードゥー — 公式サイト',
    name: 'ポンポンドゥードゥー',
    desc: '自分の性格タイプがわかるかわいい癒し系ゲーム、ポンポンドゥードゥーの公式サイト。穏やかな音楽を聞きながら、キュートなポンポンたちを見守りましょう。',
    ogDesc: '1日10分、日常に疲れた自分に贈る時間。自分の性格タイプがわかるかわいい癒し系ゲーム。',
    nav: ['ゲーム紹介', 'ポンポン', '動画', 'ダウンロード'], langAria: '言語を選択',
    visit: '<b>ALT+Gで遊んでくれてありがとう！</b> 今度は自分のスマホで、あなただけのポンポンを育てよう。',
    heroAlt: 'ポンポンドゥードゥー キービジュアル — シッターとポンポンたち',
    h1: '1日10分、日常に疲れた自分に贈る時間',
    lead: '自分の性格タイプがわかるかわいい癒し系ゲーム。穏やかな音楽を聞きながら、キュートなポンポンたちを見守りましょう。',
    tags: ['癒し', '育成', '性格診断', 'iOS · Android'],
    play: 'https://play.google.com/store/apps/details?id=' + PKG + '&hl=ja',
    appstore: 'https://apps.apple.com/jp/app/id' + APP_ID,
    storyCap: 'イースランドへようこそ',
    story: 'ピンチに陥ったイースランドは、ヒーローの到着を待っています。<br>かわいいポンポンたちのお世話をして、村をすてきに彩るシッターになってください。',
    f1: '性格で決まる、わたしだけのメインキャラクター',
    f1d: 'あなたの性格に合わせて、あなただけのメインキャラクターが決まります。あなたはどんなシッター？',
    f2: '質問に答えてポンポンを育てよう',
    f2d: '性格についての質問が届き、その答えに合わせてキャラクターが進化して、あなたを表現します。',
    feed: 'エサ', eggs: 'いろいろなタマゴ',
    f3: '思いのままにデコレーション',
    f3d: '背景やキャラクターをデコって、あなたの個性や好みを表現できます。',
    f4: '楽しい時間を過ごそう',
    photo: '写真を撮る', photoD: '村やキャラクターの写真を、ゲームの中で編集・保存できます。',
    friend: '友だちをつくる', friendD: '友だちのホームを訪ねて、自分とどう違うのか比べてみましょう。',
    mini: 'ミニゲーム', miniD: 'シンプルだけどクセになるミニゲームで、インクを集めよう。',
    closing: 'ゲームのあちこちに楽しい仕掛けが隠れています。ぜひ探してみてください。',
    friendsH: 'イースランドのポンポンたち', friendsSub: 'ポンポンをタップしてみてね！',
    videoH: '公式アニメーショントレーラー', videoAria: 'トレーラーを再生',
    badges: ['App Store でフィーチャー', '日本・韓国・アメリカで配信中'], ost: 'サウンドトラックを聴く',
    infoH: 'ゲーム情報',
    spec: [['タイトル', 'ポンポンドゥードゥー'], ['ジャンル', '癒し系育成'], ['対応OS', 'iOS (App Store) / Android (Google Play)'],
      ['価格', '基本無料（アプリ内課金あり）'], ['対応言語', '日本語 · English · 한국어'], ['リリース', '2024年2月'],
      ['開発', 'OLO-G Games Inc.']],
    dlH: 'さあ、イースランドへ', dlSub: '無料でダウンロードして、ポンポンに会いに行こう。',
    terms: '利用規約', privacy: 'プライバシーポリシー', contact: 'お問い合わせ', company: 'OLO-G Games ↗',
  },
};

const FLAG = {
  ko: '<svg class="flag" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="#fff"/><circle cx="10" cy="10" r="5.5" fill="#0047a0"/><path d="M4.5 10a5.5 5.5 0 0 1 11 0 2.75 2.75 0 0 0-5.5 0 2.75 2.75 0 0 1-5.5 0z" fill="#cd2e3a"/></svg>',
  en: '<svg class="flag" viewBox="0 0 20 20" aria-hidden="true"><defs><clipPath id="fEn"><circle cx="10" cy="10" r="10"/></clipPath></defs><g clip-path="url(#fEn)"><rect width="20" height="20" fill="#fff"/><g fill="#d23b3b"><rect width="20" height="2.3"/><rect y="4.4" width="20" height="2.3"/><rect y="8.9" width="20" height="2.3"/><rect y="13.3" width="20" height="2.3"/><rect y="17.7" width="20" height="2.3"/></g><rect width="10.5" height="8.9" fill="#3c5a9a"/></g></svg>',
  ja: '<svg class="flag" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="#fff"/><circle cx="10" cy="10" r="5.2" fill="#bc002d"/></svg>',
};
const GP_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.6 1.8c-.4.4-.6 1-.6 1.7v17c0 .7.2 1.3.6 1.7l.1.1 9.5-9.5v-.2L3.7 1.7l-.1.1zm12.8 12.9-3.2-3.2v-.2l3.2-3.2.1.1 3.8 2.1c1.1.6 1.1 1.6 0 2.2l-3.8 2.1-.1.1zm-.8.7L12.4 12 3.6 22.2c.4.4 1 .4 1.7 0l10.3-5.8zM3.6 1.8l8.8 10.2 3.2-3.2L5.3 3c-.7-.4-1.3-.4-1.7 0v-1.2z"/></svg>';
const AS_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.7 12.8c0-3 2.5-4.5 2.6-4.6-1.4-2.1-3.6-2.3-4.4-2.4-1.9-.2-3.6 1.1-4.6 1.1-.9 0-2.4-1.1-4-1-2 0-3.9 1.2-5 3-2.1 3.7-.5 9.1 1.5 12.1 1 1.5 2.2 3.1 3.8 3 1.5-.1 2.1-1 4-1s2.4 1 4 .9c1.7 0 2.7-1.5 3.7-3 1.2-1.7 1.6-3.4 1.7-3.5-.1 0-3.2-1.2-3.3-4.6zM15.6 3.8c.8-1 1.4-2.4 1.2-3.8-1.2 0-2.7.8-3.5 1.8-.8.9-1.5 2.3-1.3 3.7 1.4.1 2.8-.7 3.6-1.7z"/></svg>';

// KR 페이지만 브라우저 언어로 en/ja 리다이렉트(goraddy와 같은 규칙·같은 저장 키 olog_lang).
// EN/JA 페이지는 리다이렉트 없이 선택만 저장. 쿼리(?from=altg 등)는 리다이렉트 때 보존한다.
const LANG_SCRIPT_KO = `<script>(function(){var K='olog_lang',P='';function g(){try{return localStorage.getItem(K)}catch(e){return null}}function s(v){try{localStorage.setItem(K,v)}catch(e){}}document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a.lang');if(a)s(a.getAttribute('lang')||'en')});function go(v){location.replace(v+'/'+P+location.search)}var q=new URLSearchParams(location.search).get('lang');if(q==='ko'){s('ko');return}if(q==='en'||q==='ja'){s(q);go(q);return}var p=g();if(p==='ko')return;if(p==='en'||p==='ja'){go(p);return}var n=(navigator.language||'').toLowerCase();if(n.indexOf('ko')===0)return;if(n.indexOf('ja')===0){go('ja');return}go('en')})();</script>`;
const LANG_SCRIPT_OTHER = `<script>(function(){var K='olog_lang';document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a.lang');if(a){try{localStorage.setItem(K,a.getAttribute('lang')||'en')}catch(x){}}})})();</script>`;

const CHARS = Array.from({ length: 27 }, (_, i) => String(i + 1).padStart(2, '0'));
// 캐릭터 이미지 크기(px). 원본 600 캔버스를 같은 배율로 줄여서 저장했으므로 크기 차이 = 실제 체구 차이.
// 화면에는 절반 크기(레티나 2배)로 표시한다. 캐릭터를 다시 뽑으면 이 json도 같이 갱신.
const CHAR_SIZE = JSON.parse(fs.readFileSync(path.join(__dirname, 'ponpondoodoo-chars.json'), 'utf8'));
const charImg = (a, n, extra = '') => { const [w, h] = CHAR_SIZE['c' + n]; return `<img src="${a}chars/c${n}.webp" alt="" width="${Math.round(w / 2)}" height="${Math.round(h / 2)}" style="--w:${Math.round(w / 2)}"${extra}>`; };

// ---------- 하위 페이지 문구 (약관·개인정보·문의·공통 푸터) ----------
const SUB = {
  ko: {
    navSupport: '문의', navShort: '문의',
    biz: '(주)오로지게임즈 · 대표 권준영 · 사업자등록번호 722-86-02932 · 통신판매업 2025-마포-2730<br>서울특별시 마포구 매봉산로 31, 시너지움 9층 909호 · <a href="mailto:cs@olo-g.com">cs@olo-g.com</a>',
    termsT: '이용약관', privacyT: '개인정보처리방침',
    termsDesc: '퐁퐁두두2 서비스 이용약관', privacyDesc: '퐁퐁두두2 개인정보처리방침',
    dates: ['공고일 2026.09.23', '시행일 2026.10.01'],
    band: kind => `이 ${kind}은 <b>2026년 10월 1일</b>부터 적용됩니다. 시행일 전까지는 종전 ${kind}이 적용됩니다.`,
    oldLink: '종전 버전 보기 ↗', prevLink: '이전 버전', toc: '목차',
    supT: '문의하기', supDesc: '퐁퐁두두2 고객 문의 · 자주 묻는 질문 · 계정 삭제 안내',
    supLead: '게임을 하다가 불편한 점이 있으면 언제든 알려주세요. 돌보미님의 이야기를 꼼꼼히 읽고 답해 드릴게요.',
    mailH: '이메일로 문의하기', mailD: '아래 버튼을 누르면 문의 양식이 채워진 메일이 열려요. 보통 영업일 기준 1~3일 안에 답장을 드립니다.',
    mailBtn: '메일 쓰기', mailSubject: '[퐁퐁두두2 문의] ',
    mailBody: '닉네임:\n내 ID (설정에서 복사):\n기기 모델 / OS 버전:\n게임 버전:\n문의 내용:\n',
    includeH: '이런 정보를 함께 보내 주세요',
    include: ['게임 닉네임과 <b>내 ID</b> — 게임 안 설정 화면에서 복사할 수 있어요', '기기 모델과 OS 버전, 게임 버전', '문제가 생긴 상황과 시각, 가능하면 스크린샷', '결제 문의라면 스토어 영수증의 주문번호'],
    faqH: '자주 묻는 질문',
    faq: [
      ['기기를 바꾸거나 앱을 지우면 데이터가 사라지나요?', '게스트로 플레이 중이라면 앱을 지우거나 기기를 바꿨을 때 데이터를 찾기 어려워요. 게임 안 <b>설정</b>에서 구글 또는 애플 계정을 <b>연동</b>해 두면, 새 기기에서 같은 계정으로 로그인해 그대로 이어서 키울 수 있어요.'],
      ['연동하지 않은 채로 데이터를 잃어버렸어요.', '닉네임, 퐁퐁이 이름, 대략적인 친구·좋아요 수, 마지막으로 플레이한 시기, 결제 내역처럼 기억나는 정보를 최대한 적어 문의해 주세요. 확인되면 복구를 도와드립니다. 다만 정보가 부족하면 복구가 어려울 수 있어요.'],
      ['결제했는데 아이템이 들어오지 않았어요.', '앱을 완전히 종료한 뒤 다시 실행해 주세요. 그래도 들어오지 않으면 스토어 영수증의 주문번호와 함께 문의해 주세요.'],
      ['환불은 어떻게 하나요?', '결제는 각 스토어를 통해 처리되기 때문에 환불도 스토어 정책을 따릅니다. App Store는 <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener">reportaproblem.apple.com</a>에서, Google Play는 Play 스토어의 결제 내역에서 요청할 수 있어요. 자세한 기준은 <a href="terms">이용약관</a> 제22조를 참고해 주세요.'],
      ['구독은 어떻게 해지하나요?', 'iPhone은 <b>설정 → 내 이름 → 구독</b>, Android는 <b>Play 스토어 → 프로필 → 결제 및 정기 결제 → 정기 결제</b>에서 해지할 수 있어요. 해지해도 이미 결제한 기간이 끝날 때까지 혜택은 그대로 유지됩니다.'],
      ['알림이 오지 않아요.', '기기 설정에서 퐁퐁두두2의 알림이 허용되어 있는지 확인해 주세요. 절전 모드나 방해 금지 모드에서는 알림이 늦거나 오지 않을 수 있어요.'],
    ],
    delH: '계정 및 데이터 삭제',
    delD: '게임 안 <b>설정 → 계정 삭제</b>에서 계정과 게임 데이터를 직접 삭제할 수 있어요. 삭제한 데이터는 되돌릴 수 없습니다. 앱을 사용할 수 없는 상황이라면 <a href="mailto:cs@olo-g.com">cs@olo-g.com</a>으로 닉네임 또는 ID와 함께 삭제를 요청해 주세요. 관계 법령에 따라 보관해야 하는 결제 기록은 <a href="privacy">개인정보처리방침</a>에 정한 기간 동안 보관한 뒤 파기합니다.',
  },
  en: {
    navSupport: 'Support', navShort: 'Help',
    biz: 'OLO-G Games Inc. · CEO Kwon Joonyoung · Business Reg. No. 722-86-02932 · Mail-order Reg. No. 2025-Mapo-2730<br>909, 9F Synergium, 31 Maebongsan-ro, Mapo-gu, Seoul 03909, Republic of Korea · <a href="mailto:cs@olo-g.com">cs@olo-g.com</a>',
    termsT: 'Terms of Service', privacyT: 'Privacy Policy',
    termsDesc: 'ponpondoodoo Terms of Service', privacyDesc: 'ponpondoodoo Privacy Policy',
    dates: ['Announced September 23, 2026', 'Effective October 1, 2026'],
    band: kind => `${kind === 'Terms of Service' ? 'These Terms of Service take' : 'This ' + kind + ' takes'} effect on <b>October 1, 2026</b>. Until then, the previous version applies.`,
    oldLink: 'View previous version ↗', prevLink: 'Previous versions', toc: 'Contents',
    supT: 'Support', supDesc: 'ponpondoodoo customer support, FAQ and account deletion',
    supLead: 'If anything feels off while playing, just let us know. We read every message carefully and will get back to you.',
    mailH: 'Contact us by e-mail', mailD: 'The button below opens an e-mail with a short form already filled in. We usually reply within 1–3 business days.',
    mailBtn: 'Write an e-mail', mailSubject: '[ponpondoodoo Support] ',
    mailBody: 'Nickname:\nMy ID (copy it in Settings):\nDevice model / OS version:\nGame version:\nMessage:\n',
    includeH: 'Please include',
    include: ['Your nickname and <b>your ID</b> — you can copy it in the in-game Settings', 'Device model, OS version and game version', 'What happened and when, with a screenshot if possible', 'For payment issues, the order number from your store receipt'],
    faqH: 'Frequently asked questions',
    faq: [
      ['Will I lose my data if I change devices or delete the app?', 'If you play as a guest, your data can be hard to find after deleting the app or switching devices. <b>Link</b> a Google or Apple account in the in-game <b>Settings</b>, and you can sign in with the same account on a new device and pick up right where you left off.'],
      ['I lost my data without linking an account.', 'Send us everything you remember — your nickname, your ponpons’ names, roughly how many friends and likes you had, when you last played, and any purchases. If we can identify your account we will help restore it, although recovery may not be possible without enough information.'],
      ['I made a purchase but did not receive the item.', 'Close the app completely and open it again. If the item still has not arrived, contact us with the order number from your store receipt.'],
      ['How do I get a refund?', 'Payments are handled by the app stores, so refunds follow each store’s policy. Request one at <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener">reportaproblem.apple.com</a> for the App Store, or from your order history in the Play Store for Google Play. See Article 22 of the <a href="terms">Terms of Service</a> for details.'],
      ['How do I cancel a subscription?', 'On iPhone, go to <b>Settings → your name → Subscriptions</b>. On Android, go to <b>Play Store → Profile → Payments &amp; subscriptions → Subscriptions</b>. Your benefits continue until the end of the period you have already paid for.'],
      ['I am not getting notifications.', 'Check that notifications for ponpondoodoo are allowed in your device settings. Battery saver or Do Not Disturb modes may delay or block notifications.'],
    ],
    delH: 'Account and data deletion',
    delD: 'You can delete your account and game data yourself in the in-game <b>Settings → Delete Account</b>. Deleted data cannot be recovered. If you cannot use the app, e-mail <a href="mailto:cs@olo-g.com">cs@olo-g.com</a> with your nickname or ID to request deletion. Payment records that must be kept by law are retained for the period stated in our <a href="privacy">Privacy Policy</a> and then destroyed.',
  },
  ja: {
    navSupport: 'お問い合わせ', navShort: 'お問合せ',
    biz: '株式会社オロジゲームズ（OLO-G Games Inc.）· 代表者 クォン・ジュンヨン · 事業者登録番号 722-86-02932 · 通信販売業申告番号 2025-マポ-2730<br>ソウル特別市麻浦区メボンサン路31、シナジウム9階909号 (03909) · <a href="mailto:cs@olo-g.com">cs@olo-g.com</a>',
    termsT: '利用規約', privacyT: 'プライバシーポリシー',
    termsDesc: 'ポンポンドゥードゥー 利用規約', privacyDesc: 'ポンポンドゥードゥー プライバシーポリシー',
    dates: ['公示日 2026.09.23', '施行日 2026.10.01'],
    band: kind => `この${kind}は<b>2026年10月1日</b>から適用されます。施行日までは従前の${kind}が適用されます。`,
    oldLink: '従前の版を見る ↗', prevLink: '以前の版', toc: '目次',
    supT: 'お問い合わせ', supDesc: 'ポンポンドゥードゥーのお問い合わせ・よくある質問・アカウント削除のご案内',
    supLead: 'ゲーム中に困ったことがあれば、いつでもお知らせください。シッターさんからのメッセージは一つひとつ丁寧に読んでお返事します。',
    mailH: 'メールでお問い合わせ', mailD: '下のボタンを押すと、入力欄つきのメールが開きます。通常、1〜3営業日以内にお返事します。',
    mailBtn: 'メールを書く', mailSubject: '[ポンポンドゥードゥー お問い合わせ] ',
    mailBody: 'ニックネーム：\nマイID（設定からコピー）：\n端末の機種 / OSバージョン：\nゲームバージョン：\nお問い合わせ内容：\n',
    includeH: 'あわせてお送りください',
    include: ['ゲームのニックネームと<b>マイID</b>（ゲーム内の設定画面でコピーできます）', '端末の機種、OSバージョン、ゲームバージョン', '問題が起きた状況と日時、できればスクリーンショット', '決済に関するお問い合わせは、ストアのレシートに記載された注文番号'],
    faqH: 'よくある質問',
    faq: [
      ['機種変更やアプリの削除でデータは消えますか？', 'ゲストでプレイしている場合、アプリを削除したり機種を変更したりすると、データを見つけにくくなります。ゲーム内の<b>設定</b>でGoogleまたはAppleアカウントと<b>連携</b>しておけば、新しい端末で同じアカウントにログインして、そのまま続きから遊べます。'],
      ['連携しないままデータをなくしてしまいました。', 'ニックネーム、ポンポンの名前、フレンドや「いいね」のおおよその数、最後に遊んだ時期、購入履歴など、覚えている情報をできるだけ詳しくお知らせください。確認できれば復旧をお手伝いします。ただし、情報が少ないと復旧できない場合があります。'],
      ['購入したのにアイテムが届きません。', 'アプリを完全に終了してから、もう一度起動してください。それでも届かない場合は、ストアのレシートに記載された注文番号を添えてお問い合わせください。'],
      ['返金はどうすればいいですか？', '決済は各ストアで処理されるため、返金も各ストアのポリシーに従います。App Storeは<a href="https://reportaproblem.apple.com" target="_blank" rel="noopener">reportaproblem.apple.com</a>から、Google PlayはPlayストアの購入履歴からリクエストできます。詳しくは<a href="terms">利用規約</a>第22条をご覧ください。'],
      ['サブスクリプションの解約方法を教えてください。', 'iPhoneは<b>設定 → ユーザー名 → サブスクリプション</b>、Androidは<b>Playストア → プロフィール → お支払いと定期購入 → 定期購入</b>から解約できます。解約後も、支払い済みの期間が終わるまで特典はそのまま使えます。'],
      ['通知が届きません。', '端末の設定で、ポンポンドゥードゥーの通知が許可されているかご確認ください。省電力モードやおやすみモードでは、通知が遅れたり届かなかったりすることがあります。'],
    ],
    delH: 'アカウントとデータの削除',
    delD: 'ゲーム内の<b>設定 → アカウント削除</b>から、アカウントとゲームデータをご自身で削除できます。削除したデータは元に戻せません。アプリを使えない場合は、ニックネームまたはIDを添えて<a href="mailto:cs@olo-g.com">cs@olo-g.com</a>まで削除をご依頼ください。法令により保管が必要な決済記録は、<a href="privacy">プライバシーポリシー</a>に定める期間保管した後に破棄します。',
  },
};
const LEGAL_KIND = { ko: { terms: '약관', privacy: '방침' }, en: { terms: 'Terms of Service', privacy: 'Privacy Policy' }, ja: { terms: '規約', privacy: 'ポリシー' } };

// ---------- 약관·개인정보 txt → HTML ----------
// 형식(goraddy Agreements txt와 같음): '# 제목'(버림) · '## '→h2 · '### '→h3 · 'N. '→ol(들여쓰기 4칸=한 단계) · '•'/'-'→ul · 그 외 문단.
function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function inline(s) {
  return esc(s)
    .replace(/https?:\/\/[^\s<)）]+/g, u => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`)
    .replace(/[\w.+-]+@olo-g\.com/g, m => `<a href="mailto:${m}">${m}</a>`);
}
function legalHtml(file, skipPreamble) {
  const lines = fs.readFileSync(path.join(LEGAL_DIR, file), 'utf8').replace(/\r/g, '').split('\n');
  const out = [], toc = [], stack = [];
  let started = !skipPreamble, last = null;
  const closeTo = n => { while (stack.length > n) out.push('</li></' + stack.pop() + '>'); };
  const push = (k, d, text, n) => {
    if (stack.length > d + 1) closeTo(d + 1);
    if (stack.length === d + 1 && stack[d] !== k) closeTo(d);
    if (stack.length === d + 1) out.push('</li><li>');
    else { out.push(k === 'ol' ? `<ol${n && n !== 1 ? ` start="${n}"` : ''}><li>` : '<ul><li>'); stack.push(k); }
    out.push(inline(text)); last = { k, d };
  };
  for (const raw of lines) {
    if (!raw.trim() || /^# /.test(raw)) continue;
    if (/^## /.test(raw)) {
      started = true; closeTo(0); last = null;
      const t = raw.slice(3).trim(), id = 's' + (toc.length + 1);
      toc.push([id, t]); out.push(`<h2 id="${id}">${inline(t)}</h2>`); continue;
    }
    if (!started) continue;
    if (/^### /.test(raw)) { closeTo(0); last = null; out.push(`<h3>${inline(raw.slice(4).trim())}</h3>`); continue; }
    const ind = raw.match(/^\s*/)[0].replace(/\t/g, '    ').length;
    let m;
    if ((m = raw.match(/^\s*(\d+)\.\s+(.*)$/))) { push('ol', Math.min(Math.floor(ind / 4), stack.length), m[2], +m[1]); continue; }
    if ((m = raw.match(/^\s*[•\-]\s+(.*)$/))) { push('ul', ind >= 4 && last && stack.length && (last.k === 'ol' || last.d >= 1) ? 1 : 0, m[1]); continue; }
    closeTo(0); last = null;
    const t = raw.trim();
    out.push(/^[*＊※]/.test(t) ? `<p class="note">${inline(t)}</p>` : `<p>${inline(t)}</p>`);
  }
  closeTo(0);
  return { html: out.join('\n'), toc };
}

// ---------- 페이지 공통 틀 ----------
function shell(code, slug, o) {
  const L = STR[code], S = SUB[code];
  const up = L.dir ? '../' : '';
  const a = up + 'assets/';
  const url = BASE + (L.dir ? L.dir + '/' : '') + slug;
  const alt = c => BASE + (STR[c].dir ? STR[c].dir + '/' : '') + slug;
  const langHref = c => (STR[c].dir ? up + STR[c].dir + '/' : up || './') + slug;
  const langLinks = ['ko', 'en', 'ja'].map(c =>
    `        <a href="${langHref(c)}" class="lang" lang="${c}" hreflang="${c}"${c === code ? ' aria-current="true"' : ''}>${FLAG[c]}${STR[c].label}</a>`).join('\n');
  const langScript = code === 'ko' ? LANG_SCRIPT_KO.replace("P=''", `P='${slug}'`) : LANG_SCRIPT_OTHER;
  return `<!DOCTYPE html>
<!-- 생성 파일: tools/render-ponpondoodoo.cjs 에서 찍어냄. 직접 수정하지 말 것 -->
<html lang="${L.htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${langScript}
<title>${o.title}</title>
<meta name="description" content="${o.desc}">
<meta property="og:title" content="${o.title}">
<meta property="og:description" content="${o.desc}">
<meta property="og:image" content="${BASE}assets/og.jpg">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${L.name}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${L.name}">
<meta property="og:locale" content="${{ ko: 'ko_KR', en: 'en_US', ja: 'ja_JP' }[code]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${o.title}">
<meta name="twitter:description" content="${o.desc}">
<meta name="twitter:image" content="${BASE}assets/og.jpg">
${slug ? '' : `<meta name="apple-itunes-app" content="app-id=${APP_ID}">\n`}<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="ko" href="${alt('ko')}">
<link rel="alternate" hreflang="en" href="${alt('en')}">
<link rel="alternate" hreflang="ja" href="${alt('ja')}">
<link rel="alternate" hreflang="x-default" href="${alt('ko')}">
<link rel="icon" type="image/png" href="${a}favicon.png">
<link rel="apple-touch-icon" href="${a}favicon.png">
<link rel="preload" href="${a}${code === 'ja' ? 'KiwiMaru-Medium' : 'GameFont'}.woff2" as="font" type="font/woff2" crossorigin>
${code === 'ja' ? '' : '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css">\n'}<link rel="stylesheet" href="${up}style.css">
${GA_ID ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{site_lang:'${code}'});</script>
` : ''}<script type="application/ld+json">
${JSON.stringify(o.ld, null, 2)}
</script>
</head>
<body${slug ? ` class="sub p-${slug}"` : ''}>

<header class="site">
  <div class="nav-inner">
    <a class="brand" href="./"><img src="${a}logo.webp" alt="${L.name}" width="1000" height="161"></a>
    <nav class="menu">
      <a href="./#features" data-m="hide">${L.nav[0]}</a>
      <a href="./#friends" data-m="hide">${L.nav[1]}</a>
      <a href="support" data-short="${S.navShort}"${slug === 'support' ? ' aria-current="page"' : ''}>${S.navSupport}</a>
      <a href="./#download" class="cta">${L.nav[3]}</a>
    </nav>
    <div class="langsel">
      <button class="langsel-btn" type="button" aria-label="${L.langAria}" aria-expanded="false" aria-haspopup="true">
        ${FLAG[code]}<span class="langsel-cur">${L.label}</span><svg class="caret" viewBox="0 0 16 16" aria-hidden="true" fill="none"><path d="M4 6.5 8 10.5 12 6.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="langsel-panel" hidden>
${langLinks}
      </div>
    </div>
  </div>
</header>

${o.body}
<footer class="site">
  <img class="foot-logo" src="${a}logo.webp" alt="${L.name}" width="1000" height="161" loading="lazy">
  <nav class="foot-links">
    <a href="terms"${slug === 'terms' ? ' aria-current="page"' : ''}>${L.terms}</a> ·
    <a href="privacy"${slug === 'privacy' ? ' aria-current="page"' : ''}><b>${L.privacy}</b></a> ·
    <a href="support"${slug === 'support' ? ' aria-current="page"' : ''}>${L.contact}</a> ·
    <a href="${up}../">${L.company}</a>
  </nav>
  <p class="biz">${S.biz}</p>
  <div class="legal">© 2026 OLO-G Games Inc. All rights reserved.</div>
</footer>

<script>
// 스크롤 리빌
(function(){
  if (!('IntersectionObserver' in window)) { document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('show'); }); return; }
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); } }); }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
})();
// 측정 이벤트 — GA_ID가 비어 있으면 gtag가 없어 조용히 넘어간다
(function(){
  function ev(n,p){ if (typeof gtag === 'function') gtag('event', n, p || {}); }
  if (new URLSearchParams(location.search).get('from') === 'altg') ev('altg_visit', { lang: document.documentElement.lang });
  document.addEventListener('click', function(e){
    var a = e.target.closest('a,button'); if (!a) return;
    if (a.classList.contains('store-btn')) ev('store_click', { store: a.getAttribute('data-os'), lang: document.documentElement.lang, place: a.closest('#download') ? 'bottom' : 'hero' });
    else if (a.matches('.video[data-yt]')) ev('trailer_play');
    else if (a.closest('.ost')) ev('ost_click');
  }, true);
})();
// 드롭다운(언어 선택)
(function(){
  var root = document.querySelector('.langsel'), btn = root.querySelector('button'), panel = root.querySelector('.langsel-panel');
  function close(){ panel.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); }
  btn.addEventListener('click', function(e){ e.stopPropagation(); var c = panel.hasAttribute('hidden'); close(); if(c){ panel.removeAttribute('hidden'); btn.setAttribute('aria-expanded','true'); } });
  document.addEventListener('click', function(e){ if(!root.contains(e.target)) close(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
})();
${o.scripts || ''}</script>
</body>
</html>
`;
}

const ORG = { '@type': 'Organization', '@id': 'https://olo-g.com/#org', name: 'OLO-G Games Inc.', url: 'https://olo-g.com/', logo: 'https://olo-g.com/assets/logo.png' };

// ---------- 홈 ----------
function home(code) {
  const L = STR[code];
  const up = L.dir ? '../' : '';
  const a = up + 'assets/';
  const url = BASE + (L.dir ? L.dir + '/' : '');
  const storeBtns = `<div class="store-buttons">
      <a class="store-btn" data-os="android" href="${L.play}" target="_blank" rel="noopener">${GP_SVG}Google Play</a>
      <a class="store-btn" data-os="ios" href="${L.appstore}" target="_blank" rel="noopener">${AS_SVG}App Store</a>
    </div>`;
  const ld = { '@context': 'https://schema.org', '@graph': [ORG,
    { '@type': 'VideoGame', '@id': BASE + '#game', name: L.name, alternateName: ['퐁퐁두두2', 'ponpondoodoo', 'ポンポンドゥードゥー'],
      url, description: L.ogDesc, image: BASE + 'assets/og.jpg', genre: L.tags.slice(0, 2), gamePlatform: ['iOS', 'Android'],
      operatingSystem: 'iOS, Android', applicationCategory: 'Game', inLanguage: ['ko', 'en', 'ja'], datePublished: '2024-02-04',
      publisher: { '@id': 'https://olo-g.com/#org' },
      sameAs: ['https://apps.apple.com/app/id' + APP_ID, 'https://play.google.com/store/apps/details?id=' + PKG] }] };
  const body = `<div class="visit-banner" id="visitBanner" role="status">${L.visit}</div>

<section class="hero">
  <div class="hero-inner">
    <img class="hero-art" src="${a}keyart.webp" alt="${L.heroAlt}" width="1600" height="1141" fetchpriority="high">
    <div class="hero-copy">
      <img class="hero-logo" src="${a}logo.webp" alt="${L.name}" width="1000" height="161">
      <h1>${L.h1}</h1>
      <p class="lead">${L.lead}</p>
      ${storeBtns}
      <div class="tags">${L.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
    </div>
  </div>
  <div class="parade" aria-hidden="true"><div class="parade-track">${'<img src="' + a + 'walking.webp" alt="" width="1400" height="287">'.repeat(4)}</div></div>
</section>

<section class="story">
  <p class="reveal"><span class="cap">${L.storyCap}</span>${L.story}</p>
</section>

<div id="features"></div>
<section class="feature f-personality">
  <h2 class="pill pink reveal">${L.f1}</h2>
  <p class="desc reveal">${L.f1d}</p>
  <div class="row reveal">
    <img class="sliders" src="${a}personality-sliders.webp" alt="" width="900" height="365" loading="lazy">
    <div class="gridwrap">
      <img src="${a}personality-grid.webp" alt="" width="1000" height="400" loading="lazy">
      <img class="mystery" src="${a}personality-mystery.webp" alt="" width="165" height="169" loading="lazy">
    </div>
  </div>
</section>

<section class="feature right f-question">
  <h2 class="pill yellow reveal">${L.f2}</h2>
  <p class="desc reveal">${L.f2d}</p>
  <div class="row flow reveal">
    <img class="q shot" src="${a}question-ui.webp" alt="" width="900" height="506" loading="lazy">
    <span class="arrow" aria-hidden="true">→</span>
    <figure><img class="scribble" src="${a}feed-scribble.webp" alt="" width="111" height="112" loading="lazy"><figcaption class="cap">${L.feed}</figcaption></figure>
    <span class="arrow" aria-hidden="true">→</span>
    <img class="tree" src="${a}evolution-tree.webp" alt="" width="900" height="420" loading="lazy">
  </div>
  <div class="row hatch reveal">
    <figure>
      <div class="eggs"><img src="${a}egg1.webp" alt="" loading="lazy"><img src="${a}egg4.webp" alt="" loading="lazy"><img src="${a}egg3.webp" alt="" loading="lazy"><img src="${a}egg2.webp" alt="" loading="lazy"></div>
      <figcaption class="cap">${L.eggs}</figcaption>
    </figure>
    <span class="arrow" aria-hidden="true">→</span>
    <img class="crowd" src="${a}ponpon-crowd.webp" alt="" width="1400" height="480" loading="lazy">
  </div>
</section>

<section class="feature f-deco">
  <h2 class="pill mint reveal">${L.f3}</h2>
  <p class="desc reveal">${L.f3d}</p>
  <div class="row reveal">
    <div class="who">
      <img class="bonsai" src="${a}deco-bonsai.webp" alt="" width="456" height="493" loading="lazy">
      <img class="wizard" src="${a}deco-wizard.webp" alt="" width="520" height="670" loading="lazy">
      <img class="bird" src="${a}deco-bird.webp" alt="" width="274" height="231" loading="lazy">
    </div>
    <img class="items" src="${a}deco-items.webp" alt="" width="1200" height="488" loading="lazy">
  </div>
</section>

<section class="feature right f-fun">
  <h2 class="pill sky reveal">${L.f4}</h2>
  <div class="fun-grid">
    <div class="fun-card reveal">
      <div class="art"><img class="shot" src="${a}fun-photo.webp" alt="" width="900" height="506" loading="lazy"><img class="overlay" src="${a}fun-photographer.webp" alt="" width="800" height="203" loading="lazy"></div>
      <h3>${L.photo}</h3><p>${L.photoD}</p>
    </div>
    <div class="fun-card reveal">
      <div class="art"><img class="shot" src="${a}fun-friends.webp" alt="" width="900" height="506" loading="lazy"><img class="overlay" src="${a}fun-friends-chat.webp" alt="" width="800" height="278" loading="lazy"></div>
      <h3>${L.friend}</h3><p>${L.friendD}</p>
    </div>
    <div class="fun-card reveal">
      <div class="art"><img class="shot" src="${a}fun-mini-select.webp" alt="" width="900" height="506" loading="lazy"><img class="overlay arcade" src="${a}fun-arcade.webp" alt="" width="500" height="650" loading="lazy"></div>
      <h3>${L.mini}</h3><p>${L.miniD}</p>
    </div>
  </div>
  <p class="closing reveal">${L.closing}</p>
</section>

<section class="friends" id="friends">
  <h2 class="reveal">${L.friendsH}</h2>
  <p class="sub reveal">${L.friendsSub}</p>
  <div class="marquee" id="marquee" aria-hidden="true">
${[...CHARS, ...CHARS].map(n => `    <button type="button" tabindex="-1">${charImg(a, n, ' loading="lazy"')}</button>`).join('\n')}
  </div>
</section>

<section class="section" id="trailer">
  <h2 class="reveal">${L.videoH}</h2>
  <button class="video reveal" type="button" data-yt="${YT}" aria-label="${L.videoAria}" style="background-image:url('https://i.ytimg.com/vi/${YT}/hqdefault.jpg')">
    <span class="play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z"/></svg></span>
  </button>
  <p class="ost reveal"><a href="${OST}" target="_blank" rel="noopener">♪ ${L.ost}</a></p>
</section>

<section class="section">
  <div class="badges reveal">${L.badges.map(b => `<span class="tag">${b}</span>`).join('')}</div>
</section>

<section class="section">
  <h2 class="reveal">${L.infoH}</h2>
  <dl class="spec reveal">
${L.spec.map(([k, v]) => `    <dt>${k}</dt><dd>${v}</dd>`).join('\n')}
  </dl>
</section>

<section class="section download" id="download">
  <img class="icon reveal" src="${a}icon.webp" alt="" width="512" height="512" loading="lazy">
  <h2 class="reveal">${L.dlH}</h2>
  <p class="reveal">${L.dlSub}</p>
  ${storeBtns}
</section>
`;
  const scripts = `// ALT+G 부스 QR 유입(?from=altg) 환영 배너
(function(){
  var f = new URLSearchParams(location.search).get('from');
  if (f === 'altg') document.getElementById('visitBanner').classList.add('show');
})();
// 기기에 맞는 스토어 버튼 강조
(function(){
  var ua = navigator.userAgent, os = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document) ? 'ios' : /Android/.test(ua) ? 'android' : '';
  if (os) document.querySelectorAll('.store-btn[data-os="' + os + '"]').forEach(function(b){ b.classList.add('primary'); });
})();
// 퐁퐁이 탭 → 폴짝
document.getElementById('marquee').addEventListener('click', function(e){
  var b = e.target.closest('button'); if(!b) return;
  b.classList.remove('hop'); void b.offsetWidth; b.classList.add('hop');
});
// 트레일러: 클릭할 때만 유튜브 iframe 로드(첫 화면 무게 절약)
document.querySelectorAll('.video[data-yt]').forEach(function(v){
  v.addEventListener('click', function(){
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + v.dataset.yt + '?autoplay=1&rel=0';
    f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true; f.title = v.getAttribute('aria-label');
    var box = document.createElement('div'); box.className = 'video show'; box.appendChild(f);
    v.replaceWith(box);
  }, { once: true });
});
`;
  return shell(code, '', { title: L.title, desc: L.desc, body, scripts, ld });
}

// ---------- 약관 / 개인정보 ----------
function legal(code, kind) {
  const L = STR[code], S = SUB[code];
  const title = kind === 'terms' ? S.termsT : S.privacyT;
  const { html, toc } = legalHtml(`${kind}_${code}.txt`, kind === 'terms');
  const old = kind === 'terms' ? OLD_TERMS : OLD_PRIVACY;
  const body = `<main class="doc-page">
  <div class="page-head">
    <h1>${title}</h1>
    <p class="dates">${S.dates[0]} · <b>${S.dates[1]}</b> · <a href="${old}" target="_blank" rel="noopener">${S.prevLink}</a></p>
  </div>
  <p class="doc-band" data-until="${LEGAL_EFFECTIVE}">${S.band(LEGAL_KIND[code][kind])} <a href="${old}" target="_blank" rel="noopener">${S.oldLink}</a></p>
  <details class="doc-toc" open>
    <summary>${S.toc}</summary>
    <ol>
${toc.map(([id, t]) => `      <li><a href="#${id}">${esc(t)}</a></li>`).join('\n')}
    </ol>
  </details>
  <article class="legal-doc">
${html}
  </article>
</main>
`;
  const scripts = `// 시행일이 지나면 '시행 전' 안내 띠를 숨긴다(KST 자정 기준)
(function(){
  var b = document.querySelector('.doc-band[data-until]'); if (!b) return;
  if (Date.now() >= new Date(b.getAttribute('data-until') + 'T00:00:00+09:00').getTime()) b.remove();
})();
// 좁은 화면에서는 목차를 접어서 시작
if (window.matchMedia('(max-width: 640px)').matches) { var t = document.querySelector('.doc-toc'); if (t) t.removeAttribute('open'); }
`;
  const ld = { '@context': 'https://schema.org', '@graph': [ORG, { '@type': 'WebPage', name: title, url: BASE + (L.dir ? L.dir + '/' : '') + kind, inLanguage: code, publisher: { '@id': 'https://olo-g.com/#org' } }] };
  return shell(code, kind, { title: `${title} — ${L.name}`, desc: kind === 'terms' ? S.termsDesc : S.privacyDesc, body, scripts, ld });
}

// ---------- 문의 ----------
function support(code) {
  const L = STR[code], S = SUB[code];
  const a = (L.dir ? '../' : '') + 'assets/';
  const mailto = `mailto:${CS_MAIL}?subject=${encodeURIComponent(S.mailSubject)}&body=${encodeURIComponent(S.mailBody)}`;
  const body = `<main class="doc-page support">
  <div class="page-head">
    <h1>${S.supT}</h1>
    <p>${S.supLead}</p>
  </div>
  <section class="mail-card">
    ${charImg(a, '08', ' loading="lazy"')}
    <div>
      <h2>${S.mailH}</h2>
      <p>${S.mailD}</p>
      <a class="btn" href="${mailto}">✉ ${S.mailBtn}</a>
      <p class="mail-addr"><a href="mailto:${CS_MAIL}">${CS_MAIL}</a></p>
    </div>
  </section>
  <section class="box">
    <h2>${S.includeH}</h2>
    <ul class="checks">
${S.include.map(t => `      <li>${t}</li>`).join('\n')}
    </ul>
  </section>
  <section class="box faq">
    <h2>${S.faqH}</h2>
${S.faq.map(([q, ans]) => `    <details><summary>${q}</summary><p>${ans}</p></details>`).join('\n')}
  </section>
  <section class="box" id="delete">
    <h2>${S.delH}</h2>
    <p>${S.delD}</p>
  </section>
</main>
`;
  const ld = { '@context': 'https://schema.org', '@graph': [ORG, { '@type': 'FAQPage', inLanguage: code,
    mainEntity: S.faq.map(([q, ans]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: ans.replace(/<[^>]+>/g, '') } })) }] };
  return shell(code, 'support', { title: `${S.supT} — ${L.name}`, desc: S.supDesc, body, ld });
}

// ---------- 출력 ----------
const PAGES = [['index.html', home], ['terms.html', c => legal(c, 'terms')], ['privacy.html', c => legal(c, 'privacy')], ['support.html', support]];
const check = process.argv.includes('--check');
let bad = 0;
for (const code of Object.keys(STR)) {
  for (const [file, fn] of PAGES) {
    const out = path.join(ROOT, STR[code].dir, file);
    const html = fn(code);
    if (check) {
      const cur = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
      const ok = cur === html; if (!ok) bad++;
      console.log((ok ? '✓ ' : '✗ ') + path.relative(process.cwd(), out));
    } else {
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, html);
      console.log('wrote ' + path.relative(process.cwd(), out));
    }
  }
}
process.exit(bad ? 1 : 0);
