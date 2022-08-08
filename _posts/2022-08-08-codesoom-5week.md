---
layout: post
title: "[코드숨] 스프링 5주차 회고 - 유효성 검사"
date: 2022-08-08 21:00:00 +0900
categories: Spring
tags:
  - Spring
  - Validation
---

이번 주는 시간을 충분히 사용하지 못해서 아쉽지만, 아쉬운대로 회고하고 기록을 남겨본다.

## 유효성 검사

이번 주 주제는 유효성 검사였다. 앱 개발할 때 적절한 View를 터치했는지, 적절한 정보를 전달했는지 확인하는 것과 비슷하다.
API 서버는 Request가 적절한 양식으로 입력되었는지 확인해야 한다. `spring-boot-starter-validation` 지루할 수 있는 이 과정을 간편하게 처리해준다.

Controller 외부에서 전달받은 DTO가 적절한 양식인지 확인해주는데, 유효성을 검사하고 싶은 필드에 어노테이션을 지정하면 된다.
아래는 https://spring.io/guides/gs/validating-form-input/ 예제를 빌려왔다.

```java
public class PersonForm {

	@NotNull
	@Size(min=2, max=30)
	private String name;

	@NotNull
	@Min(18)
	private Integer age;
}
```

그런데 유효성 검사를 아무때나 해주는건 아니다. Controller의 파라미터에 `@Valid` 라는 어노테이션을 지정해두면 Spring이 Controller에 파라미터를 전달할 떄 유효성을 먼저 검사한다.
유효하지 않은 모델이라면 [MethodArgumentNotValidException](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/MethodArgumentNotValidException.html) 예외를 던진다.

```java
@Controller
public class WebController implements WebMvcConfigurer {
	@PostMapping("/")
	public String checkPersonInfo(@Valid PersonForm personForm, BindingResult bindingResult) {

		if (bindingResult.hasErrors()) {
			return "form";
		}

		return "redirect:/results";
	}
}
```

## iOS 개발에도 도움이 될 것 같다

유효성 검사를 위한 귀찮은 작업을 줄여줘서 너무 좋다. 스프링에서 이렇게 좋은 기술을 발견하면 iOS 개발에도 어떻게 하면 가져올 수 있을까 고민이 된다.
Swift에는 어노테이션과 동일한 것은 아니지만 [약간 비슷한 방식으로 argument에 property wrapper를 적용할 수 있다](https://www.swiftbysundell.com/tips/attaching-property-wrappers-to-function-arguments/).
유효성 검사를 위한 기능을 만들 때 이런 아이디어를 실험해보면 좋겠다.

요즘은 SDK 개발을 하는데 앱 개발 입장에서는 SDK도 일종의 서버가 된다. 그래서 그런지 차용해올 아이디어가 꽤 있는 것 같다.
다른 플랫폼의 기술을 배우는건 시야를 넓혀주는 좋은 방법이라 생각한다.

## 일정

아쉽지만 다른 일정 때문에 이번 주는 과제 해결하는데 3일 정도만 사용할 수 있었다. 
시간을 더 효율적으로 사용하는 방법을 배워야 겠다. 사이드 프로젝트로 진행하고 있는 타이머 앱의 필요성을 한번 더 느꼈다.
하고 싶은건 많고 시간은 부족한 사람들이 많지 않을까?
아무튼 다음 주도 시간이 넉넉하진 않다. 지치지 않고 계속 학습할 방법을 찾아가야겠다.
