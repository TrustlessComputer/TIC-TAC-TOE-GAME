import { StorageService } from "../storage";

class AccountStorage extends StorageService {
    ACCOUNT_KEY = "ACCOUNT_STORAGE";

    getAccountKey = () => this.ACCOUNT_KEY;

    getAccount = () => {
        const key = this.getAccountKey();
        const account = this.get(key)
        return account;
    };

    setAccount = (privateKey) => {
        const key = this.getAccountKey();
        this.set(key, privateKey)
    };
}

const accountStorage = new AccountStorage();

export default accountStorage;