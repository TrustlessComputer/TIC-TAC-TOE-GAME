import React from 'react';
import "./Spinner.scss";

const Spinner = React.memo(() => {
    return (
        <div className="spinner">
            <div className="lds-dual-ring"/>
        </div>
    )
})

export default Spinner;