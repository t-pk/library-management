import { DataTypes, Sequelize } from 'sequelize';

export const IUser = {
  id: {
    type: DataTypes.SMALLINT({ length: 2 }),
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(256),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(32),
    allowNull: true
  },
  phoneNumber: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  position: {
    type: DataTypes.STRING(32),
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
