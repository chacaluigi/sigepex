const { Router } = require("express");

const { startProcess } = require("../controllers/proceso.js");

const router = Router();

router.post("/proceso", startProcess);

module.exports = router;
