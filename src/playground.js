import { Op } from "sequelize";

import "./database";

import Customer from "./app/models/Customer";

class Playground {
  static async play() {
    const customers = await Customer.findAll({
      attributes: { exclude: ["id", "status"] },
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
    });

    console.log(JSON.stringify(customers, null, 2));
  }
}

Playground.play();
