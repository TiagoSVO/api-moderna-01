import { Op } from "sequelize";

import "./database";

import Customer from "./app/models/Customer";
import Contact from "./app/models/Contact";

class Playground {
  static async play() {
    // Funções de agregação: min, max, sum, count
    const customers = await Customer.findAll({
      attributes: { exclude: ["id", "status"] },
      include: {
        model: Contact,
        where: {
          status: {
            [Op.in]: ["ACTIVE", "ARCHIEVED"],
          },
        },
        required: false,
      },
      where: {
        [Op.or]: {
          status: {
            [Op.in]: ["ACTIVE", "ARCHIEVED"],
          },
          name: {
            [Op.like]: "Ti%",
          },
        },
        createdAt: {
          [Op.between]: [new Date(2022, 1, 1), new Date(2022, 12, 31)],
        },
      },
      order: [["name", "desc"], "createdAt"],
      limit: 3,
      offset: 3 * 1 - 3, // limit * page - limit
    });

    console.log(JSON.stringify(customers, null, 2));

    const customersMin = await Customer.min("createdAt", {
      where: { status: "ACTIVE" },
    });

    console.log(`Min createdAt: ${JSON.stringify(customersMin, null, 2)}`);

    const customersMax = await Customer.max("createdAt", {
      where: { status: "ACTIVE" },
    });

    console.log(`Max createdAt: ${JSON.stringify(customersMax, null, 2)}`);

    const customersCount = await Customer.count();

    console.log(`Count registers: ${JSON.stringify(customersCount, null, 2)}`);

    const customerScope = await Customer.scope("active").findAll();

    console.log(`Scoped query: ${JSON.stringify(customerScope, null, 2)}`);

    const customerScopeMethod = await Customer.scope({
      method: ["created", new Date(2022, 12, 12)],
    }).findAll();

    console.log(
      `Scopedmethod query: ${JSON.stringify(customerScopeMethod, null, 2)}`
    );

    let customerCreate = await Customer.findAll({
      where: {
        email: {
          [Op.like]: "admin@croscode.com",
        },
      },
    });

    if (!customerCreate) {
      customerCreate = await Customer.create({
        name: "CrossCode",
        email: "admin@croscode.com",
      });
    }

    console.log(
      `customerCreate query: ${JSON.stringify(customerCreate, null, 2)}`
    );

    const customerToUpdate = await Customer.findByPk(4);
    console.log(`Customer antes: ${JSON.stringify(customerToUpdate, null, 2)}`);

    const statusCustomer =
      customerToUpdate.status === "ACTIVE" ? "ARCHIEVED" : "ACTIVE";

    const customerUpdated = await customerToUpdate.update({
      status: statusCustomer,
    });

    console.log(`Customer depois: ${JSON.stringify(customerUpdated, null, 2)}`);

    const customerToDelete = await Customer.create({
      name: "Customer To Delete definitly",
      email: "customer_to_delete@definitly.com",
    });

    customerToDelete.destroy();
  }
}

Playground.play();
