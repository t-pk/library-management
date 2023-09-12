import { Sequelize } from 'sequelize';
import pg from 'pg';
import { IBorrowDetail } from './schema/borrow-detail';
import { IBorrow } from './schema/borrow';
import { IDocument } from './schema/document';
import { IReader } from './schema/reader';
import { IReturn } from './schema/return';
import { IUser } from './schema/user';

export const sequelize = new Sequelize('postgres://postgres:123456@localhost:5433/library', {
  dialectModule: pg,
});

const attributeCommon = {
  paranoid: true,
  updatedAt: true,
  createdAt: true
}

/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const BorrowDetailSchema = sequelize.define('borrow-details', IBorrowDetail, attributeCommon);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const BorrowSchema = sequelize.define('borrows', IBorrow, attributeCommon);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const DocumentSchema = sequelize.define('documents', IDocument, attributeCommon);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReaderSchema = sequelize.define('readers', IReader, attributeCommon);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReturnSchema = sequelize.define('returns', IReturn, attributeCommon);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const UserSchema = sequelize.define('users', IUser, attributeCommon);
