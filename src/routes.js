import { Router } from "express";
import CustomersControllers from "./app/controllers/CustomersControllers";

const routes = new Router();

routes.get("/customers", CustomersControllers.index);
routes.get("/customers/:id", CustomersControllers.show);
routes.post("/customers", CustomersControllers.create);
routes.put("/customers/:id", CustomersControllers.update);
routes.delete("/customers/:id", CustomersControllers.destroy);

export default routes;
