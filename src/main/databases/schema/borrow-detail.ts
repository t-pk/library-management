import { DataTypes, Sequelize } from 'sequelize';

export const IBorrowDetail = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  borrowId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  documentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  durationTime: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now'),
  },
  createdBy: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
};
