import { DataTypes, Sequelize } from 'sequelize';

export const IBorrow = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  readerId: {
    type: DataTypes.INTEGER,
    allowNull: false
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
