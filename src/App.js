import { useEffect, useState } from "react";
import "./App.css";
import abi from "./contracts/claim.json";
import { ethers } from "ethers";

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
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

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

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  const ClaimButton = () => {
    return (
      <button onClick={claimHandler} className="cta-button mint-nft-button">
        Claim
      </button>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div className="main-app">
      <h1>CRE8R CLAIMER</h1>
      <h2>
        <b>Account:</b> {currentAccount}
      </h2>
      <div>{currentAccount ? ClaimButton() : connectWalletButton()}</div>
      <br />
      <p>{`Status: ${status}`}</p>
    </div>
  );
}

export default App;
