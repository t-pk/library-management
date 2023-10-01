import { createAuthors, authorSeeds } from './author';
import { createDocuments, documentSeeds } from './document';
import { createPublisher, publisherSeeds } from './publisher';
import { createReaders, readerSeeds } from './reader';

(async () => {
  await createAuthors(authorSeeds);
  await createPublisher(publisherSeeds);
  await createDocuments(documentSeeds);
  await createReaders(readerSeeds);
  process.exit();
})();
