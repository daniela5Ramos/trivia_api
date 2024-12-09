import { Router } from "express";
import * as preguntasCtrl from "../controllers/preguntas.controller";
import { authJwt } from "../middlewares";

const router = Router();

router.get("/", preguntasCtrl.getPreguntas);
router.post( "/", [authJwt.verifyToken, authJwt.isAdmin], preguntasCtrl.createPregunta);
router.get("/:preguntaId", preguntasCtrl.getPreguntaById);
router.put("/:preguntaId", [authJwt.verifyToken, authJwt.isAdmin], preguntasCtrl.updatePreguntaById );
router.delete("/:preguntaId", [authJwt.verifyToken, authJwt.isAdmin], preguntasCtrl.deletePreguntaById);

export default router;
