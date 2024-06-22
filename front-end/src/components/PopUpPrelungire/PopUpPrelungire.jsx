import React from "react";
import "../PopUp/PopUp.css";

function PopUpPrelungire(props) {
    return(props.trigger)?(
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn" onClick={()=>props.setTrigger(false)}>X</button>
                {props.children}
                
            </div>
        </div>
    ) : "";
}

export default PopUpPrelungire;