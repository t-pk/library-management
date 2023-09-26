import { DataTypes, Sequelize } from 'sequelize';

export const IPenalty = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  returnId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  compensation: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now')
  },
  createdBy: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now')
  },
  updatedBy: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
};