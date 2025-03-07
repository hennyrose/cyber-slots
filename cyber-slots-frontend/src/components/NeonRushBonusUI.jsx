import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const SpinContainer = styled(motion.div)`
  margin: 20px 0;
`;

function NeonRushBonusUI() {
    const [currentSpinIndex, setCurrentSpinIndex] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinResults, setSpinResults] = useState(null);
    const [totalWin, setTotalWin] = useState(0);
    const [newBalance, setNewBalance] = useState(0);

    const buyNeonRushBonus = async (bet) => {
        try {
            setIsSpinning(true);
            const response = await axios.post('/api/game/neon-rush-bonus', { bet });
            const { freeSpinGrids, totalWinAmount, newBalance } = response.data;

            setSpinResults(freeSpinGrids);
            setTotalWin(totalWinAmount);
            setNewBalance(newBalance);

            // Start the sequence of spins
            setCurrentSpinIndex(0);
        } catch (error) {
            console.error('Error buying neon-rush bonus:', error);
        }
    };

    useEffect(() => {
        if (spinResults && currentSpinIndex < 5) {
            const timer = setTimeout(() => {
                if (currentSpinIndex < 4) {
                    setCurrentSpinIndex(prev => prev + 1);
                } else {
                    setIsSpinning(false);
                }
            }, 2000); // 2 seconds between spins

            return () => clearTimeout(timer);
        }
    }, [currentSpinIndex, spinResults]);

    return (
        <div>
            <button
                onClick={() => buyNeonRushBonus(10)}
                disabled={isSpinning}
            >
                Buy Neon-Rush Bonus (Bet 10)
            </button>

            <AnimatePresence>
                {spinResults && (
                    <SpinContainer
                        key={currentSpinIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <h3>Free Spin #{currentSpinIndex + 1}</h3>
                        <SlotMachine
                            grid={spinResults[currentSpinIndex]}
                            isSpinning={true}
                        />
                    </SpinContainer>
                )}
            </AnimatePresence>

            <div>
                <p>Total Win: {totalWin}</p>
                <p>Balance: {newBalance}</p>
            </div>
        </div>
    );
}

export default NeonRushBonusUI;