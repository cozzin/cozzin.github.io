---
layout: post
title: "Github Action으로 iOS 프로젝트 테스트하기"
date: 2021-03-30 23:18:00 +0900
---

회사 Github이 드디어 Github Action이 가능한 버전으로 업데이트 되었습니다. 개인 프로젝트에서 미리 테스트를 해보려고 합니다. Github Action이 생긴지 꽤 시간이 지나서 많은 분들이 튜토리얼을 남겨두었습니다. 하지만 직접 기록을 남기면서 배우는게 있을 것으로 생각하고 글을 작성합니다.

Github 레포로 가면 Actions라는 탭이 있습니다.
![GithubActionsIntro](/assets/2021/03/githubactionsintro.png)
아마도 Swift로 작성된 코드가 있어서 센스있게 Swift를 추천하고 있는 것 같습니다. 무튼 `Set up this workflow`를 눌러봅니다.
그러면 workflow 명세를 작성할 수 있는 화면이 나옵니다.

문법을 어디서 찾아야하는지 몰라서 헤맸는데, 오른편에 두번째 탭에 보면 `Documentation`이라고 있습니다. 여기에 커스터마이징 하는 방법에 대해 자세히 나와있습니다.
![githubActionDocumentation](/assets/2021/03/githubactiondocumentation.png)

## 실행 조건 걸기

`main`과 `release/*` 브랜치에 push 왔을 때 workflow 실행하기

```yml
on:
  push:
    branches:
    - main
    - release/*
```

`main` 브랜치에 PR 왔을 때 workflow 실행하기
```yml
on:
  pull_request:
    branches:
    - main
```

시간 정해놓고 반복적으로 workflow 실행하기
```yml
on:
  schedule:
  - cron: "0 2 * * 1-5"
```

근데 저 간이 document에는 모든 브랜치에 다 적용하는 가이드는 없었습니다... 그래서 좀 찾아보니, 이런식으로 적용하면 된다고 합니다. [detail document](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#on)

```yml
on:
  push:
    branches:    
      - '*'         # matches every branch that doesn't contain a '/'
      - '*/*'       # matches every branch containing a single '/'
      - '**'        # matches every branch
      - '!master'   # excludes master
```

[https://stackoverflow.com/a/57903434](https://stackoverflow.com/a/57903434)

```yml
on:
  push:
    branches-ignore: # !master 이런식으로 표현하는대신 branches-ignore에 담아도 되네요
      - master
```

## 동작 지정

```yml
jobs:
  test:
    name: Test on node ${{ matrix.node_version }} and ${{ matrix.os }}
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        node_version: ['8', '10', '12']
        os: [ubuntu-latest, windows-latest, macOS-latest] # 이렇게 여러개의 OS에서 실행해 볼 수 있습니다

    steps:
    - uses: actions/checkout@v1
    - name: Use Node.js ${{ matrix.node_version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node_version }}

    - name: npm install, build and test
      run: |
        npm install
        npm run build --if-present
        npm test
```

Swift를 선택하고 만들어지는 샘플은 이렇게 되어 있습니다.

```yml
jobs:
  build:

    runs-on: macos-latest

    steps:
    - uses: actions/checkout@v2
    - name: Build
      run: swift build -v
    - name: Run tests
      run: swift test -v
```

일단 이대로 저장해보겠습니다. yml 파일을 레포에 저장하는 식으로 되어 있습니다.
![swiftyml저장](/assets/2021/03/swiftyml저장.png)

## 일단 실행시켜보기

지금 main 브랜치에 push 될 때면 위의 동작을 실행하는걸로 되어 있는데요. push를 한번 해보겠습니다... 라고 하려했는데ㅋㅋ
오잉 그 전에 Actions 탭 > Build 를 눌러보면 트리거 없이 바로 실행 시켜볼 수 있습니다. git을 더럽히지 않아도 빌드는 테스트 해볼 수 있겠네요

![githubActionsDirectBuild](/assets/2021/03/githubactionsdirectbuild.png)

네 빌드 실패했습니다.
![githubActionsBuildFail](/assets/2021/03/githubactionsbuildfail.png)

`error: root manifest not found` 요 내용을 보니까 Swift Package로 인식하고 빌드한 것 같은데... 빌드 옵션을 구체적으로 지정해줄 필요가 있을 것 같습니다. 이번엔 이렇게 바꾸고 실행해보겠습니다.

```yml
steps:
- uses: actions/checkout@v2
- name: Run tests
  run: swift build -v
    xcodebuild test -project Algo.xcodeproj -scheme Algo -destination 'platform=iOS Simulator,name=iPhone 11 Pro,OS=13.6'
```

아니... 안되네요ㅠㅜ 이제보니 `swift build -v` 부분을 뺴야 합니다ㅋㅋ... 아 그리고 프로젝트 최소 설정이 iOS 14.4로 되어 있어서 OS 버전도 변경했습니다.

```yml
- name: Run tests
  run: |
    xcodebuild test -project Algo.xcodeproj -scheme Algo -destination 'platform=iOS Simulator,name=iPhone 11 Pro,OS=14.4'
```

드뎌 성공...!!!

![update swift.yml](/assets/2021/03/update-swift-yml.png)

일부러 테스트 케이스 하나를 실패하도록 만들고 push를 해보겠습니다.

![일부러 실패하는 테스트 케이스 push](/assets/2021/03/일부러-실패하는-테스트-케이스-push.png)

그러면 의도했던대로 테스트 케이스가 실패하는걸 확인해줍니다.

![testFailedAction](/assets/2021/03/testfailedaction.png)

실험해보고 나서 다시 revert 해줬습니다ㅋㅋ

## 다음에 좀 더 확인할 부분

예제로 사용한 프로젝트는 Swift Package Manager로 라이브러리들을 구성해뒀기 때문에 별 문제 없이 빌드가 된 것 같습니다.
빌드 앞부분을 보면 별다른 세팅을 안해줬는데도 라이브러리들을 연결해주는 것을 볼 수 있습니다.

```
Resolved source packages:
  Nimble: https://github.com/Quick/Nimble @ 9.0.0
  CwlPreconditionTesting: https://github.com/mattgallagher/CwlPreconditionTesting.git @ 2.0.0
  CwlCatchException: https://github.com/mattgallagher/CwlCatchException.git @ 2.0.0
  Quick: https://github.com/Quick/Quick @ 3.1.2
```

제가 사용하고 싶은 환경은 코코아팟, 카르타고 둘 다 있는 환경이기 때문에 좀 더 가혹한 환경을 만들어두고 한번 더 실험해봐야할 것 같습니다.

## 참고
* [https://macgongmon.club/24](https://macgongmon.club/24)
* [https://zeddios.tistory.com/825](https://zeddios.tistory.com/825)
* [https://leenarts.net/2020/02/12/github-actions-for-ios-projects/](https://leenarts.net/2020/02/12/github-actions-for-ios-projects/)
* [https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
