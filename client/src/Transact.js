import React, { useState } from 'react';
import { ethers, formatEther } from 'ethers';
 
const Transact = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
 
    const accountChangeHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        getUserBalance(newAccount.toString());
    };
 
    const getUserBalance = (address) => {
        window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] })
            .then(balance => {
                setUserBalance(formatEther(balance));
            })
    };
 
    const chainChangeHandler = () => {
        window.location.reload();
    }
 
    window.ethereum.on('accountChange', accountChangeHandler);
 
    window.ethereum.on('chainChanged', chainChangeHandler);
 
 
    const connectWalletHandler = () => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {
                    accountChangeHandler(result[0]);
                })
        } else {
            setErrorMessage("Install MetaMask");
        }
    };
 
    return (
        <div className="walletCard">
            <h4>{"Connection to MetaMask using window.ethereum methods"}</h4>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
            <div className="accountDisplay">
                <h3>Address: {defaultAccount}</h3>
            </div>
            <div className="balanceDisplay">
                <h3>Balance : {userBalance}</h3>
            </div>
            {errorMessage}
        </div>
    );
}
 
export default Transact;