/**
 * Cover photos for Explore trip cards and destination tiles.
 *
 * Trips (and most regions) don't carry their own imagery yet, so each one
 * is given a curated photo matching its imageType. The pick is derived from
 * its id, so an item always shows the same photo while neighbours of the
 * same landscape usually differ. An `imageUrl` from the backend always wins.
 */

const unsplash = (id) =>
  `https://images.unsplash.com/photo-${id}?w=900&h=600&fit=crop&auto=format&q=70`;

const PHOTOS = {
  mountain: [
    '1626621341517-bbf3d9990a23',
    '1506905925346-21bda4d32df4',
    '1464822759023-fed622ff2c3b',
    '1519681393784-d120267933ba',
    '1589182373726-e4f658ab50f0',
    '1581793745862-99fde7fa73d2',
    '1544735716-392fe2489ffa',
    '1483728642387-6c3bdd6c93e5',
  ],
  snow: [
    '1454496522488-7a8e488e8606',
    '1491002052546-bf38f186af56',
    '1418985991508-e47386d96a71',
    '1517299321609-52687d1bc55a',
  ],
  valley: [
    '1470071459604-3b5ec3a7fe05',
    '1500534314209-a25ddb2bd429',
    '1472214103451-9374bd1c798e',
    '1506744038136-46273834b3fb',
    '1501785888041-af3ef285b470',
  ],
  beach: [
    '1507525428034-b723cf961d3e',
    '1512343879784-a960bf40e7f2',
    '1559128010-7c1ad6e1b6a5',
    '1519046904884-53103b34b206',
    '1602216056096-3b40cc0c9944',
    '1593693397690-362cb9666fc2',
    '1505228395891-9a51e7e86bf6',
  ],
  desert: [
    '1477587458883-47145ed94245',
    '1509316785289-025f5b846b35',
    '1599661046289-e31897846e41',
    '1547234935-80c7145ec969',
  ],
  jungle: [
    '1448375240586-882707db888b',
    '1441974231531-c6227db76b6e',
    '1518495973542-4542c06a5843',
    '1433086966358-54859d0ed716',
  ],
};

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getCoverImage(item) {
  if (!item) return null;
  if (item.imageUrl) return item.imageUrl;
  const pool = PHOTOS[item.imageType] || PHOTOS.mountain;
  const seed = String(item._id || item.title || item.name || '');
  return unsplash(pool[hashString(seed) % pool.length]);
}
