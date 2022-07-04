# ErrorNote
2022-1 고급웹프로그래밍과제 제출물 ErrorNote

# 사용한 프레임워크 및 라이브러리
Nodejs Express, Naver Cloud Platform - Simple & Easy Notification Service, Bootstrap, Chart.js,

# 파일구조 및 파일설명

```markdown
├── app.js > 메인 미들웨어
├── .env > 환경변수 포함 파일 (dotenv)
├── config > DB관련 정보
│   └── config.js > ENV파일에서 DB정보를 로드
├── models > DB스키마 정보
│   ├── errorInfo.js > errorInfo 테이블 정보
│   ├── index.js > 각종 테이블 및 관계 설정
│   └── user.js > user 테이블 정보
├── package.json > 프로젝트 정보 및 모듈 정보
├── public > 클라이언트 요소 파일 정보
│   ├── css > 클라이언트 css파일
│   ├── img > 클라이언트 img파일
│   ├── javascript > 클라이언트 javascript 파일
│   ├── json
│   └── uploads > multer에서 다운로드한 파일
├── routers > 각종 라우터 집합
│   ├── index.js > 메인페이지 라우터
│   ├── isLogin.js > 로그인 확인용 모듈
│   ├── list.js > ErrorNote 목록 라우터
│   ├── passport > passport 관련 모듈
│   │   ├── index.js > passport 전략 로드 및 공통 모듈
│   │   ├── kakaoStratergy.js > 카카오 전략
│   │   └── localStrategy.js > 로컬전략
│   ├── signin.js > 로그인 라우터
│   ├── signup.js > 회원가입 라우터
│   └── write.js > ErrorNode 작성 라우터
├── swagger-output.json > API 문서, Swagger 데이터
├── swagger.js > Swagger 모듈
└── views > 각종 뷰 파일
    ├── edit.ejs > 에러코드 글 편집 뷰
    ├── error.ejs > 에러 발생시 노출되는 뷰
    ├── footer.ejs > 공통 Footer 내용
    ├── header.ejs > 공통 Header 내용
    ├── index.ejs > 메인 페이지 ( Chart.js 내용 )
    ├── list.ejs > ErrorNote 목록 확인 뷰
    ├── signin.ejs > 로그인 뷰
    ├── signup.ejs > 회원가입 뷰
    ├── viewer.ejs > 게시글 상세정보 확인 뷰
    └── write.ejs > 글쓰기 뷰
```

# 서버 실행 방법
- 최상위 폴더 ( root ) 로 이동하여 npm run start 실행

