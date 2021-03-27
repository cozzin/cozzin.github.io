---
layout: post
title: "Xcode에서 class의 모든 method에 breakpoint 걸기"
date: 2019-10-23 21:55:00 +0900
categories: Xcode
tags:
  - Xcode
---

회사에서 코드를 작성하다 보면 모두지 찾을 수 없는 버그들을 만나기 마련이다. 사방에 함수들이 흩어져 있기 때문에 어떤 함수가 호출되는지 따라갈 수 없는 일도 있다. 그런 코드를 만들지 않기 위해서 역할 분리를 잘 해야겠다는 교훈을 느끼기도 한다. 무튼 지금의 버그를 이겨내야 하니 이 클래스 안에 있는 함수들에 모두 breakpoint를 걸어주자.

```
(lldb) breakpoint set -r '\[ClassName .*\]$'
```

메소드 명에도 걸 수 있다.

```
(lldb) breakpoint set -n ViewDidLoad
```

이 방법으로 Objc 코드에 있던 사이드 이팩트를 발견할 수 있었다. 보통 의심가는 함수에 하나씩 breakpoint를 걸면서 찾아봤는데, 때로는 이렇게 모든 함수에서 디버깅 하는것이 편할 때도 있다.

출처: [http://blog.alwawee.com/2012/07/23/setting-breakpoints-on-all-methods-in-xcode/](http://blog.alwawee.com/2012/07/23/setting-breakpoints-on-all-methods-in-xcode/)
