---
layout: post
title:  "Functional Thinking"
date:   2018-10-28 00:00:00 +0000
categories: swift
tags:
  - Swift
  - Functional programming
---

사실 함수형 사고 보다 RxSwift를 먼저 접하긴 했지만, 먼저 뿌리가 되는 함수형 프로그래밍 부터 알아보고 싶다는 생각이 들었다. RxSwift가 매력적인 프로그래밍 도구가 되어주는 것은 이해했지만, 아직도 남들을 설득하기에 기초가 되는 지식이 부족했기 때문이다.

### 함수형 프로그래밍

미리 말해두고 싶은 것은 객체지향과 함수형은 서로 적대적인 관계가 아니라는 점이다. 코드의 재사용이라는 동일한 목표를 두고 다른 각도에서 바라보는 것이다. 저자가 책의 마지막 부분에서 말하고 있듯이, 다양한 패러다임을 연습해두고 문제에 맞는 방식을 채택하는 것이 좋다.

개발자들은 코드를 재사용하고 싶어한다. 클래스를 재사용하는 것에 초점을 맞춘 [객체지향 프로그래밍](https://ko.wikipedia.org/wiki/%EA%B0%9D%EC%B2%B4_%EC%A7%80%ED%96%A5_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D)이 있고, 함수를 재사용하는 것에 초점을 맞춘 [함수형 프로그래밍](https://ko.wikipedia.org/wiki/%ED%95%A8%EC%88%98%ED%98%95_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D)이 있다. 함수를 재사용하기 위해서는 함수를 사용할 때마다 다른 결과가 나와서는 안되겠다. 함수형 프로그래밍에서 **불변성**을 중요하게 생각하는 이유다.

### 커링

객체지향에서 함수를 재사용할 방법을 고민하기 보다는 접근제어(private, public 등) 을 어떻게 하면 잘 나눌 수 있을지 고민한 적이 많은 것 같다. 내부에 추가적인 함수를 만들지 않고도 작업이 가능하다.

```swift
func add(x: Int, y: Int) -> Int {
    return x + y
}
```

위와 같은 함수가 있다고 가정하자. 항상 1 을 더해주는 함수는 어떻게 추가할 수 있을까?

```swift
func addOne(x: Int) -> Int {
    return add(x: x, y: 1)
}
```

모두가 알고 있듯이 이렇게 만들면 된다. 간단한 일이다. 하지만 항상 2, 3, 4, 5 를 추가해주는 함수도 필요하면 어떻게 될까? 4개의 추가적인 함수가 또 필요하다. 대신 이렇게 한번 해보자.

```swift
func add(_ x: Int) -> (Int) -> Int {
    return { y in
        return x + y
    }
}
```

이렇게 x를 먼저 받아두고 y는 나중에 받을 수 있도록 해주는 함수다. **커링(currying)**이라고 부른다. 1, 2, 3, 4, 5 를 더해주는 함수는 이렇게 만든다.

```swift
let addOne = add(1)
let addTwo = add(2)
let addThree = add(3)
let addFour = add(4)
let addFive = add(5)
```

사용할 때는 이렇게 사용한다.

```swift
addOne(10) // 11
addTwo(10) // 12
addThree(10) // 13
addFour(10) // 14
addFive(10) // 15
```

저자는 부분함수와 커링의 개념을 좀 더 명확하게 구분하고자 했다. 간단히 보면 파라미터가 1개인 함수로 만들어주는 것을 커링, 나머지는 부분함수라고 이해했다. 커링의 개념을 조금 더 깊게 알고 싶다면 [이 글](https://edykim.com/ko/post/writing-a-curling-currying-function-in-javascript/)을 참고하는 것도 도움이 될 것이다. Swift로 라이브러리 형태로 정리된 것은 [thoughtbot/Curry](https://github.com/thoughtbot/Curry)가 있으니 사용해보는 것도 좋겠다.


### 메모이제이션
내부의 상태를 저장하기 위해서 캐시를 사용하는 경우가 많다. 그 경우에 클래스 내부에서 캐싱을 한다. 이 경우 어디서 캐시를 사용하는지 고려해줘야 한다. 클래스 내부의 어떤 함수가 사용할 수도 있고 아닐 수도 있다. 잠재적인 오류를 품고 있는 것이다.

함수형 프로그래밍에서는 캐시를 함수 단위로 풀어가고자 한다. 함수의 리턴 값을 캐싱하는 방법인데 **메모이제이션**이라고 부른다. 메모이제이션을 사용하면 런타임에 최적화를 맡기게 되어서 성능 향상을 꾀할 수 있다. 그리고 메모이제이션 된 함수의 내부의 값을 다른 함수가 변경하는 것이 어렵기 때문에 잠재적인 오류를 줄일 수 있다.

```swift
func memoize<T: Hashable, U>(_ function: @escaping (T) -> U) -> (T) -> U {
    var cache = [T: U]()

    func memoizedFunction(x: T) -> U {
        if let cachedValue = cache[x] {
            return cachedValue
        }

        let value = function(x)
        cache[x] = value
        return value
    }

    return memoizedFunction
}

let memoizedClassfier = memoize(Classifier.isPerfect)
```

책을 읽으면서 메모이제이션을 swift로 구현해봤다. 위의 예제에서는 `func isPerfect() -> Bool` 함수 자체를 캐싱한다. 재귀 상황에서도 사용할 수 있으면 좋겠다는 생각이 든다. [애플의 WWDC 세션](https://www.youtube.com/watch?v=g44U1937o0g)에서 아래와 같은 코드를 소개했다.

```swift
func memoize<T: Hashable, U>(_ body: @escaping ((T) -> U, T) -> U) -> (T) -> U {
    var memo = [T: U]()
    var result: ((T) -> U)!
    result = { x in
        if let q = memo[x] { return q }
        let r = body(result, x)
        memo[x] = r
        return r
    }
    return result
}

let factorial = memoize { factorial, x in x == 0 ? 1 : x * factorial(x - 1) }
```

 속도 비교도 함께 있어서 자세히 알고 싶은 사람은 [이 글](https://greatgift.tistory.com/entry/Swift-Memoization)을 읽어보면 좋을 듯 하다. 책의 예제를 따라가면서 실제로 속도 향상이 있는지 궁금했고, 실무에도 적용할 수 있을지 고민해봤다.

### 함수형 자료구조
함수형 언어는 부수효과가 없는 **순수함수**를 선호한다. 그리고 리턴 받은 값을 또 다시 함수에 넣을 수 있어야 좋다. 만약 함수가 예외를 발생시키면 이러한 특성을 깨뜨리게 된다. 그래서 보통 type-safe한 오류 처리방식을 도입한다.

책에서는 Either 라는 클래스를 소개하는데 swift에서는 모나드로 값을 한번 감싸서 구현할 수 있다. [Optional](https://developer.apple.com/documentation/swift/optional)이나 [Result](https://github.com/antitypical/Result)도 이와 같은 역할을 한다. unwrapping 하는 과정을 한번만 거치면 된다. Optional 구현부를 보면 아래와 값을 감싸게 되어있다.

```swift
public enum Optional<Wrapped> : ExpressibleByNilLiteral {

    /// The absence of a value.
    ///
    /// In code, the absence of a value is typically written using the `nil`
    /// literal rather than the explicit `.none` enumeration case.
    case none

    /// The presence of a value, stored as `Wrapped`.
    case some(Wrapped)
}
```

Result는 이런식으로 구현하면 된다. 책에서 소개한 Either과 같다. Error 내용에 따라 처리해줘야 할 것이 있을 때는 Result를 사용하면 된다.

```swift
public enum Result<Value, Error: Swift.Error>: ResultProtocol, CustomStringConvertible, CustomDebugStringConvertible {
    case success(Value)
    case failure(Error)
}
```

에러를 바로 발생시키지 않는다는 개념이기 때문에, lazy를 구현하는데 도움이 된다. 에러의 내용을 확인하려면 한번 더 값을 열어봐야한다.

### Lazy
이번엔 lazy에 대해서 알아보자. **표현의 평가를 가능한 최대로 늦추는 기법** 이라고 소개한다. 시간이 많이 걸리는 연산을 최대로 늦출 수 있고, 무한 컬렉션을 만들 수 있다. 자바에서는 이러한 무한 컬렉션을 Stream 으로 도입했고, 비슷한 개념을 RxSwift 에서 사용 가능하다.

사실 lazy 라는 것이 그렇게 새롭다고 느껴지진 않았다. swift에서 이미 많이 사용되고 있기 때문이다. UIView를 구성할 때 각 화면 요소들의 생성을 최대한 늦췄다가 필요할 때 생성해서 사용하기도 하고(lazy stored property), collection에 lazy를 적용해서 필요할 때만 값을 생성하거나 필터 하는 방법을 사용한다([lazy collection](https://developer.apple.com/documentation/swift/lazycollection)). lazy stored property에 대한 애플의 예제를 간단히 보자.
```swift
class DataManager {
    lazy var importer = DataImporter()
    var data = [String]()
    // the DataManager class would provide data management functionality here
}

let manager = DataManager()
manager.data.append("Some data")
manager.data.append("Some more data")
// the DataImporter instance for the importer property has not yet been created
```

가끔씩 사용되고 생성하는 비용이 크다면 `lazy` 키워드를 사용해서 생성을 미룰 수 있는 것이다. 위의 예제에서는 `importer` 가 아직 생성되지 않았다. 아래는 [lazy collection에 대한 예제](https://cocoacasts.com/what-is-a-lazymapcollection-in-swift)이다.

```swift
public var keys: LazyMapCollection<Dictionary, Key> {
  return self.lazy.map { $0.key }
}
```

lazy map을 사용해서 map을 연산할 필요가 있을 때만 연산한다. collection에 있는 모든 값에 대해 계산해주는 것이 아니라 사용되는 index의 값만 게산해서 반환하는 방법이다. 만약 collection에 많은 값들이 들어있고 key를 가져오는 것이 가끔 있는 일이라면 유용한 방법이 된다.


### 함수 수준의 재사용

글의 초반에 함수형 프로그래밍의 핵심이 함수의 재사용에 있다고 했다. 클래스에 패턴을 적용하는 객체지향처럼, 함수형 프로그래밍에서도 일종의 패턴이 있다.

#### 1. 템플릿 메서드

기존에 탬플릿 메서드에서는 아래와 같이 구현할 수 있다. 껍데기만 만들어두고 각 함수의 구현부는 클래스에게 맞기는 것이다.

```swift
protocol Customer {
    associatedtype Item

    var plan: [Item] { get }

    func checkCredit()
    func checkInventory()
    func ship()

    func process()
}

extension Customer {
    func process() {
        checkCredit()
        checkInventory()
        ship()
    }
}
```

같은 기능을 수행하는 프로토콜을 만들어보자. 앞서서 3개의 함수를 클래스에서 반드시 구현해야 했다. 물론 checkCredit() { } 처럼 함수를 비워두는 방법도 있겠고, extension에서 구현부를 미리 비워두는 방법도 있겠지만 클로저를 사용한 아래의 방법이 조금 더 깔끔한 것을 알 수 있다.

```swift
protocol CustomerBlocks {
    associatedtype Item

    var plan: [Item] { get }

    var checkCredit: (() -> Void)? { get }
    var checkInventory: (() -> Void)? { get }
    var ship: (() -> Void)? { get }

    func process()
}

extension CustomerBlocks {
    func process() {
        checkCredit?()
        checkInventory?()
        ship?()
    }
}
```

optional로 정의되어 있는 일급 함수들은 nil을 넣어서 생략할 수 있다. 그리고 함수를 호출하는 부분에서는 ? 라는 syntax sugar을 사용해서 간편하게 처리할 수 있다.


#### 2. 전략(Strategy)
strategy pattern은 알고리즘을 바꿔서 사용할 수 있게 해주는 패턴이다. 곱셈을 두가지 방식으로 구현했다.

```swift
protocol Calc {
    func product(n: Int, m: Int) -> Int
}

class CalcMult: Calc {
    func product(n: Int, m: Int) -> Int {
        return n * m
    }
}

class CalcAdd: Calc {
    func product(n: Int, m: Int) -> Int {
        var result = 0
        (1...n).forEach { _ in
            result += m
        }
        return result
    }
}
```

 CalcMult과 CalcAdd의 결과값은 같다.

```swift
class StrategyTest {
    var listOfStrategies: [Calc] = [CalcMult(), CalcAdd()]

    func test() {
        listOfStrategies.forEach {
            print(10 == $0.product(n: 5, m: 2))
        }
    }
}
```

앞서 템플릿 메서드에서 사용했던 것처럼 일급 함수를 사용해보자. 함수를 바로 배열에 넣어서 사용했다.

```swift
class StrategyTest {
    static func testExp() {
        var listOfExp: [(Int, Int) -> Int] = [
        { n, m in n * m},
        { n, m in
            var result = 0
            (1...n).forEach { _ in
                result += m
            }
            return result
            }
        ]

        listOfExp.forEach {
            print(10 == $0(5, 2))
        }
    }
}
```

#### 3. 플라이웨이트 디자인 패턴과 메모이제이션

플라이웨이트는 같은 종류의 모든 상품을 대표하는 **표준객체**라는 개념을 사용한다. 싱글톤에서 각 상품에 대한 정보를 공유한다.

```swift
class CompFactory {
    var types: [String: Computer] = [:]
    static let sharedInstance: CompFactory = CompFactory()

    init() {
        types["MacBookPro6_2"] = Laptop()
        types["SunTower"] = Desktop()
    }

    func ofType(_ computer: String) -> Computer? {
        return types[computer]
    }
}

func testCompFactory() {
    let bob = AssignedComputer(computerType: CompFactory.sharedInstance.ofType("MacBookPro6_2"), userID: "Bob")
    let steve = AssignedComputer(computerType: CompFactory.sharedInstance.ofType("MacBookPro6_2"), userID: "Bob")

    print(bob.computerType === steve.computerType)
}
```

각 type에 대한 정보를 캐시해두었다. 이 글의 앞부분에서 캐싱을 메모이제이션으로 대체할 수 있다고 했다. 그렇다면 플라이웨이트 패턴을 메모이제이션을 활용해서 만들어보자. memoize() 함수는 앞부분에서 구현했던 것을 그대로 사용했다. 싱글톤을 쓰지 않고도 보다 간결하게 표현할 수 있게 되었다.

```swift
func testMemoize() {
    let computerOf: (String) -> Computer? = { type in
        let of: [String: Computer] = ["MacBookPro6_2": Laptop(),
                                      "SunTower": Desktop()]
        return of[type]
    }

    let computerOfType = memoize(computerOf)

    let bob = AssignedComputer(computerType: computerOfType("MacBookPro6_2"), userID: "Bob")
    let steve = AssignedComputer(computerType: computerOfType("MacBookPro6_2"), userID: "Bob")

    print(bob.computerType === steve.computerType)
}
```

#### 4. 팩토리와 커링
주어진 조건에 따라 다른 값을 리턴하는 것이 **팩토리** 의 본질이다. 이 글의 제일 앞부분에서 다뤘던 커링을 떠올려보자. 함수를 주어진 조건에 따라 다른 함수로 만든다.

```swift
let addOne = add(1)
let addTwo = add(2)
let addThree = add(3)
let addFour = add(4)
let addFive = add(5)
```

### 메타 프로그래밍
함수형 프로그래밍 개념을 제대로 지원하지 않는 언어나, 다른 라이브러리를 가져와서 사용하게 되는 경우에 메타프로그래밍을 통해 원하는 기능들로 매핑해서 사용하면 편리하다. swift에서는 extension을 활용하면 해당 객체나 구조체가 원래 가지고 있던 함수처럼 사용할 수 있다.


```swift
extension Reactive where Base: UILabel {

    /// Bindable sink for `text` property.
    public var text: Binder<String?> {
        return Binder(self.base) { label, text in
            label.text = text
        }
    }

    /// Bindable sink for `attributedText` property.
    public var attributedText: Binder<NSAttributedString?> {
        return Binder(self.base) { label, text in
            label.attributedText = text
        }
    }

}
```

위의 예제는 [RxSwift/RxCocoa/iOS/UILabel+Rx.swift](https://github.com/ReactiveX/RxSwift/blob/master/RxCocoa/iOS/UILabel%2BRx.swift)에서 가져온 것인데 기존의 UILabel을 함수형 개념으로 사용할 수 있도록 도와준다. 여기서 만들어서 사용한 것 처럼 진행하고 있는 프로젝트의 방향성에 맞게 확장해서 사용가능 하다는 장점이 있다.

### 정리
* 함수형 프로그래밍이 객체지향 프로그래밍과 완전히 등을 돌리고 있는것이 아니라는 것을 알았다.
* 사이드 이팩트가 많이 발생할 수 있는 부분에 함수형을 적용하면 좋다는 것을 알았다.
* 런타임에 양도하는 것이 중요한 개념이라는 것을 알게 되었다.
* swift를 사용하면서 이미 많은 개념들을 함수형으로 사용하고 있다는 것을 알게되었다.
* 함수형에도 패턴이 있다는 것을 알게 되었다.
* 스트림을 무한한 컬렉션이라고 상상해보면 더 이해가 쉽다는 것을 알게되었다.
* 함수형으로 코드를 작성하는 것은 쉽지 않다.
* 하지만 제대로 사용하면 더 간결하고 안전한 코드를 얻을 수 있다는 것을 알게되었다.
