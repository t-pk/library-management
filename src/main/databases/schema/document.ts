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
  publisherId: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  authorId: {
    type: DataTypes.SMALLINT,
    allowNull: false
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
    type: DataTypes.SMALLINT,
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
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now')
  },
  updatedBy: {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
};