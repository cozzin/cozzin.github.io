---
layout: post
title:  "iOS zPosition"
date:   2017-12-26 00:00:00 +0000
categories: swift
---

iOS에서 zPosition을 변경해서 UI로 확인할 때는 뒤에 가있는 것으로 보이는데, 실제로 터치했을 때 우선순위가 여전히 앞서 있어서 뒤에 있는 뷰가 터치되는 현상이 발생했다. zPosition을 변경해서 뒤에 있는 것으로 보이게 할 때는 이러한 오류가 발생할 수 있음을 염두해두고 작업하자. 아래는 플레이그라운드에서 테스트하면서 썼던 예제 코드이다.

```swift
//: Playground - noun: a place where people can play

import Foundation
import UIKit
import PlaygroundSupport

class ContainerView: UIView {

    @objc func onHeaderButton() {
        print("header")
    }

    @objc func onMainButton() {
        print("Main")
    }
}

let containerView = ContainerView(frame: CGRect(x: 0, y: 0, width: 300, height: 600))
containerView.backgroundColor = UIColor.white

let headerButton = UIButton(frame: CGRect(x: 0, y: 0, width: 300, height: 500))
headerButton.backgroundColor = UIColor.green
headerButton.layer.zPosition = -1
headerButton.addTarget(containerView, action: #selector(containerView.onHeaderButton), for: .touchUpInside)

let mainButton = UIButton(frame: CGRect(x: 0, y: 100, width: 300, height: 500))
mainButton.backgroundColor = UIColor.blue
mainButton
mainButton.addTarget(containerView, action: #selector(containerView.onMainButton), for: .touchUpInside)

containerView.addSubview(mainButton)
containerView.addSubview(headerButton)

PlaygroundPage.current.liveView = containerView
PlaygroundPage.current.needsIndefiniteExecution = true
```

