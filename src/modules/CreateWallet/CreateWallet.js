import './styles.scss';
import { generatePrvKey } from "../../libs/account/account";

function CreateWallet({ preload }) {

    const onClick = () => {
        generatePrvKey();
        preload()
    }

    return (
        <div className="container">
            <button className="button" onClick={onClick}>Create wallet</button>
        </div>
    );
}

export default CreateWallet;
