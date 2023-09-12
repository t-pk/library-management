import { DataTypes, Sequelize } from 'sequelize';

export const IDocument = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(256),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  publisher: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  author: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  publishTime: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  quantity: {
    type: DataTypes.SMALLINT({ length: 4 }),
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
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now')
  },
  updatedBy: {
    type: DataTypes.INTEGER({ length: 2 }),
    allowNull: true
  },
};