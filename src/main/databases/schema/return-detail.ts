import { DataTypes, Sequelize } from 'sequelize';

export const IReturnDetail = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  returnId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  borrowDetailId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idempotencyToken: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now'),
  },
  createdBy: {
    type: DataTypes.SMALLINT,
    allowNull: true,
  },
};
