module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("customers", "status", {
      type: Sequelize.ENUM("ACTIVE", "ARCHIEVED"),
      defaultValue: "ACTIVE",
      allowNull: false,
    });
  },

  async down(queryInterface) {
    // TODO: Check if the dialect is postgres to execute the query below.
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn("customers", "status", { transaction });
      await queryInterface.sequelize.query("DROP TYPE enum_customers_status", {
        transaction,
      });
    });
  },
};
