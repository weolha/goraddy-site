/*
 * OLO-G 게임 목록 — 단일 데이터 소스 (Single Source of Truth)
 * ---------------------------------------------------------------
 * 게임을 추가/수정하려면 이 배열만 고치고 generator를 돌린다:
 *     node tools/render-games.mjs        (블록 HTML 출력)
 * 자세한 규칙: docs(회사사이트_IA_확장계획.md) §5·§6, tools/README.md
 *
 * tier   : 'flagship'(자체 사이트 보유) | 'catalog'(스토어 링크만)
 * 연도 내림차순으로 정렬해 둘 것(렌더 순서 = 배열 순서).
 * 브라우저(window.OLOG_GAMES)와 Node(module.exports) 양쪽에서 로드 가능.
 */
(function (root) {
  const GAMES = [
    {
      id: 'goraddy',
      name: '고!래디', nameEn: 'Go! Raddy', sub: 'Go! Raddy',
      genreKo: '전진형 디펜스', genreEn: 'Advance Defense',
      tagsKo: ['전진형 횡스크롤 디펜스', 'iOS · Android', '2026'],
      tagsEn: ['Side-scrolling advance defense', 'iOS · Android', '2026'],
      year: 2026, tier: 'flagship', status: 'live',
      icon: 'assets/games/goraddy/icon.png',
      feature: 'assets/games/goraddy/feature.webp',
      shots: ['assets/games/goraddy/shot1.webp', 'assets/games/goraddy/shot2.webp', 'assets/games/goraddy/shot3.webp'],
      site: 'goraddy/index.html', siteEn: 'goraddy/en/index.html',
      store: {
        play: 'https://play.google.com/store/apps/details?id=com.ologgames.goraddy',
        appstore: 'https://apps.apple.com/kr/app/go-raddy/id6748856004'
      },
      descKo: '바다를 돌파하는 ‘전진형 이동 기지’가 특징인 횡스크롤 디펜스. 제자리에서 적을 기다리는 기존 방식과 달리, 고래 래디가 직접 전진하며 ‘아쿠아’를 모으고 아군을 강화합니다. 실시간 ‘버블’ 시스템으로 매 판 다른 전략을 짜며 끝없이 성장하세요.',
      descEn: 'Raddy the whale moves forward, gathers ‘Aqua’, and grows endlessly — with real-time ‘Bubbles’ that let you build a different strategy every run. OLO-G\'s flagship title.'
    },
    {
      id: 'aim',
      name: 'Aim! the Center', nameEn: 'Aim! the Center', sub: '',
      genreKo: '하이퍼캐주얼', genreEn: 'Hyper-casual',
      tagsKo: ['하이퍼캐주얼', 'iOS · Android', '2025'],
      tagsEn: ['Hyper-casual', 'iOS · Android', '2025'],
      year: 2025, tier: 'catalog', status: 'live',
      icon: 'assets/games/aim/icon.png',
      feature: 'assets/games/aim/feature.webp',
      shots: [], site: null, siteEn: null,
      store: {
        play: 'https://play.google.com/store/apps/details?id=com.OlogGames.AimtheCenter',
        appstore: 'https://apps.apple.com/kr/app/id6743078809'
      },
      descKo: '양옆에서 좁혀오는 벽, 점점 줄어드는 공간. 중앙을 조준해 탭하고 최대한 높이 올라가세요. 단순한 조작과 매끄러운 모션의 한입 캐주얼 게임입니다.',
      descEn: 'An intuitive one-hand casual. A light game for short, focused bursts of fun.'
    },
    {
      id: 'ponpondoodoo2',
      name: '퐁퐁두두2', nameEn: 'PonPonDoodoo 2', sub: 'ponpondoodoo2',
      genreKo: '힐링 키우기', genreEn: 'Healing & Raising',
      tagsKo: ['힐링', '키우기', 'iOS · Android', '2024'],
      tagsEn: ['Healing', 'Raising', 'iOS · Android', '2024'],
      year: 2024, tier: 'catalog', status: 'live',
      icon: 'assets/games/ponpondoodoo2/icon.png',
      feature: 'assets/games/ponpondoodoo2/feature.webp',
      shots: [], site: null, siteEn: null,
      store: {
        play: 'https://play.google.com/store/apps/details?id=com.ologgames.ponpondoodoo2',
        appstore: 'https://apps.apple.com/kr/app/id6445818248'
      },
      descKo: '하루 10분, 나의 성격을 알아가는 힐링 키우기 게임. 잔잔한 음악과 함께 몽글몽글한 퐁퐁이를 키워보세요. 구글 ‘교사 추천’·앱스토어 피처드 선정, 일본에도 출시되었습니다.',
      descEn: 'The sequel to our warm healing game about collecting and raising what you treasure.'
    },
    {
      id: 'ponpondoodoo',
      name: '퐁퐁두두', nameEn: 'PonPonDoodoo', sub: 'ponpondoodoo',
      genreKo: '힐링 키우기', genreEn: 'Healing & Raising',
      tagsKo: ['힐링', '키우기', 'iOS · Android', '2021'],
      tagsEn: ['Healing', 'Raising', 'iOS · Android', '2021'],
      year: 2021, tier: 'catalog', status: 'live',
      icon: 'assets/games/ponpondoodoo/icon.png',
      feature: 'assets/games/ponpondoodoo/feature.webp',
      shots: [], site: null, siteEn: null,
      store: {
        play: 'https://play.google.com/store/apps/details?id=com.ologgames.ponpondoodoo',
        appstore: 'https://apps.apple.com/kr/app/id1550902440'
      },
      descKo: '퐁퐁이를 키우며 나를 되돌아보는, 오로지의 출발점이 된 첫 작품. 하루 15분만 즐기도록 설계된 잔잔한 힐링 게임으로 앱스토어 4위·45만 다운로드를 기록했습니다.',
      descEn: 'The first healing game that put OLO-G on the map. The quiet joy of collecting and nurturing.'
    }
  ];

  if (typeof module !== 'undefined' && module.exports) module.exports = GAMES;
  if (root) root.OLOG_GAMES = GAMES;
})(typeof window !== 'undefined' ? window : null);
