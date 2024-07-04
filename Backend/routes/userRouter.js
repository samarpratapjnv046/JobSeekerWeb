import express from 'express'
import { logout, resister } from '../controllers/userController.js';
import { login } from '../controllers/userController.js';
import { isAuthorized } from '../middlewares/auth.js';

const router =express.Router();

router.post("/resister", resister);
router.post("/login",login);
router.get("/logout",isAuthorized,logout);


export default router;