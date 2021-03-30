---
layout: post
title: "Swift 객체 외부에서 객체가 해제되는 것 감지하기"
date: 2021-03-30 12:25:00 +0900
---

iOS 앱 개발하면서 `NotificationCenter`를 많이 사용하게 되는데요. 특정 객체의 행동을 추척할 때 유용하게 쓸 수 있습니다. `addObserver(_:selector:name:object:)`를 사용해서 옵저버를 등록해 둔 경우에는, 해당 객체가 메모리에서 해제될 때 옵저버도 자동으로 함께 삭제됩니다. `removeObserver(_:)`를 호출할 필요가 없는 것이죠.

여기에 예외가 있습니다. `addObserver(forName:object:queue:using:)`를 사용하는 경우에는 직접 `removeObserver(_:)`를 호출해줘야 합니다. 클로저를 넘겨주기 때문에 OS 내부에서 해당 클로저를 강한 참조했을 것으로 추측됩니다. [[removeObserver 문서](https://developer.apple.com/documentation/foundation/notificationcenter/1413994-removeobserver)] 그렇다면 개발자가 실수할 가능성이 있습니다. deinit 때에 `removeObserver(_:)`를 호출해주지 않을 수도 있죠.

이런 동작을 관리해주는 객체를 만들면 어떨까요? 저희 회사 팀에서는 `addObserver(_:selector:name:object:)`의 결과값을 래핑해서 관리해주는 객체를 이미 사용하고 있습니다. 하지만 여전히 `removeObserver(_:)`를 호출해줘야 합니다ㅜ 해당 객체를 감시하고 있다가 필요시 자동으로 `removeObserver(_:)`를 호출해주는 코드를 만들어보겠습니다.

[https://stackoverflow.com/questions/28670796/can-i-hook-when-a-weakly-referenced-object-of-arbitrary-type-is-freed](https://stackoverflow.com/questions/28670796/can-i-hook-when-a-weakly-referenced-object-of-arbitrary-type-is-freed) 스택 오버플로우 내용을 먼저 참고해보겠습니다. `AssociatedObject`를 특정 객체에 정의를 해주면 해당 객체가 메모리에서 해제될 때 `AssociatedObject`도 함께 해제되는 원리를 이용했습니다.

```swift
func addObserver(for key: AnyObject, name: Foundation.Notification.Name, object: Any? = nil, queue: OperationQueue? = OperationQueue.main, using completion: @escaping (Notification) -> Void) {
    // (1) 객체의 주소값 가져오기
    let forKey = describing(key)

    // (2) 객체가 해제되는 것을 감시하는 역할
    let watcher = DeallocWatcher { [unowned self] in
        // (4) 객체가 메모리에서 해제됨
        self.removeObserver(for: forKey) // 토큰을 내부 dictionary에서 제거
    }

    // (3) 객체에 DeallocWatcher를 프로퍼티로 등록해줌
    objc_setAssociatedObject(key, forKey, watcher, .OBJC_ASSOCIATION_RETAIN_NONATOMIC)

    let token = NotificationCenter.default.addObserver(forName: name, object: object, queue: queue) { (noti) in
        completion(noti)
    }

    // 토큰을 내부 dictionary에 저장
}

private func describing(_ objRef: AnyObject) -> String {
    return String(describing: Unmanaged<AnyObject>.passUnretained(objRef).toOpaque())
}
```

다시 한번 과정을 살펴보겠습니다.
(1) 등록을 원하는 객체의 주소값을 가져와서 key로 사용합니다.
(2) 객체가 해제되는 것을 감시하는 Class 하나를 만들어줍니다.
(3) `objc_setAssociatedObject`를 통해서 객체에 동적으로 프로퍼티를 등록해줍니다.
(4) 객체가 메모리에서 해제되면 `DeallocWatcher`의 deinit이 호출됩니다. 그러면 등록된 클로저도 호출됩니다. 클로저가 호출되었을 때 해당 key 값으로 `removeObserver`를 해줍니다.

이런식으로 하면 객체를 상속받거나 수정하지 않고도 객체 외부에서 메모리 해제를 감지할 수 있습니다. 비슷한 원리를 사용해서 다른 곳에서도 활용할 수 있을 것 같습니다. 예제가 조금 어려웠네요ㅎ;; 조금 더 좋은 예제가 있으면 나중에 한번 더 글을 써보려 합니다. 도움이 되었으면 좋겠습니다 🙏🙏
