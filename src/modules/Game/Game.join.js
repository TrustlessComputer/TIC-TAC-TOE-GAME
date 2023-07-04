import { AnimatePresence, motion } from "framer-motion";
import React, {useContext} from 'react';
import useContractSigner from "../../hooks/useContractSigner";
import useGetGames from "../../hooks/useGetGames";
import Spinner from "../../components/Spinner/Spinner";
import {WalletContext} from "../../contexts/wallet.context";

const JoinGame = ({ show, onCancel, onSuccess }) => {
    const [gameID, setGameID] = React.useState(undefined);
    const [loading, setLoading] = React.useState(false);

    const contractSigner = useContractSigner()
    const { onWaitingGames } = useGetGames()
    const { keySet } = useContext(WalletContext)

    const onJoinGame = async () => {
        try {
            setLoading(true)
            const tx = await contractSigner.joinGame(gameID);
            await tx.wait();
            const games = await onWaitingGames(gameID);
            if (games.player1.toLowerCase() === keySet.address.toLowerCase() || games.player2.toLowerCase() === keySet.address.toLowerCase()) {
                onSuccess({
                    games,
                    gameID
                })
            } else {
                alert('Can not join the game.')
            }

        } catch (error) {
            console.log('LOGGER--- JOIN GAME ERROR: ', error)
            alert(error?.message || "JOIN GAME ERROR")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key={"parent-box"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="winner"
                >
                    <motion.div
                        key={"child-box"}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="text"
                    >
                        <motion.h2
                            initial={{ scale: 0, y: 100 }}
                            animate={{
                                scale: 1,
                                y: 0,
                                transition: {
                                    y: { delay: 0.7 },
                                    duration: 0.7,
                                },
                            }}
                        >
                            Join The Game
                        </motion.h2>
                        <motion.input
                            initial={{ scale: 0 }}
                            className="input-join-game"
                            animate={{
                                scale: 1,
                                transition: {
                                    delay: 1.3,
                                    duration: 0.2,
                                },
                            }}
                            autoFocus={true}
                            onChange={(event) => {
                                setGameID(event?.target.value)
                            }}
                        >
                        </motion.input>
                        {loading && (<Spinner/>)}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{
                                scale: 1,
                                transition: { delay: 1.5, duration: 0.3 },
                            }}
                            style={{ display: 'flex' }}
                        >
                            <button className="button" onClick={() => onCancel()}>Cancel</button>
                            <button className="button" onClick={onJoinGame}>Join</button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
};

export default JoinGame;