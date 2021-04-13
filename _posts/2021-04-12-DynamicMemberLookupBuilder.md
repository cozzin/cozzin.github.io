---
layout: post
title: "dynamicMemberLookup를 활용한 Builder"
date: 2021-04-11 20:49:00 +0900
---

안녕하세요. 이번에는 Builder를 구현해보겠습니다. 빌더 패턴을 구현하기 위해서 목표로 하는 객체 프로퍼티의 set 함수들을 직접 만들어줘야하는 번거로움이 있습니다. 물론 Builder로 한번 작성 후에는 수정이 되지 않는 Immutable 객체를 만들 수 있는 장점이 있지만, UI 객체의 경우 Mutable 객체가 많기 때문에 굳이 이런식의 접근을 하지 않아도 괜찮다고 생각합니다.

우아한형제들 기술블로그를 보다가 KeyPath에 대한 내용을 보게 되었습니다. [https://woowabros.github.io/swift/2021/02/18/swift-dynamic-features.html](https://woowabros.github.io/swift/2021/02/18/swift-dynamic-features.html) 원래 알고 있던 내용들이라고 생각하고 스크롤하면서 보고 있었는데 저런것도 가능한가???!! 싶은 부분을 발견했습니다. 추상적인 빌더를 만들어 놓고 제네릭을 통해서 해당 객체를 변경시키는 코드입니다.

```swift
let label = UILabel()
  .builder
  .text("hi")
  .textColor(.label)
  .numberOfLines(0)
  .build()
```

기존에도 많은분들이 then을 사용해서 객체를 수정하는 것으로 알고 있는데, 이건 좀 더 SwiftUI 스러운 느낌이 나서 좋다고 생각합니다. Builder 패턴 예제로 나오는 모습을 거의 유지하고 있어서 처음 코드를 접한 사람도 빌더 패턴인것을 바로 인식할 수 있다는 장점이 있습니다. 위의 구현을 위해서는 아래와 같은 코드가 필요합니다.

```swift
@dynamicMemberLookup
public struct Builder<Base> {

    private var base: Base

    public init(_ base: Base) {
        self.base = base
    }

    public subscript<Value>(dynamicMember keyPath: ReferenceWritableKeyPath<Base, Value>) -> ((Value) -> Builder<Base>) {
      return { value in
        base[keyPath: keyPath] = value
        return Builder(base)
      }
    }

    public func build() -> Base { base }
}

public protocol Buildable {
    associatedtype Base: AnyObject
    var builder: Builder<Base> { get }
}

public extension Buildable where Self: AnyObject {
    var builder: Builder<Self> { Builder(self) }
}

extension NSObject: Buildable {}
```

기발하다고 생각했던 점은 `subscript`의 return 값으로 `((Value) -> Builder<Base>)` 클로저 자체를 넘겼다는 점 입니다. 클로저를 return 할 수 있다는 것은 특별한 일이 아니지만, 클로저를 받은 쪽에서 함수로 사용할 수 있어서 결론적으로 `text("hi")`와 같이 바로 실행할 수 있다는 것이 재밌다고 생각됩니다. 사용하는 쪽에서는 함수인지 클로저인지 고민할 필요없이 빌더의 set 함수라고 생각하고 작성할 수 있습니다. 잘 기억해뒀다가 나중에 응용하면 유용한 코드를 작성할 수 있을 것 같습니다.
