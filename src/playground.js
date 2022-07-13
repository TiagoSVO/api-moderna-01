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

    const customersMin = await Customer.min("createdAt", {
      where: { status: "ACTIVE" },
    });

    const customersMax = await Customer.max("createdAt", {
      where: { status: "ACTIVE" },
    });

    const customersCount = await Customer.count();

    console.log(JSON.stringify(customers, null, 2));
    console.log(`Min createdAt: ${JSON.stringify(customersMin, null, 2)}`);
    console.log(`Max createdAt: ${JSON.stringify(customersMax, null, 2)}`);
    console.log(`Count registers: ${JSON.stringify(customersCount, null, 2)}`);
  }
}

Playground.play();
