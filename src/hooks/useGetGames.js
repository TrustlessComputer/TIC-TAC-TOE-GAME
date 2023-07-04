import useContractSigner from "./useContractSigner";
import sleep from "../utils/sleep";
import {SLEEP_TIME, COUNTER_TIME} from "../constants/configs";
import {ZeroAddress} from "ethers";

const useGetGames = () => {
    const contractSigner = useContractSigner();

    const gamesBuilder = (games) => {
        return {
            player1: games[0],
            player2: games[1],
            winner: games[2].toString(),
            turn: games[3].toString(),
        }
    }

    const onWaitingGames = async (gameID) => {
        let games = undefined;
        let counter = 0;
        try {
            while (true) {
                const _games = await contractSigner.games(gameID);
                const mapper = gamesBuilder(_games);
                if (counter === COUNTER_TIME) {
                    throw new Error(`Timeout.`);
                }

                counter++;
                if (mapper.player1 === ZeroAddress || mapper.player2 === ZeroAddress) {
                    await sleep(SLEEP_TIME);
                    continue;
                }
                games = mapper;
                break
            }
        } catch (error) {
            console.log('LOGGER--- GET GAMES ERROR: ', error)
        }
        return games
    }

    const onWaitingUpdateNextMove = async ({ gameID, roleNumber }) => {
        let counter = 0;
        let games = undefined
        try {
            while (true) {
                const _games = await contractSigner.games(gameID);
                const mapper = gamesBuilder(_games);
                if (counter === COUNTER_TIME) {
                    throw new Error('Timeout.');
                }

                counter++;
                if (mapper.turn === roleNumber && mapper.winner === '0') {
                    await sleep(SLEEP_TIME);
                    continue;
                }

                games = mapper
                break
            }
            return games
        } catch (error) {
            console.log('LOGGER--- GET GAMES ERROR: ', error)
        }
    }

    const onGetWinner = async ({ gameID }) => {
        try {
            const _games = await contractSigner.games(gameID);
            const mapper = gamesBuilder(_games);
            return mapper.winner
        } catch (error) {
            console.log('LOGGER--- GET GAMES ERROR: ', error)
        }
    }

    return {
        onWaitingGames,
        onWaitingUpdateNextMove,
        onGetWinner
    }
}

export default useGetGames