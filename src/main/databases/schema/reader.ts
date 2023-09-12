import { DataTypes, Sequelize } from 'sequelize';

export const IReader = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fullName: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(32),
    allowNull: true
  },
  studentId: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  citizenIdentify: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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