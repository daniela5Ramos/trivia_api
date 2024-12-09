import { Router } from "express";
import * as resultadoCtrl from "../controllers/resultados.controller.js";

const router = Router();

router.post("/", resultadoCtrl.createResultado);
router.get("/", resultadoCtrl.getResultados);

// Nuevo endpoint para obtener trivias realizadas por un usuario
router.get("/usuario/:idUsuario", resultadoCtrl.obtenerTriviasRealizadas);

router.get("/:resultadoId", resultadoCtrl.getResultadoById);
router.get("/trivia/:triviaId", resultadoCtrl.getResultadosPorTrivia);
router.get("/promedio/usuario/:idUsuario", resultadoCtrl.obtenerPromedioUsuario);
router.get("/puntaje/usuario/:idUsuario", resultadoCtrl.obtenerPuntajeUsuario);
router.get("/historial/usuario/:idUsuario", resultadoCtrl.obtenerHistorialUsuario)
router.get("/top/promedio/:idTrivia", resultadoCtrl.obtenerTopPromedio);
router.get("/top/puntaje/:idTrivia", resultadoCtrl.obtenerTopPuntaje);

export default router;