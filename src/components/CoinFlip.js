import React, { useState } from 'react';
import { ethers } from 'ethers';

const CoinFlip = ({ contract, signer }) => {
  const [betAmount, setBetAmount] = useState('');
  const [choice, setChoice] = useState('0');
  const [result, setResult] = useState('');

  const placeBet = async () => {
    if (!contract || !signer) return;
    try {
      const tx = await contract.connect(signer).placeBet(choice, { value: ethers.utils.parseEther(betAmount) });
      await tx.wait();
      console.log('Bet placed!');
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  };

  const settleBet = async () => {
    if (!contract || !signer) return;
    try {
      const tx = await contract.connect(signer).settleBet();
      const receipt = await tx.wait();
      // Check events for result
      const event = receipt.events.find(event => event.event === 'BetSettled');
      if (event) {
        const { winner } = event.args;
        setResult(`The result is ${winner ? 'Heads' : 'Tails'}.`);
      }
    } catch (error) {
      console.error('Error settling bet:', error);
    }
  };

  return (
    <div>
      <h2>Coin Flip Game</h2>
      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        placeholder="Bet Amount (ETH)"
      />
      <select value={choice} onChange={(e) => setChoice(e.target.value)}>
        <option value="0">Heads</option>
        <option value="1">Tails</option>
      </select>
      <button onClick={placeBet}>Place Bet</button>
      <button onClick={settleBet}>Settle Bet</button>
      <p>{result}</p>
    </div>
  );
};

export default CoinFlip;
