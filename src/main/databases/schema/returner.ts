import { DataTypes, Sequelize } from 'sequelize';

export const IReturner = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  borrowerId: {
    type: DataTypes.INTEGER,
    allowNull: false
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