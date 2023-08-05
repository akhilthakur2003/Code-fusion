const express = require("express");
const bodyParser = require("body-parser");
var request = require("request");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const cors = require("cors");
// setting middleware
app.use(cors());
app.use(bodyParser());
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.post("/test", (req, res) => {
  console.log(req.body);
  res.json("recieved");
});

app.post("/submissions", (req, res) => {
  // res.json(req);
  var code = req.body.code;
  var inp = req.body.input;
  var lang = req.body.lang;
  var program = {
    script: code,
    language: lang,
    stdin:inp,
    versionIndex: "0",
    clientId: "b683c6b8d0cb63be7f6a3cc243591092",
    clientSecret:
      "127aadb98d26533a1d1ad28a52ee813aacc123ccaa1086cb0f9f17e00e4e8abf",
  };
  request(
    {
      url: "https://api.jdoodle.com/v1/execute",
      method: "POST",
      json: program,
    },
    function (error, response, body) {
      console.log("error:", error);
      console.log("statusCode:", response && response.statusCode);
      console.log("body:", body);
      res.json(body);
    }
  );

  console.log(getRequests(req,res));
});




let mydata = "";
let users = 0;
io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);
  users = users + 1;
  socket.emit("new-connection", mydata, users);

  io.emit("user-change", users);

  socket.on("send-message", (data) => {
    mydata = data;
    socket.broadcast.emit("receive-message", mydata);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    users = users - 1;
    io.emit("user-change", users);
  });
});

server.listen(3001, () => {
  console.log("server is running");
});

const getRequests = (req, res) => {
  request(
    {
      url: "https://api.jdoodle.com/v1/credit-spent",
      method: "POST",
      json: {
        clientId: "b683c6b8d0cb63be7f6a3cc243591092",
        clientSecret:
          "127aadb98d26533a1d1ad28a52ee813aacc123ccaa1086cb0f9f17e00e4e8abf",
      },
    },
    function (error, response, body) {
      console.log("error:", error);
      console.log("statusCode:", response && response.statusCode);
      console.log("body:", body);
      return body;
    }
  );
};

const compileCode = (code, req, res) => {
  var program = {
    script: code,
    language: "python3",
    versionIndex: "0",
    clientId: "b683c6b8d0cb63be7f6a3cc243591092",
    clientSecret:
      "127aadb98d26533a1d1ad28a52ee813aacc123ccaa1086cb0f9f17e00e4e8abf",
  };
  request(
    {
      url: "https://api.jdoodle.com/v1/execute",
      method: "POST",
      json: program,
    },
    function (error, response, body) {
      console.log("error:", error);
      console.log("statusCode:", response && response.statusCode);
      console.log("body:", body);
      return body.used;
    }
  );
};
