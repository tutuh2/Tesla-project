# NestJS로 Tesla웹사이트 백엔드 구성

> NestJS에 있는 기능으로 Tesla 웹사이트의 백엔드단 구현. 추가적으로 네이버,카카오,구글 소셜 로그인 기능도 구현.

## 배포 주소

[https://backendapi.tutuh2.shop/graphql](https://backendapi.tutuh2.shop/graphql)

배포는 아직 완료하지 못해서 일단 수업시간에 한걸로 올려져있습니다.

## 기술 스택

- Javascript
- Typescript
- docker
- GraphQL
- NestJS
- ELK stack
- NodeJS
- TypeORM
- MySQL

## ERD 설계

![](https://storage.googleapis.com/thumb-codecamp-storage13/%E1%84%90%E1%85%A6%E1%84%89%E1%85%B3%E1%86%AF%E1%84%85%E1%85%A1%20ERD%20%E1%84%80%E1%85%A2%E1%84%8C%E1%85%A9.png)

## 파이프라인

![](https://storage.googleapis.com/thumb-codecamp-storage13/%E1%84%91%E1%85%A1%E1%84%8B%E1%85%B5%E1%84%91%E1%85%B3%E1%84%85%E1%85%A1%E1%84%8B%E1%85%B5%E1%86%AB.png)

## API 설계

- 회원 가입 (기본 가입, 네이버, 카카오, 구글 가입)
- 로그인 & 소셜 로그인
- 상품, 차량 등록
- 상품 검색
- 결제
- 파일 업로드

## 프로젝트 설치 & 실행 방법

```sh
1. git clone
2. 완료 후 backend파일 터미널에서 docker-compose build
3. 빌드 완료 후 docker-compose up
4. localhost:3000/graphql 에서 확인
```

## 폴더 구조

.
├── backend

│ ├── Dockerfile

│ ├── README.md

│ ├── docker-compose.yaml

│ ├── elk

│ │ ├── elasticsearch

│ │ ├── kibana

│ │ └── logstash

│ │ ├── logstash.conf

│ │ ├── mysql-connector-java-8.0.28.jar

│ │ └── test_template.json

│ ├── gcp-file-storage.json

│ ├── nest-cli.json

│ ├── package-lock.json

│ ├── package.json

│ ├── src

│ │ ├── apis

│ │ │ ├── auth

│ │ │ │ ├── auth.controller.ts

│ │ │ │ ├── auth.module.ts

│ │ │ │ ├── auth.resolver.ts

│ │ │ │ └── auth.service.ts

│ │ │ ├── booking

│ │ │ │ ├── booking.module.ts

│ │ │ │ └── entities

│ │ │ │ └── booking.entity.ts

│ │ │ ├── cart

│ │ │ │ ├── cart.module.ts

│ │ │ │ ├── cart.resolver.ts

│ │ │ │ ├── cart.service.ts

│ │ │ │ ├── dto

│ │ │ │ │ └── cart.input.ts

│ │ │ │ └── entities

│ │ │ │ └── cart.entity.ts

│ │ │ ├── file

│ │ │ │ ├── file.module.ts

│ │ │ │ ├── file.resolver.ts

│ │ │ │ └── file.service.ts

│ │ │ ├── iamport

│ │ │ │ └── iamport.service.ts

│ │ │ ├── mainCategory

│ │ │ │ └── entities

│ │ │ │ └── mainCategory.entity.ts

│ │ │ ├── models

│ │ │ │ ├── dto

│ │ │ │ │ ├── createModel.input.ts

│ │ │ │ │ └── updateModel.input.ts

│ │ │ │ ├── entities

│ │ │ │ │ └── model.entity.ts

│ │ │ │ ├── model.module.ts

│ │ │ │ ├── model.resolver.ts

│ │ │ │ └── model.service.ts

│ │ │ ├── pointTransaction

│ │ │ │ ├── entities

│ │ │ │ │ └── pointTransactino.entity.ts

│ │ │ │ ├── pointTransaction.module.ts

│ │ │ │ ├── pointTransaction.resolver.ts

│ │ │ │ └── pointTransaction.service.ts

│ │ │ ├── product

│ │ │ │ ├── dto

│ │ │ │ │ ├── createProduct.input.ts

│ │ │ │ │ └── updateProduct.input.ts

│ │ │ │ ├── entities

│ │ │ │ │ └── product.entity.ts

│ │ │ │ ├── product.module.ts

│ │ │ │ ├── product.resolver.ts

│ │ │ │ └── product.service.ts

│ │ │ ├── productImages

│ │ │ │ ├── dto

│ │ │ │ │ ├── addProductImages.input.ts

│ │ │ │ │ ├── createProductImages.input.ts

│ │ │ │ │ └── updateProductImages.input.ts

│ │ │ │ ├── entities

│ │ │ │ │ └── productImages.entity.ts

│ │ │ │ ├── productImages.module.ts

│ │ │ │ ├── productImages.resolver.ts

│ │ │ │ └── productImages.service.ts

│ │ │ ├── productTag

│ │ │ │ └── entities

│ │ │ │ └── productTag.entity.ts

│ │ │ ├── subCategory

│ │ │ │ └── entities

│ │ │ │ └── subCategory.entity.ts

│ │ │ └── users

│ │ │ ├── dto

│ │ │ ├── entities

│ │ │ │ └── user.entity.ts

│ │ │ ├── user.module.ts

│ │ │ ├── user.resolver.ts

│ │ │ └── user.service.ts

│ │ ├── app.module.ts

│ │ ├── commons

│ │ │ ├── auth

│ │ │ │ ├── gql-auth.guard.ts

│ │ │ │ ├── gql-user.param.ts

│ │ │ │ ├── jwt-access.strategy.ts

│ │ │ │ ├── jwt-refresh.strategy.ts

│ │ │ │ ├── jwt-social-google.strategy.ts

│ │ │ │ ├── jwt-social-kakao.strategy.ts

│ │ │ │ └── jwt-social-naver.strategy.ts

│ │ │ ├── filter

│ │ │ │ └── http-exception.filter.ts

│ │ │ └── graphql

│ │ │ └── schema.gql

│ │ └── main.ts

│ ├── test

│ │ ├── app.e2e-spec.ts

│ │ └── jest-e2e.json

│ ├── tsconfig.build.json

│ ├── tsconfig.json

│ ├── yarn-error.log

│ └── yarn.lock

├── frontend

│ ├── img

│ │ ├── back-ground.jpg

│ │ ├── facebook.png

│ │ ├── google.png

│ │ ├── kakao.png

│ │ ├── menu-back-ground.jpg

│ │ ├── naver.png

│ │ ├── starbucks.png

│ │ └── user-back-ground.jpg

│ ├── login

│ │ ├── index.css

│ │ └── index.html

│ └── payment.html

├── functions

│ ├── generateThumbnail.js

│ └── package.json

└── 검색 파이프라인.jpg

## .env 설정

```sh
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
KAKAO_CLIENT_ID
NAVER_CLIENT_ID
NAVER_CLIENT_SECRET
```
