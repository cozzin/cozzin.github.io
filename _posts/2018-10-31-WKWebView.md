## WWDC 영상 정리

web에서 발생하는 복잡한 작업들을 navtive code로 부터 분리해준다.
app과 동시적으로 작동하고 성능의 향상을 가져온다.

### Cookie 관리 방법
웹페이지가 브라우저 엔진에 렌더링 될 때, iamge, js file, css 등 많은 리소스들이 등장한다.


### 컨텐츠 필터링


### Custom Resource 제공


## WKWebView 로딩 실패 시 다시 시도

### reload

didFailProvisionalNavigation delegate가 호출되면 로딩 실패한 것이다. 그러면 그 때 webView를 reload해주면 되지 않을까? 이렇게 말이다.

```swift
func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation, withError error: Swift.Error) {
    // if needsReload
    webView.reload()
}
```

하지만 웹뷰를 최초로 띄웠을 때, 네트워크 오류가 발생하면 reload가 되지 않았다. 그리고 최초로 웹페이지를 띄운 경우가 아니라, 서핑중에 네트워크 오류가 발생하더라도 reload 해주면 전환하려면 페이지가 아니라, 마지막으로 보고 있던 페이지가 다시 로드됨을 알 수 있었다.

### Redirection

didReceiveServerRedirectForProvisionalNavigation

[https://stackoverflow.com/questions/45604336/capture-redirect-url-in-wkwebview-in-ios](https://stackoverflow.com/questions/45604336/capture-redirect-url-in-wkwebview-in-ios)