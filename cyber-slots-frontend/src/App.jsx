import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { motion, AnimatePresence } from 'framer-motion';
import SlotMachine from './components/SlotMachine.jsx';
import Controls from './components/Controls.jsx';
import BonusModal from './components/BonusModal.jsx';
import { theme } from './theme.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/game';


const AppWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    padding: 20px;
`;

const Title = styled.h1`
    font-family: 'Orbitron', sans-serif;
    color: ${props => props.theme.colors.primary};
    text-align: center;
    margin-bottom: 30px;
`;

const Balance = styled.div`
    font-size: 24px;
    color: ${props => props.theme.colors.primary};
    margin: 20px 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const BalanceChangeText = styled(motion.span)`
    position: absolute;
    left: 100%;
    margin-left: 10px;
    color: ${props => props.amount > 0 ? '#00ff9f' : '#ff4444'};
`;

const BalanceChange = ({ amount }) => {
    if (!amount) return null;

    return (
        <AnimatePresence>
            <BalanceChangeText
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                amount={amount}
            >
                {amount > 0 ? `+${amount}` : amount}€
            </BalanceChangeText>
        </AnimatePresence>
    );
};

function App() {
    const [grid, setGrid] = useState(Array(4).fill(Array(3).fill('')));
    const [balance, setBalance] = useState(8000);
    const [bet, setBet] = useState(1);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winningLine, setWinningLine] = useState(null);
    const [error, setError] = useState(null);
    const [balanceChange, setBalanceChange] = useState(null);
    const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);

    const handleSpin = async () => {
        if (isSpinning || balance < bet) return;

        setIsSpinning(true);
        setWinningLine(null);
        setError(null);
        setBalanceChange(-bet);

        try {
            const response = await fetch(`${API_BASE_URL}/spin`
                , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ bet })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Server response:', result);

            await new Promise(resolve => setTimeout(resolve, 1500));

            if (result && result.grid) {
                setGrid(result.grid);
                setBalance(result.newBalance);

                if (result.winningGame && result.winAmount) {
                    setBalanceChange(result.winAmount);
                    for (let i = 0; i < result.grid.length; i++) {
                        if (result.grid[i][0] === result.grid[i][1] &&
                            result.grid[i][1] === result.grid[i][2]) {
                            setWinningLine(i);
                            break;
                        }
                    }
                }
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error('Error during spin:', error);
            setError(error.message);
        } finally {
            setIsSpinning(false);
            setTimeout(() => setBalanceChange(null), 2000);
        }
    };

    const handleBonusSelect = async (bonusOption) => {
        if (balance < bonusOption.multiplier * bet) {
            setError("Insufficient balance for bonus");
            return;
        }

        setIsSpinning(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/bonus-spin`
                , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    bet: bet,
                    bonusType: bonusOption.id
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setGrid(result.grid);
            setBalance(result.newBalance);

            if (result.winningGame) {
                setBalanceChange(result.winAmount);
                // Обробка виграшної лінії...
            }
        } catch (error) {
            console.error('Error during bonus spin:', error);
            setError(error.message);
        } finally {
            setIsSpinning(false);
            setIsBonusModalOpen(false);
        }
    };

    const handleIncreaseBet = () => {
        if (bet < 100) setBet(prev => prev + 1);
    };

    const handleDecreaseBet = () => {
        if (bet > 1) setBet(prev => prev - 1);
    };

    return (
        <ThemeProvider theme={theme}>
            <AppWrapper>
                <Title>Cyber Slots</Title>
                <Balance>
                    Balance: {balance}€
                    <BalanceChange amount={balanceChange} />
                </Balance>
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <SlotMachine
                    grid={grid}
                    winningLine={winningLine}
                    isSpinning={isSpinning}
                />
                <Controls
                    onSpin={handleSpin}
                    onIncreaseBet={handleIncreaseBet}
                    onDecreaseBet={handleDecreaseBet}
                    bet={bet}
                    isSpinning={isSpinning}
                    disabled={balance < bet}
                    onBuyBonus={() => setIsBonusModalOpen(true)}
                />
                <BonusModal
                    isOpen={isBonusModalOpen}
                    onClose={() => setIsBonusModalOpen(false)}
                    onSelectBonus={handleBonusSelect}
                    bet={bet}
                />
            </AppWrapper>
        </ThemeProvider>
    );
}

export default App;