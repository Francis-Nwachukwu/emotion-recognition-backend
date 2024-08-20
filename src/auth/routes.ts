import { Router } from "express";
import { loginController, registerUser } from "./controllers";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginController);

export default router;
