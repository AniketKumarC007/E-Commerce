import React, { useState } from 'react';
import './Transfer.scss'; // Import your CSS file for styling
import useToken from '../../hooks/useToken';
import { CircularProgress } from '@mui/material';
 
const { ethers } = require('ethers');
const object = {
    nike: '0x9e84dc3b653E63806FFA245f52ba49C0c3A959e8',
    puma: '0x3Bbc06863d2cF4E49C7510947BdBcE2d30B757AF',
    ads: '0xC8E81fe181ce5f426e4Dd14134Edf744beB182e8',
    rbk: '0x1570F2dA362840Ca18f01A0F6bC0bBb671E86e0A',
    skt: '0xA242C57922e5e18A532f201945be4e3bC3465897',
}
 
 
const Transfer = () => {
    const [sender, setSender] = useState('');
    // const [tranferToken, setTransferToken] = useState('');
    const [contractAddress, setContractAddress] = useState(0);
    const [receiver, setReceiver] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
 
    const { address, setAddress, token, setToken, payments, setPayments } = useToken();
 
    const contractABI = require('../../ABI.json');
    const privateKey = sender;
    // const contractAddress = '0x9e84dc3b653E63806FFA245f52ba49C0c3A959e8'; // Replace with your contract address
    const providerUrl = 'https://rpc.ankr.com/eth_goerli';
 
    async function transferTokens(fromPrivateKey, toAddress, amount) {
        const provider = new ethers.providers.JsonRpcProvider(providerUrl);
        const wallet = new ethers.Wallet(fromPrivateKey, provider);
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);
 
        try {
 
            // Call the transfer function to send tokens to the specified address
            const transactionResponse = await contract.transfer(toAddress, amount);
 
            // Wait for the transaction to be mined and confirmed
            const receipt = await transactionResponse.wait();
 
            const item1 = {
                hash: transactionResponse.hash,
                time: new Date().toLocaleString(),
                value: -parseInt(Math.min(parseInt(token), amount)),
                comment: "Transferred"
            }
            // setPayments([item1, ...payments])
 
 
            setPayments(prevArray => [item1, ...prevArray]);
 
            console.log('Transfer transaction receipt:', receipt);
 
            // Get updated balance of the 'to' address
            const balance = await contract.balanceOf(address);
            setToken(parseInt(balance));
            console.log(`Balance of tokens at address ${toAddress}: ${balance.toString()}`);
        } catch (error) {
            console.error('Error transferring tokens:', error);
        }
    }
 
    const handleTransfer = async (event) => {
        console.log(contractAddress);
        event.preventDefault();
        setLoading(true)
        await transferTokens(sender, receiver, amount);
        setLoading(false)
 
    };
 
    // const isButtonDisabled = !sender || !receiver || !amount;
 
    // return (
    //     <div className="transfer-container">
    //         <h1>Transfer Page</h1>
    //         <div className="transfer-form">
    //             <label htmlFor="sender">Enter Your Private Key:</label>
    //             <input
    //                 type="text"
    //                 id="sender"
    //                 value={sender}
    //                 onChange={(e) => setSender(e.target.value)}
    //             />
    //             <label htmlFor="receiver">Enter Receiver's Address:</label>
    //             <input
    //                 type="text"
    //                 id="receiver"
    //                 value={receiver}
    //                 onChange={(e) => setReceiver(e.target.value)}
    //             />
    //             <label htmlFor="amount">Amount:</label>
    //             <input
    //                 type="text"
    //                 id="amount"
    //                 value={amount}
    //                 onChange={(e) => setAmount(e.target.value)}
    //             />
    //             <button
    //                 className="transfer-button"
    //                 onClick={handleTransfer}
    //                 disabled={isButtonDisabled} // Disable the button if any field is empty
    //             >
    //                 Transfer
    //             </button>
    //         </div>
    //     </div>
    // );
    const handleSelect = (event) => {
        setContractAddress(object[event.target.value])
    }
 
    return (
        <div className="transfer-container">
            {
                loading ? <CircularProgress/> : 
                <form className="transfer-form">
                    <h1>Transfer Page</h1>
                    <div>
                        <label htmlFor="sender"></label>
                        <input
                            type="password"
                            id="sender"
                            required
                            placeholder='Enter your Private key'
                            value={sender}
                            onChange={(e) => setSender(e.target.value)}
                        />
                    </div>
                    <div>
                        {/* <label htmlFor="select_token">Select Token:</label> */}
                        <select id="select_token" required onChange={handleSelect}>
                            <option value="puma">puma</option>
                            <option value="nike">nike</option>
                            <option value="ads">ads</option>
                            <option value="rbk">rbk</option>
                            <option value="skt">skt</option>
                        </select>
                    </div>
                    <div>
                        {/* <label htmlFor="receiver">Enter Receiver's Address:</label> */}
                        <input
                            type="text"
                            id="receiver"
                            required
                            placeholder="Enter Receiver's Address"
                            value={receiver}
                            onChange={(e) => setReceiver(e.target.value)}
                        />
                    </div>
                    <div>
                        {/* <label htmlFor="amount">Amount:</label> */}
                        <input
                            type="text"
                            id="amount"
                            value={amount}
                            placeholder='Amount'
                            required
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <button type='submit' className="transfer-button" onClick={handleTransfer}>
                        Transfer
                    </button>
                </form>
            }
 
        </div>
    );
}
 
export default Transfer;