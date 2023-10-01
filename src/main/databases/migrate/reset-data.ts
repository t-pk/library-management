import {
  AuthorSchema,
  BorrowSchema,
  BorrowDetailSchema,
  DocumentSchema,
  DocumentTypeSchema,
  PenaltySchema,
  PublisherSchema,
  ReaderSchema,
  ReaderTypeSchema,
  RemindSchema,
  ReturnDetailSchema,
  ReturnSchema,
  UserSchema,
} from '../db';

(async () => {
  Promise.all([
    RemindSchema.destroy({ truncate: true, cascade: true }),
    ReturnSchema.destroy({ truncate: true, cascade: true }),
    ReturnDetailSchema.destroy({ truncate: true, cascade: true }),
    PenaltySchema.destroy({ truncate: true, cascade: true }),
    ReaderSchema.destroy({ truncate: true, cascade: true }),
    BorrowDetailSchema.destroy({ truncate: true, cascade: true }),
    BorrowSchema.destroy({ truncate: true, cascade: true }),
    DocumentTypeSchema.destroy({ truncate: true, cascade: true }),
    ReaderTypeSchema.destroy({ truncate: true, cascade: true }),
    PublisherSchema.destroy({ truncate: true, cascade: true }),
    DocumentSchema.destroy({ truncate: true, cascade: true }),
    AuthorSchema.destroy({ truncate: true, cascade: true }),
    UserSchema.destroy({ truncate: true, cascade: true }),
  ]).then((res) => process.exit());
})();
