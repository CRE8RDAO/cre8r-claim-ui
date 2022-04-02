import { createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import abi from "../../contracts/claim.json";

const initialState = {
  connected: false,
  account: "",
  balance: null,
  status_message: "",
};

export const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {
    loaded: (state, action) => ({
      ...state,
      connected: action.payload,
    }),
    account_loaded: (state, action) => ({
      ...state,
      account: action.payload,
    }),
    account_loaded_error: (state, action) => ({
      ...state,
      account_error: action.payload,
    }),
    balance_loaded: (state, action) => ({
      ...state,
      balance: action.payload,
    }),
    change_status: (state, action) => ({
      ...state,
      status_message: action.payload,
    }),
  },
});

export const loadWeb3 = () => async (dispatch) => {
  if (typeof window.ethereum !== "undefined") {
    const { ethereum } = window;
    // Request account access if needed
    await window.ethereum.enable();

    dispatch(loaded(true));

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length) dispatch(account_loaded(accounts[0]));
    } catch (err) {
      console.log(err);
      dispatch(account_loaded_error(err));
    }
  } else {
    window.alert("Please install MetaMask");
    window.location.assign("https://metamask.io/");
  }
};

export const loadClaimableBalance = () => async (dispatch, getState) => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const { account } = getState().web3;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const claimContract = new ethers.Contract(
        process.env.REACT_APP_VESTING_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const vestedAmount = await claimContract.getClaim(account);
      dispatch(balance_loaded(vestedAmount.toString()));
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const claimBalance = () => async (dispatch, getState) => {
  const { balance } = getState().web3;
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const claimContract = new ethers.Contract(
        process.env.REACT_APP_VESTING_CONTRACT_ADDRESS,
        abi,
        signer
      );
      if (balance !== 0) {
        dispatch(change_status("Initialize payment"));
        let claimTxn = await claimContract.claim();

        dispatch(change_status("Claiming... please wait"));
        await claimTxn.wait();

        dispatch(
          change_status(
            `Claimed, see transaction: https://ftmscan.com/tx/${claimTxn.hash}`
          )
        );
      } else {
        dispatch(change_status(`Nothing to claim :(`));
      }
    } else {
      dispatch(change_status("Ethereum object does not exist"));
    }
  } catch (err) {
    console.log(err);
  }
};

// Action creators are generated for each case reducer function
export const {
  loaded,
  account_loaded,
  account_loaded_error,
  balance_loaded,
  change_status,
} = web3Slice.actions;

export default web3Slice.reducer;
