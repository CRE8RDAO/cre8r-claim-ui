import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadWeb3, loadClaimableBalance, claimBalance } from './store/slices/web3Slice';
import { toast } from 'react-toastify';
import cre8rLogo from './assets/logo-515x512.png';
import './App.css';

function App() {
  const { account, balance, status_message } = useSelector(state => state.web3);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadWeb3());
  }, [dispatch]);

  useEffect(() => {
    if (account !== '') {
      dispatch(loadClaimableBalance());
    }
  }, [account, dispatch]);

  const handleClaimButton = () => {
    dispatch(claimBalance());
  };

  useEffect(() => {
    if (status_message === 'Nothing to claim :((') {
      toast('Contract says you have no tokens to claim!');
    } else if (status_message !== '') {
      toast(status_message);
      // dispatch clean status message ?
    }
  }, [status_message]);

  return (
    <>
      <nav>
        <div className="brand-container">
          <img src={cre8rLogo} alt="cre8r logo" />
        </div>
        <div className="btn-container">
          <button onClick={() => {}} className="connect-wallet-button" disabled={account !== ''}>
            {account !== '' ? account?.substring(0, 8) + '...' : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      <div className="main-app">
        <div className="modal">
          <div className="brand-container">
            <img src={cre8rLogo} alt="cre8r logo" />
          </div>
          <div className="vested-container">
            <h3>Available:</h3>
            <p>{`${balance.length ? balance : '0,00'}`} CRE8R</p>
          </div>
          <div className="available-container">
            {/* <p>
              {' '}
              <span></span>
            </p> */}
            {/* <p>
              Claimed:{' '}
              <span>{`${balance.length ? balance : '0,00'}`} CRE8R</span>
            </p> */}
          </div>
          <div className="btn-container">
            {account ? (
              <button onClick={handleClaimButton} className="claim-button">
                Claim CRE8R
              </button>
            ) : (
              <span>Nothing to claim ...</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
