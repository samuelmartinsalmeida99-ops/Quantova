// IndexedDB
const DB_NAME = "quantova";
const DB_VERSION = 1;
const STORE = "transacoes";

function abrirDB() {
  return new Promise(function(resolve, reject) {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = function(e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
        store.createIndex("tipo", "tipo", { unique: false });
        store.createIndex("data", "data", { unique: false });
      }
    };
    req.onsuccess = function(e) { resolve(e.target.result); };
    req.onerror = function(e) { reject(e.target.error); };
  });
}

function getTodasTransacoes() {
  return abrirDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = function() { resolve(req.result); };
      req.onerror = function() { reject(req.error); };
    });
  });
}

function adicionarTransacao(dados) {
  return abrirDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      const tx = db.transaction(STORE, "readwrite");
      const req = tx.objectStore(STORE).add(dados);
      req.onsuccess = function() { resolve(req.result); };
      req.onerror = function() { reject(req.error); };
    });
  });
}

function apagarTransacao(id) {
  return abrirDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      const tx = db.transaction(STORE, "readwrite");
      const req = tx.objectStore(STORE).delete(id);
      req.onsuccess = function() { resolve(); };
      req.onerror = function() { reject(req.error); };
    });
  });
}

function apagarTodasTransacoes() {
  return abrirDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      const tx = db.transaction(STORE, "readwrite");
      const req = tx.objectStore(STORE).clear();
      req.onsuccess = function() { resolve(); };
      req.onerror = function() { reject(req.error); };
    });
  });
}