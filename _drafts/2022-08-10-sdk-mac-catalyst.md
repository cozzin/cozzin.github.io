---
layout: post
title: "SDK에서 Mac Catalyst 지원하기"
date: 2022-08-08 15:00:00 +0900
categories: iOS
tags:
  - SDK
  - iOS
  - Mac Catalyst
---

Mac Catalyst를 지원하는 앱에 회사 SDK를 설치하면 모듈을 불러올 수 없다는 오류를 제보 받았습니다. 
project 파일 통째로 샘플앱에 링크해서 확인해보니 역시나 모듈을 찾을 수 없었습니다. 

SDK project로 가서 `catalyst`와 관련된 옵션이 없는지 찾아봤습니다. `Support Mac Catalyst`라는 옵션을 발견 했습니다.
이게 기존에는 NO로 되어 있어서 YES로 변경했더니 모듈을 찾을 수 있게 되었습니다!

![](/assets/images/2022-08-10-15-32-03.png)

회사 SDK는 xcframework를 사용하고 있습니다. 그래서 xcframework 에서도 정상적으로 모듈을 찾을 수 있는지 확인해봐야 합니다.
아래와 같이 연결해서 확인했는데 Mac Catalyst가 여기서 선택되어 있지만 빌드 과정에서는 찾을 수 없다는 에러가 발생했습니다.

![](/assets/images/2022-08-10-15-37-04.png)


![](/assets/images/2022-08-10-15-39-01.png)

역시나 한번에 해결되진 않는군요ㅎㅎ 관련해서 검색하다 보니 한가지 방법이 발견되었습니다. XCFramework and Mac Catalyst - https://developer.apple.com/forums/thread/120542?answerId=374124022#374124022 

```
xcodebuild archive -project "$FRAMEWORK".xcodeproj -scheme "$FRAMEWORK" \
    -destination 'platform=macOS,arch=x86_64,variant=Mac Catalyst' \
    -archivePath "$FRAMEWORK"MC.xcarchive SKIP_INSTALL=NO clean
```

여기서 핵심은 `-destination 'platform=macOS,arch=x86_64,variant=Mac Catalyst'` destination을 지정하는 것으로 보입니다.
추가로 xcodebuild 가 궁금하다면 터미널에서 `xcodebuild -help`를 입력해보시면 다양한 옵션을 확인할 수 있습니다.

```
-destination DESTINATIONSPECIFIER                        use the destination described by DESTINATIONSPECIFIER (a comma-separated set of key=value pairs describing the destination to use)
```

destination은 key=value 쌍으로 되어 있고 콤마로 구분해서 여러개를 넣을 수 있습니다. 위의 명령어는 platform이 macOS 이고, architecture는 x86_64를 바라보고 빌드하라는 뜻이 되겠죠.

더 좋아보이는 방법

https://stackoverflow.com/a/57402455
https://msolarana.netlify.app/2021/01/12/embedding-debug-symbols-in-xcframeworks/
https://pspdfkit.com/blog/2020/supporting-xcframeworks/
https://stackoverflow.com/a/60709402
