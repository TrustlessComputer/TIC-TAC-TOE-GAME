import { useMemo } from 'react';
import { ethers } from 'ethers';
import { TC_LAYER2 } from "../constants/configs";

function useProvider() {
    return useMemo(() => {
        try {
            return new ethers.JsonRpcProvider(TC_LAYER2.RPC);
        } catch (error) {
            return undefined;
        }
    }, []);
}

export default useProvider;
