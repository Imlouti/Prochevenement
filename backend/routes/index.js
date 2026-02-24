const express = require("express");
const router = express.Router();

router.get("/", (res) => {
  res.send({ response: "I am alive" }).status(200);
}); //quand utilisateur se connecte il donne I am alive, pas socket

module.exports = router;