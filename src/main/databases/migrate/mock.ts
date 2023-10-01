import { createAuthors, authorSeeds } from './author';
import { createDocuments, documentSeeds } from './document';
import { createPublisher, publisherSeeds } from './publisher';

(async () => {
  await createAuthors(authorSeeds);
  await createPublisher(publisherSeeds);
  await createDocuments(documentSeeds);
  process.exit();
})();
