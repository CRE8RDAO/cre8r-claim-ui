import { useEffect, useState } from "react";
import cre8rLogo from "./assets/cre8r_logo.png";
import "./App.css";
import { ClaimButton } from "./components/ClaimButton";

import { ethers } from "ethers";
import abi from "./contracts/claim.json";
import { Topbar } from "./components/Topbar";
const contractAddress = "0x355638a4eCcb777794257f22f50c289d4189F245";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [status, setStatus] = useState("");

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      setStatus("Make sure you have Metamask installed!");
      return;
    } else {
      setStatus("Wallet exists! We're ready to go!");
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        setStatus(`Found an authorized account: ${account}`);
        setCurrentAccount(account);
      } else {
        setStatus("No authorized account found");
        setCurrentAccount("");
      }
    }
  };

  useEffect(() => {
    console.log(status);
  }, [status]);

  const claimHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const claimContract = new ethers.Contract(contractAddress, abi, signer);

        setStatus("Initialize payment");
        let claimTxn = await claimContract.claim();

        setStatus("Claiming... please wait");
        await claimTxn.wait();

        setStatus(
          `Claimed, see transaction: https://ftmscan.com/tx/${claimTxn.hash}`
        );
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <>
      <Topbar />
      <div className="main-app">
        <div className="modal">
          <div className="brand-container">
            <img src={cre8rLogo} alt="cre8r logo" />
          </div>
          <div>
            {/* <h1>Claim your free CRE8R token</h1> */}
            <p>
              Available: <span>1,000,000</span>
            </p>
          </div>
          <div className="btn-container">
            {currentAccount ? (
              <ClaimButton onClickHandler={claimHandler} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
