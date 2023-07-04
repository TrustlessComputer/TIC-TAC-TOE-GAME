import React, {useContext, useEffect, useState} from "react";
import Square from "../../components/Square";
import { AssetsContext } from "../../contexts/assets.context";
import Loader from "../../components/Spinner/Loader";
import GameHeader from "./Game.header";
import GameEnd from "./Game.end";
import JoinGame from "./Game.join";
import './styles.scss'
import Spinner from "../../components/Spinner/Spinner";
import CreateGame from "./Game.create";
import { WalletContext } from "../../contexts/wallet.context";
import useMakeMoves from "../../hooks/useMakeMoves";
import useGetGameState from "../../hooks/useGetGameState";
import useGetGames from "../../hooks/useGetGames";

let interval = undefined;

function Game() {
    const { balance, isNeedTopupTC } = useContext(AssetsContext);
    const { keySet } = useContext(WalletContext);
    const { onMakeMoves } = useMakeMoves();
    const { onGetWinner } = useGetGames()
    const [squares, setSquares] = useState(Array(9).fill(""));
    const [turn, setTurn] = useState("x");
    const [loading, setLoading] = React.useState(false)

    const [showJoin, setShowJoin] = React.useState(false);
    const [showCreate, setShowCreate] = React.useState(false);

    const [gameInfo, setGameInfo] = React.useState({
        myRole: undefined,
        gameID: undefined,
        ruleNumber: undefined,
        winner: undefined
    });

    const { onGetGameState } = useGetGameState();

    const _onGetGameState = async (gameID) => {
        try {
            const [
                { squares, newTurn },
                winner
            ] = await Promise.all([
                await onGetGameState(gameID),
                onGetWinner({ gameID })
            ]);
            setSquares(squares);
            setTurn(newTurn)
            setGameInfo(value => ({
                ...value,
                winner: winner
            }))
        } catch (error) {
            alert(error.message || "GET GAME STATE ERROR: ")
        }
    }

    const throttleGetGameState = React.useCallback(_onGetGameState, [])

    const updateSquares = async (ind) => {
        if (loading) {
            alert("Please waiting.")
            return;
        }
        if (!gameInfo.gameID) {
            alert("Please join or create new game")
            return;
        }
        if (turn !== gameInfo.myRole) {
            alert("Please waiting to your role")
            return;
        }
        try {
            setLoading(true)
            const { games } = await onMakeMoves({ gameID: gameInfo.gameID, moveIdx: ind, roleNumber: gameInfo.ruleNumber });
            onGetGameState(gameInfo.gameID)
            if (games?.winner !== '0') {
                setGameInfo(value => ({
                    ...value,
                    winner: games.winner
                }))
            }
        } catch (error) {
            alert(error?.message || "Move error.")
        } finally {
            setLoading(false)
        }
    };

    const resetGame = () => {
        setSquares(Array(9).fill(""));
        setTurn('x');
        setGameInfo({
            gameID: undefined,
            myRole: undefined,
            ruleNumber: undefined,
            winner: undefined
        })
        setLoading(false)
    };

    const handleJoinGame = ({ games, gameID }) => {
        resetGame();
        const isPlayer1 = keySet.address.toLowerCase() === games.player1.toLowerCase();
        setGameInfo({
            myRole: isPlayer1 ? 'x' : 'o',
            gameID,
            ruleNumber: isPlayer1 ? "1" : "2",
            winner: games.winner
        })
        setShowJoin(false);
        setShowCreate(false)
    }

    useEffect(() => {
        if (!gameInfo.gameID) {
            if (interval) {
                clearInterval(interval);
                interval = undefined;
            }
            return;
        }
        throttleGetGameState(gameInfo.gameID)
        interval = setInterval(() => throttleGetGameState(gameInfo.gameID), 1000)

        return () => {
            clearInterval(interval);
            interval = undefined;
        }
    }, [gameInfo.gameID])

    if (!balance?.isLoaded) {
        return <Loader />
    }

    return (
        <div className="tic-tac-toe game-container">
            <GameHeader />
            <h1>{gameInfo.gameID ? "Your role" : "TIC TAC TOE"}</h1>
            {!!gameInfo.gameID && (
                <div className={`turn myrole`}>
                    <Square clsName={`${gameInfo.myRole}`} />
                </div>
            )}
            {(balance?.isLoaded && !gameInfo.gameID && !isNeedTopupTC) && (
                <>
                    <button
                        onClick={() => {
                            setShowCreate(true)
                        }}
                    >
                        New Game
                    </button>
                    <button onClick={() => setShowJoin(true)}>
                        Join Game
                    </button>
                </>
            )}

            <>
                {loading && (
                    <div className="wrap-loader">
                        <Spinner />
                    </div>
                )}
                <div className="game">
                    {Array.from("012345678").map((ind) => (
                        <Square
                            key={ind}
                            ind={ind}
                            updateSquares={updateSquares}
                            clsName={squares[ind]}
                        />
                    ))}
                </div>
                <div className={`turn ${turn === "x" ? "left" : "right"}`}>
                    <Square clsName="x" />
                    <Square clsName="o" />
                </div>
                {gameInfo.winner && gameInfo.winner !== '0' && (
                    <GameEnd resetGame={resetGame} winner={gameInfo.winner} myRole={gameInfo.ruleNumber}/>
                )}
                {!!showCreate && (
                    <CreateGame
                        show={showCreate}
                        onSuccess={handleJoinGame}
                        onCancel={() => {
                            setShowCreate(false);
                            resetGame();
                        }}
                    />
                )}
                {!!showJoin && (
                    <JoinGame
                        show={showJoin}
                        onSuccess={handleJoinGame}
                        onCancel={() => {
                            setShowJoin(false);
                            resetGame();
                        }}
                    />
                )}
            </>
        </div>
    );
}

export default Game;
