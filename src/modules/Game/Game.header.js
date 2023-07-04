import './styles.scss';
import { useContext } from "react";
import { WalletContext } from "../../contexts/wallet.context";
import { AssetsContext } from "../../contexts/assets.context";
import * as formatter from 'tc-formatter';

const GameHeader = () => {
    const { keySet } = useContext(WalletContext);
    const { balance } = useContext(AssetsContext);

    return (
        <div className="header">
            <div className="item-wrapper">
                <p>Account: {keySet?.address}</p>
            </div>
            <div className="item-wrapper">
                <p>Balance: {formatter.formatAmount({
                    originalAmount: balance.amount,
                    decimals: 18
                })} TC</p>
            </div>
        </div>
    )
}

export default GameHeader;