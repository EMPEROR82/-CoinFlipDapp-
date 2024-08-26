import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CoinFlipGameABI from './CoinFlipGameABI.json'; // Make sure this path is correct

const App = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [result, setResult] = useState('');

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(ethProvider);

        // Request account access
        const accounts = await ethProvider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          console.error('No accounts found');
        }

        // Setup the contract
        const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE'; // Replace with your contract address
        const contractInstance = new ethers.Contract(contractAddress, CoinFlipGameABI, ethProvider.getSigner());
        setContract(contractInstance);
      } else {
        console.error('MetaMask not detected');
      }
    };

    initialize();
  }, []); // Empty dependency array means this runs once when the component mounts

  const flipCoin = async () => {
    if (contract && account) {
      try {
        const tx = await contract.flipCoin();
        await tx.wait();
        const result = await contract.getResult();
        setResult(result ? 'Heads' : 'Tails');
      } catch (error) {
        console.error('Error flipping coin:', error);
      }
    }
  };

  return (
    <div>
      <h1>Coin Flip Game</h1>
      <p>Connected Account: {account}</p>
      <button onClick={flipCoin}>Flip Coin</button>
      <p>Result: {result}</p>
    </div>
  );
};

export default App;
