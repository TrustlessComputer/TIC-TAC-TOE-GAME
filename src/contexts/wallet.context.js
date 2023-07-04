import React from 'react'
import { getStoragePrvKey } from "../libs/account/account";
import CreateWallet from "../modules/CreateWallet/CreateWallet";
import { ethers } from "ethers";
import Loader from "../components/Spinner/Loader";

const INIT_KEY_SET = {
    prvKey: undefined,
    address: undefined
}

const initialValue = {
    keySet: {
        ...INIT_KEY_SET
    }
};

export const WalletContext = React.createContext(initialValue);

export const WalletProvider = ({ children }) => {
    const [initing, setIniting] = React.useState(true);
    const [isCreate, setIsCreate] = React.useState(false);
    const [keySet, setKeySet] = React.useState(INIT_KEY_SET)

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
            setKeySet({
                prvKey: storagePrvKey,
                address
            })
            console.log("LOGGER---- USER INFO: ", {
                address
            })
            setIsCreate(false)
        }
        setIniting(false);
    }

    const contextValues = React.useMemo(() => {
        return {
            keySet
        };
    }, [keySet]);

    React.useEffect(onPreLoader, [])

    return (
        <WalletContext.Provider value={contextValues}>
            {renderContent()}
        </WalletContext.Provider>
    );
};
