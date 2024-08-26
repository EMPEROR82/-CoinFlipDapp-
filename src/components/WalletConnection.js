import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';

const WalletConnect = ({ setProvider, setSigner }) => {
  const [address, setAddress] = useState('');

  useEffect(() => {
    (async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        setProvider(provider);
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]);
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        setSigner(ethersProvider.getSigner());
      } else {
        console.log('Please install MetaMask!');
      }
    })();
  }, [setProvider, setSigner]);

  return (
    <div>
      <button onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>
        Connect Wallet
      </button>
      {address && <p>Connected as: {address}</p>}
    </div>
  );
};

export default WalletConnect;
