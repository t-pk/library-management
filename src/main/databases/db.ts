import pg from 'pg';
import Sequelize, { ConnectionRefusedError } from 'sequelize';
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
import { getUser } from './logic/user';
import { createDocument, getDocuments } from './logic/document';
import { createAuthor, getAuthors } from './logic/author';
import { createPublisher, getPublishers } from './logic/publisher';
import { getDocumentTypes } from './logic/document-type';
import { getReaderTypes } from './logic/reader-type';
import { createReader, getReaders } from './logic/reader';
import { createBorrow, getBorrows } from './logic/borrow';
import { getBorrowDetail } from './logic/borrow-detail';
import { createReturn, getReturns } from './logic/return';
import { createRemind, getRemindDetails, getReminds } from './logic/remind';
import { createPenalty, getPenalties } from './logic/penalty';
import {
  Document,
  Author,
  Borrow,
  BorrowDetail,
  DocumentType,
  Penalty,
  Publisher,
  Reader,
  ReaderType,
  Remind,
  Return,
  User,
  RemindDetail,
  DocumentRequest,
} from '../../renderer/constants';
import { IDocumentRequest } from './schema/document-request';
import { createDocumentRequest, getDocumentRequests } from './logic/document-request';

const urlConnection = 'postgres://postgres:123456@localhost:5433/library';

export const sequelize = new Sequelize.Sequelize(urlConnection, {
  dialectModule: pg,
  logging: process.env.NODE_ENV === 'production' ? false : true,
  pool: { max: 5, min: 0, idle: 10000 },
});

const attributeCommon = {
  paranoid: false,
  updatedAt: true,
  createdAt: true,
  underscored: true,
  deletedAt: false,
};

/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const BorrowSchema = sequelize.define('borrows', IBorrow, { ...attributeCommon, updatedAt: false, tableName: 'borrows' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const BorrowDetailSchema = sequelize.define('borrowDetails', IBorrowDetail, { ...attributeCommon, updatedAt: false, tableName: 'borrow_details' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const DocumentSchema = sequelize.define('documents', IDocument, { ...attributeCommon, tableName: 'documents' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReaderSchema = sequelize.define('readers', IReader, { ...attributeCommon, tableName: 'readers' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReturnSchema = sequelize.define('returns', IReturn, { ...attributeCommon, updatedAt: false, tableName: 'returns' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReturnDetailSchema = sequelize.define('returnDetails', IReturnDetail, { ...attributeCommon, updatedAt: false, tableName: 'return_details' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const UserSchema = sequelize.define('users', IUser, { ...attributeCommon, tableName: 'users' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const AuthorSchema = sequelize.define('authors', IAuthor, { ...attributeCommon, tableName: 'authors' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const PublisherSchema = sequelize.define('publishers', IPublisher, { ...attributeCommon, tableName: 'publishers' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const DocumentTypeSchema = sequelize.define('documentTypes', IDocumentType, { ...attributeCommon, tableName: 'document_types' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const ReaderTypeSchema = sequelize.define('readerTypes', IReaderType, { ...attributeCommon, tableName: 'reader_types' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const RemindSchema = sequelize.define('reminds', IRemind, { ...attributeCommon, tableName: 'reminds' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const PenaltySchema = sequelize.define('penalties', IPenalty, { ...attributeCommon, tableName: 'penalties' });
/** @type import("sequelize").ModelStatic<import("sequelize").Model> */
export const DocumentRequestSchema = sequelize.define('documentRequests', IDocumentRequest, {
  ...attributeCommon,
  tableName: 'document_requests',
  updatedAt: false,
});

AuthorSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });
AuthorSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'updatedBy' } });

BorrowSchema.belongsTo(ReaderSchema, { foreignKey: { allowNull: false, name: 'readerId' } });
BorrowSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });
BorrowSchema.hasOne(ReturnSchema);

BorrowDetailSchema.belongsTo(BorrowSchema, { foreignKey: { allowNull: false, name: 'borrowId' } });
BorrowDetailSchema.belongsTo(DocumentSchema, { foreignKey: { allowNull: false, name: 'documentId' } });
BorrowDetailSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' }, as:'createdInfo' });
BorrowDetailSchema.hasOne(ReturnDetailSchema, { foreignKey: { allowNull: true, name: 'borrowDetailId' } });

DocumentSchema.belongsTo(AuthorSchema, { foreignKey: { allowNull: false, name: 'authorId' } });
DocumentSchema.belongsTo(PublisherSchema, { foreignKey: { allowNull: false, name: 'publisherId' } });
DocumentSchema.belongsTo(DocumentTypeSchema, { foreignKey: { allowNull: false, name: 'documentTypeId' } });
DocumentSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' }, as:'createdInfo' });
DocumentSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'updatedBy' }, as:'updatedInfo' });

ReaderSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' }, as:'createdInfo' });
ReaderSchema.belongsTo(ReaderTypeSchema, { foreignKey: { allowNull: false, name: 'readerTypeId' } });
ReaderSchema.hasMany(BorrowSchema);
ReaderSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'updatedBy' }, as:'updatedInfo' });
ReaderTypeSchema.hasOne(ReaderSchema);

ReturnSchema.belongsTo(ReaderSchema, { foreignKey: { allowNull: false, name: 'readerId' } });
ReturnSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });
ReturnSchema.hasOne(PenaltySchema);
ReturnSchema.hasOne(RemindSchema);
ReturnSchema.belongsTo(BorrowSchema, { foreignKey: { allowNull: false, name: 'borrowId' } });

ReturnDetailSchema.belongsTo(ReturnSchema, { foreignKey: { allowNull: false, name: 'returnId' } });
ReturnDetailSchema.belongsTo(BorrowDetailSchema, { foreignKey: { allowNull: false, name: 'borrowDetailId' } });
ReturnDetailSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } , as:'createdInfo' });

UserSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' } });
UserSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'updatedBy' } });

RemindSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' }, as:'createdInfo' });
RemindSchema.belongsTo(ReturnSchema, { foreignKey: { allowNull: false, name: 'returnId' } });

PenaltySchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' }, as:'createdInfo'  });
PenaltySchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'updatedBy' }, as:'updatedInfo'  });
PenaltySchema.belongsTo(ReturnSchema, { foreignKey: { allowNull: false, name: 'returnId' } });

DocumentRequestSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'createdBy' }, as:'createdInfo' });
DocumentRequestSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'approvedBy' }, as:'approvedInfo' });
DocumentRequestSchema.belongsTo(UserSchema, { foreignKey: { allowNull: true, name: 'rejectedBy' }, as:'rejectedInfo' });

export const handleData = async (arg: any, data: any) => {
  let result;
  try {
    switch (arg.key) {
      case User.login:
        result = await getUser(data);
        break;
      case Document.search:
        result = await getDocuments(data);
        break;
      case Document.create:
        result = await createDocument(data);
        break;
      case Author.create:
        result = await createAuthor(data);
        break;
      case Author.search:
        result = await getAuthors(data);
        break;
      case Publisher.create:
        result = await createPublisher(data);
        break;
      case Publisher.search:
        result = await getPublishers(data);
        break;
      case DocumentType.search:
        result = await getDocumentTypes(data);
        break;
      case ReaderType.search:
        result = await getReaderTypes(data);
        break;
      case Reader.create:
        result = await createReader(data);
        break;
      case Reader.search:
        result = await getReaders(data);
        break;
      case Borrow.create:
        result = await createBorrow(data);
        break;
      case Borrow.search:
        result = await getBorrows(data);
        break;
      case BorrowDetail.search:
        result = await getBorrowDetail(data);
        break;
      case Return.create:
        result = await createReturn(data);
        break;
      case Return.search:
        result = await getReturns(data);
        break;
      case Remind.create:
        result = await createRemind(data);
        break;
      case Remind.search:
        result = await getReminds(data);
        break;
      case Penalty.create:
        result = await createPenalty(data);
        break;
      case Penalty.search:
        result = await getPenalties(data);
        break;
      case RemindDetail.search:
        result = await getRemindDetails(data);
        break;
      case DocumentRequest.create:
        result = await createDocumentRequest(data);
        break;
      case DocumentRequest.search:
        result = await getDocumentRequests(data);
        break;

      default:
        break;
    }
    return result;
  } catch (error) {
    console.log(error);
    if (error instanceof ConnectionRefusedError) {
      throw `Cannot connect to Database ${error.message}`;
    }
    throw error;
  }
};

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
