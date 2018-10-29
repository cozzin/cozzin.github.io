---
layout: post
title:  "iOS 메모리 관리"
date:   2017-12-29 00:00:00 +0000
categories: swift
---

## 1. 레퍼런스 카운트
### 기본 개념
* 참조하고 있는 객체의 카운트를 1 올려준다. (retain: 보존하다)
* 더 이상 사용하지 않으면 카운트를 1 내려준다. (release)
* 카운트가 0이 되면 객체가 해제된다. (dealloc)

### 자동 해제
#### NSAutoreleasePool
* 다양한 객체의 메모리를 하나하나 관리하기 어렵다.
* autorelease 메세지를 보내두면, pool이 release될 때 등록된 인스터들 모두에게 release 메세지를 전달하게 된다.
* retain 횟수와 autorelease 횟수가 동일해야 문제가 발생하지 않는다.
* pool 자체에 autorelease를 보내면 안된다. 비정상 종료된다.
```objc
while(...) {
  id pool = [[NSAutoreleasePool alloc] init];
  // 여기서 작업 수행
  [pool release];
}
```

### 이벤트 풀
* Cocoa의 GUI 이벤트 관리는 NSApplication 이라는 클래스가 이벤트 루프를 관리.
* 각 루프 마다 autoreleasePool을 만들고 루프가 종료되면 해제함.
* Cocoa의 GUI를 사용해서 개발할 때는 자동 해제 신경쓰지 않아도 됨.

### 오너쉽 정책
* 자연스럽게 인스턴스 객체의 오너와 해제에 대한 이슈가 발생
#### 객체의 오너가 되는 경우
* alloc...을 사용한 인스턴스 생성
* copy...를 사용한 인스턴스의 복사: 메세지를 보낸 객체가 복사된 인스턴스의 오너
* retain을 사용한 보존

```objc
- (void)setMyValue:(id)obj{
  [obj retain];
  [myValue release];
  myValue = obj;
}
```
* 위의 예제에서 retain 하는 순서가 중요
* obj와 myValue가 동일한 객체 참조하고 있다면 release를 먼저하면 객체가 해제될 수 있음

### 보존의 순환 - Retain cycle
```objc
id A = [[MyClass alloc] init];
id B = [[MyClass alloc] init];
[A setMyValue: B];
[B setMyValue: A];
[A release];
[B release];
```
* release 하더라도 여전히 retain count가 1

```Objc
- (void)dealloc {
  [myValue release];
  [super dealloc];
}
```
* dealloc 내부에서 release 하면 무한 루프에 빠짐

### 해제되지 않는 인스턴스
* retain, release를 오버라이드 해서 아무것도 하지 않도록 함
* retainCount를 오버라이드 해서 UNIT_MAX를 리턴하게 함
* 일반적인 프로그래밍에서 직접 구현하는 경우는 없음
* NSApplication, 컬러 패널, 프론트 패널 등... singleton으로 사용됨
* shared로 시작하는 클래스 메소드가 공유되는 유일한 인스턴스를 리턴

## 2. ARC
```objc
- (instancetype)retain OBJC_ARC_UNAVAILABLE;
- (oneway void)release OBJC_ARC_UNAVAILABLE;
- (instancetype)autorelease OBJC_ARC_UNAVAILABLE;
- (NSUInteger)retainCount OBJC_ARC_UNAVAILABLE;
- (struct _NSZone *)zone OBJC_ARC_UNAVAILABLE;
```

Objc는 ARC가 적용된 이후엔 struct 내부에 클래스 타입을 사용하지 못하도록 금지
```objc
typedef struct ImageNames {
  NSString *normalImageName;
  NSString *selectedImageName;
} sImageNames;
```
출처: http://minsone.github.io/mac/ios/how-to-use-struct-with-arc-in-objective-c

### autoreleasepool 블록
* 블록 내에 생성된 모든 객체는 오토릴리스 됨
* 블록이 종료될 때 자동으로 파괴 됨
```objc
for (i = 0; i < n; ++i){
  @autoreleasepool{
    ... // 여기서 많은 수의 임시 객체를 처리한다.
  }
}
```
### @property 지정 옵션
#### 메서드명 지정
* `getter = 게터명`
* `setter = 세터명`

#### 읽기/쓰기 속성
* `readonly`: 읽기 전용
* `readwrite`: 읽기/쓰기 가능(기본 값)

### 프로퍼티 속성(값 설정 방법)
* `assign`: deallocated 되면 nil이 대입되지 않음. 참조할 시 dangling pointer.(기본값)
* `retain`: 새로운 객체를 대입하면 무조건 retain 됨. 순환 참조 발생하면 메모리 해제 불가능.(기본값)
* `unsafe_unretained`: (ARC용) `assign`과 동일. iOS 4 이하에 사용.
* `weak`: (ARC용) deallocated 되면 자동으로 nil이 대입됨. nil이 대입된다는 점에서 `assign`과 다름. 순환 참조를 막기 위해 delegate들에는 weak을 사용.
* `strong`: (ARC용) `retain`과 동일
* `copy`: 복제를 만들어서 설정. 프로퍼티 클래스가 NSCopying 채용하고 copy 메서드 이용할 수 있느때만 사용가능.

https://www.letmecompile.com/arc-관련-키워드-사용법/
https://soulpark.wordpress.com/2013/04/03/ios-automatic-reference-counting-arc/
https://stackoverflow.com/questions/9859719/objective-c-declared-property-attributes-nonatomic-copy-strong-weak
https://www.raywenderlich.com/5677/beginning-arc-in-ios-5-part-1

## 3. Copy
* copy와 mutableCopy 메서드


## 4. Atomic
