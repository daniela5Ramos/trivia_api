import express from 'express';
import cors from 'cors'; // Importa el paquete cors
import productsRoutes from './src/routes/products.routes';
import authRoutes from './src/routes/auth.routes';
import preguntasRoutes from "./src/routes/preguntas.routes.js";
import triviasRoutes from "./src/routes/trivias.routes.js";
import resultadosRoutes from "./src/routes/resultados.routes";
import usuariosRoutes from "./src/routes/usuarios.routes";
import { createRoles } from './src/libs/initialSetup';

const app = express();

// Configuración del middleware CORS
app.use(cors({
  origin: '*', // URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  credentials: true // Habilitar el envío de cookies si las usas
}));

// Ejecutar la función para crear roles por defecto
createRoles();

// Middleware para interpretar JSON
app.use(express.json());

// Rutas de tu API
app.use('/api/products', productsRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/preguntas", preguntasRoutes);
app.use("/api/trivias", triviasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/resultados", resultadosRoutes);

// Ruta para el endpoint raíz
app.get('/', (req, res) => {
    res.send('Bienvenido a mi API');
});

export default app;
