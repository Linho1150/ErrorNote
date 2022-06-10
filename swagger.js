const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "ErrorNote",
    description: "에러코드를 저장하고 공유하는 서비스",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
