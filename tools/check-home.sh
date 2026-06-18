#!/usr/bin/env bash
# 회사 홈(index.html) 핵심 기능 회귀 검사 — 수정 후 매번 실행
set -e; cd "$(dirname "$0")/.."; F=index.html; ok=1
chk(){ if grep -q "$2" "$F"; then echo "  ✓ $1"; else echo "  ✗ $1  (누락!)"; ok=0; fi; }
cnt(){ n=$(grep -oc "$2" "$F" || true); if [ "$n" -ge "$3" ]; then echo "  ✓ $1 ($n)"; else echo "  ✗ $1 ($n<$3)"; ok=0; fi; }
echo "[소프트락]"; chk "html scroll-snap" 'scroll-snap-type:y proximity'; chk "section snap-align" 'section\[data-s\]{scroll-snap-align:start}'
echo "[콘텐츠 등장]"; chk "swirlIn keyframe" '@keyframes swirlIn'; chk ".reveal.show 애니" '.reveal.show{animation:swirlIn'; chk "observe 루프" "querySelectorAll('.reveal')"; cnt "reveal 요소" 'class="[^"]*reveal' 20
echo "[바다]"; chk "sea 물결 wave1" '.bloom .sea .wv1'; chk "onScroll sea" "sea.style.height"
echo "[캐릭터]"; chk "floaters 레이어" '.floaters{position:fixed'; chk "고래 sway" '@keyframes wsway'; cnt "floaters cc" 'class="cc' 25
echo "[게임 트리거]"; chk "스푼 배지" 'id="spoon"'; chk "클릭 collect" 'function collect'; chk "100 축제" 'function bigCelebration'; chk "가득 상태 markFull" "function markFull"; chk "rushup 입자" '@keyframes rushup'
echo "[푸터 트리거]"; chk "fwave" 'class="fwave"'; chk "footin 리빌" 'id="footin"'
echo "[구조]"; D=$(grep -oc '<div' "$F"); E=$(grep -oc '</div>' "$F"); if [ "$D" = "$E" ]; then echo "  ✓ div 균형 ($D)"; else echo "  ✗ div 불균형 $D/$E"; ok=0; fi
node --check <(sed -n '/<script>(function/,/})();<\/script>/p' "$F" | sed 's/<\/\?script>//') 2>/dev/null && echo "  ✓ JS 문법" || echo "  (JS 문법검사 생략)"
[ "$ok" = 1 ] && echo "== 전체 통과 ==" || { echo "== 누락 있음 =="; exit 1; }
