## 1. strong을 사용하는 경우
* 내가 정의하는데 중요하다고 참조를 보장해야 하는 경우와 IB에서 아웃렛(IBOutlet)을 연결하는 경우(컨트롤변수, IBOutlet) 메인뷰는 strong을 기본(recommand)으로 잡아준다

ex) XXXAppDelegate.h
```objc
@property (strong, nonatomic) UIWindow *window;
@property (strong, nonatomic) BIDViewController *viewController;
```
ex) XXXViewController.h
```objc
@property (weak, nonatomic) IBOutlet UIView * backView;
```

##2. weak를 사용하는 경우
* 내가 정의하는데 중요하다고 참조 보장할 필요가 없는 경우와 IB에서 아웃렛(IBOutlet)을 연결하는 경우(컨트롤변수,  IBOutlet) 하위뷰는 weak를 기본(recommand)으로 잡아준다
* 보통, delegate는 weak로 지정한다. weak로 사용하는 이유는 이미 참조유지(retain)하고 있을지도 모르는 델리게이트를 실수로 참조 유지하는 일이 없게 하기 위해서다.
* 만일 해당 델리게이트가 객체의 참조를 유지하지 않는다는 사실을 이미 알고 있다고 하더라도
* 코코아 터치에서 사용하는 표준 패턴에서는 델리게이트 참조를 유지하지 않으므로 구태여 다른 방식을 사용할 필요는 없을 것 같다.

ex) XXXViewController.h
```objc
@property (weak, nonatomic) IBOutlet UITextField *nameField;
@property (weak, nonatomic) IBOutlet UILabel *sliderLabel;
@property (weak, nonatomic) IBOutlet UISwitch *leftSwitch;
@property (weak, nonatomic) id delegate;
```

## 3. copy를 사용하는 경우
* 테이블뷰에서 셀을 하위뷰로 잡아서 사용하는 경우, 저장 NSString값의 경우(변경가능성이 있을 때), 값을 안정적으로 보관해서 받을 때
* 보통, NSString이나, NSDictionary처럼 값 기반의 클래스를 다룰 때 사용
* NSNumber, NSArray, NSSet과 같은 immutable 한 클래스에도 적용되는 개념이다.

ex) XXXTableViewCell
```objc
@interface XXXTableViewCell : UITableViewCell
@property (copy, nonatomic) NSString *name;
@property (copy, nonatomic) NSString *color;
@property (copy, nonatomic) NSDictionary *selection;
@end
```

* 컨트롤러에서 각 셀로 값을 넘겨줄 때 사용할 두 속성을 정의할 때, NSString속성을 strong으로 사용해 정의하지 않고 copy를 사용해 정의했다.
* 속성의 세터로 전달된 문자열값은 값을 전달한 코드에서 나중에 값을 수정할 수 있는 NSMutableString이 될 수도 있으므로, 항상 이렇게 NSString값을 정의하는 것이 좋다.
* 속성으로 전달된 각 문자열을 복사하면 세터가 호출된 순간에 문자열에 들어 있는 값을 안정적으로 속성에 보관할 수 있다.

### 보충설명
수정할 수 문자열인 가능성이 있을 때, (수정가능한 하위클래스를 비롯해) 모든 NSString에 대해 copy를 호출하면 항상 수정할 수 없는 복사본이 반환된다. 더불어 성능에 대한 부담도 걱정하지 않아도 된다. 수정할 수 없는 문자열 인스턴스에 대해 copy메세지를 보내면 실제로 복사하 일어나는 것이 아니라 대신 참조 카운트를 증가시킨 후 같은 문자열 객체를 반환한다. 이와같이 copy를 사용하면 객체가 변하지 않을 뿐더러 누구든 문자열 객체를 안심하고 사용할 수 있다.

* 하지만 제대로 이해가 되지 않는다. NSString과 copy에 대한 예시를 다시 한번 보자.

### NSString properties를 strong으로 설정한 경우
```Objc
@interface Book: NSObject
@property (strong, nonatomic) NSString *title;
@end
```

```Objc
- (void)stringExample {
  NSMutableString *bookTitle = [NSMutableString stringWithString:@"Best book ever"];
  Book *book = [[Book alloc] init];
  book.title = bookTitle;
  [bookTitle setString:@"Worst book ever"];
  NSLog(@"book title: %@", book.title); // "book title: Worst book ever"
}
```

### NSString properties를 copy로 설정한 경우
```Objc
@interface Book: NSObject
@property (copy, nonatomic) NSString *title;
@end
```

```Objc
- (void)stringExample {
  NSMutableString *bookTitle = [NSMutableString stringWithString:@"Best book ever"];
  Book *book = [[Book alloc] init];
  book.title = bookTitle;
  [bookTitle setString:@"Worst book ever"];
  NSLog(@"book title: %@", book.title); // "book title: Best book ever"
}
```

출처
* http://funnyrella.blogspot.kr/2013/10/46_31.html
* http://www.ios-blog.co.uk/tutorials/quick-tips/use-copy-for-nsstring-properties/
