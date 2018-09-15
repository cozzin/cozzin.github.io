---
layout: post
title:  "Builder 패턴 사용하기"
date:   2018-08-16 00:00:00 +0900
categories: swift
---

## JSONWebToken.swift를 통해서 본 variable 확장하기, builder 패턴 사용하기

`JSONWebToken.swift` readme 파일을 한번 살펴보다가 흥미로운 코드를 발견했다.

### class의 variable을 계속해서 확장하게 만들 수 있을까?

```swift
var claims = ClaimSet()
claims.issuer = "fuller.li"
claims.issuedAt = Date()
claims["custom"] = "Hi"

JWT.encode(claims: claims, algorithm: .hs256("secret".data(using: .utf8)!))
```
`claims["custom"]` 으로 variable을 추가하는 모습을 볼 수 있다.
내부적으로는 class안에 dictionary를 두고 모든 variable을 담아뒀기 떄문에 이렇게 무한대로 확장 가능한 것이다.

```swift 
public struct ClaimSet {
  var claims: [String: Any]

  public init(claims: [String: Any]? = nil) {
    self.claims = claims ?? [:]
  }

  public subscript(key: String) -> Any? {
    get {
      return claims[key]
    }

    set {
      if let newValue = newValue, let date = newValue as? Date {
        claims[key] = date.timeIntervalSince1970
      } else {
        claims[key] = newValue
      }
    }
  }
}
```

`subscript`를 구현했기 때문에 class를 dictionary 처럼 직접적으로 사용할 수 있다.
```swift
extension ClaimSet {
  public var issuer: String? {
    get {
      return claims["iss"] as? String
    }

    set {
      claims["iss"] = newValue
    }
  }

  public var audience: String? {
    get {
      return claims["aud"] as? String
    }

    set {
      claims["aud"] = newValue
    }
  }
}
```
그리고 public 으로 보여지는 변수들도 사실은 dictionary에 담겨 있도록 설계되어 있다.
아주 많은 확장성을 가져야할 때 이렇게 작성하는 방법도 있다는 것을 배울 수 있다.


### 클로저로 Builder 넘겨주기

readme 파일 위의 예제 바로 밑에 또 흥미로운 코드가 있었다.
Builder 패턴을 어떻게 사용하면 좋을까 고민하고 있었는데, 나중에 참고하면 좋을 것 같다.
클로저로 builder를 넘겨주는 방식이다.
사용하는 쪽에서 builder을 init할 필요 없고 클로저 안에서 바로 사용하기만 하면 되기 때문에 간편하고 
코드를 읽을 때에도 주변 코드와 잘 분리될 수 있을 것 같다.

```swift
JWT.encode(.hs256("secret".data(using: .utf8))) { builder in
  builder.issuer = "fuller.li"
  builder.issuedAt = Date()
  builder["custom"] = "Hi"
}
```

내부 구현은 다음과 같다. 여기에서 직접 builder를 생성해서 closure에 담아서 넘겨준다.
사용하는 쪽에서 builder에 원하는 작업을 했을 것이고,
그 builder를 가지고 encode하는 방식이다.

```swift
public func encode(_ algorithm: Algorithm, closure: ((ClaimSetBuilder) -> Void)) -> String {
  let builder = ClaimSetBuilder()
  closure(builder)
  return encode(claims: builder.claims, algorithm: algorithm)
}
```

참고: https://github.com/kylef/JSONWebToken.swift
