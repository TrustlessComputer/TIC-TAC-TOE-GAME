import React from 'react'
import Spinner from "../components/Spinner/Spinner";
import { getStoragePrvKey } from "../libs/account/account";
import CreateWallet from "../modules/CreateWallet/CreateWallet";

const initialValue = {
    privateKey: undefined
};

export const WalletContext = React.createContext(initialValue);

export const WalletProvider = ({ children }) => {
    const [initing, setIniting] = React.useState(true);
    const [privateKey, setPrivateKey] = React.useState(undefined);
    const [isCreate, setIsCreate] = React.useState(false);

    const renderContent = () => {
        if (initing) return <Spinner />;
        if (isCreate) return <CreateWallet preload={onPreLoader} />
        return children;
    };

    const onPreLoader = () => {
        setIniting(true);
        const storagePrvKey = getStoragePrvKey();
        if (!storagePrvKey) {
            setIsCreate(true)
        } else {
            setPrivateKey(storagePrvKey)
            setIsCreate(false)
        }
        setIniting(false);
    }

    const contextValues = React.useMemo(() => {
        return {
            privateKey
        };
    }, [privateKey]);

    React.useEffect(onPreLoader, [])

    return (
        <WalletContext.Provider value={contextValues}>
            {renderContent()}
        </WalletContext.Provider>
    );
};
