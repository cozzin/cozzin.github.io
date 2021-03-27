---
layout: post
title: "[Combine 책 정리] Chapter 1: Hello, Combine!"
date: 2021-01-03 22:35:00 +0900
categories: combine
tags:
  - combine
  - swift
---

## 책의 목표

1.  추상적으로 들리는 컴바인의 개념을 이해
2.  한 챕터씩 따라가면서 컴바인이 무엇을 해결하고자 하는지 배워나감

[https://www.raywenderlich.com/books/combine-asynchronous-programming-with-swift/v2.0](https://www.raywenderlich.com/books/combine-asynchronous-programming-with-swift/v2.0)

## 애플에서는 Combine을 통해

1.  이벤트 처리를 위한 선언적 접근을 함
2.  Delegate나 Completion Handler 구현 대신 이벤트 소스에 대한 Single processing chain을 만들 수 있음

# 비동기 프로그래밍 (Asynchronous programming)

1.  스레드 1개가 코드 실행

-   결과로 "Tom Harding"이 출력됨을 보장 가능

```swift
begin
  var name = "Tom"
  print(name)
  name += " Harding"
  print(name)
end

// 다음에서 발췌: By Marin Todorov. ‘Combine: Asynchronous Programming with Swift.’ Apple Books.
```

2.  스레드 2개가 비동기적으로 코드를 실행

-   코드를 실행할 때마다 결과가 달라지기도 함
-   Thread 2 가 끼어들면서 결과물은 "Billy Bob Harding"이 되어버림...

```swift
--- Thread 1 ---
begin
  var name = "Tom"
  print(name)

--- Thread 2 ---
name = "Billy Bob"

--- Thread 1 ---
  name += " Harding"
  print(name)
end

// 다음에서 발췌: By Marin Todorov. ‘Combine: Asynchronous Programming with Swift.’ Apple Books.
```

# Foundation and UIKit/AppKit

-   상황: 모바일 앱을 만들 때 비동기 프로그래밍을 일상적으로 하고 있음.
-   문제: 비동기 코드는 재현하기 어려운 이슈들을 많이 만들어냄
-   해결: Combine이 탄생!!!

## Combine 장점

1.  당신의 코드에 통합하기 쉬움. 애플은 Combine API를 Foundation Framework에 긴밀하게 통합하고 있음. // 이게 RxSwift 보다 좋은 점이 아닐까 싶음. RxSwift는 외부 라이브러리. 코코아 프레임워크와 통합하기 위해서 많은 노력이 필요.
2.  SwiftUI와 함께 사용하기도 좋음.
3.  API에 대한 테스트도 잘되어 있습니다.
4.  데이터 모델 부터 네트워크 레이어 그리고 UI까지 모두 Combine을 사용 가능

# Foundation of Combine

-   선언형, 반응형 프로그래밍은 새로운 컨셉이 아님.
-   오랫 동안 사용되어 왔지만 지난 10년동안 주목 받음.

## Rx 라이브러리들의 역사

-   2009년 MS에서 Rx.NET을 출시.
-   2012년에는 Rx.NET을 오픈소스로 출시
-   그 때 부터 다른 언어들도 동일한 컨셉을 사용하기 시작했습니다.
-   현재는 Rx를 포팅한 많은 라이브러리들이 있음 (RxJS, RxKotlin, RxScala, RxPHP...)
-   읽어볼만 한 기사: [https://zdnet.co.kr/view/?no=20161010104628](https://zdnet.co.kr/view/?no=20161010104628)
-   Reactive Programming 관련된 영상이 있어서 정리해봤습니다 [link](https://cozzin.tistory.com/13)

## 애플 플랫폼 용 반응형 프로그래밍 라이브러리

1.  RxSwift: Rx standard 구현
2.  ReactiveSwift: Rx로 부터 영감을 받음
3.  Interstellar: 커스텀하게 구현. // 이건 잘 모르겠음  
    // TODO: RxSwift, ReactiveSwift는 어떻게 다른지 찾아보기

## 컴바인 도입

-   컴바인은 Rx와 다르지만 비슷한 표준인 Reactive Streams를 구현.
-   Reactive Streams과 Rx의 대부분의 핵심 컨셉은 동일.
-   iOS 13/macOS Catalina 부터 애플은 Combine으로 반응형 프로그래밍을 도입.

# Combine basics

## 컴바인 3가지 주요 부분

1.  Publisher
2.  Operator
3.  Subscriber

// WWDC 2019 정리했던 글([https://medium.com/@hongseongho/introducing-combine-%EC%A0%95%EB%A6%AC-9e42b0fed56d](https://medium.com/@hongseongho/introducing-combine-%EC%A0%95%EB%A6%AC-9e42b0fed56d)) 다시 읽기

자세한 건 챕터2(Publishers & Subscribers)에서...

챕터1 에서는 각 타입들의 역할 파악.

## Publishers

Publisher는 value들을 보내는(emit) 역할.

### Publisher가 emit 할 수 있는 이벤트 종류

1.  Output
2.  Completion: successful completion
3.  Failure: completion with an error

-   Publisher는 Output을 안보내고 있거나 여러번 보낼 수 있으며,
-   Completion 이나 Failure를 한번 보내고 나면 더 이상의 이벤트는 보낼 수 없습니다.

ex)

```swift
Publisher<Int, Never>
-[1]-[3]-[1]-[5]-[Completion]-
-[1]-[3]-[1]-[Failure]-
```

### 특징

1.  3가지 이벤트로 모든 종류의 동적 데이터를 표현 가능
2.  delegate를 추가하거나 completion callback을 주입 필요없음 // 아직까지 그렇게 동의하지 못하는 부분. publisher도 어차피 찾아서 연결해줘야하는 건 동일한데 큰 우위에 있다고 볼 수 있을까?
3.  Publisher는 에러 핸들링이 내장 // 이거 아직 이해 못함... Error를 emit할 수 있다는 점을 뜻하는 걸까?
4.  Publisher는 2개의 제니릭을 기반으로 구성
    -   Publisher.Ouput: output value.
    -   Publisher.Failure: 에러 전달. 에러가 발생할 일이 없으면, Never 라는 타입으로 정의하면 됨

## Operators

### 정의

-   Operator는 Publisher 프로토콜에 선언되어 있음.
-   같거나 새로운 Publisher를 반환하는 메소드.
-   Operator들을 체이닝해서 사용할 수 있기 때문에 유용함.

### 장점

1.  Operator들은 독립적이고 조합가능하기 때문에, 복잡한 로직을 구현하는데 조합(Combine) 가능.
2.  항상 Input & Ouput(Upstream & Downstream)을 가지기 때문에 shared state를 피할 수 있음. (앞에서 나왔던 동시성 이슈)  
    비동기 코드가 끼어들어 당신의 데이터를 중간에 변경할 일이 없음

## Subscribers

### 정의

모든 구독은 subscriber로 끝남.  
전달받은 value나 completiopn event로 작업을 수행.

### 2개의 내장된 subscriber

1.  sink: output value와 completion을 받을 수 있는 클로저를 제공할 수 있음
2.  assign: output을 key path를 통해 data model의 property 나 UI control에 바로 바인딩 할 수 있음

## Subscriptions

> Note: 책의 subscription 이라는 용어는 아래를 설명하기 위해 사용됨
>
> 1\. subscription 프로토콜  
> 2\. 프로토콜을 준수하는 오브젝트  
> 3\. publisher, operator, subscriber의 전체 chain

### 중요

subscription의 끝에 subscriber를 추가 -> 체이닝의 맨 앞에 있는 publisher를 활성화  
output을 수신해줄 subscriber가 없으면 publisher는 어떤 value도 전달하지 않음

### 장점

1.  Subscription은 비동기 이벤트들의 체인을 커스텀 코드와 에러 핸들링과 함께 한방에 선언 가능.
2.  Full-Combine 이면, 앱 전체의 로직을 subscription 들로 표현 가능.
3.  Subscription이 한번 선언되고 나면 콜백을 호출할 필요 없이 시스템이 다 알아서 해줌.

## 메모리 관리

-   Cacncellable 프로토콜 사용해서 메모리 관리.
-   Subscriber들은 Cancellable을 준수하고 있음.
-   오브젝트를 메모리에서 해제 -> 모든 subscription은 취소 -> 리소스를 메모리로부터 해제

### 장점

-   Subscription의 수명을 view controller 같은 오브젝트에 bind 가능.
-   유저가 view controller를 view stack에서 dismiss -> subscription 취소 해줌

### 조금 더 자동화

1. `[AnyCancellable]` Collection 프로퍼티를 만들어서, subscription들을 여기에 담아주기.
2. `[AnyCancellable]`가 메모리에서 해제될 때 자동적으로 cancel 되고 release 될 것 입니다.

## 기존 코드에 비해 Combine이 더 좋은 점은?

편리함, 안전함, 경제적

### 장점

1.  시스템 레벨에 통합되어 있음. 내부에서 privatet API 쓰는 듯
2.  delegate, closure를 만들 필요 없음. 실수 가능성 낮아짐.
3.  재사용성 좋음. 동일한 인터페이스 쓰기 때문.
4.  operator를 조합하기 좋음.
5.  비동기 코드에서도 비즈니스 로직에 집중할 수 있음.

## App architecture

-   아키텍처에 영향을 미치지는 않음. 선택적으로 적용 가능.
-   MVC, MVVM, VIPER 에서 활용 가능.
-   Combine & SwiftUI의 경우에는 MVC에서 C가 필요 없음.

## Book projects

-   playground에서 컴바인을 사용해보기 좋음.
-   책에서 제공하는 playground 부터 시작

## Key points

1.  컴바인은 비동기 이벤트를 위한 선언적, 반응형 프레임워크
2.  비동기 프로그래밍의 기존 문제를 해결하는 것이 목표
3.  주요 3 타입: publisher (이벤트 발행) -> operator (이벤트 처리, 조작) -> subscriber (결과물 소비)
