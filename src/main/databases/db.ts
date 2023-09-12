import { Sequelize } from 'sequelize';
import pg from 'pg';
import { IBorrowDetail } from './schema/borrow-detail';
import { IBorrow } from './schema/borrow';
import { IDocument } from './schema/document';
import { IReader } from './schema/reader';
import { IReturn } from './schema/return';
import { IUser } from './schema/user';
import { IReturnDetail } from './schema/return-detail';

export const sequelize = new Sequelize('postgres://postgres:123456@localhost:5433/library', {
  dialectModule: pg,
  logging: true
});

const attributeCommon = {
  paranoid: false,
  updatedAt: true,
  createdAt: true,
  underscored: true,
  deletedAt: false
}

/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const BorrowSchema = sequelize.define('borrows', IBorrow, { ...attributeCommon, paranoid: false, updatedAt: false });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const BorrowDetailSchema = sequelize.define('borrow-details', IBorrowDetail, { ...attributeCommon, paranoid: false, updatedAt: false });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const DocumentSchema = sequelize.define('documents', IDocument, attributeCommon);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReaderSchema = sequelize.define('readers', IReader, attributeCommon);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReturnSchema = sequelize.define('returns', IReturn, { ...attributeCommon, paranoid: false, updatedAt: false });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReturnDetailSchema = sequelize.define('return-details', IReturnDetail, { ...attributeCommon, paranoid: false, updatedAt: false });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const UserSchema = sequelize.define('users', IUser, attributeCommon);


BorrowSchema.belongsTo(DocumentSchema, { foreignKey: { allowNull: false, name: 'documentId' } });
BorrowSchema.belongsTo(ReaderSchema, { foreignKey: { allowNull: false, name: 'readerId' } });
BorrowSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });

BorrowDetailSchema.belongsTo(BorrowSchema, { foreignKey: { allowNull: false, name: 'borrowId' } });
BorrowDetailSchema.belongsTo(DocumentSchema, { foreignKey: { allowNull: false, name: 'documentId' } });
BorrowDetailSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });

DocumentSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });
DocumentSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'updatedBy' } });

ReaderSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });
ReaderSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'updatedBy' } });

ReturnSchema.belongsTo(ReaderSchema, { foreignKey: { allowNull: false, name: 'returnner' } });
ReturnSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });

ReturnDetailSchema.belongsTo(ReturnSchema, { foreignKey: { allowNull: false, name: 'returnId' } });
ReturnDetailSchema.belongsTo(BorrowDetailSchema, { foreignKey: { allowNull: false, name: 'brrowDetailId' } });
ReturnDetailSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });

UserSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });
UserSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'updatedBy' } });