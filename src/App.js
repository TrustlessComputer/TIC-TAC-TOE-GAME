import Game from "./modules/Game/Game";
import { WalletProvider } from "./contexts/wallet.context";
import {AssetsProvider} from "./contexts/assets.context";

const App = () => {
    return (
        <WalletProvider>
            <AssetsProvider>
                <Game />
            </AssetsProvider>
        </WalletProvider>
    )
};

export default App;