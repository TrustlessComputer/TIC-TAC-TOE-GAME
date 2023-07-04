import React, { useContext } from 'react'
import { WalletContext } from "./wallet.context";
import useProvider from "../hooks/useProvider";
import debounce from "lodash/debounce";

const INITIAL_BALANCE = {
    isLoaded: false,
    amount: '0'
};

const initialValue = {
    balance: {
        ...INITIAL_BALANCE
    }
};

export const AssetsContext = React.createContext(initialValue);

export const AssetsProvider = ({ children }) => {
    const { keySet } = useContext(WalletContext);
    const provider = useProvider();

    const [balance, setBalance] = React.useState({
        ...INITIAL_BALANCE
    });

    const onLoadBalance = async () => {
        try {
            const balance = await provider.getBalance(keySet?.address);
            setBalance({
                amount: balance.toString(),
                isLoaded: true
            })
        } catch (e) {
            setBalance({
                amount: '0',
                isLoaded: true
            })
        }
    };

    const debounceLoadBalance = React.useCallback(debounce(onLoadBalance, 1000), []);

    const contextValues = React.useMemo(() => {
        return {
            balance
        };
    }, [balance]);

    React.useEffect(() => {
        debounceLoadBalance()
        const interval = setInterval(() => {
            debounceLoadBalance()
        }, 4000);
        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <AssetsContext.Provider value={contextValues}>
            {children}
        </AssetsContext.Provider>
    );
};
