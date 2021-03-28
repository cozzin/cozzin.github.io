---
layout: post
title: "[Combine 책 정리] Chapter 2: Publishers & Subscribers"
date: 2021-01-06 19:51:00 +0900
categories: combine
tags:
  - combine
  - swift
---


챕터2 부터는 실습 위주

## Hello Publisher

```swift
example(of: "Publisher") {
  // 1
  let myNotification = Notification.Name("MyNotification")

  // 2
  let publisher = NotificationCenter.default
    .publisher(for: myNotification, object: nil)

  // 3
  let center = NotificationCenter.default
  // 4
  let observer = center.addObserver(
    forName: myNotification,
    object: nil,
    queue: nil) { notification in
      print("Notification received!")
  }

  // 5
  center.post(name: myNotification, object: nil)
  // 6
  center.removeObserver(observer)
}
```

```
——— Example of: Publisher ———
Notification received!
```

이 예제는 조금 맞지 않는 면이 있는데, 이벤트가 publisher로 부터 나온게 아니기 때문.  
Subscriber가 등록되어야 Publisher가 활성화 됨.

## Hello Subscirber

```swift
example(of: "Subscriber") {
  let myNotification = Notification.Name("MyNotification")

  let publisher = NotificationCenter.default
    .publisher(for: myNotification, object: nil)

  let center = NotificationCenter.default

  // 1
  let subscription = publisher
    .sink { _ in
      print("Notification received from a publisher!")
    }

  // 2
  center.post(name: myNotification, object: nil)
  // 3
  subscription.cancel()
}

```

```
——— Example of: Subscriber ———
Notification received from a publisher!

```

sink 메소드에 대해 알아보자.

