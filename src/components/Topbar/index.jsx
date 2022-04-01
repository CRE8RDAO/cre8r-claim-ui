import React from "react";
import cre8rLogo from "../../assets/cre8r_logo.png";
import { ConnectWalletButton } from "../ConnectWalletButton";
import "./Topbar.css";

export const Topbar = () => {
  return (
    <nav>
      <div className="brand-container">
        <img src={cre8rLogo} alt="cre8r logo" />
      </div>
      <h1>CRE8R Claimer</h1>
      <div className="btn-container">
        <ConnectWalletButton />
      </div>
    </nav>
  );
};
