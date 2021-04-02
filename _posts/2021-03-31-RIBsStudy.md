---
layout: post
title: "Let'Swift 발표들로 RIBs 맛보기"
date: 2021-03-31 23:38:00 +0900
---

많은 팀에서 도입하고 있는 RIBs 아키텍처에 대해 스터디 해보겠습니다. RIBs 레포의 설명도 좋지만, 먼저 안정민님이 정리해주신 자료들로 필기해보며 공부를 시작해보겠습니다.

# MVC, MVVM, ReactorKit, Viper를 거쳐 RIB 정착기 (1)
[https://www.youtube.com/watch?v=3XS6xLzKRjc](https://www.youtube.com/watch?v=3XS6xLzKRjc) 강의 필기 입니다.

## 기존 아키텍처에 왜 만족 못했는가?
- 화면 단위가 아닌 프로세스 단위로 유연한 개발 필요
- 자체 제작 아키텍처의 유지 보수 어려움
- 더 확실한 안정화 필요
  - 테스트 코드 템플릿 또는 가이드가 있는 아키텍처가 거의 없음
  - 체계화된 테스트 코드 작성이 필요

## 아키텍처 여정
### MV(C)
- 장점: 기존에 익숙한 구조. 단순환 화면에만 적용
- 단점: 기능이 확장되면 깔끔하지 않아짐

### MVVM
- 장점: MVC보다는 코드가 정리되는 느낌
- 단점: 기능이 복잡해질수록 ViewModel이 빠르게 비대해짐. 표준화된 틀이 존재하지 않음. 이해가 다름. 테스트 코드 작성이 가능하지만 어려움. Rx 허들 및 디버깅...

### ReactorKit
- 장점: 단방향이라 View와 관계된 로직이 깔끔
- 단점: 프로세스 단위의 아키텍처라 아니라서 아쉬움.

### VIPER
- 장점: VIPER 역할이 명확하게 구분됨
- 단점: 명확한 가이드, 테스트 코드 템플릿이 정형화되어 있지 않음

## RIBs 선택한 이유
- RIBs에 대한 설명은 [https://www.youtube.com/watch?v=BvPW-cd8mpw](https://www.youtube.com/watch?v=BvPW-cd8mpw) 이것을 보는게 좀 더 좋다고 해서 좀 더 아래쪽에 따로 정리해뒀습니다.
- 템플릿화된 코드 및 테스트 작성 [https://github.com/uber/RIBs/tree/master/ios/tooling](https://github.com/uber/RIBs/tree/master/ios/tooling)
  - 템플릿을 통해 RIB / RIB Unit Tests / Component extension 을 만들 수 있습니다. (Component extension 이건 뭔지 모르곘네요... 나중에 찾아보겠습니다)
    ![RIB template](/assets/2021/04/rib-template.png)
  - Owns corresponding View: View가 있는 RIB을 만들건지 선택
    Adds Storyboard file: View를 Storyboard로 만들지, 아니면 xib로 만들지 선택가능
    ![RIB template 2](/assets/2021/04/rib-template-2.png)
  - 체크한 항목에 따라 아래와 같이 파일을 만들어 줌
    ![RIB template 3](/assets/2021/04/rib-template-3.png)
  - 템플릿으로 테스트 코드도 구성 가능.
  - 테스트 코드에 Mock 구성하는 방법도 있음. [Tutorial2/TicTacToeTests/TicTacToeMocks.swift](https://github.com/uber/RIBs/blob/master/ios/tutorials/tutorial2/TicTacToeTests/TicTacToeMocks.swift) present가 호출되었는지, 클로저가 호출되었는지 확인하는 가이드를 제공해주고 있음. 이 코드는 템플릿으로 제공해주지는 않고 있음. [SourceKitten](https://github.com/jpsim/SourceKitten)을 이용해서 Mock 코드 생성하는 스크립트 이용중

## 프로토콜 지향 프로그래밍
![RIBs Protocol](/assets/2021/04/ribs-protocol.png)
- 프로토콜이 굉장히 많이 사용되는데... 아직 익숙하지 않아서 그런지 헷갈리네요;;

### Interactor
```swift
import RIBs
import RxSwift // Rx는 필수일까?

// 이 코드가 Interactor 쪽에 있어야 함
protocol LoggedInRouting: ViewableRouting {
    // 여기에 원하는 명령을 추가
    // -> Router는 컴파일 에러
    // -> Router에 가서 컴파일 에러 수정
}

protocol LoggedInPresentable: Presentable {
    var listener: LoggedInPresentableListner { get set }
}

// 상위 RIB이 어떤 Interaction에 대해 호출을 해야 할 때
// "나는 내 작업이 끝났어" 하고 알려줘야 할 때
protocol LoggedInListener: class {

}

final class LoggedInInteractor: PresentableInteractor<LoggedInPresentable>, LoggedInInteractable, LoggedInPresentableListner {

    // Interactor는 Routing 과 View를 알고 있어야하기 때문에 weak 변수로 가지고 있음
    weak var router: LoggedInRouting?
    weak var listener: LoggedInListener?

    ovrride init(presenter: LoggedInPresentable) {
        super.init(presenter: presenter)
        presenter.listner = self
    }

    ovrride func didBecomeActive() {
        super.didBecomeActive()
        // TODO: Implement business logic here.
    }

    ovrride func willResignActive() {
        super.willResignActive()
        // TODO: Pause any business logic.
        // 여기에 Routing 작업을 할 수 있음
    }
}

```

### Router

```swift
import RIBs

protocol LoggedInInteractable: Interactable {
    var router: LoggedInRouting? { get set }
    var listener: LoggedInListener? { get set }
}

// View에 어떤 Present를 할지, Push를 할지 방향을 정하는 역할
protocol LoggedInViewControllable: ViewControllable {

}

final class LoggedInRouter: ViewableRouter<LoggedInInteractable, LoggedInViewControllable>, LoggedInRouting {
    override init(interactor: LoggedInInteractable, viewController: LoggedInViewControllable) {
        super.init(interactor: interactor, viewController: viewController)
        interactor.router = self
    }
}
```

### View

```swift
import RIBs
import RxSwift
import UIKit

// View에서 Action이 일어났을 때 -> Interactor 쪽에다 알려줘야 하는 것을 정의
// Interactor는 이 프로토콜을 구현해야 함
// 한 군데라도 프로토콜을 따르지 않았다면 컴파일 에러가 발생해서 -> 에러가 나는 곳을 구현해주면 됨
protocol LoggedInPresentableListener: class {

}

final class LoggedInViewController: UIViewController, LoggedInPresentable, LoggedInViewControllable {
    weak var listener: LoggedInPresentableListner?
}
```

### 부모 RIB <-> 자식 RIB 간의 통신
`Interactor`를 통해서만 통신을 하게 되어 있음

![RIBcommunication](/assets/2021/04/ribcommunication.png)

복잡한 로직도 `Interactor`간의 통신으로만 구현 가능함

![RIBcommunication2](/assets/2021/04/ribcommunication2.png)

## 의존성 주입 DI

해당 RIB에서 필요한 속성을 [Dependency](https://github.com/uber/RIBs/blob/master/ios/RIBs/Classes/DI/Dependency.swift)에 정의

```swift
import RIBs

// 해당 RIB은 여기에 있는 정보를 사용할 수 있음
protocol LoggedInDependency: Dependency {

}

final class LoggedInComponent: Component<LoggedInDependency> {

}
```

이런식으로 만들 수 있음

```swift
import RIBs

protocol LoggedInDependency: Dependency {
    var name: String { get }
    var nickName: String { get }
}

final class LoggedInComponent: Component<LoggedInDependency> {
    fileprivate var name: String {
        return dependency.name
    }

    fileprivate var nickName: String {
        return dependency.nickName
    }
}
```

- dependency가 확장되면 컴파일 에러 발생
- 해당 RIB을 사용하는 곳은 다 작성을 해야 함

# RxRIBs, Multiplatform architecture with Rx
[https://www.youtube.com/watch?v=BvPW-cd8mpw](https://www.youtube.com/watch?v=BvPW-cd8mpw)
회사 세미나에도 발표하러 오셨었는데 들었던 이후로 시간이 꽤 지나서 다시 들으며 정리했습니다.

## 새로운 아키텍처 필요했던 이유
- 서비스를 빨리 출시해서 운영 노하우를 얻고자 했음
- 기존 방식으로 업무를 진행하면 안되겠다고 생각함
- 두 플랫폼에서 동일한 아키텍처를 사용하고 싶었음

## 고민 요소
- MVC는 최대한 피하자
- Single Activity Application
  - 안드로이드의 Activity 생성, 관리가 까다로움
  - 타다 같은 경우는 map-based 로 만들려고 했음
- 프레임워크를 처음부터 끝까지 만들 시간이 없었음

## RIBs
- [https://github.com/uber/RIBs](https://github.com/uber/RIBs)
- Router, Interactor, Builder, (Presenter, View)

### Interactor
- RIB에서 비즈니스 로직을 담당함
- API를 어떻게 호출할지, 데이터를 어떻게 저장할지, 어떤 State로 바꿔줄지 Interactor에서 이루어짐

### Router
- 여러 RIB이 존재할텐데 A RIB -> B RIB으로 바꾸는 과정을 라우터가 신경써야 함
- 트리상에서 어떻게 립이 존재할지, 트랜지션이 어떻게 일어날지 결정
- 다른 Interactor를 호출하는것을 봉쇄시킴

### Builder
- 팩토리 패턴으로 RIB의 컴포넌트들을 생성해주는 역할을 함
- 클래스들의 Mockability가 향상됨 <- 요건 무슨말이지...?
- Builder는 실제 DI 시스템이 어떻게 구현되어 있는지 알고있는 유일한 클래스

### View
- UI 컴포넌트들을 Layout 하고 애니메이션만 존재하도록

### Presenter
- View 로직이 필요할 떄만 추가함

## State 관리

### Convoluted state machines
![stateMachine](/assets/2021/04/statemachine.png)
- State 관리에 장점이 있음
- 앱에는 많은 State가 있음...

### State tree
![stateTree](/assets/2021/04/statetree.png)
- 어떠한 형태든 Tree 형태로 상태를 그릴 수 있게 되었음
  - 이게 모든 앱이 다 가능할까???
  - 타다는 우버와 비슷한 목적의 앱이라서 잘 사용할 수 있었던건 아닐까?
  - 나중에 예제 따라해보면서 고민해보기
- 비즈니스 로직에 따라 상태를 변경함. 경우에 따라 여러 RIB이 attach된 경우도 있음
- 뷰 로직에 따라 상태를 변경하지 않았음!!

### Scope
- State tree를 사용했을 때 장점은 Scope를 한정 시키는 것

![RIBScopes](/assets/2021/04/ribscopes.png)

### 협업하기 좋아짐
- 관심사 분리
- 레고 블럭 쌓듯이 구현해서 조립함

## 어려움
### Flow of Data
우버에서 사용하는 방식은 양방향 데이터 플로우
![UberRIBs](/assets/2021/04/uberribs.png)

VCNC에서는 단방향 데이터 플로우로 변경해서 사용함
![VCNCRIBs](/assets/2021/04/vcncribs.png)

### Animations
- UITransitionDelegate를 이용함
- HeroTransition 이라는 라이브러리를 사용하고 싶었음
- RIB 간의 transition에서는 위의 두 방식을 사용하게 헀음
- 그래서 RIB lifecycle을 변경해서 사용함

## 요약
![RIBsWrapUp](/assets/2021/04/ribswrapup.png)


# 배운점
- 지난번에 한번 시도했다가 프로토콜들이 너무 많아서 힘들었던 기억이 있습니다. 하지만 각 역할을 좀 더 명확하게 하고 프로토콜이 변경되었을 때 컴파일 에러를 발생시키는게 변경을 더 명확하게 알아차리게 하는 장점이 될 수 있음을 알게되었습니다.
- 안정민님이 사용한 예시가 RIBs tutorial에 있는 것들인데 이것부터 따라해보면 좋겠다는 생각을 했습니다.
- 테스트 코드에 대한 템플릿도 있는게 굉장히 좋다고 생각합니다. 테스트 작성에 손이 잘 안가는 문제가 있는데, 이렇게 하면 테스트 코드로 가는 허들을 조금 더 낮출 수 있을 것 같습니다.
- iOS & 안드로이드 플랫폼 둘 다 RIB를 썼을 때 장점이 과연 어떨지 직접 경험해보고 싶다는 생각도 들었습니다. 어차피 Swift / Kotlin으로 각각 나눠서 작업 하는거면 내부의 아키텍처가 동일하더라도 각각 작업하는건 똑같을 것 같은데... 과연 이게 그렇게 큰 장점일지 궁금해졌습니다. 아니면 한 사람이 두 코드 베이스를 유지보수 할 수 있는 뜻인가...? 버그를 수정할 때 아키텍처 이슈보다 UI 오류였던 적이 더 많은 것 같아서 드는 고민입니다.
