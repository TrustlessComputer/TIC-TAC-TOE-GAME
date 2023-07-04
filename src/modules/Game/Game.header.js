import './styles.scss';
import { useContext } from "react";
import { WalletContext } from "../../contexts/wallet.context";
import { AssetsContext } from "../../contexts/assets.context";
import * as formatter from 'tc-formatter';
import {MIN_AMOUNT} from "../../constants/configs";

const GameHeader = () => {
    const { keySet } = useContext(WalletContext);
    const { balance, isNeedTopupTC } = useContext(AssetsContext);

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
            {!!isNeedTopupTC && (
                <div className="warning-wrapper">
                    <p>Please deposit as least {formatter.formatAmount({
                        originalAmount: MIN_AMOUNT,
                        decimals: 18
                    })} TC for play the game.</p>
                </div>
            )}
        </div>
    )
}

export default GameHeader;