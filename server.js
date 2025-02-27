const express = require("express");

const server = express();

const userRouter = require("./users/userRouter");
const postRouter = require("./posts/postRouter");

server.use(express.json());

server.use(logger);

server.use("/api/user", userRouter);
server.use("/api/posts", postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`[\n${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.ip}\n`);
  next();
};

module.exports = server;

