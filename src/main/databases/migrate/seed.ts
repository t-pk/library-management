import { createDocumentTypes, documentTypeSeeds } from './document-type';
import { createReaderTypes, readerTypeSeeds } from './reader-type';
import { createUsers, userSeeds } from './user';

(async () => {
  await createUsers(userSeeds);
  await createDocumentTypes(documentTypeSeeds);
  await createReaderTypes(readerTypeSeeds);
  process.exit();
})()