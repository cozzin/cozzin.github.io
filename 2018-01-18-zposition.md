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
