---
layout: post
title:  "Associated Types"
date:   2018-02-28 00:00:00 +0000
categories: swift
---
## 요약
* `asscociatedtype`은 protocol에서 구체적인 type을 정하지 않고 해당 프로토콜을 따르는 곳에서 type을 지정할 수 있도록 하는 keyword 이다.
* 프로토콜을 따르는 곳에서는 `typealias`로 구체적인 type을 지정할 수 있다.

## 정의
프로토콜을 정의할 때 associatedType을 쓰는 것이 유용할 때가 있다. Associated type은 프로토콜의 일부가 되는 타입의 placeholder name을 제공한다.
> 알쏭달쏭하다. typealias와 어떻게 다른거지?

Associated type으로 사용되기 위한 실제 type은 프로토콜이 채택되기 전까지는 구체화 되어 있지 않다. `associatedtype`이라는 키워드를 통해 사용된다.

## 예시
```swift
protocol Container {
  associatedtype Item
  mutating func append(_ itme: Item)
  var count: Int { get }
  subscript(i: Int) -> Item { get }
}
```
* `append(_:)` method를 통해 새로운 item을 추가할 수 있어야 한다.
* `count`프로퍼티를 통해 컨테이너에 있는 item개수를 Int로 반환받을 수 있어야 한다.
* `subscript(i:)`를 통해 `Int` 인덱스에 해당하는 item을 가져올 수 있어야 한다.

이 프로토콜에서 각 기능을 구체적으로 어떻게 수행해야하는지 나와있지는 않다. Container를 구성하기 위해 어떤 타입과 함수가 필요한지 정의한다.
> 그냥 프로토콜에 대한 전반적인 얘기인듯

Container 프로토콜을 따르는 타입은 그것이 저장하고 있는 타입을 명확히 할 수 있어야 한다.
> 뭔말이지

특별히, container에 add 되는 것이 올바른 타입이라는 것을 보장할 수 있어야 한다. 그리고 subscript를 통해서 가져온 item의 type도 명확해야 한다.

이러한 요구사항을 충족시키기 위해, `Container` 프로토콜은 Item 으로 불리는 `associatedtype`을 정의했다. 프로토콜은 `Item`이 무엇인지 정의하지 않았다. - 이것은 프로토콜을 따르는 쪽의 몫이다.
그럼에도 불구하고, Item alias는 Container안에 있는 item의 type을 언급할 수 있는 방법이 있다. 그리고 `appned(_:)` 메소드에서 쓰일 type을 정의할 수 있고, Container가 작동하기 기대하는 대로 강제할 수 있다.

아래는 Container 프로토콜을 따르는 generic이 아닌 버전의 IntStack 이다.
```swift
struct IntStack: Container {
    // original IntStack implementation
    var items = [Int]()
    mutating func push(_ item: Int) {
        items.append(item)
    }
    mutating func pop() -> Int {
        return items.removeLast()
    }
    // conformance to the Container protocol
    typealias Item = Int
    mutating func append(_ item: Int) {
        self.push(item)
    }
    var count: Int {
        return items.count
    }
    subscript(i: Int) -> Int {
        return items[i]
    }
}
```

출처: https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Generics.html
