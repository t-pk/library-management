import { DataTypes, Sequelize } from 'sequelize';

export const IReaderType = {
  id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now'),
  },
};
