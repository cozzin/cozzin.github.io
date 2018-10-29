---
layout: post
title:  "Memory Deep Dive"
date:   2018-09-17 00:00:00 +0000
categories: jekyll
---

* memory graph
  * malloc_history
  * leaks
    * strong refrence 확인할 수 있음
  * heap
    * instance의 크기를 알고 싶을 때



* Images
  * 메모리 사용은 파일 사이즈가 아닌, 이미지의 dimesion과 관련이 있다.
    * 2048 x 1536 x 4 bytes pixels => 10MB 메모리 사용
    * Wide format: 8 bytes / pixel
  * 어떻게 적절한 포맷을 선택할 것인가?
    * UIGraphicsBeginImageContextWithOptions 쓰지말고
    * UIGraphicsIamgeRenderer 쓰자
    * iOS 12 에서 이미지에 적합한 포맷을 선택해줌
  * 앱이 백그라운드에 있을 때 여전히 메모리를 사용하고 있음
    * UIApplicationDidEneterBackground / Foreground 노티를 받아서 unload 하고 load 하는 방법
    * viewDidDisapper / viewWillAppear 때 이미지를 unload 하고 load 하는 방법
  * ImageIO
    * downsampling image 를 위해 사용

