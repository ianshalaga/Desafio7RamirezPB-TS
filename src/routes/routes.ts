import { Router } from "express";

// Routers
import productsRouter from "../routes/products.route";
import cartsRouter from "../routes/carts.route";
import sessionsRouter from "../routes/sessions.route";
import viewsRouter from "../routes/views.route";

import {
  apiRoute,
  productsRoute,
  cartsRoute,
  sessionsRoute,
} from "../utils/routes";

const routes = Router();

routes.use(apiRoute + productsRoute, productsRouter); // API Products
routes.use(apiRoute + cartsRoute, cartsRouter); // API Carts
routes.use(apiRoute + sessionsRoute, sessionsRouter); // API Sessions
routes.use(viewsRouter); // Views

export default routes;
