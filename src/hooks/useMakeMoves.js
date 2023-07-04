import useContractSigner from "./useContractSigner";
import {INDEX_TO_GEO_MAPPER} from "../modules/Game/utils";
import {number} from "tc-formatter";
import sleep from "../utils/sleep";
import useGetGames from "./useGetGames";

const useMakeMoves = () => {
    const contractSigner = useContractSigner();
    const { onWaitingUpdateNextMove } = useGetGames()

    const onMakeMoves = async ({ gameID, moveIdx, roleNumber }) => {
        const geo = INDEX_TO_GEO_MAPPER[number(moveIdx)];
        const tx = await contractSigner.makeMove(gameID, geo.x, geo.y);
        // await tx.wait();
        // await sleep(500);
        const games = await onWaitingUpdateNextMove({ gameID, roleNumber });
        return { games }
    };

    return {
        onMakeMoves
    }
}

export default useMakeMoves