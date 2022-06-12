const express = require("express");
const CryptoJS = require("crypto-js");
const request = require("request");
const router = express.Router();
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./isLogin");
const User = require("../models/user");

let phoneBooks = [];
let conformBooks = [];

/* 회원가입 페이지를 전달함. */
router.get("/", (req, res, next) => {
  return res.render("signup", { nickname: "" });
});

/* 요청받은 전화번호로 메세지를 요청받음. 랜덤 값이 부여되고 랜덤값과 휴대폰 번호의 인증번호가
key와 value형식으로 배열 변수에 저장된다.*/
router.post("/sms", (req, res, next) => {
  const { phoneNumber } = req.body;
  const certificationNumber = String(
    Math.floor(Math.random() * 999999 + 100000)
  );
  send_message(certificationNumber, phoneNumber)
    .then((element) => {
      const phoneBook = {
        certificationNumber: certificationNumber,
        phoneNumber: phoneNumber,
      };
      phoneBooks.push(phoneBook);
      res.status(200).json(element);
    })
    .catch((element) => {
      res.status(404).json(element);
    });
});
/* 사용자의 휴대폰 번호와 인증번호가 올바른지 확인한다. 인증번호를 저장해놨던 변수에
값을 저장하여 모두 비교해본 후에 인증이 완료되면 다음으로 넘어가기로했다.
key와 value형식으로 배열 변수에 저장된다.*/

router.post("/conform", (req, res, next) => {
  const { phoneNumber, certificationNumber } = req.body;
  const index = phoneBooks
    .map(function (d) {
      return ["phoneNumber"];
    })
    .indexOf(phoneNumber);
  if (certificationNumber === phoneBooks.at(index)["certificationNumber"]) {
    phoneBooks.splice(index, 1);
    conformBooks.push(phoneNumber);
    res.json(true);
  } else {
    res.json(false);
  }
});
/* 휴대폰 인증시 인증을 받기 phoneBooks안에 요청한 번호가 있는지 확인 
번호가 있으면 함께 들어었는 번호와 인증번호가 사용자가 다시 전달해준 값이 맞는지 확인*/

router.post("/", isNotLoggedIn, async (req, res, next) => {
  const { phoneNumber, password, nickname } = req.body;
  try {
    const exUser = await User.findOne({ where: { phoneNumber } });
    const notConform = conformBooks.indexOf(phoneNumber);
    if (exUser || notConform < 0) {
      return res.json(false);
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      phoneNumber,
      password: hash,
      snsnickname: nickname,
    });
    return res.json(true);
  } catch (error) {
    console.log(error);
    return res.json(false);
  }
});
/* 값이 정확하게 입력되었는짖, 그리고 가입한 기록이 있는지 확인한 후에 문제가없으면 가입을진행한다.
과정에서는 비밀번호는 bcrypt를 통해 암호화한다.*/

async function send_message(certificationNumber, phoneNumber) {
  return new Promise(function (resolve, reject) {
    var user_phone_number = phoneNumber; //수신 전화번호 기입
    const date = Date.now().toString();
    const uri = process.env.SMS_SERVICEID; //서비스 ID
    const secretKey = process.env.SMS_SECRET; // Secret Key
    const accessKey = process.env.SMS_ACCESSKEY; //Access Key
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
    const url2 = `/sms/v2/services/${uri}/messages`;
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);
    request(
      {
        method: method,
        json: true,
        uri: url,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-ncp-iam-access-key": accessKey,
          "x-ncp-apigw-signature-v2": signature,
          "x-ncp-apigw-timestamp": date,
        },
        body: {
          type: "SMS",
          countryCode: "82",
          from: process.env.PHONENUM,
          content: `ErrorNote 인증번호 [${certificationNumber}]`,
          messages: [{ to: `${user_phone_number}` }],
        },
      },
      async (err, res, html) => {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      }
    );
  });
}
/* 네이버 클라우드에서 명세한 API 에 맞게 관련 정보를 요청하여 사용자가 메세지를
받을 수 도있도록 한다. */

module.exports = router;
