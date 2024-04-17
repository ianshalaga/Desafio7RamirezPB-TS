import { Server } from "socket.io";
// Data Access Object (DAO)
import ProductManagerDB from "../dao/services/ProductManagerDB";
import messagesModel from "../dao/models/messages.model";
// Interfaces
import Product from "../interfaces/Product";
import GetProduct from "../interfaces/GetProduct";

function socketMessages(socketServer: Server) {
  const messages = [];

  socketServer.on("connection", async (socket) => {
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
      socketServer.emit("messageLogs", messages);
    });
  });
}

export default socketMessages;
