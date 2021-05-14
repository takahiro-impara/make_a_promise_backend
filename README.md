# frontend

- frontend SPA code is hosted

  https://github.com/takahiro-impara/make_a_promise_frontend

# backend

## Project setup

```
npm install
```

## Code deploy

```
sls deploy -v
```

## Local Test

### Install DynamoDB in LocalPC

```
npm run dynamo
```

### Start Serverless-Offline Test

```
npm run start
```

### get Id Token from frontend Web page

- go to https://github.com/takahiro-impara/make_a_promise_frontend
- build SPA in Your Local PC
- In the Top page, you can login OpenID(google etc)
- Before login, open Web console https://developer.chrome.com/docs/devtools/open/
- After login, you can get Id token.

### execute lambda_offline test

- set your token as a Environment variable to run test shell scripts

```
export TOKEN={YOUR TOKEN}
```

- go to test folder and execute test scrpts

```
$ cd src/test/lambda_offline
$ ./getItems.sh

{"items":[{"itemId":"5986741c-ed6d-4b5c-8add-4fcfa5862980","attachmentUrl":"https://serverless-udagram-item-dev-koichi.s3-ap-northeast-1.amazonaws.com/2fa12f3c-4210-4f1b-8ff2-f528729f7912","dueDate":"2021-05-11","name":"aaa","done":true,"userId":"auth0|6097611c60d4a80069a94364","createAt":"2021-05-10T16:41:00.421Z"},{"name":"Test Ites","itemId":"794c6188-b07f-41fc-be8b-6ae3d237c5e1","userId":"auth0|6097611c60d4a80069a94364","done":false,"createAt":"2021-05-14T15:09:23.475Z","dueDate":"2021-05-19"},{"itemId":"107d1241-b60c-4626-bd6a-e069e970f21f","attachmentUrl":"https://serverless-udagram-item-dev-koichi.s3-ap-northeast-1.amazonaws.com/20272d5a-e2e5-42ec-b859-f02965afcd77","dueDate":"2021-05-11","name":"aaaa","userId":"auth0|6097611c60d4a80069a94364","done":false,"createAt":"2021-05-11T12:47:00.567Z"},{"name":"Test Ites","itemId":"e3006cbd-95d1-4173-986f-7e24c1e8d4fe","userId":"auth0|6097611c60d4a80069a94364","done":false,"createAt":"2021-05-14T15:08:21.314Z","dueDate":"2021-05-19"}]}* Closing connection 0
```

## execute postman

- in [src/test/postman], there is postman collection file.You can perform API testing using AWS resources
