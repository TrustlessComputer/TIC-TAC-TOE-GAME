import { isAddress, Wallet, ZeroAddress, Contract } from "ethers";

const getWalletSigner = ({
    privateKey,
    provider
}) => {
    const wallet = new Wallet(privateKey);
    return wallet.connect(provider);
};

const getContractSigner = (address, ABI, provider, privateKey) => {
    if (!isAddress(address) || address === ZeroAddress) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }
    const walletSigner = getWalletSigner({ privateKey, provider });
    return new Contract(address, ABI, walletSigner);
};

export {
    getWalletSigner,
    getContractSigner
}