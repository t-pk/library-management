import Sequelize from 'sequelize';
import pg from 'pg';
import { IBorrowerDetail } from './schema/borrower-detail';
import { IBorrower } from './schema/borrower';
import { IDocument } from './schema/document';
import { IReader } from './schema/reader';
import { IReturner } from './schema/returner';
import { IUser } from './schema/user';
import { IReturnerDetail } from './schema/returner-detail';
import { IAuthor } from './schema/author';
import { IPublisher } from './schema/publisher';
import { IDocumentType } from './schema/document-type';
import { IReaderType } from './schema/reader-type';

export const sequelize = new Sequelize.Sequelize('postgres://postgres:123456@localhost:5433/library', {
  dialectModule: pg,
  logging: true,
  pool: { max: 5, min: 0, idle: 10000 }
});

const attributeCommon = {
  paranoid: false,
  updatedAt: true,
  createdAt: true,
  underscored: true,
  deletedAt: false
}

/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const BorrowerSchema = sequelize.define('borrowers', IBorrower, { ...attributeCommon, updatedAt: false, tableName: 'borrowers' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const BorrowerDetailSchema = sequelize.define('borrowerDetails', IBorrowerDetail, { ...attributeCommon, updatedAt: false, tableName: 'borrower_details' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const DocumentSchema = sequelize.define('documents', IDocument, attributeCommon);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReaderSchema = sequelize.define('readers', IReader, {...attributeCommon, tableName: 'reader'});
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReturnerSchema = sequelize.define('returners', IReturner, { ...attributeCommon, updatedAt: false, tableName: 'returners' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReturnerDetailSchema = sequelize.define('returnerDetails', IReturnerDetail, { ...attributeCommon, updatedAt: false, tableName: 'returner_details' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const UserSchema = sequelize.define('users', IUser, attributeCommon);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const AuthorSchema = sequelize.define('authors', IAuthor, attributeCommon);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const PublisherSchema = sequelize.define('publishers', IPublisher, attributeCommon);
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const DocumentTypeSchema = sequelize.define('documentTypes', IDocumentType, {...attributeCommon, tableName: 'document_types'});
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */ 
export const ReaderTypeSchema = sequelize.define('readerTypes', IReaderType, {...attributeCommon, tableName: 'reader_types'});

// BorrowerSchema.belongsTo(DocumentSchema, { foreignKey: { allowNull: false, name: 'documentId' } });
BorrowerSchema.belongsTo(ReaderSchema, { foreignKey: { allowNull: false, name: 'readerId' } });
BorrowerSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });

BorrowerDetailSchema.belongsTo(BorrowerSchema, { foreignKey: { allowNull: false, name: 'borrowerId' } });
BorrowerDetailSchema.belongsTo(DocumentSchema, { foreignKey: { allowNull: false, name: 'documentId' } });
BorrowerDetailSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });

BorrowerSchema.hasMany(BorrowerDetailSchema,  { as: {
  singular: 'borrowerDetail', // Singular form of the alias
  plural: 'borrowerDetails',  // Plural form of the alias
}, foreignKey:  { allowNull: false, name: 'borrowerId' } })

DocumentSchema.belongsTo(AuthorSchema, { foreignKey: { allowNull: false, name: 'authorId' } });
DocumentSchema.belongsTo(PublisherSchema, { foreignKey: { allowNull: false, name: 'publisherId' } });
DocumentSchema.belongsTo(DocumentTypeSchema, { foreignKey: { allowNull: false, name: 'documentTypeId' } });
DocumentSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });
DocumentSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'updatedBy' } });

ReaderSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });
ReaderSchema.belongsTo(ReaderTypeSchema, { foreignKey: { allowNull: false, name: 'readerTypeId' } });
ReaderTypeSchema.hasOne(ReaderSchema);
ReaderSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'updatedBy' } });

ReturnerSchema.belongsTo(ReaderSchema, { foreignKey: { allowNull: false, name: 'readerId' } });
ReturnerSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });

ReturnerDetailSchema.belongsTo(ReturnerSchema, { foreignKey: { allowNull: false, name: 'returnerId' } });
ReturnerDetailSchema.belongsTo(BorrowerDetailSchema, { foreignKey: { allowNull: false, name: 'borrowerDetailId' } });
ReturnerDetailSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });

UserSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });
UserSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'updatedBy' } });

export const unitOfWork = (callback: any) => {
  const isolationLevel = Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
  return new Promise((resolve, reject) => {
    sequelize.transaction({ isolationLevel }, callback)
      .then((value) => {
        resolve(value);
      })
      .catch((error) => {
        reject(error);
      });
  });
}