---
layout: post
title:  "CocoaPods 꿀팁"
date:   2018-08-30 00:00:00 +0000
categories: cocoapods
---
### CocoaPods warning 제거하기 ⚠️
#### 1. inhibit_warnings 옵션 적용하기
iOS 프로젝트에 오픈소스를 간편하게 가져올 수 있도록 도와주는 cocoapods를 사용하다 보면 warning이 많이 발생하는 것을 볼 수 있다.
내가 작성한 코드도 아닌데 warning이 이렇게나 많이 뜨는것은 좀 억울하다는 생각이 들었다.

때마침 [Xcode 에서 Pod 프로젝트의 경고 표시 없애기](https://code.iamseapy.com/archives/174) 링크가 보이길래 적용해보았다.
경고를 무시하고 싶은 pod 파일 뒤에 `:inhibit_warnings => true`를 명시 하면 된다는 것이다.
```
pod 'Alamofire', '~> 4.5', :inhibit_warnings => true
```

마침 `FBSDKLoginKit`에서 warning이 발생하고 있어서 바로 적용해봤다.
음... 잘된다.
하지만 새로운 pod이 추가될 때 마다 같은 문구를 반복해서 달아줘야 한다는 것은 아주 귀찮은 일이다.

#### 2. 모든 pod에 inhibit_warnings 옵션 적용하기

다들 개발자들도 귀찮은 것을 싫어하지 않을까? 싶어서 검색해봤다. 
https://github.com/ClintJang/cocoapods-tips
```
inhibit_all_warnings!
```
앞으로 pod이 새롭게 추가되어도 pod 설치시에 위의 스크립트가 돌면서 warning을 만나지 않게 되었다. 🎉

## 타겟별 공통으로 사용되는 pod 파일 묶어주기
이건 조금 다른 이슈인데, `FBSDKLoginKit` 에서 사용하는 코드가 AppExtension 에서는 작동하지 않는다는 것을 알게되었다.
```objc
UIViewController *vc = [UIApplication sharedApplication].keyWindow.rootViewController.presentedViewController;
// FBLogin 'sharedApplication' is unavailable: not available on iOS (App Extension) - Use view controller based solutions where appropriate instead.
```

타겟별로 분리하지 않았기 때문에 이런 이슈가 발생했다.
그렇다고 해서 이렇게 무식하게 하나만 빼고 전부 복붙을 할 수는 없는 노릇이다.
```
target 'sieum' do
  shared_pods
  # Pods for sieum
  pod 'FBSDKLoginKit' # 이것만 다르다
  pod 'SnapKit', '~> 4.0.0'
  pod 'Firebase/Core'
  pod 'Firebase/Database'
  pod 'DBImageColorPicker', '~> 1.0.0'
  pod 'Alamofire', '~> 4.3'
  pod 'SwiftyBeaver'
  pod 'PopupDialog', '~> 0.5'
  pod 'SwiftyJSON'
  pod 'Kingfisher', '~> 4.0'
  pod 'SHSideMenu', '~> 0.0.4'
  pod 'RxDataSources', '~> 3.0'
  pod 'RxTheme', '2.0'
  pod 'Then'
  pod 'ObjectMapper', '~> 3.3'
end

target 'SieumWidget' do
  pod 'SnapKit', '~> 4.0.0'
  pod 'Firebase/Core'
  pod 'Firebase/Database'
  pod 'DBImageColorPicker', '~> 1.0.0'
  pod 'Alamofire', '~> 4.3'
  pod 'SwiftyBeaver'
  pod 'PopupDialog', '~> 0.5'
  pod 'SwiftyJSON'
  pod 'Kingfisher', '~> 4.0'
  pod 'SHSideMenu', '~> 0.0.4'
  pod 'RxDataSources', '~> 3.0'
  pod 'RxTheme', '2.0'
  pod 'Then'
  pod 'ObjectMapper', '~> 3.3'
end
```

그래서 공통으로 쓰이는 부분은 `shared_pods`로 묶고,
특정 타겟에서 필요한 것만 정의해서 쓰는 방법을 사용했다.

```
def shared_pods
  use_frameworks!
  pod 'SnapKit', '~> 4.0.0'
  pod 'Firebase/Core'
  pod 'Firebase/Database'
  pod 'DBImageColorPicker', '~> 1.0.0'
  pod 'Alamofire', '~> 4.3'
  pod 'SwiftyBeaver'
  pod 'PopupDialog', '~> 0.5'
  pod 'SwiftyJSON'
  pod 'Kingfisher', '~> 4.0'
  pod 'SHSideMenu', '~> 0.0.4'
  pod 'RxDataSources', '~> 3.0'
  pod 'RxTheme', '2.0'
  pod 'Then'
  pod 'ObjectMapper', '~> 3.3'
end

target 'sieum' do
  shared_pods
  # Pods for sieum
  pod 'FBSDKLoginKit'
end

target 'SieumWidget' do
  shared_pods
end
```
완벽하진 않지만 이제야 좀 정리된 것 같다.
