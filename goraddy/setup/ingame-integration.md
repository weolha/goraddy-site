# 인게임 "문의하기" 연동 스펙 (개발자 전달용)

게임 설정/로비에 [문의하기] 버튼 → UniWebView로 문의 페이지를 열되, **계정·기기 정보를 URL 파라미터로 자동 전달**한다. 유저가 닉네임·버전·기기를 직접 입력할 필요가 없어지고, CS 시트에 UID까지 찍혀서 응대가 빨라진다.

## URL 형식

```
https://goraddy.olo-g.com/support.html?source=ingame&nick={닉네임}&uid={유저ID}&ver={앱버전}&device={기종 OS}
```

(도메인 전환 전 테스트: `https://weolha.github.io/goraddy-site/support.html?...`)

- 모든 값은 **URL 인코딩** 필수 (`UnityWebRequest.EscapeURL`)
- `type` 파라미터로 문의 유형 사전 선택도 가능 (예: 결제 화면의 문의 버튼 → `&type=결제 문제`)
- 폼이 자동으로: 닉네임·기기 칸 채움, uid/ver는 hidden으로 제출, "게임에서 오셨네요" 안내 표시

## Unity 예시

```csharp
public static string BuildSupportUrl(string presetType = null)
{
    string nick = UnityWebRequest.EscapeURL(Managers.UserData.Nickname ?? "");
    string uid  = UnityWebRequest.EscapeURL(Managers.UserData.UserId ?? "");
    string ver  = UnityWebRequest.EscapeURL(Application.version);
    string dev  = UnityWebRequest.EscapeURL($"{SystemInfo.deviceModel} {SystemInfo.operatingSystem}");

    string url = $"https://goraddy.olo-g.com/support.html?source=ingame&nick={nick}&uid={uid}&ver={ver}&device={dev}";
    if (!string.IsNullOrEmpty(presetType))
        url += $"&type={UnityWebRequest.EscapeURL(presetType)}";
    return url;
}
```

웹뷰 표시는 기존 `NoticeWebView.cs` 패턴 그대로 (UniWebView + ReferenceRectTransform).

## 첨부 동작 참고

- 스크린샷: 폼에서 이미지 선택 → 브라우저(웹뷰)에서 1600px로 리사이즈 후 업로드 → 드라이브 "고래디 문의 첨부" 폴더 저장. **모바일 웹뷰에서 `<input type=file>`이 동작하려면 UniWebView 설정에서 파일 선택 허용 필요** (Android: file chooser 기본 지원 여부 확인).
- 영상: 직접 업로드는 용량 문제로 미지원 — **메일 첨부 권장** (폼의 "영상 메일로 보내기" 버튼이 작성 내용을 양식으로 채운 메일을 열어줌). 링크(유튜브 일부 공개/드라이브) 입력도 가능.
