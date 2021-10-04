const router = require("express").Router();
const userController = require("../../../controllers/userController");

router.post("/login", userController.userLogin);

router.post("/add", userController.userAdd);

router.get("/:id", userController.userDetails);

router.put("/:id", userController.userUpdate);

router.delete("/:id", userController.userDelete);

module.exports = router;
