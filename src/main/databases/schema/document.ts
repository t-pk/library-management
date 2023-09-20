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
  documentTypeId: {
    type: DataTypes.SMALLINT,
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
  publishYear: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  special: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
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