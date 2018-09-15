---
layout: post
title:  "What's New in Testing"
date:   2018-08-25 00:00:00 +0900
categories: swift
---

## What's New in Testing

WWDC 영상 보면서 정리했습니다.
https://developer.apple.com/videos/play/wwdc2018/403/

## Code coverage

### Performance
* 로딩 시간: XCode9 에서 6.5초 걸리던 것이 XCode9.3에서는 0.3초 걸린다.
* coverage 파일 사이즈: XCode9에서 214MB -> XCode9.3에서 18.5MB
* C++ header 파일의 Code coverage도 측정해서 통과되지 못한 코드에 빨간색으로 표시해준다.

### Target Selection
* Code coverage 옵션을 enabled/disabled 로 설정해줄 수 있다.

### xconv
* 커멘드 라인 툴
* 결과물: 사람이 읽을 수 있음, 기계가 읽을 수 있도록 파싱가능(JSON)
* coverage data를 볼 수 있음

### Coverage Data
coverage data가 enabled된 상태로 테스트를 수행하게 되면 XCode는 두개의 파일을 생성한다.
1. Coverage report
각 타겟, 소스파일, 함수의 line coverage 퍼센트를 포함한다.

2. Coverage archive
리포트의 각 파일에 대한 Raw execution counts를 포함한다.

![screenshot 5](https://user-images.githubusercontent.com/11647461/44618316-85f4f800-a8ae-11e8-82e2-77a0949de887.png)

Coverage Data는 프로젝트의 derived data 디렉토리 안에 있게 된다.
추가적으로 result bundle path flag를 설정해주면 해당 번들에 Coverage data 파일들이 위치하게 된다. 각 파일, 각 메소드에 대한 coverage를 확인할 수 있다. 그리고 설정을 통해 같은 결과를 JSON 형태로 받아볼 수 있다.
![screenshot 8](https://user-images.githubusercontent.com/11647461/44618314-7ecdea00-a8ae-11e8-8af7-a27cf66f3fd2.png)


### Source Editor
앞에서는 커멘드 라인에서 확인하는 법을 소개했는데, 실제로 사용할 때는 XCode에서 보븐 것이 편할 것이다. `Menu > Editor > Show Code Coverage`를 통해 활성화 시킬 수 있다. 테스트를 통과하지 못한 코드는 빨간색으로 표시된다.
![screenshot 10](https://user-images.githubusercontent.com/11647461/44618318-87bebb80-a8ae-11e8-9b08-3fe81563e607.png)

## Test selection and ordering
모든 테스트가 동일한 목적을 가지지 않는다. 당신은 아마도 빨리 검증될 수 있는 1000개의 유닛 테스트를 실행하고 오랜 시간이 걸리는 UI 테스트를 진행하고 싶을 것이다.
이제 scheme에서 특정 테스트를 disable 해서 스킵할 수 있다. 스킴은 disable된 테스트의 리스트를 인코딩해서 XE Test가 어떤 테스트를 스킵할 것인지 선택할 수 있게한다. 그리고 이것이 흥미로운 사이드 이펙트를 만들어낸다. 새로운 테스트를 작성할 때 마다, 테스트 타겟에 해당하는 모든 스킴에 추가된다. 하지만 그걸 원하지 않는다면, 모든 스킴들을 확인하면서 테스트를 수동으로 disable 시켜야한다(잘안써봐서 모르지만 하나하나 노가다로 꺼야 했는듯ㅜ...)

### Test Selection
그래서 XCode10 테스트를 인코딩하는 새로운 모드를 제공한다. 스킴을 새로운 모드로 전환하면, 선택한 테스트가 해당 스킴에서만 작동한다. 이 모드는 스킴 에디터(Product > Scheme > Edit Scheme)에서 `Test` 섹션을 누르고 해당 스킴의 옵션으로 선택할 수 있다. `Automatically include new tests`를 on/off할 수 있다. 이렇게하면 일부 스킴들은 새로 작성된 테스트들을 포함해서 실행하게 되고, 또 다른 스킴들은 직접 선택한 테스트들만 실행한다.
<img width="1372" alt="screenshot 11" src="https://user-images.githubusercontent.com/11647461/44626094-d40f0780-a951-11e8-8623-ee03f664ad41.png">

### Test Ordering
지금까지 어떤 테스트를 언제 실행할지에 대해 논의 했다. 하지만 테스트 순서도 중요할 수 있다.
* 기본적으로, XCode의 테스트는 이름 순으로 정렬된다. (이름을 바꾸지 않으면 항상 같은 순서로 실행됨)
* 하지만 이와 같은 결정방식은 양날의 검이 될 수 있다.

#### 단점
하나의 테스트가 다른 테스트에 암묵적으로 종속성을 가질 때, 순서대로 작동하는 테스트는 버그들을 놓칠 수 있다.
A, B, C 라는 테스트가 항상 동일한 순서로 작동한다고 가정하자. A에서 DB를 생성하고, C에서 삭제한다.
만약 이름이 변경되어서 순서가 바뀌게 되면 테스트는 실패하게 된다.
이런 문제를 방지하기 위해서 테스트는 항상 올바르게 `setup` 되고 `tearDown`되어야 한다.

#### 해결책
* XCode10에서는 `test randomization mode`를 제공한다.
* 모드를 활성화하면 테스트를 실행할 때마다 순서를 섞는다.
* 스킴 에디터에서 `Randomize execution order`를 on/off 해주면 된다.
<img width="1368" alt="screenshot 12" src="https://user-images.githubusercontent.com/11647461/44626353-b04dc080-a955-11e8-90da-2f3d6945249f.png">

## Parallel testing
* 일반적인 개발 프로세스: Write -> Debug -> Test -> Push (다시반복)
* 테스트가 얼마나 걸리는지 따라 병목 현상 발생함
* Xcode8: 순차적 진행. iPhoneX에서 실행하고 iPad에서 실행하라고 하면, iPhoneX 에서 테스트가 끝나고 나서 iPad에서 테스트를 진행한다.
* XCode9: `Parallel Destination Testing`을 소개했었다. 여러 기기에서 동시에 테스트를 할 수 있다.

### 한계
* multiple destination에 대해서만 이점이 있다.
* xcodebuild에서만 접근이 가능하다. CI 환경에서만 이점이 있다.

### 해결책: Parallel Distributed Testing
* 단일 destination 에서 테스트를 병렬로 실행할 수 있다.
* XCode 와 xcodebuild 모두 접근가능하다.
