import { Router } from "express";
import * as usuarioCtrl from "../controllers/usuarios.controller"

const router = Router();

router.get("/", usuarioCtrl.getUsers);
router.get("/:userId", usuarioCtrl.getUserById);

export default router;