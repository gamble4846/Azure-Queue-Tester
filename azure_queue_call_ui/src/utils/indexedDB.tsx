const DB_NAME = 'myDatabase';
const DB_VERSION = 1;
const CLIENT_STORE = 'clients';
const MESSAGE_STORE = 'messages';
const QUEUE_STORE = 'queues';
const SEND_MESSAGE_STORE = 'sendMessages';

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CLIENT_STORE)) {
        db.createObjectStore(CLIENT_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(MESSAGE_STORE)) {
        db.createObjectStore(MESSAGE_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(QUEUE_STORE)) {
        db.createObjectStore(QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(SEND_MESSAGE_STORE)) {
        db.createObjectStore(SEND_MESSAGE_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event: Event) => {
      reject('Database error: ' + request.error);
    };
  });
};

const addData = (storeName: string, data: any) => {
  return openDB().then(db => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      store.add(data);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event: Event) => {
        reject('Transaction error: ' + transaction.error);
      };
    });
  });
};

const getData = (storeName: string) => {
  return openDB().then(db => {
    return new Promise<any[]>((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event: Event) => {
        reject('Request error: ' + request.error);
      };
    });
  });
};

const updateData = (storeName: string, data: any) => {
  return openDB().then(db => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      store.put(data);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event: Event) => {
        reject('Transaction error: ' + transaction.error);
      };
    });
  });
};

const deleteData = (storeName: string, id: number) => {
  return openDB().then(db => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      store.delete(id);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event: Event) => {
        reject('Transaction error: ' + transaction.error);
      };
    });
  });
};

export const addClientData = (data: any) => addData(CLIENT_STORE, data);
export const getClientData = () => getData(CLIENT_STORE);
export const updateClientData = (data: any) => updateData(CLIENT_STORE, data);
export const deleteClientData = (id: number) => deleteData(CLIENT_STORE, id);

export const addMessageData = (data: any) => addData(MESSAGE_STORE, data);
export const getMessageData = () => getData(MESSAGE_STORE);
export const updateMessageData = (data: any) => updateData(MESSAGE_STORE, data);
export const deleteMessageData = (id: number) => deleteData(MESSAGE_STORE, id);

export const addQueueData = (data: any) => addData(QUEUE_STORE, data);
export const getQueueData = () => getData(QUEUE_STORE);
export const updateQueueData = (data: any) => updateData(QUEUE_STORE, data);
export const deleteQueueData = (id: number) => deleteData(QUEUE_STORE, id);

export const addSendMessageData = (data: any) => addData(SEND_MESSAGE_STORE, data);
export const getSendMessageData = () => getData(SEND_MESSAGE_STORE);
export const updateSendMessageData = (data: any) => updateData(SEND_MESSAGE_STORE, data);
export const deleteSendMessageData = (id: number) => deleteData(SEND_MESSAGE_STORE, id);
