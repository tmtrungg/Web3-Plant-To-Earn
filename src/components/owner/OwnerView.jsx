import React from "react"
import "./ownerview.css"

const OwnerView = ({onEnd,onWinner}) => { 
    return (
        <div className="owner_view">
            <div className="container board__container">Hello owner, please select your action</div>
            <div className="owner_buttons">
                <div className="btn btn-primary" onClick={onEnd}>End donation</div>
                <div className="btn btn-secondary"  onClick={onWinner}>Select winner</div>
            </div>
        </div>
    )
}

export default OwnerView;