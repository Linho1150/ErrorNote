const express = require("express");
const CryptoJS = require("crypto-js");
const request = require("request");
const router = express.Router();
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./isLogin");
const User = require("../models/user");

let phoneBooks = [];
let conformBooks = [];

/* GET users listing. */
router.get("/", (req, res, next) => {
  return res.render("signup", { nickname: "" });
});

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

module.exports = router;
