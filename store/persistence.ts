import type { RootState } from './store';

const DB_NAME = 'bizop-db';
const STORE_NAME = 'state';
const KEY = 'root';

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const loadState = async (): Promise<Partial<RootState> | undefined> => {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return await new Promise((resolve, reject) => {
      const request = store.get(KEY);
      request.onsuccess = () => resolve(request.result as Partial<RootState> | undefined);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return undefined;
  }
};

export const saveState = async (state: RootState): Promise<void> => {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(state, KEY);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // no-op
  }
};
