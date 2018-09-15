---
layout: post
title:  "jekyll 테마 적용하기"
date:   2018-08-30 00:00:00 +0900
categories: jekyll
---
### 테마 고르기
개발 과정에 대한 기록을 하지 않다보니 어떤 문제를 해결하려 했고, 발견한 것은 무엇인지 제대로 정리가 되지 않는 느낌을 받았다. 이미 사용중인 github pages가 있어서 테마를 조금 바꿔서 활용해보고 싶다는 생각이 들었다. 테마를 바꾸는 이유는 다음과 같다.

* 블로그 내 글을 검색할 수 있으면 좋겠다
* 글 목록을 자동으로 리스팅 해주면 좋겠다
* 어두운 계열의 색상이면 좋겠다

맘에 드는 테마가 생각보다 별로 없고, 위의 조건에 맞는 것이 하나 있었다. https://github.com/mmistakes/jekyll-theme-basically-basic#skin 그래서 기존에 사용하던 github pages를 어떻게 바꿀 수 있을지 들어가보니 커스터마이징 할 수 있는 폴더 구조가 되어 있지 않았다. 제일 기본 형태라서 그렇게 되어 있는지도 모르겠다. 그래서 jekyll를 설치해서 폴더 구조 부터 잡아보기로 했다.

### jekyll 설치하기

이렇게 친절하게 정리할 수 있을까 싶을 정도로 잘 정리된 글이 있어서 설치는 어렵지 않게 할 수 있었다. https://nolboo.kim/blog/2013/10/15/free-blog-with-github-jekyll/  

다만 jekyll 을 통해서 프로젝트를 생성하고 나서 `jekyll serve --watch` 를 통해서 로컬에서 블로그를 확인하려 했는데 잘 되지 않아서 조금 검색을 해봐야했다. 

```bash
$ jekyll serve  --watch
/System/Library/Frameworks/Ruby.framework/Versions/2.3/usr/lib/ruby/2.3.0/rubygems/core_ext/kernel_require.rb:55:in `require': cannot load such file -- bundler (LoadError)
	from /System/Library/Frameworks/Ruby.framework/Versions/2.3/usr/lib/ruby/2.3.0/rubygems/core_ext/kernel_require.rb:55:in `require'
	from /Library/Ruby/Gems/2.3.0/gems/jekyll-3.8.3/lib/jekyll/plugin_manager.rb:48:in `require_from_bundler'
	from /Library/Ruby/Gems/2.3.0/gems/jekyll-3.8.3/exe/jekyll:11:in `<top (required)>'
	from /usr/local/bin/jekyll:22:in `load'
	from /usr/local/bin/jekyll:22:in `<main>'
```

이런 에러가 뜬다면 아래의 답변이 도움이 될 것이다.

https://github.com/jekyll/jekyll/issues/5165#issuecomment-236341627 

```bash
$ gem install bundler
$ bundle install
$ bundle exec jekyll serve
```

### 테마 변경하기 

이제 기본 테마에서 내가 원하는 테마로 바꿔보자

https://github.com/mmistakes/jekyll-theme-basically-basic#installation

iOS에서 cocoapods를 통해서 라이브러리를 불러오듯이 아주 간편하게 불러올 수 있었다.

다시 한번 `$ bundle exec jekyll serve` 를 통해 테마가 제대로 적용되었는지 한번 체크해보면 된다.

#### 검색

https://github.com/mmistakes/jekyll-theme-basically-basic#search

`_config.yml` 파일에서 `search: true` 를 적어주고 다시 로컬에서 확인해보면 우상단에 검색 버튼이 생긴것을 확인할 수 있다

#### 어두운 화면

https://github.com/mmistakes/jekyll-theme-basically-basic#skin

[`/_data/theme.yml`](https://github.com/mmistakes/jekyll-theme-basically-basic/blob/master/_data/theme.yml) 을 찾아가서 `skin: night` 로 바꿔주면 된다고 하는데 _data 폴더를 찾을 수 없어서 직접만들어 줬다.

#### 글 목록 

글 목록은 posts 폴더 안에 형식을 맞춰 적으면 날짜별로 구분해준다. `/_posts/yyyy-MM-dd-제목을-써보자.md` 
