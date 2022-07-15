import { Op } from "sequelize";
import { parseISO } from "date-fns";
import Customer from "../models/Customer";
import Contact from "../models/Contact";

const customers = [
  { id: 1, name: "TiagoSVO", site: "https://tiagosvo.github.io/" },
  { id: 2, name: "Google", site: "https://google.com" },
  { id: 3, name: "Pudim", site: "https://pudim.com.br" },
  { id: 4, name: "Pudim2", site: "https://pudim2.com.br" },
  { id: 5, name: "Pudim3", site: "https://pudim3.com.br" },
];

const getCustomerById = (id) => {
  const customer = customers.find((item) => item.id === parseInt(id, 10));
  return customer;
};

const getLastCustomer = () => {
  const customersLength = customers.length;
  const orderedCustomers = customers.sort(
    (a, b) => parseInt(a.id, 10) - parseInt(b.id, 10)
  );

  return orderedCustomers[customersLength - 1];
};

class CustomersControllers {
  async index(req, res) {
    const {
      name,
      email,
      status,
      createdBefore,
      createdAfter,
      updatedBefore,
      updatedAfter,
      sort,
    } = req.query;

    console.log(`${name}`);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;

    let where = {};
    let order = [];

    if (name) {
      where = {
        ...where,
        name: {
          [Op.iLike]: `%${name}%`,
        },
      };
    }

    if (email) {
      where = {
        ...where,
        email: {
          [Op.iLike]: `%${email}%`,
        },
      };
    }

    if (status) {
      where = {
        ...where,
        status: {
          [Op.in]: status.split(",").map((item) => item.toUpperCase()),
        },
      };
    }

    if (createdBefore) {
      where = {
        ...where,
        createdAt: {
          [Op.gte]: parseISO(createdBefore),
        },
      };
    }

    if (createdAfter) {
      where = {
        ...where,
        createdAt: {
          [Op.lte]: parseISO(createdAfter),
        },
      };
    }

    if (updatedBefore) {
      where = {
        ...where,
        updatedAt: {
          [Op.gte]: parseISO(updatedBefore),
        },
      };
    }

    if (updatedAfter) {
      where = {
        ...where,
        updatedAt: {
          [Op.lte]: parseISO(updatedAfter),
        },
      };
    }

    if (sort) {
      order = sort.split(",").map((item) => item.split(":"));
    }

    const offset = limit * page - limit;

    const data = await Customer.findAll({
      where,
      include: [
        {
          model: Contact,
          attributes: ["id"],
        },
      ],
      order,
      limit,
      offset,
    });

    const statusCode = 200;
    return res.status(statusCode).json(data);
  }

  show(req, res) {
    const { id } = req.params;
    const customer = customers.find((item) => item.id === parseInt(id, 10));
    const status = customer ? 200 : 400;

    return res.status(status).json(customer);
  }

  create(req, res) {
    const { name, site } = req.body;
    const status = 201;

    const newId = getLastCustomer().id + 1;
    const newCustomer = { id: newId, name, site };

    customers.push(newCustomer);

    return res.status(status).json(newCustomer);
  }

  update(req, res) {
    const { id } = req.params;
    let { name, site } = req.body;
    const customer = getCustomerById(id);
    const status = customer ? 200 : 400;

    if (customer) {
      name = name || customer.name;
      site = site || customer.site;
      const index = customers.findIndex((item) => item.id === parseInt(id, 10));

      customers[index] = { id: parseInt(id, 10), name, site };
    }

    return res.status(status).json(customers);
  }

  destroy(req, res) {
    const { id } = req.params;
    const customer = getCustomerById(id);
    const status = customer ? 200 : 400;

    if (customer) {
      const index = customers.findIndex((item) => item.id === parseInt(id, 10));
      customers.splice(index, 1);
    }

    return res.status(status).json(customers);
  }
}

export default new CustomersControllers();