# 참고
- Swagger를 통한 API문서 확인은 [http://localhost:3000/docs](http://localhost:3000/docs)로 확인 가능합니다.
- 에러코드의 내용이 들어있는 글을 “에러코드”라고 명명하였습니다.

# API 명세
API                               | 반환               | 설명                  
--------------------------------- | ---------------- | --------------------
GET/logout                |                  |                     
GET/                      | 게시글의 언어 수        | 첫페이지 로드             
GET/signin/               | EJS 페이지          | 로그인 페이지 로드          
POST/signin/              | 로그인 성공여부         | 로그인 요청              
GET/signin/kakao          | 카카오로그인 콜백 주소    | 카카오 로그인 요청          
GET/signin/kakao/callback | 성공&실패시 리다이렉트 주소 | 카카오 로그인 리다이렉트 주소    
GET/signup/               | EJS페이지           | 회원가입 페이지 로드         
POST/signup/              | 회원가입 성공여부        | 회원가입 시도             
POST/signup/sms           | SMS발송여부          | SMS로 인증번호 요청        
POST/signup/conform       | 인증번호 정확여부        | 인증번호 확인 요청          
GET/lists/                | 전체 게시글 데이터       | 에러코드 목록             
GET/lists/{id}            | ID 게시글 데이터       | 특정 에러코드를 로드         
GET/write/                | EJS페이지           | 에러코드 작성 페이지 로드      
POST/write/               | 글 등록여부           | 에러코드 작성 요청          
GET/write/{id}            | EJS (수정페이지)      | 특정 에러코드의 내용 로드 (수정용)
PUT/write/{id}            | ID 게시글 수정여부      | 특정 에러코드 수정          
DELETE/write/{id}         | ID 게시글 제거여부      | 특정 에러코드 제거   

# 프로그램 실행과정
<img width="452" alt="image" src="https://user-images.githubusercontent.com/56428918/177034632-33182894-1b6a-4f08-a74d-d486f5924bba.png">
1.	서비스 실행시 나오는 첫 화면입니다. ErrorNote에 등록된 오류코드의 언어비율을 보여주고 있습니다. 등록된 게시글을 확인하거나 로그인, 회원가입을 진행할 수 있습니다.

<img width="452" alt="image" src="https://user-images.githubusercontent.com/56428918/177034654-73c465bc-32d3-4833-8221-b4d25f195e17.png">
2. 로그인 페이지 입니다. ErrorNote는 전화번호를 아이디로 사용하고 카카오로그인 또한 가능합니다. 카카오로그인 인증을 원하면 카카오로그인을, 전화번호 인증을 원하면 전화번호와 비밀번호를 입력하면 인증여부에 따라 진행됩니다.

<img width="452" alt="image" src="https://user-images.githubusercontent.com/56428918/177034691-9515ad59-8a01-4768-b302-7d9884e29732.png">
3.	회원가입 페이지 입니다. 휴대폰번호를 입력하고 휴대폰인증 버튼을 누르면 인증번호가 발송됩니다. 발송된 인증번호와 입력한 인증번호가 동일하면 인증이 완료됩니다. 그 외에는 사용할 닉네임 비밀번호를 입력하면 가입할 수 있습니다.

<img width="452" alt="image" src="https://user-images.githubusercontent.com/56428918/177034748-48939edc-9310-4943-ad2c-50fea3e927a7.png">
4.	로그인에 성공하면 다시 메인페이지로 오고 ErrorNote 보러가기 버튼을 클릭하거나 오른쪽 산단에 View를 클릭하여 에러코드 리스트로 넘어갈 수 있습니다. 글을 작성하고 싶으면 Write를 누르고 Logout을 원하면 Logout을 클릭하면 됩니다.

<img width="452" alt="image" src="https://user-images.githubusercontent.com/56428918/177034755-6e7216b4-5066-4e3e-8827-9945972ce788.png">
5.	에러코드 보기를 클릭하거나 View를 클릭하면 작성된 글을 볼 수 있습니다. 제목은 작성한 에러코드의 언어가 나와있고, 내용은 에러코드가 나와있습니다. 자세한 내용은 글의 하단 View버튼을 누르면 볼 수 있습니다.

<img width="452" alt="image" src="https://user-images.githubusercontent.com/56428918/177034759-c2b76dda-1fe6-41d9-b803-f9b953383a60.png">
6.	에러코드의 상세 내용을 볼 수 있습니다. 본 페이지에서는 에러코드와 에러가 발생한 사진, 언어, 이유, 해결방법을 볼 수 있습니다. 기능적 측면으로는 글을 수정하거나 제거할 수 있습니다.

<img width="452" alt="image" src="https://user-images.githubusercontent.com/56428918/177034769-37688a6c-2b73-4d2e-8844-63a7f8b80a9f.png">
7.	에러코드를 수정할 수 있습니다. 다만, 작성자만 권한을 갖고 있습니다.

<img width="452" alt="image" src="https://user-images.githubusercontent.com/56428918/177034777-165ecfca-1047-4e55-a077-e96a73b6b0a6.png">
8.	에러코드를 제거할 수 있습니다. 확인을 누르면 보고있던 게시글이 삭제됩니다. 다만, 작성자만 권한이 있습니다.

<img width="452" alt="image" src="https://user-images.githubusercontent.com/56428918/177034795-125e97ed-6329-4d78-9f51-74161a260cb9.png">
9.	오른쪽 상단의 Write탭을 클릭하면 이미지를 업로드하여 글을 작성할 수 있는 페이지가 보입니다. 해당 내용을 다 작성하고 등록을 누르면 작성된 게시글을 view를 통해 볼 수 있습니다.

<img width="452" alt="image" src="https://user-images.githubusercontent.com/56428918/177034806-c58f7181-104b-4077-9007-f3f7aac02973.png">
10.	로그인이 필요한 서비스이거나 잘못된 접근이 발생하면 위와 같은 화면을 사용자에게 출력시킵니다.

<img width="452" alt="image" src="https://user-images.githubusercontent.com/56428918/177034837-554f0e48-4111-4808-bd5a-0e92c1fb631c.png">
11.	http://localhost:3000/docs 요청하면 스웨거를 통해 사용한 API의 정보를 볼 수 있습니다.




