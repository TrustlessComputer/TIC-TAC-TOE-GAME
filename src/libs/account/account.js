import CryptoJS from 'crypto-js';
import accountStorage from "./account.storage";
import * as ethers from "ethers";

const generatePrvKey = () => {
    try {
        const id = CryptoJS.lib.WordArray.random(32);
        const privateKey = "0x" + id;
        const address = new ethers.Wallet(privateKey).address;
        if (!address) {
            throw new Error("Create wallet error.")
        }
        accountStorage.setAccount(privateKey)
        return privateKey
    } catch (e) {
        alert('Create wallet error.')
    }

}

const getStoragePrvKey = () => {
    return accountStorage.getAccount();
}

export {
    generatePrvKey,
    getStoragePrvKey
}