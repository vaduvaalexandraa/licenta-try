import React from "react";
import "./PopUp.css";


function PopUp(props) {
    return(props.trigger)?(
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn" onClick={()=>props.setTrigger(false)}>X</button>
                {props.children}
                {/* <div className="popup-buttons">
                    <button className="popup-button" onClick={() => handleConfirm(props)}>Da</button>
                    <button className="popup-button" onClick={() => props.setTrigger(false)}>Nu</button>
                </div> */}
            </div>

        </div>
    ) : "";
}

export default PopUp;