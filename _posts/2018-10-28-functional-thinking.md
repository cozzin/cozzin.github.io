---
layout: post
title:  "Functional Thinking"
date:   2018-10-28 00:00:00 +0900
categories: swift
---

![](https://ws1.sinaimg.cn/large/006tNbRwgy1fwoa7dxq2fj30dw0i8myr.jpg)

사실 함수형 사고 보다 RxSwift를 먼저 접하긴 했지만, 먼저 뿌리가 되는 함수형 프로그래밍 부터 알아보고 싶다는 생각이 들었다. RxSwift가 매력적인 프로그래밍 도구가 되어주는 것은 이해했지만, 아직도 남들을 설득하기에 기초가 되는 지식이 부족했기 때문이다.

### 함수형 프로그래밍

미리 말해두고 싶은 것은 객체지향과 함수형은 서로 적대적인 관계가 아니라는 점이다. 코드의 재사용이라는 동일한 목표를 두고 다른 각도에서 바라보는 것이다. 저자가 책의 마지막 부분에서 말하고 있듯이, 다양한 패러다임을 연습해두고 문제에 맞는 방식을 채택하는 것이 좋다.

개발자들은 코드를 재사용하고 싶어한다. 클래스를 재사용하는 것에 초점을 맞춘 **객체지향 프로그래밍**이 있고, 함수를 재사용하는 것에 초점을 맞춘 **함수형 프로그래밍**이 있다. 함수를 재사용하기 위해서는 함수를 사용할 때마다 다른 결과가 나와서는 안되겠다. 함수형 프로그래밍에서 **불변성**을 중요하게 생각하는 이유다.

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

이렇게 x를 먼저 받아두고 y는 나중에 받을 수 있도록 해주는 함수다. 커링(currying)이라고 부른다. 1, 2, 3, 4, 5 를 더해주는 함수는 이렇게 만든다.

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

커링의 개념을 조금 더 깊게 알고 싶다면 [이 글](https://edykim.com/ko/post/writing-a-curling-currying-function-in-javascript/)을 참고하는 것도 도움이 될 것이다.


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

### 함수 수준의 재사용

#### 1. 템플릿 메서드

#### 2. 전략(Strategy)

#### 3. 플라이웨이트 디자인 패턴과 메모이제이션

#### 4. 팩토리와 커링

### 메타 프로그래밍

