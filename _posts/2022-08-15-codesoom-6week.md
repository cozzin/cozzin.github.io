---
layout: post
title: "[코드숨] 스프링 6주차 회고 - 로그인"
date: 2022-08-15 17:59:00 +0900
categories: Spring
tags:
  - Spring
  - Login
---

## 요약

지난주는 JWT 이용해서 로그인 구현하는 과제를 수행했습니다.
혼자 사이드 프로젝트를 수행할 때 로그인 기능을 만들 때 어려움을 겪었었는데,
JWT 토큰을 만들고 주고 받는걸 구현해볼 수 있어서 흥미로웠습니다.
다음에 로그인 기능을 구현할 때 써먹을 수 있을 것 같아서 기대됩니다.
아래는 이번 주에 알게된 2가지 개념입니다.

## Lombok 사용시 주의할 점

Java에서 모델을 다룰 때 lombok 이라는 라이브러리를 사용해서 Getter, Setter를 자동으로 만들어 줄 수 있습니다.
재밌는 점은 이런 메타 프로그래밍 기법을 사용하면 Code Generator 통해서 생성된 코드를 직접 커밋하는 것은 아니라는 점 입니다.
lombok 사용할 때는 주의할 점이 있습니다. 

- `@Setter` 사용 자제하기 
  - 클래스 레벨에서 사용하게 되면 모든 필드들이 언제든지 변경될 수 있는 상태가 됩니다.
  - Setter가 많아지면 작성자의 의도를 드러내기 힘들어 집니다. 
  - constructor나 `@Builder` 통해서 세팅해주는 것이 좋습니다.
- `@AllArgsConstructor` 사용 자제하기
  - `@AllArgsConstructor`는 클래스 내부의 필드들을 위한 constructor를 자동으로 만들어주는 간편한 기능입니다.
  - 필드 순서가 변경되었을 떄 constructor의 필드 순서도 변경될 수 있습니다.
  - 순서가 변경된 필드의 타입이 같은 경우 의도치 않은 동작의 변경이 있을 수 있습니다.
  - `@AllArgsConstructor`를 쓰지말고 직접 constructor를 생성하는 것이 좋습니다.
- `@NoArgsConstructor` 사용하지 않는 방법도 있음
  - Spring 통해서 DTO로 변환시키는 과정에서 `HttpMessageConverter`가 모델로 매핑해주는데요. 
  이럴 떄 깡통 객체를 먼저 생성해두고 해당 필드에 값을 매핑해줍니다. 
  그래서 argument가 없는 constructor가 필요하게 되고 `@NoArgsConstructor`를 사용하게 됩니다.
  - 이럴 때 매핑이 필요한 필드가 들어있는 constructor를 직접 구현하고 `@JsonCreator`를 붙여주면 `HttpMessageConverter`가 해당 constructor를 사용하게 됩니다.

## 마커 인터페이스 패턴

아샬님의 강의에서는 `mockito` 통해서 테스트를 위한 의존 객체를 mocking 하는 방식을 사용합니다.
하지만 이 방식이 번거롭기도 하고, 모든 경우의 수에 mocking을 할 것 인가? 라는 고민이 한가지 있었고,
테스트에서 input - output을 다 정의해 두더라도 미래에 언제든지 해당 클래스의 스펙이 변경될 수 있으니까 유지보수하기 어려운 테스트 코드라는 생각을 했습니다.
그래서 새로 작성하는 테스트 코드에서는 mocking을 쓰지 않고 작업을 하고 있습니다.
Repository도 테스트 코드에서 사용할 것을 직접 구현해서 주입해줬습니다.
그런데 흥미롭게도 아래와 같은 코드를 제안해주셨습니다.

```diff
- public class InMemoryUserRepository implements UserRepository {
+ public class InMemoryUserRepository implements UserRepository, TestOnly {
```

`TestOnly`는 아무런 구현도 제약하고 있지 않는 interface 입니다.
단지 어떤 클래스가 테스트 코드에서만 사용되는 것을 드러내는 장치입니다.
기존에는 추상화된 객체에 method 호출이 필요할 때 interface 를 사용한다고만 생각했던 것 같습니다. 
어떤 객체의 의도를 드러낸다는 접근이 신선하게 느껴졌어요.
앞으로도 유용하게 쓸 것 같습니다.

