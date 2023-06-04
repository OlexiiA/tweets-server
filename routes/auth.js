import { Router } from "express";
import { register, login, getMe } from "../controller/auth.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = new Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", checkAuth, getMe);

export default router;
