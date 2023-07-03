import React from 'react'
import { getStoragePrvKey } from "../libs/account/account";
import CreateWallet from "../modules/CreateWallet/CreateWallet";
import { ethers } from "ethers";
import Loader from "../components/Spinner/Loader";

const initialValue = {
    privateKey: undefined,
    address: undefined,
};

export const WalletContext = React.createContext(initialValue);

export const WalletProvider = ({ children }) => {
    const [initing, setIniting] = React.useState(true);
    const [privateKey, setPrivateKey] = React.useState(undefined);
    const [address, setAddress] = React.useState(undefined);
    const [isCreate, setIsCreate] = React.useState(false);

    const renderContent = () => {
        if (initing) return <Loader />;
        if (isCreate) return <CreateWallet preload={onPreLoader} />
        return children;
    };

    const onPreLoader = () => {
        setIniting(true);
        const storagePrvKey = getStoragePrvKey();
        if (!storagePrvKey) {
            setIsCreate(true)
        } else {
            const address = new ethers.Wallet(storagePrvKey).address;
            setPrivateKey(storagePrvKey);
            setAddress(address);
            console.log("LOGGER---- USER INFO: ", {
                address
            })
            setIsCreate(false)
        }
        setIniting(false);
    }

    const contextValues = React.useMemo(() => {
        return {
            privateKey,
            address
        };
    }, [privateKey, address]);

    React.useEffect(onPreLoader, [])

    return (
        <WalletContext.Provider value={contextValues}>
            {renderContent()}
        </WalletContext.Provider>
    );
};
