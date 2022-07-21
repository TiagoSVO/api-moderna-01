module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        "customers",
        "created_at",
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("now"),
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        "customers",
        "updated_at",
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("now"),
        },
        { transaction }
      );
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        "customers",
        "created_at",
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: null,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        "customers",
        "updated_at",
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: null,
        },
        { transaction }
      );
    });
  },
};
