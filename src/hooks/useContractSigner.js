import {useContext, useMemo} from 'react';
import {CONTRACT_ADDRESS} from "../constants/configs";
import useProvider from "./useProvider";
import {WalletContext} from "../contexts/wallet.context";
import {getContractSigner} from "../libs/contract.signer";
import GameABI from "../abis/game.json";

function useContractSigner() {
    const provider = useProvider();
    const { keySet } = useContext(WalletContext)

    return useMemo(() => {
        try {
            if (!keySet || !provider) return undefined
            const contract = getContractSigner(CONTRACT_ADDRESS, GameABI, provider, keySet.prvKey);
            return contract;
        } catch (error) {
            return undefined;
        }
    }, [provider, keySet.prvKey]);
}

export default useContractSigner;
