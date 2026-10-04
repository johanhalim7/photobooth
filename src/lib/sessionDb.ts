export interface SessionRecord {
  id: string;
  createdAt: number;
  image: string; // dataURL PNG hasil akhir
  layout: string;
}

const DB_NAME = "photobooth-db";
const STORE = "sessions";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const req = run(t.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    t.oncomplete = () => db.close();
  });
}

export const saveSession = (rec: SessionRecord) => tx("readwrite", (s) => s.put(rec));
export const listSessions = async (): Promise<SessionRecord[]> => {
  const all = await tx<SessionRecord[]>("readonly", (s) => s.getAll());
  return all.sort((a, b) => b.createdAt - a.createdAt);
};
export const deleteSession = (id: string) => tx("readwrite", (s) => s.delete(id));
export const clearSessions = () => tx("readwrite", (s) => s.clear());
