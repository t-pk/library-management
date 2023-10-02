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
  author: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  publisher: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.SMALLINT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.fn('now'),
  },
  approvedBy: {
    type: DataTypes.SMALLINT,
    allowNull: true,
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  rejectedBy: {
    type: DataTypes.SMALLINT,
    allowNull: true,
  },
  rejectedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
};
