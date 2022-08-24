---
layout: post
title: "AWS EC2 생성하고 Github Repository Clone하기"
date: 2022-08-24 20:00:00 +0900
categories: Spring
tags:
  - Spring
  - AWS
  - EC2
---

오랜만에 AWS에 EC2 서버 띄우려고 합니다.
https://velog.io/@18k7102dy/devops-mono-5, https://velog.io/@18k7102dy/Docker-Spring-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EB%A5%BC-Docker%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%B4%EC%84%9C-%EB%B0%B0%ED%8F%AC%ED%95%B4%EB%B4%85%EC%8B%9C%EB%8B%A4
이 글 보면서 따라갑니다.
위의 글이 더 정확할 수 있습니다. 그래도 미래의 저를 위해서 기록해보겠습니다.

## EC2 instance 생성하기

잊어버린 비밀번호를 찾고ㅋㅋ EC2로 검색해서 들어왔습니다.
EC2 instance 생성 화면이 달라진 것 같아서 캡쳐하면서 진행합니다.

![](/assets/images/2022-08-24-19-20-32.png)

![](/assets/images/2022-08-24-19-21-11.png)

기본 설정과 동일하게 `Amazon Linux` 를 선택

![](/assets/images/2022-08-24-19-25-04.png)

Network settings도 기본으로 둡니다.
혹시 나중에 이슈 생기면 수정할 예정

![](/assets/images/2022-08-24-19-25-45.png)

새로운 key piar 생성하겠습니다.

![](/assets/images/2022-08-24-19-34-16.png)

![](/assets/images/2022-08-24-19-35-40.png)

자동으로 다운되는 pem 파일은 로컬에 잘 보관하기

![](/assets/images/2022-08-24-19-38-03.png)

프리티어는 30GiB까지 무료

![](/assets/images/2022-08-24-19-29-04.png)

일단 이렇게 고고

![](/assets/images/2022-08-24-19-31-27.png)

1초만에 만들어졌다...

![](/assets/images/2022-08-24-19-38-49.png)

## Security Group 설정하기

![](/assets/images/2022-08-24-19-53-41.png)

SSH만 기본적으로 설정된 것을 볼 수 있습니다.
`Edit inbound rules`를 선택해서 HTTP 통신을 위한 80포트도 추가해줍니다.

![](/assets/images/2022-08-24-19-55-42.png)

`Add rule`을 선택합니다.

![](/assets/images/2022-08-24-19-57-10.png)

`HTTP` 선택!

![](/assets/images/2022-08-24-19-57-52.png)

![](/assets/images/2022-08-24-19-58-45.png)

![](/assets/images/2022-08-24-19-59-10.png)

## ssh 접속하기

![](/assets/images/2022-08-24-19-44-14.png)

pem은 public key file인데 실행권한을 줘야합니다.

```bash
chmod 400 ./spring-server-key-pair.pem
```

만약 실행권한이 없으면 아래와 같은 에러를 만나게 됩니다.

```bash
Permission denied (publickey,gssapi-keyex,gssapi-with-mic)
```

권한을 설정해줬으면 아래 명령어를 실행해서 ssh통해서 서버에 접속합니다.

```bash
ssh -i ./spring-server-key-pair.pem ec2-user@<Public-IP>
```

## 서버 환경설정

```
sudo yum update

# git 설치
sudo yum install git

# docker 설치
sudo yum install docker
```

## Server deploy key를 Github Repository에 등록

key 생성

```
ssh-keygen -t rsa
```

key 복사

```
cd .ssh
cat id_rsa.pub
```

Gihub Setting > Deploy keys > Add deploy key

![](/assets/images/2022-08-24-20-06-24.png)

복사해둔 key를 붙여넣고 `Add key` 해주시면 됩니다.

![](/assets/images/2022-08-24-20-07-41.png)

## Server deploy key를 Github Account에 등록

```
ssh-keygen -t rsa -C <your github email>
```

```
cat id_rsa.pub
```

![](/assets/images/2022-08-24-20-11-17.png)

![](/assets/images/2022-08-24-20-13-00.png)

## 서버에 git clone

```
cd ~
git clone <your address of repository (SSH Address)>
```

## 참고자료 
- https://velog.io/@18k7102dy/devops-mono-5
- https://velog.io/@18k7102dy/Docker-Spring-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EB%A5%BC-Docker%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%B4%EC%84%9C-%EB%B0%B0%ED%8F%AC%ED%95%B4%EB%B4%85%EC%8B%9C%EB%8B%A4
