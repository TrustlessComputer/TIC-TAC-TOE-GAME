import Game from "./modules/Game/Game";
import { WalletProvider } from "./contexts/Wallet.context";

const App = () => {
    return (
        <WalletProvider>
            <Game />
        </WalletProvider>
    )
};

export default App;