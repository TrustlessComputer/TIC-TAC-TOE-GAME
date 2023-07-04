import useContractSigner from "./useContractSigner";
import {INDEX_TO_GEO_MAPPER} from "../modules/Game/utils";
import useGetGames from "./useGetGames";

const useMakeMoves = () => {
    const contractSigner = useContractSigner();
    const { onWaitingUpdateNextMove } = useGetGames()

    const onMakeMoves = async ({ gameID, moveIdx, roleNumber }) => {
        const geo = INDEX_TO_GEO_MAPPER[Number(moveIdx)];
        await contractSigner.makeMove(gameID, geo.x, geo.y);
        // await tx.wait();
        const games = await onWaitingUpdateNextMove({ gameID, roleNumber });
        return { games }
    };

    return {
        onMakeMoves
    }
}

export default useMakeMoves