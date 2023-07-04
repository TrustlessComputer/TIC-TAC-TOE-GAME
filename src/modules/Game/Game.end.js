import {AnimatePresence, motion} from "framer-motion";
import Square from "../../components/Square";
import ButtonNewGame from "../../components/ButtonNewGame";

const GameEnd = ({ winner, resetGame, myRole }) => {
    return (
        <AnimatePresence>
            {winner && (
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
                            {winner === "3"
                                ? "No Winner :/" : winner === myRole ? "Win !! :)" : "Lose !! :("}
                        </motion.h2>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{
                                scale: 1,
                                transition: {
                                    delay: 1.3,
                                    duration: 0.2,
                                },
                            }}
                            className="win"
                        >
                            {winner === "3" ? (
                                <>
                                    <Square clsName="x" />
                                    <Square clsName="o" />
                                </>
                            ) : (
                                <>
                                    <Square clsName={myRole === '2' ? "o" : "x"} />
                                </>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{
                                scale: 1,
                                transition: { delay: 1.5, duration: 0.3 },
                            }}
                        >
                            <ButtonNewGame resetGame={resetGame} />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
};

export default GameEnd;