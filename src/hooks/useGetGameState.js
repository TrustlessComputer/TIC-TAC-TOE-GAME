import useContractSigner from "./useContractSigner";
import {flatten} from "lodash/array";

const useGetGameState = () => {
    const contractSigner = useContractSigner();
    // getGameState
    const onGetGameState = async (gameID) => {
        if (!gameID) return undefined
        const gameState = await contractSigner.getGameState(gameID);

        const squares = flatten(gameState).map(item => {
            const value = item.toString();
            let data = '';
            switch (value) {
                case '0':
                    data = '';
                    break;
                case '1':
                    data = 'x';
                    break;
                case '2':
                    data = 'o';
                    break;
            }
            return data
        });

        const player1Moved = squares.filter(item => item === 'x').length;
        const player2Moved = squares.filter(item => item === 'o').length;

        console.log('LOGGER---- GAME STATE: ', squares)

        return {
            squares,
            newTurn: player1Moved > player2Moved ? 'o' : 'x'
        }
    };

    return {
        onGetGameState
    }
}

export default useGetGameState