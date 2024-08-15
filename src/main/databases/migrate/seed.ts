import { createDocumentTypes, documentTypeSeeds } from './document-type';
import { createUsers, userSeeds } from './user';

(async () => {
  await createUsers(userSeeds);
  await createDocumentTypes(documentTypeSeeds);
  process.exit();
})();
