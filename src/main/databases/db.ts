import Sequelize from 'sequelize';
import pg from 'pg';
import { IBorrowDetail } from './schema/borrow-detail';
import { IBorrow } from './schema/borrow';
import { IDocument } from './schema/document';
import { IReader } from './schema/reader';
import { IReturn } from './schema/return';
import { IUser } from './schema/user';
import { IReturnDetail } from './schema/return-detail';
import { IAuthor } from './schema/author';
import { IPublisher } from './schema/publisher';
import { IDocumentType } from './schema/document-type';
import { IReaderType } from './schema/reader-type';
import { IRemind } from './schema/remind';
import { IPenalty } from './schema/penalty';

export const sequelize = new Sequelize.Sequelize(
  'postgres://postgres:123456@localhost:5433/library',
  {
    dialectModule: pg,
    logging: true,
    pool: { max: 5, min: 0, idle: 10000 },
  }
);

const attributeCommon = {
  paranoid: false,
  updatedAt: true,
  createdAt: true,
  underscored: true,
  deletedAt: false,
};

/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const BorrowSchema = sequelize.define('borrows', IBorrow, {
  ...attributeCommon,
  updatedAt: false,
  tableName: 'borrows',
});
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const BorrowDetailSchema = sequelize.define(
  'borrowDetails',
  IBorrowDetail,
  { ...attributeCommon, updatedAt: false, tableName: 'borrow_details' }
);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const DocumentSchema = sequelize.define(
  'documents',
  IDocument,
  attributeCommon
);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReaderSchema = sequelize.define('readers', IReader, {
  ...attributeCommon,
  tableName: 'reader',
});
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReturnSchema = sequelize.define('returns', IReturn, {
  ...attributeCommon,
  updatedAt: false,
  tableName: 'returns',
});
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReturnDetailSchema = sequelize.define(
  'returnDetails',
  IReturnDetail,
  { ...attributeCommon, updatedAt: false, tableName: 'return_details' }
);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const UserSchema = sequelize.define('users', IUser, attributeCommon);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const AuthorSchema = sequelize.define(
  'authors',
  IAuthor,
  attributeCommon
);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const PublisherSchema = sequelize.define(
  'publishers',
  IPublisher,
  attributeCommon
);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const DocumentTypeSchema = sequelize.define(
  'documentTypes',
  IDocumentType,
  { ...attributeCommon, tableName: 'document_types' }
);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReaderTypeSchema = sequelize.define('readerTypes', IReaderType, {
  ...attributeCommon,
  tableName: 'reader_types',
});
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const RemindSchema = sequelize.define('reminds', IRemind, {
  ...attributeCommon,
  tableName: 'reminds',
});
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const PenaltySchema = sequelize.define('penalties', IPenalty, {
  ...attributeCommon,
  tableName: 'penalties',
});

// BorrowSchema.belongsTo(DocumentSchema, { foreignKey: { allowNull: false, name: 'documentId' } });
BorrowSchema.belongsTo(ReaderSchema, {
  foreignKey: { allowNull: false, name: 'readerId' },
});
BorrowSchema.belongsTo(UserSchema, {
  foreignKey: { allowNull: true, name: 'createdBy' },
});
BorrowSchema.hasOne(RemindSchema);
BorrowSchema.hasOne(ReturnSchema);

BorrowDetailSchema.belongsTo(BorrowSchema, {
  foreignKey: { allowNull: false, name: 'borrowId' },
});
BorrowDetailSchema.belongsTo(DocumentSchema, {
  foreignKey: { allowNull: false, name: 'documentId' },
});
BorrowDetailSchema.belongsTo(UserSchema, {
  foreignKey: { allowNull: true, name: 'createdBy' },
});
BorrowDetailSchema.hasOne(ReturnDetailSchema, {
  foreignKey: { allowNull: true, name: 'borrowDetailId' },
});

DocumentSchema.belongsTo(AuthorSchema, {
  foreignKey: { allowNull: false, name: 'authorId' },
});
DocumentSchema.belongsTo(PublisherSchema, {
  foreignKey: { allowNull: false, name: 'publisherId' },
});
DocumentSchema.belongsTo(DocumentTypeSchema, {
  foreignKey: { allowNull: false, name: 'documentTypeId' },
});
DocumentSchema.belongsTo(UserSchema, {
  foreignKey: { allowNull: true, name: 'createdBy' },
});
DocumentSchema.belongsTo(UserSchema, {
  foreignKey: { allowNull: true, name: 'updatedBy' },
});

ReaderSchema.belongsTo(UserSchema, {
  foreignKey: { allowNull: true, name: 'createdBy' },
});
ReaderSchema.belongsTo(ReaderTypeSchema, {
  foreignKey: { allowNull: false, name: 'readerTypeId' },
});
ReaderSchema.hasMany(BorrowSchema);
ReaderSchema.belongsTo(UserSchema, {
  foreignKey: { allowNull: true, name: 'updatedBy' },
});
ReaderTypeSchema.hasOne(ReaderSchema);

ReturnSchema.belongsTo(ReaderSchema, {
  foreignKey: { allowNull: false, name: 'readerId' },
});
ReturnSchema.belongsTo(UserSchema, {
  foreignKey: { allowNull: true, name: 'createdBy' },
});
ReturnSchema.hasOne(PenaltySchema);
ReturnSchema.belongsTo(BorrowSchema, {
  foreignKey: { allowNull: false, name: 'borrowId' },
});

ReturnDetailSchema.belongsTo(ReturnSchema, {
  foreignKey: { allowNull: false, name: 'returnId' },
});
ReturnDetailSchema.belongsTo(BorrowDetailSchema, {
  foreignKey: { allowNull: false, name: 'borrowDetailId' },
});
ReturnDetailSchema.belongsTo(UserSchema, {
  foreignKey: { allowNull: true, name: 'createdBy' },
});

UserSchema.belongsTo(UserSchema, {
  foreignKey: { allowNull: true, name: 'createdBy' },
});
UserSchema.belongsTo(UserSchema, {
  foreignKey: { allowNull: true, name: 'updatedBy' },
});

RemindSchema.belongsTo(UserSchema, {
  foreignKey: { allowNull: true, name: 'createdBy' },
});
RemindSchema.belongsTo(BorrowSchema, {
  foreignKey: { allowNull: false, name: 'borrowId' },
});

PenaltySchema.belongsTo(UserSchema, {
  foreignKey: { allowNull: true, name: 'createdBy' },
});
PenaltySchema.belongsTo(UserSchema, {
  foreignKey: { allowNull: true, name: 'updatedBy' },
});
PenaltySchema.belongsTo(ReturnSchema, {
  foreignKey: { allowNull: false, name: 'returnId' },
});

export const unitOfWork = (callback: any) => {
  const isolationLevel = Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
  return new Promise((resolve, reject) => {
    sequelize
      .transaction({ isolationLevel }, callback)
      .then((value) => {
        resolve(value);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
