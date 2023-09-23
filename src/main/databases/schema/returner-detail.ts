import { DataTypes, Sequelize } from 'sequelize';

export const IReturnerDetail = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  returnerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  borrowerDetailId: {
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
    type: DataTypes.SMALLINT,
    allowNull: false
  },
};