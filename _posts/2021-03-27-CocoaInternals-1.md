---
layout: post
title: "Cocoa Internals: 1장 객체 (1.1 ~ 1.2)"
date: 2021-01-03 22:35:00 +0900
categories: CocoaInternals
tags:
  - swift
  - objective-c
  - CocoaInternals
---

애플 플랫폼에 대한 기초 정리를 위해 김정님의 코코아 인터널스 책을 공부합니다. 생각보다 진짜 어렵네요 🤣🤣 1.1 클래스와 객체 인스턴스, 1.2 객체 정체성과 등가성에 관한 정리입니다.

## 스위프트 중간 언어(SIL)

스위프트에서 기계어 까지 가는 여정에 스위프트 중간 언어라는게 있다고 합니다. 컴파일러가 알아서 기계어로 번역해주는것만 알았지, 이렇게 중간언어가 있다는 사실은 모르고 있었습니다. SIL을 통해서 최적화 과정을 거친뒤에 기계어로 변환됩니다. 책에 나와 있는 과정을 그대로 옮기면 아래와 같습니다. 사실 아직 제대로 이해가 되지는 않습니다...;;

```
Swift -> `Swift 프론트엔드` -SIL-> `SIL 최적화` -SIL-> `LLVM IR 최적화` -SIL-> `코드 생성기` -> 기계코드  
```

SIL의 목적은 프로그래머가 입력한 Swift 소스 코드와 LLVM IR간의 표현 차이를 메꾸는 것이라고 합니다. [링크](https://woowabros.github.io/swift/2018/03/18/translation-SIL-for-the-moment-before-entry.html)에 좀 더 자세한 컴파일 과정이 있습니다.

```
구문분석(AST) -> 의미분석 -> 모듈 임포트 -> SIL 생성 -> SIL 정규화 -> SIL 최적화 -> LLVM IR 생성 -> ...
```

이 과정을 보더라도 아직 이해가 잘 되지 않습니다. 위의 링크에는 각 과정마다 더 자세한 설명이 있습니다. 구문분석 부분을 보면 학부 컴파일러 수업 때 들었던 Paser에 대한 내용도 있습니다. [https://github.com/apple/swift/tree/main/lib/Parse](https://github.com/apple/swift/tree/main/lib/Parse) 에 내용이 있습니다. (애플 코드도 라인이 꽤 긴데... 좀 더 추상화 하거나 파일을 나누지 않은 이유가 무엇일지 궁금하네요ㅋㅋ...) 나머지 과정들도 해당 레포를 보면 열어볼 수 있습니다.

## 객체
```
코드를 작성하는 과정보다 객체 중심으로 생각하는 과정이 더 중요하다. (p.17)
```

구현을 따라하는 과정보다 추상화를 어떻게 시킬 건지 고민해보는 노력이 중요하다는 생각이 듭니다. 요즘엔 그렇게 추상화에 대한 고민을 어느 정도 했으면 코드로 작성해보는 것 또한 놓치지 않아야 겠다는 생각을 하고 있습니다.

## 메모리 구조

한번쯤 메모리 구조를 본적이 있을 텐데 아래와 같이 생겼습니다. 클래스와 인스턴스는 힙 공간에 위치하게 되고, 그 인스턴스를 가리키는 포인터는 스택 공간에 자리잡게 됩니다.

```
(High Memory)

스택(Stack) // ⬇️ 위에서 아래로 쌓아감
빈공간
힙(Heap) // ⬆️ 아래에서 위로 쌓아감
심벌(BSS)
데이터(DATA)
텍스트(TEXT)

(Low Memory)
```

그런데 왜...? 스택과 힙이 왜 빈공간을 끼고서 서로를 향해 쌓아가는지 궁금증이 생겼습니다. 사용할 공간을 알고 있는 유형과 사용할 공간을 동적으로 정하는 유형으로 나눠집니다. 메모리라는 한 공간에서 두 개의 유형을 다룰 수 있는 장점이 있습니다. 스택과 힙에 대해서 간단히 알아보겠습니다.

### 스택

* 컴파일 타임에 크기 결정되는 것들 저장
* 이미 할당된 공간을 사용하기 때문에 속도가 빠름
* LIFO 가장 늦게 저장된 데이터가 먼저 인출됨
* High Memory -> Low Memory 방향으로 할당됨
* 무한으로 이어지는 루프가 있으면 stack overflow가 발생한다. -> 결국 세그멘테이션 오류 발생
```swift
func foo() -> Int {
    foo()
}
```

### 힙

* 사용자가 직접 관리하는 메모리 영역
* 동적으로 메모리 공간 할당
* Low Memory -> High Memory 방향으로 할당됨
* 여러 스레드가 있어도 하나의 힙 영역을 사용함


## 객체 예외성

모든 코코아 객체 인스턴스가 힙 영역에 생성되는 것은 아닙니다. NSString 같은 경우에는 예외입니다...!! 문자열은 텍스트 영역에 저장됩니다. 동일한 문자열을 반복해서 사용하면 같은 텍스트 영역을 사용합니다. 이걸 **문자열 인터닝(string interning)** 이라고 부릅니다.

## 출처
* 코코아 인터널스
* [[번역] SIL(Swift Intermediate Language), 일단 시작해보기까지](https://woowabros.github.io/swift/2018/03/18/translation-SIL-for-the-moment-before-entry.html)
* [스택(Stack)과 힙(Heap) 차이점](https://junghyun100.github.io/%ED%9E%99-%EC%8A%A4%ED%83%9D%EC%B0%A8%EC%9D%B4%EC%A0%90/)
* [자바 메모리 관리 - 스택 & 힙](https://yaboong.github.io/java/2018/05/26/java-memory-management/)
* [스택 오버플로](https://ko.wikipedia.org/wiki/%EC%8A%A4%ED%83%9D_%EC%98%A4%EB%B2%84%ED%94%8C%EB%A1%9C)
