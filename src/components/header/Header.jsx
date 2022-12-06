import React from "react"
import "./header.css"

import whitepaper from '../../assets/plant.pdf'

const Header = ({account}) => {
    return (
        <header>
            {account[0] ?
                <h6>{account[0]}</h6>
                :
                <div className="btn btn-metamask" onClick = {() => {window.ethereum.request({method: 'eth_requestAccounts'});}}>Connect Metamask</div>
            }
            <a href={whitepaper} without rel="noopener noreferrer" className="whitepaper" target="_blank">White Paper</a>
        </header>
    )
}

export default Header;