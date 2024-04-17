/** External */
import express, { Express } from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

// Routes
import productsRouter from "./routes/products.route";
import cartsRouter from "./routes/carts.route";
import sessionsRouter from "./routes/sessions.route";
import viewsRouter from "./routes/views.route";
// Data Access Object (DAO)
import ProductManagerDB from "./dao/services/ProductManagerDB";
import messagesModel from "./dao/models/messages.model";
// Utils
import connectDB, { dbURI } from "./utils/db";
import { PORT } from "./utils/ports";
import { rootPath } from "./utils/paths";
import {
  apiRoute,
  productsRoute,
  cartsRoute,
  sessionsRoute,
} from "./utils/routes";
// Interfaces
import Product from "./interfaces/Product";
import GetProduct from "./interfaces/GetProduct";

const app: Express = express(); // Express.js application instance creation

// Express.js server start
const httpServer = app.listen(PORT, () =>
  console.log(`Servidor de Express.js corriendo en el puerto: ${PORT}`)
);

const io = new Server(httpServer); // Socket.IO server start in same port that httpServer

/** MIDDLEWARES */
app.use(express.urlencoded({ extended: true })); // Complex URLs format mapping
app.use(express.static(`${rootPath}/public`)); // Serves static files from public folder
app.use(express.json()); // Format JSON requests to JavaScript Object format (POST / PUT)
app.set("views", rootPath + "/src/views"); // Sets the path where Express will look for the views of the application
app.engine("handlebars", handlebars.engine()); // Sets up Handlebars as the template engine for Express.js. Allows to use Handlebars template files (*.handlebars).
app.set("view engine", "handlebars"); // Sets Handlebars to view engine for Express application
app.use(cookieParser("secret")); // Cookies
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: dbURI,
      ttl: 15, // seconds
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
); // Sessions

/** ROUTES */
app.use(apiRoute + productsRoute, productsRouter); // API Products
app.use(apiRoute + cartsRoute, cartsRouter); // API Carts
app.use(apiRoute + sessionsRoute, sessionsRouter); // API Sessions
app.use(viewsRouter); // Views

// WEBSOCKETS
const messages = [];

io.on("connection", async (socket) => {
  console.log("Cliente conectado");
  const limit = 1000;
  const page = 1;
  const productManagerDB: ProductManagerDB = new ProductManagerDB();
  let products: GetProduct = await productManagerDB.getProducts(
    limit,
    page,
    null,
    null
  );

  socket.emit("products", products.payload);

  socket.on("newProduct", async (newProduct: Product) => {
    console.log("Nuevo producto");
    console.log(newProduct);
    await productManagerDB.addProduct(newProduct);
    products = await productManagerDB.getProducts(limit, page, null, null);
    socket.emit("products", products.payload);
  });

  socket.on("message", async (data) => {
    console.log(data);
    messages.push(data);
    await messagesModel.create(data);
    io.emit("messageLogs", messages);
  });
});

// MongoDB
connectDB();
