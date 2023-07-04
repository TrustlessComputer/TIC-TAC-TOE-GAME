import { AnimatePresence, motion } from "framer-motion";
import Spinner from "../../components/Spinner/Spinner";
import React from 'react';
import useContractSigner from "../../hooks/useContractSigner";
import useProvider from "../../hooks/useProvider";
import { ethers } from 'ethers'

import debounce from "lodash/debounce";
import useGetGames from "../../hooks/useGetGames";
const CreateGame = ({ show, onSuccess, onCancel }) => {
    const [loading, setLoading] = React.useState(false);
    const [gameID, setGameID] = React.useState(undefined);

    const contractSigner = useContractSigner()
    const provider = useProvider()

    const { onWaitingGames } = useGetGames()

    const onCreateGameID = async () => {
        try {
            setLoading(true);
            const tx = await contractSigner.newGame();
            await tx.wait();
            const hash = Object(tx).hash;
            const receipt = await provider.getTransactionReceipt(hash);

            // TODO: REMOVE LATER
            // const receipt = await provider.getTransactionReceipt('0xe3abe905a773fc0f695fdc41e06dee36b07fcb37ff517f9ac88ba8efab2f9a4e')
            const logs = receipt.logs;
            const logData = logs[0]
            const abiCoder = ethers.AbiCoder.defaultAbiCoder();
            const game = abiCoder.decode(
                [
                    {
                        "name": "gameId",
                        "type": "uint256"
                    },
                    {
                        "name": "creator",
                        "type": "address"
                    }
                ],
                logData.data
            );
            const gameID = game[0].toString();
            setGameID(gameID)
            const games = await onWaitingGames(gameID);
            onSuccess({
                games,
                gameID
            })
        } catch (error) {
            console.log('LOGGER--- create game error: ', error)
            alert('CREATE GAME ERROR')
        } finally {
            setLoading(false)
        }
    }

    const debounceCreateGameID = React.useCallback(debounce(onCreateGameID, 1000), [])

    React.useEffect(() => {
        if (!contractSigner) return;
        debounceCreateGameID()
    }, [contractSigner])

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
                            {gameID && loading ? 'Waiting user' : 'Create the game'}
                        </motion.h2>
                        {!!gameID && (
                            <motion.h3
                                initial={{ scale: 0, y: 100 }}
                                animate={{
                                    scale: 1,
                                    y: 0,
                                    transition: {
                                        y: { delay: 0.7 },
                                        duration: 0.7,
                                    },
                                }}
                                style={{ color: 'white' }}
                            >
                                Game ID: {gameID}
                            </motion.h3>
                        )}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{
                                scale: 1,
                                transition: { delay: 1.5, duration: 0.3 },
                            }}
                        >
                            {loading && (
                                <Spinner/>
                            )}
                            <button className="button" onClick={onCancel}>
                                Cancel
                            </button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
};

export default CreateGame;