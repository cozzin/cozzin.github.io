---
layout: post
title:  "Stack View subview hidden시 constraints 문제"
date:   2018-06-19 00:00:00 +0900
categories: swift
---

## Stack View subview hidden시 constraints 문제

stack view에 두 개의 label이 있고 spacing을 설정한 상태에서
하나의 label을 hidden 하게 되었을 때 constraints 가 깨졌다는 문구를 볼 수 있다.

hidden 시키면 stack view가 친절하게 모든 constraints를 설정해주는 줄 알았는데
spacing이 0 이상으로 설정되어 있으면 constraints를 어떻게 변경해줘야 하는지 모호해지는 듯 하다.

이를 해결하기 위한 몇가지 방법이 있다.

1. stack view에서 해당 view를 제거한다.
아주 난폭한 방법인듯 하다. 해결이 되긴 할 것이다.

2. spacing을 0으로 바꿔준다.
간편하긴 하지만 상태가 변했을 때 수동으로 바꿔줘야 한다는 단점이 있다.

3. constraints priority 변경
bottom에 해당하는 priority를 변경해줘서 해결한다.

https://stackoverflow.com/a/38237833/5761092
