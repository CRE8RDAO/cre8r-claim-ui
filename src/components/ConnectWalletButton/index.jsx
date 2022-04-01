import React from "react";
import "./ConnectWalletButton.css";

export const ConnectWalletButton = () => {
  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      // setCurrentAccount(accounts[0]); // with redux
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button onClick={connectWalletHandler} className="connect-wallet-button">
      Connect Wallet
    </button>
  );
};
