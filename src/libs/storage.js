export class StorageService {
    _getKey = (key) => key;

    set(key, data) {
        const _key = this._getKey(key);
        const dataStr = JSON.stringify(data);
        return localStorage.setItem(_key, dataStr);
    }

    get(key) {
        const _key = this._getKey(key);
        const dataStr = localStorage.getItem(_key);
        return dataStr ? JSON.parse(dataStr) : undefined;
    }

    remove(key) {
        const _key = this._getKey(key);
        return localStorage.removeItem(_key);
    }
}

const storageLocal = new StorageService();

export default storageLocal;
