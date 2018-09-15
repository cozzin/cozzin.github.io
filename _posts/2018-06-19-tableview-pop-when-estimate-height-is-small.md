---
layout: post
title:  "estimated height가 작을 때 table view가 튀어오르는 현상"
date:   2018-06-19 00:00:00 +0900
categories: swift
---

table view에서 estimated height가 row height 보다 작은 경우 `reloadData()` 할 때 스크롤이 튀어오르는 문제가 있다.
scroll offset을 기억해서 조정하는 방법도 있는 듯하지만 근본적인 문제를 해결하는 방법이 아닌것 같아서 다른 방법을 한동안 찾아봤다.

제일 처음 table view를 그려줄 때는 이상 없고, reload 될 때부터 문제가 발생한다.
그렇다면 cell 이 화면에 그려진 높이를 저장하고, 다음 업데이트 될때 estimated height로 사용하면 table view가 튀어오르는 현상을 해결할 수 있겠다.

```swift
var cellHeightsDictionary: [IndexPath: CGFloat] = [:]


func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
    cellHeightsDictionary[indexPath] = cell.frame.size.height
}

func tableView(_ tableView: UITableView, estimatedHeightForRowAt indexPath: IndexPath) -> CGFloat {
    return cellHeightsDictionary[indexPath] ?? UITableViewAutomaticDimension
}
```

[https://stackoverflow.com/a/49254704/5761092](https://stackoverflow.com/a/49254704/5761092)
