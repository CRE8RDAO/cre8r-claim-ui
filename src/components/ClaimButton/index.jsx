import React from "react";
import "./ClaimButton.css";

export const ClaimButton = ({ onClickHandler }) => {
  return (
    <button onClick={onClickHandler} className="claim-button">
      Claim CRE8R
    </button>
  );
};
