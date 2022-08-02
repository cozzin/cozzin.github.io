---
layout: post
title: "@WebMvcTest 장단점"
date: 2022-08-02 21:00:00 +0900
categories: Spring
tags:
  - Spring
  - MVC
  - Test
---

코드숨 과제를 보면 @WebMvcTest 어노테이션을 활용해서 테스트하고 있다. 
간편하게 테스트할 수 있는 기능을 제공해주지만 나는 과제를 진행하면서 이 어노테이션을 쓰지 않았다. 
일단 내가 만들고 싶은 테스트 구조에서는 위의 어노테이션이 제대로 작동하지 않았기 때문에 쓸 수 없었다.

## Nested Test에서 사용 불가능

Spring 5.3 부터 Nested Test에서 사용 가능하게 되었다고 한다. 
과제 프로젝트의 환경은 Spring-core:5.2.10 을 사용하고 있어서 여기서 테스트 해보진 못했다.
작업 중인 프로젝트에서는 구조화된 테스트를 작성할지 WebMvcTest를 사용할지 둘 중 하나를 선택해야하는 상황이다.

[Spring에 PR 올라와있는걸 보면](https://github.com/spring-projects/spring-boot/issues/12470#issuecomment-717410503) `searchEnclosingClass()` 이라는 것을 구현해서 테스트 가능하게 만들었다고 한다.
구체적인 코드를 이해해보고 싶었는데, 맥락을 몰라서 그런지 이해하기가 굉장히 어렵다… 🥲 
대략 이해한 내용은 Nested 테스트 상황을 고려해서 Root 클래스의 Context도 고려하는 방식으로 바뀐 것 같다.

## WebMvcTest의 장점

구조화된 테스트를 작성하지 않는다고 가정하고 한번 탐구해보자. WebMvcTest를 사람들이 사용하는 이유가 있을 것이다.

> If you want to focus only on the web layer and not start a complete ApplicationContext, consider using @WebMvcTest instead.

[spring 문서](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.testing.spring-boot-applications.with-mock-environment)를 보면 `@SpringBootTest`는 스프링 서버를 전부 띄워서 테스트하는 반면,
`@WebMvcTest`는 Web Layer만 테스트할 수 있도록 도와준다고 한다. 그리고 `@WebMvcTest(UserController.class)` 같이 Controller를 직접 지정하면 필요한 Context만 생성하게 된다.
`@SpringBootTest` 보다는 좀 더 빠르다는 느낌을 받았다.

[Auto-configured Spring MVC Tests](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.testing.spring-boot-applications.spring-mvc-tests) 자동으로 의존하는 컴포넌트들을 주입해주는 것도 장점이라고 한다.
의존성을 하나하나 지정해주는 것을 나는 선호하지만, 이런 컴포넌트들이 굉장히 많아졌을 때 유연하게 대처할 수 있을 것 같다.

## WebMvcTest의 한계

- 완전한 통합 테스트가 필요할 떄가 있다 [그럴 때는 @SpringBootTest를 사용하자](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.testing.spring-boot-applications.with-running-server)
- 앞서 말한 구조화된 테스트를 작성하기 어렵다
- `@SpringBootTest` 보다는 빠르다고 하지만 유닛 테스트에 비하면 여전히 느린듯 하다.

## 의문

- Controller에 필요한 의존성은 ApplicationContext 통해서 생성하고, @BeforeEach 에서 직접 Controller를 참조해줄 수 없을까?