[https://developer.apple.com/documentation/combine/record/sink(receivevalue:)](https://developer.apple.com/documentation/combine/record/sink(receivevalue:))

-   Failure = Never
-   Subscriber를 만들고 backpressure를 무제한 값으로 요청.

```swift
let integers = (0...3)
integers.publisher
    .sink { print("Received \($0)") }

// Prints:
//  Received 0
//  Received 1
//  Received 2
//  Received 3
```

### Just

```swift
example(of: "Just") {
  // 1
  let just = Just("Hello world!")

  // 2
  _ = just
    .sink(
      receiveCompletion: {
        print("Received completion", $0)
      },
      receiveValue: {
        print("Received value", $0)
    })

  _ = just
    .sink(
      receiveCompletion: {
        print("Received completion (another)", $0)
      },
      receiveValue: {
        print("Received value (another)", $0)
    })
}
```

```
——— Example of: Just ———
Received value Hello world!
Received completion finished
Received value (another) Hello world!
Received completion (another) finished

```

[https://developer.apple.com/documentation/combine/just](https://developer.apple.com/documentation/combine/just)

-   각 subscriber에게 output 한번만 emit 후 finsih
-   [Publishers.catch](https://developer.apple.com/documentation/combine/publishers/catch)에서 value를 교체해줄 때 유용함
    -   catch를 써봐야 제대로 공감할 듯
    -   catch는 failed publisher를 다른 publisher로 바꿔주는 거
-   Just는 failure가 없음
-   값이 반드시 있음

### Assign

```swift
example(of: "assign(to:on:)") {
  // 1
  class SomeObject {
    var value: String = "" {
      didSet {
        print(value)
      }
    }
  }

  // 2
  let object = SomeObject()

  // 3
  let publisher = ["Hello", "world!"].publisher

  // 4
  _ = publisher
    .assign(to: \.value, on: object)
}

```

```
——— Example of: assign(to:on:) ———
Hello
world!

```

assign on에 들어갈 object는 class만 가능

```swift
example(of: "assign(to:)") {
  // 1
  class SomeObject {
    @Published var value = 0
  }

  let object = SomeObject()

  // 2
  object.$value // $value로 접근하면 publisher로 접근 가능
    .sink {
      print($0)
    }

  // 3
  (0..<10).publisher
    .assign(to: &object.$value) // return 값이 없음
}

```

```
——— Example of: assign(to:) ———
0
0
1
2
3
4
5
6
7
8  
```

왜 assign(to:on:)을 안쓰고, assign(to:)를 쓸까?

```swift
class MyObject {
  @Published var word: String = ""
  var subscriptions = Set<AnyCancellable>()

  init() {
    ["A", "B", "C"].publisher
      .assign(to: \.word, on: self)
      .store(in: &subscriptions)
  }
}

// 다음에서 발췌: By Marin Todorov. ‘Combine: Asynchronous Programming with Swift.’ Apple Books.
```

이렇게 사용하면 subscription -> self -> subscription 으로 강한 순환 참조에 걸림

이걸 방지하기 위해서 assign(to: &$word)를 사용할 수 있음

## Hello Cancellable

-   subscirber가 더 이상 값을 받을 필요 없을 때 cancel() 사용
-   cancel()을 직접 호출하지 않으면, deinit될 때까지 구독됨

## Understanding what's going on

![다운로드](/assets/다운로드.png)

1\. 구독 시작

2\. Subscription 객체 전달

3\. request value: Backpressure

4\. values 여러개 전달 가능

5\. completion은 한번만

Publisher는 프로토콜로 되어 있음.

내부를 한번 보자

```swift
public protocol Publisher {
  // 1: emit할 수 있는 value
  associatedtype Output

  // 2: 예외 발생할 경우 사용되는 에러.
  // 에러가 발생하지 않는다고 보장할 수 있으면, `Never` 사용
  associatedtype Failure : Error

  // 4: publisher에 subscirber를 붙이기 위해서 호출 됨
  func receive<S>(subscriber: S)
    where S: Subscriber,
    Self.Failure == S.Failure,
    Self.Output == S.Input
}

extension Publisher {
  // 3
  public func subscribe<S>(_ subscriber: S)
    where S : Subscriber,
    Self.Failure == S.Failure,
    Self.Output == S.Input
}

```

Subscriber도 프로토콜

```swift
public protocol Subscriber: CustomCombineIdentifierConvertible {
  // 1: receive 할 수 있는 value
  associatedtype Input

  // 2: receive 할 수 있는 error
  associatedtype Failure: Error

  // 3
  func receive(subscription: Subscription)

  // 4
  func receive(_ input: Self.Input) -> Subscribers.Demand

  // 5
  func receive(completion: Subscribers.Completion<Self.Failure>)
}
```

Subscription을 통해 Publisher와 Subscriber 간에 소통

```swift
public protocol Subscription: Cancellable, CustomCombineIdentifierConvertible {
  func request(_ demand: Subscribers.Demand)
}

```

demand 통해서 backpressure를 정의함.

subscirber가 얼마나 value를 더 받을 수 있는지 알려줌.

[https://developer.apple.com/documentation/combine/subscribers/demand](https://developer.apple.com/documentation/combine/subscribers/demand)

![다운로드 (1)](/assets/다운로드%20(1).png)

.max(Int)로 들어온 값 만큼 + 해줌.

음수가 될 수 는 없음

.max(2) .max(1) 으로 요청하면 최대 3개 value를 전달받게 됨

.max(2) .none 으로 요청하면 최대 2개 value를 전달받게 됨

.unlimited로 요청하면 무한정 값을 받게됨 (별로 권장하지 않는 방식인 듯)

## Creating a custom subscriber

```swift
example(of: "Custom Subscriber") {
  // 1
  let publisher = (1...6).publisher

  // 2
  final class IntSubscriber: Subscriber {
    // 3
    typealias Input = Int
    typealias Failure = Never

    // 4
    func receive(subscription: Subscription) {
      subscription.request(.max(3))
    }

    // 5
    func receive(_ input: Int) -> Subscribers.Demand {
      print("Received value", input)
      return .none
    }

    // 6
    func receive(completion: Subscribers.Completion<Never>) {
      print("Received completion", completion)
    }
  }

  let subscriber = IntSubscriber()

  publisher.subscribe(subscriber)
}

```

```
——— Example of: Custom Subscriber ———
Received value 1
Received value 2
Received value 3

```

Demand.max(3) 으로 요청했기 때문에 1, 2, 3을 전달 받음

만약에 unlimited로 변경하면, 모든 데이터를 다 전달 받음

```swift
func receive(_ input: Int) -> Subscribers.Demand {
  print("Received value", input)
  return .unlimited
}

```

```
——— Example of: Custom Subscriber ———
Received value 1
Received value 2
Received value 3
Received value 4
Received value 5
Received value 6
Received completion finished

```

## Hello Future

```swift
example(of: "Future") {
  func futureIncrement(
    integer: Int,
    afterDelay delay: TimeInterval) -> Future<Int, Never> {
    Future<Int, Never> { promise in
      print("Original")
      DispatchQueue.global().asyncAfter(deadline: .now() + delay) {
        promise(.success(integer + 1))
      }
    }
  }

  // 1
  let future = futureIncrement(integer: 1, afterDelay: 3)

  // 2
  future
    .sink(receiveCompletion: { print($0) },
          receiveValue: { print($0) })
    .store(in: &subscriptions)

  future
    .sink(receiveCompletion: { print("Second", $0) },
          receiveValue: { print("Second", $0) })
    .store(in: &subscriptions)
}

```

```
——— Example of: Future ———
Original
2
finished
Second 2
Second finished

```

Future는 좀 특이함

init될 때 즉시 실행되고 다시 실행되지 않음.

그래서 위의 예제에서 "Original"이 한번만 호출됨

subscriber가 추가되면 만들어진 value를 재사용하고, completion 호출함

## Hello Subject

```swift
example(of: "PassthroughSubject") {
  // 1
  enum MyError: Error {
    case test
  }

  // 2
  final class StringSubscriber: Subscriber {
    typealias Input = String
    typealias Failure = MyError

    func receive(subscription: Subscription) {
      subscription.request(.max(2))
    }

    func receive(_ input: String) -> Subscribers.Demand {
      print("Received value", input)
      // 3
      return input == "World" ? .max(1) : .none
    }

    func receive(completion: Subscribers.Completion<MyError>) {
      print("Received completion", completion)
    }
  }

  // 4
  let subscriber = StringSubscriber()

  // 5
  let subject = PassthroughSubject<String, MyError>()

  // 6
  subject.subscribe(subscriber)

  // 7
  let subscription = subject
    .sink(
      receiveCompletion: { completion in
        print("Received completion (sink)", completion)
      },
      receiveValue: { value in
        print("Received value (sink)", value)
      }
    )

  subject.send("Hello")
  subject.send("World")

  // 8
  subscription.cancel()

  // 9
  subject.send("Still there?")

  subject.send(completion: .failure(MyError.test))
  subject.send(completion: .finished)
  subject.send("How about another one?")
}

```

```
——— Example of: PassthroughSubject ———
Received value Hello
Received value (sink) Hello
Received value World
Received value (sink) World
Received value Still there?
Received completion failure(__lldb_expr_71.(unknown context at $1102e3024).(unknown context at $1102e3180).(unknown context at $1102e3188).MyError.test)

```

Passthrough subject는 직접 new value를 넣어줄 수 있음

// 8 에서는 cancel()을 명시적으로 호출했기 때문에

// 9 에서 더이상 sink가 호출되지 않음

completion: failure와 finished는 배타적이기 때문에

failure가 전달되면 스트림은 종료되게 된다

나중에 finished를 보낸다고 해도 효력이 없다

```swift
example(of: "CurrentValueSubject") {
  // 1
  var subscriptions = Set<AnyCancellable>()

  // 2
  let subject = CurrentValueSubject<Int, Never>(0)

  // 3
  subject
    .print()
    .sink(receiveValue: { print($0) })
    .store(in: &subscriptions) // 4

  subject.send(1)
  subject.send(2)

  print(subject.value)
  subject.value = 3
  print(subject.value)

  subject
    .print()
    .sink(receiveValue: { print("Second subscription:", $0) })
    .store(in: &subscriptions)

  subject.send(completion: .finished)
}

```

```
——— Example of: CurrentValueSubject ———
receive subscription: (CurrentValueSubject)
request unlimited
receive value: (0)
0
receive value: (1)
1
receive value: (2)
2
2
receive value: (3)
3
3
receive subscription: (CurrentValueSubject)
request unlimited
receive value: (3)
Second subscription: 3
receive finished
receive finished

```

// 나중에 추가 정리

## Dynamically adjusting demand

subscriber를 커스텀하게 만들고

Demand 컨트롤을 직접 할 수 있음

실제 문제해결에서 사용될지는 모르겠음...

```swift
example(of: "Dynamically adjusting Demand") {
  final class IntSubscriber: Subscriber {
    typealias Input = Int
    typealias Failure = Never

    func receive(subscription: Subscription) {
      subscription.request(.max(2))
    }

    func receive(_ input: Int) -> Subscribers.Demand {
      print("Received value", input)

      switch input {
      case 1:
        return .max(2) // 1
      case 3:
        return .max(1) // 2
      default:
        return .none // 3
      }
    }

    func receive(completion: Subscribers.Completion<Never>) {
      print("Received completion", completion)
    }
  }

  let subscriber = IntSubscriber()

  let subject = PassthroughSubject<Int, Never>()

  subject.subscribe(subscriber)

  subject.send(1)
  subject.send(2)
  subject.send(3)
  subject.send(4)
  subject.send(5)
  subject.send(6)
}

```

```
——— Example of: Dynamically adjusting Demand ———
Received value 1
Received value 2
Received value 3
Received value 4
Received value 5

```

// 나중에 추가 정리

## Type erasure

```swift
example(of: "Type erasure") {
  // 1
  let subject = PassthroughSubject<Int, Never>()

  // 2
  let publisher = subject.eraseToAnyPublisher()

  // 3
  publisher
    .sink(receiveValue: { print($0) })
    .store(in: &subscriptions)

  // 4
  subject.send(0)
}

```

```
——— Example of: Type erasure ———
0

```

type erasure를 하면 외부에서 접근할 때 subject의 구체적인 타입을 숨길 수 있음

위의 예제에서는 PassthroughSubject 인데, subject를 바로 노출하면 send(\_:)를 해버릴 수 있어서 외부에 노출할 경우 의도치 않은 동작을 유도할 수 있음
