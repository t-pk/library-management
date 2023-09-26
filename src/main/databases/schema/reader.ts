import { DataTypes, Sequelize } from 'sequelize';

export const IReader = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  readerTypeId: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING(16),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(32),
    allowNull: true,
  },
  studentId: {
    type: DataTypes.STRING(16),
    allowNull: true,
  },
  civilServantId: {
    type: DataTypes.STRING(16),
    allowNull: true,
  },
  citizenIdentify: {
    type: DataTypes.STRING(16),
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now'),
  },
  createdBy: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now'),
  },
  updatedBy: {
    type: DataTypes.SMALLINT,
    allowNull: true,
  },
};
