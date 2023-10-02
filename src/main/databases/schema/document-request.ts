import { DataTypes, Sequelize } from 'sequelize';

export const IDocumentRequest = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  authorName: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  publisherName: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  approvedBy: {
    type: DataTypes.SMALLINT,
    allowNull: true,
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.fn('now'),
  },
  createdBy: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
};
