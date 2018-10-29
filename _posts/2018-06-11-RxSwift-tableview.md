---
layout: post
title:  "RxDataSource 예제를 보며 RxSwift 익히기"
date:   2018-06-11 00:00:00 +0000
categories: swift
---

## RxSwift 개념잡기

* 목표: table view form library를 rx스럽게 작성하기

## 예제
### RxSwift
RxSwift 프로젝트에 포함된 예제를 먼저 살펴보자
### SimpleTableViewExampleViewController
```swift
tableView.rx
    .modelSelected(String.self)
    .subscribe(onNext:  { value in
        DefaultWireframe.presentAlert("Tapped `\(value)`")
    })
    .disposed(by: disposeBag)

tableView.rx
    .itemAccessoryButtonTapped
    .subscribe(onNext: { indexPath in
        DefaultWireframe.presentAlert("Tapped Detail @ \(indexPath.section),\(indexPath.row)")
    })
    .disposed(by: disposeBag)

```
##### 배울점
1. `modelSelected`는 있는 줄 몰라서 못썼던 부분이다.
itemSelected 말고 modelSelected를 바로 사용해서 선택된 모델을 더 손쉽게 가져올 수 있겠다.
2. `itemAccessoryButtonTapped` cell 안의 요소들의 상태 변화를 이것처럼 가져올 수 있으면 좋겠다.
switch on/off를 내가 작성할 때는 configure() 에서 해주게 되어서 코드가 분리되어 보인다.

### SimpleTableViewExampleSectionedViewController
```swift
{
  tableView.rx
    .itemSelected
    .map { indexPath in
        return (indexPath, dataSource[indexPath])
    }
    .subscribe(onNext: { pair in
        DefaultWireframe.presentAlert("Tapped `\(pair.1)` @ \(pair.0)")
    })
    .disposed(by: disposeBag)

    tableView.rx
      .setDelegate(self)
      .disposed(by: disposeBag)
}

// to prevent swipe to delete behavior
func tableView(_ tableView: UITableView, editingStyleForRowAt indexPath: IndexPath) -> UITableViewCellEditingStyle {
  return .none
}

func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
  return 40
}

```
##### 배울점
1. `itemSelected`를 바로 사용하지 않고 한번 더 `map` 해서 가공
2. `setDelegate`를 통해서 table view의 delegate를 사용한다. 딱히 뾰쪽한 수는 없나보다.


### rx_tap on UIButton of UITableViewCell
https://github.com/ReactiveX/RxSwift/issues/288
```swift
class TableViewCell: UITableViewCell {
    var disposeBag = DisposeBag()
    let subject = PublishSubject<Void>()

    override func prepareForReuse() {
        disposeBag = DisposeBag()
    }

   @IBAction onSomeTableViewCellViewAction(_ sender: AnyObject){
        subject.onNext(())
    }
}

// then when you dequeue for reuse from the UITableViewDataSource
let item = tableView.dequeue...
item.subject
    .asObservable()
    .subscribe(onNext: {...})
    // put it in the items disposeBag so when it's reused it will be cleared
    .disposed(by: item.disposeBag)
```
##### 배울점
1. 기존 방법과 같이 `prepareForReuse` 호출될 때 disposeBag 갱신해주면 됨
2. 다만 `PublishSubject`를 protocol이나 다른 요소로 통일해서 tableview bind 하는 부분에서 같이 처리해줄 수 있으면 좋겠다.
3. SimpleTableViewExampleViewController의 2번 배울점에서 나온 것 처럼 tableview.rx.itemChanged() 같이 받을 수 있으면 좋겠다. 내용을 보면 delegate 를 rx로 받을 수 있게 한번 래핑한 것처럼 보이는데, cell에 적용할 수 있는 방법을 생각해보자. delegate proxy

#### RxSimpleDataSource
```swift
// MARK: - Reactive Extensions
extension Reactive where Base: PersonCell {
    var tappedButton: Observable<Bool> {
        guard let cellType = base.cellType else { return .never() }

        return base.btnActive
                .rx.tap
                .map { !cellType.isActive }
    }
}

private func setupDataSource(dataSource: TableViewSectionedDataSource<PeopleViewModel.Section>,
                             tableView: UITableView,
                             indexPath: IndexPath,
                             cellType: PersonCell.CellType) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: "PersonCell", for: indexPath) as? PersonCell ?? PersonCell()
    cell.configureWith(cellType: cellType)

    cell.rx.tappedButton
        .map { (cellType.person, $0) }
        .bind(to: viewModel.inputs.switchedPerson)
        .disposed(by: cell.disposeBag)

    return cell
}
```


```swift
// PeopleViewModel.swift
sections = Observable
    .combineLatest(people, switchedPerson.startWith(nil)) { ($0, $1?.0, $1?.1) }
    .map { people, switchedPerson, switchedState -> [Section] in
        let cells = people.map { person -> PersonCell.CellType in
            guard let switchedState = switchedState,
                  let switchedPerson = switchedPerson,
                  person == switchedPerson else {
                return .inactive(person)
            }

            return switchedState ? .active(switchedPerson) : .inactive(switchedPerson)
        }

        return [Section(model: "", items: cells)]
    }
    .asDriver(onErrorJustReturn: [])

```

##### 배울점
1. `Reactive`에 `extension`으로 확장하여 사용하는 부분에서 cell.rx 로 좀 더 명확하게 observable인 것을 알 수 있다.
2. data source를 만들어 주는 부분에서 bind를 통해서 delegate 패턴으로 구현하는 대신, 스트림을 연결해주는 것을 볼 수 있다. 연결된 스트림은 `combineLatest`로 section과 한 곳에 묶여서 상태값을 변환해 줄 수 있다.
3. 2번과 같이하면 한계가 있는데, 지금까지 변해온 상태값이 쌓이지 않는다는 것이다. 코드를 실행해보면 선택된 셀에 대해 업데이트 되고 나머지 셀은 다시 해제됨을 알 수 있다.
4. `combineLatest` 사용했기 때문에 people에 해당하는 값이 바뀔 때 바로 반영할 수 있다.
5. sections에 대한 Observable만 만들어두고, tableview에 bind 할 때는 이것을 가져다가 쓰면 되기 때문에 코드를 좀 더 분리할 수 있어보인다. 어쩌면 코드를 봐야하는 위치가 두곳으로 분리되기 때문에 단점이라고 볼 수 도 있겠다.

#### RxDataSource
```swift
Observable.of(addCommand, deleteCommand, movedCommand)
    .merge()
    .scan(initialState) { (state: SectionedTableViewState, command: TableViewEditingCommand) -> SectionedTableViewState in
        return state.execute(command: command)
    }
    .startWith(initialState)
    .map {
        $0.sections
    }
    .share(replay: 1) // replay를 왜 하지...?
    .bind(to: tableView.rx.items(dataSource: dataSource))
    .disposed(by: disposeBag)
```
##### 배울점
1. `merge` 와 `combineLatest` 의 차이를 알아볼 필요가 있겠다.
2. initialState를 `scan`해줌으로 현재까지 진행된 상태값 위에 올릴 수 있게 된다.
3. `scan`을 하는 것은 반응형 프로그래밍의 지향점을 위해서 반드시 사용해야 하는 개념이다. 상태값을 따로 저장하지 않고, 어떤 흐름에서 요청하던지 같은 결과값을 내어줄 수 있어야하기 때문이다.
