import express from 'express'
import { resister } from '../controllers/userController.js';

const router =express.Router();

router.post("/resister", resister)


export default router;