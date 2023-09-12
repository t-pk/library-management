import { DataTypes, Sequelize } from 'sequelize';

export const IReturnDetail = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  returnId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  borrowDetailId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now')
  },
  createdBy: {
    type: DataTypes.INTEGER({ length: 2 }),
    allowNull: false
  },
};