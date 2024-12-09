import { Router } from "express";
import * as triviasCtrl from "../controllers/trivias.controller";
import { authJwt } from "../middlewares";

const router = Router();

router.get("/", triviasCtrl.getTrivias);
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], triviasCtrl.createTrivia);
router.get("/:triviaId", triviasCtrl.getTriviaById);
router.put("/:triviaId", [authJwt.verifyToken, authJwt.isAdmin], triviasCtrl.updateTriviaById);
router.delete("/:triviaId", [authJwt.verifyToken, authJwt.isAdmin], triviasCtrl.deleteTriviaById);

export default router;
