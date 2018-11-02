```
import Foundation

enum TestType: String {
    case captureSelf
    case weakSelf
    case nestedWeakSelf
    case nestedWeakStrongSelf
}

class BaseObject {
    
    var title: String?
    var closure: (() -> Void)?
    
    deinit {
        print("\(self) \(self.title ?? "") test deinit")
    }
    
    init(type: TestType) {
        setTitle(type: type)

        switch type {
        case .captureSelf:
            closure = {
                self.setTitle(type: type)
            }
            
        case .weakSelf:
            closure = { [weak self] in
                self?.setTitle(type: type)
            }
            
        case .nestedWeakSelf:
            closure = { [weak self] in
                DispatchQueue.global().async {
                    self?.setTitle(type: type)
                }
            }
            
        case .nestedWeakStrongSelf:
            closure = { [weak self] in
                guard let strongSelf = self else {
                    return
                }

                DispatchQueue.global().asyncAfter(deadline: .now() + 3.0) { [weak strongSelf] in 
                    // strongSelf를 다시한번 weak으로 잡을지 말지는 상황마다 다르다
                    // 현재 클로저 안에서 self를 반드시 사용하고 메모리가 해제되야하는 경우, strongSelf를 바로 사용
                    // 현재 클로저에 진입했을 때 self가 해제되었다면, 클로저를 실행하지 않아도 괜찮은 경우 weak으로 다시 잡아준다
                    // 또는 현재 클로저 바깥에 있는 [weak self] 를 바로 사용해도 좋다
                    strongSelf?.setTitle(type: type)
                }
            }
        }
    }
    
    func setTitle(type: TestType) {
        title = type.rawValue
    }
}

BaseObject(type: .captureSelf) // 메모리에서 해제되지 않는다
BaseObject(type: .weakSelf)
BaseObject(type: .nestedWeakSelf)

var nestedWeakStrongSelf: BaseObject? = BaseObject(type: .nestedWeakStrongSelf)
nestedWeakStrongSelf?.closure?()
nestedWeakStrongSelf = nil
```