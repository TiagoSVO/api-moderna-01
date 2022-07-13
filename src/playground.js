import { Op } from "sequelize";

import "./database";

import Customer from "./app/models/Customer";
import Contact from "./app/models/Contact";

class Playground {
  static async play() {
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
  }
}

Playground.play();
