import { Router, Request, Response } from "express";
import ProductManagerDB from "../dao/services/ProductManagerDB";
import QueryParams from "../interfaces/QueryParams";
import validateQueryParams from "../validators/queryParams";
import GetProduct from "../interfaces/GetProduct";
import { CartManagerDB } from "../dao/services/CartManagerDB";
import DbCart from "../interfaces/DbCart";
import { PORT } from "../utils/ports";
import { productRoute, productsRoute } from "../utils/routes";
import DbProduct from "../interfaces/DbProduct";
import auth from "../middlewares/auth";
import logedin from "../middlewares/logedin";

const viewsRouter = Router();

// @@@@
// viewsRouter.get("/", async (req: Request, res: Response) => {
//   try {
//     const productManagerDB: ProductManagerDB = new ProductManagerDB();
//     let limitParsed: number = 10;
//     let pageParsed: number = 1;
//     const queryParams: QueryParams = validateQueryParams(req.query);
//     const { limit, page, sort, query } = queryParams;
//     // @@@@ Pendiente: Validar que el parseo a entero de limit y page de un número válido.
//     if (limit) {
//       limitParsed = parseInt(limit);
//     }
//     if (page) {
//       pageParsed = parseInt(page);
//     }
//     const products: GetProduct = await productManagerDB.getProducts(
//       limitParsed,
//       pageParsed,
//       sort,
//       query
//     );
//     res.render("home", {
//       title: "Products",
//       style: "app.css",
//       products: products.payload,
//     });
//   } catch (error) {
//     res.render("failure", {
//       title: "Products",
//       style: "app.css",
//       failureMessage: error.message,
//     });
//   }
// });

// @@@@
viewsRouter.get("/realtimeproducts", (req: Request, res: Response) => {
  try {
    res.render("realTimeProducts", {
      title: "Real Time Products",
      style: "app.css",
    });
  } catch (error) {
    res.render("failure", {
      title: "Real Time Products",
      style: "app.css",
      failureMessage: error.message,
    });
  }
});

// @@@@
viewsRouter.get("/chat", (req: Request, res: Response) => {
  try {
    res.render("chat", { title: "Chat", style: "app.css" });
  } catch (error) {
    res.render("failure", {
      title: "Chat",
      style: "app.css",
      failureMessage: error.message,
    });
  }
});

// @@@@
viewsRouter.get(productsRoute, async (req: Request, res: Response) => {
  try {
    const productManagerDB: ProductManagerDB = new ProductManagerDB();
    let limitParsed: number = 2;
    let pageParsed: number = 1;
    const queryParams: QueryParams = validateQueryParams(req.query);
    const { limit, page, sort, query } = queryParams;
    // @@@@ Pendiente: Validar que el parseo a entero de limit y page de un número válido.
    if (limit) {
      limitParsed = parseInt(limit);
    }
    if (page) {
      pageParsed = parseInt(page);
    }
    const products: GetProduct = await productManagerDB.getProducts(
      limitParsed,
      pageParsed,
      sort,
      query
    );
    const nextLink = products.hasNextPage
      ? `http://localhost:${PORT}${productsRoute}?page=${products.nextPage}&limit=${limitParsed}`
      : "";
    const prevLink = products.hasPrevPage
      ? `http://localhost:${PORT}${productsRoute}?page=${products.prevPage}&limit=${limitParsed}`
      : "";
    const productsTemplate = {
      ...products,
      nextLink,
      prevLink,
    };
    res.render("products", {
      title: "Products",
      style: "app.css",
      products: productsTemplate,
      user: req.session.user,
      admin: req.session.admin,
    });
  } catch (error) {
    res.render("failure", {
      title: "Products",
      style: "app.css",
      failureMessage: error.message,
    });
  }
});

// @@@@
viewsRouter.get("/carts/:cid", async (req: Request, res: Response) => {
  try {
    const cartManagerDB: CartManagerDB = new CartManagerDB();
    const cid: string = req.params.cid;
    const cart: DbCart = await cartManagerDB.getCartById(cid);
    res.render("cartDetail", {
      title: "Cart detail",
      style: "app.css",
      cart: cart,
    });
  } catch (error) {
    res.render("failure", {
      title: "Cart detail",
      style: "app.css",
      failureMessage: error.message,
    });
  }
});

// @@@@
viewsRouter.get(`${productRoute}/:pid`, async (req: Request, res: Response) => {
  try {
    const productManagerDB: ProductManagerDB = new ProductManagerDB();
    const pid: string = req.params.pid;
    const product: DbProduct = await productManagerDB.getProductById(pid);
    res.render("product", {
      title: "Product",
      style: "app.css",
      product: product,
    });
  } catch (error) {
    res.render("failure", {
      title: "Product",
      style: "app.css",
      failureMessage: error.message,
    });
  }
});

// @@@@
viewsRouter.get("/register", logedin, async (req: Request, res: Response) => {
  try {
    res.render("register", {
      title: "Register",
      style: "app.css",
    });
  } catch (error) {
    res.render("failure", {
      title: "Register",
      style: "app.css",
      failureMessage: error.message,
    });
  }
});

// @@@@
viewsRouter.get("/login", logedin, async (req: Request, res: Response) => {
  try {
    res.render("login", {
      title: "Login",
      style: "app.css",
    });
  } catch (error) {
    res.render("failure", {
      title: "Login",
      style: "app.css",
      failureMessage: error.message,
    });
  }
});

// @@@@
viewsRouter.get("/profile", auth, async (req: Request, res: Response) => {
  try {
    res.render("profile", {
      title: "Profile",
      style: "app.css",
      user: req.session.user,
    });
  } catch (error) {
    res.render("failure", {
      title: "Profile",
      style: "app.css",
      failureMessage: error.message,
    });
  }
});

// @@@@
viewsRouter.get("/", logedin, async (req: Request, res: Response) => {
  try {
    res.render("login", {
      title: "Login",
      style: "app.css",
    });
  } catch (error) {
    res.render("failure", {
      title: "Login",
      style: "app.css",
      failureMessage: error.message,
    });
  }
});

export default viewsRouter;
