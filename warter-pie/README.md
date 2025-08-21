<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository with Prisma ORM and PostgreSQL.

## Project setup

```bash
$ npm install
```

## Environment variables

Create a `.env` file in the root directory with the following content:

```env
JWT_SECRET=secret key -> 가급적 60자 이상
DB_HOST=localhost -> 로컬 테스트시
DB_PORT=5432 -> postgresqlDB 포트
DB_USERNAME=postgres // 도커에서 세팅된 유저 이름과 비밀번호
DB_PASSWORD=1234
DB_NAME=warter_pie
DATABASE_URL=postgresql://postgres:1234@localhost:5432/warter_pie
MAIL_HOST=smtp.naver.com
MAIL_PORT=587
MAIL_USER=이메일 (네이버, 구글등 가능)
MAIL_PASS=비밀번호
```

## Docker Setup

1. **Start PostgreSQL with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Run Database Migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Warter Pie Backend

Warter Pie 백엔드 API 서버입니다.

## 주요 기능

### 사용자 관리 (User Management)

#### 회원가입
- `POST /users/signup/influencer` - 인플루언서 회원가입
- `POST /users/signup/brand-manager` - 브랜드 매니저 회원가입
- `POST /users/signup/marketing-agency` - 마케팅 대행사 회원가입

#### 사용자 조회
- `GET /users` - 전체 사용자 목록 조회
- `GET /users/search` - 사용자 검색 (이름, 타입, 페이지네이션)
- `GET /users/:id` - 특정 사용자 정보 조회
- `GET /users/me` - 현재 로그인한 사용자 정보 조회
- `GET /users/type/influencers` - 인플루언서 목록 조회
- `GET /users/type/brand-managers` - 브랜드 매니저 목록 조회
- `GET /users/type/marketing-agencies` - 마케팅 대행사 목록 조회
- `GET /users/stats` - 사용자 통계 정보 조회

#### 사용자 정보 수정
- `PUT /users/me` - 기본 사용자 정보 수정
- `PUT /users/me/influencer-profile` - 인플루언서 프로필 수정
- `PUT /users/me/brand-manager-profile` - 브랜드 매니저 프로필 수정
- `PUT /users/me/marketing-agency-profile` - 마케팅 대행사 프로필 수정
- `PUT /users/me/change-password` - 비밀번호 변경

#### 사용자 삭제
- `DELETE /users/me` - 현재 사용자 삭제

### 인증 (Authentication)
- `POST /auth/login` - 로그인
- `POST /auth/register` - 회원가입

### 라이센스 코드 (License Code)
- `POST /licence-code/send` - 라이센스 코드 전송

## 기술 스택

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT, Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정하세요:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-jwt-secret"
PORT=3000
```

### 3. 데이터베이스 마이그레이션
```bash
npx prisma migrate dev
```

### 4. 애플리케이션 실행
```bash
npm run start:dev
```

### 5. API 문서 확인
브라우저에서 `http://localhost:3000/api`를 열어 Swagger 문서를 확인할 수 있습니다.

## 데이터베이스 스키마

### User (사용자)
- 기본 사용자 정보 (이메일, 비밀번호, 이름, 전화번호, 사용자 타입)

### Influencer (인플루언서)
- 소셜 미디어 URL (유튜브, 블로그, 인스타그램, 틱톡)

### BrandManager (브랜드 매니저)
- 소셜 미디어 URL
- 사업자등록번호, 주소 정보

### MarketingAgency (마케팅 대행사)
- 사업자등록번호, 주소 정보

## API 응답 형식

### 성공 응답
```json
{
  "data": {...},
  "message": "성공 메시지"
}
```

### 에러 응답
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users",
  "message": "에러 메시지",
  "error": "Bad Request"
}
```

## 보안 기능

- JWT 기반 인증
- 비밀번호 해시화 (bcrypt)
- 입력 데이터 검증
- CORS 설정
- 전역 예외 처리

## 개발 가이드

### 새로운 기능 추가 시
1. DTO 클래스 생성 (입력/출력 데이터 검증)
2. Service 클래스에 비즈니스 로직 구현
3. Controller 클래스에 엔드포인트 추가
4. Swagger 문서화
5. 테스트 코드 작성

### 코드 스타일
- TypeScript 사용
- ESLint 규칙 준수
- Swagger 문서화 필수
- 에러 처리 및 로깅
