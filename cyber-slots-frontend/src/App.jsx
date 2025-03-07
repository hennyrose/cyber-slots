import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { motion, AnimatePresence } from 'framer-motion';
import SlotMachine from './components/SlotMachine.jsx';
import Controls from './components/Controls.jsx';
import BonusModal from './components/BonusModal.jsx';
import { theme } from './theme.js';
import axios from 'axios';
import InfoButton from './components/InfoButton';



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

const ControlsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
    width: 90vw;
    max-width: 1200px;
    margin: 20px auto;

    @media (max-width: 768px) {
        width: 95vw;
        gap: 10px;
    }
`;

const Button = styled.button`
    padding: 12px 24px;
    font-size: 18px;
    border-radius: 10px;
    background: ${props => props.theme.colors.primary};
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;

    @media (max-width: 768px) {
        padding: 8px 16px;
        font-size: 16px;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const SessionInfo = styled.div`
    font-size: 16px;
    color: ${props => props.theme.colors.text};
    margin-top: 10px;

    @media (max-width: 768px) {
        font-size: 12px;
    }
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
    const [sessionId, setSessionId] = useState(generateSessionId());

    function generateSessionId() {
        // Генеруємо ID без префіксу session_
        return Math.random().toString(36).substr(2, 9);
    }


    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const response = await fetch('https://cyber-slots.onrender.com/api/game/balance', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch balance');
            const balance = await response.json();
            setBalance(balance);

            document.cookie = `JSESSIONID=${sessionId}; path=/`;
        } catch (error) {
            console.error('Error fetching balance:', error);
            setError('Failed to load balance');
        }
    };

    const handleSpin = async () => {
        if (isSpinning || balance < bet) return;

        setIsSpinning(true);
        setWinningLine(null);
        setError(null);
        setBalanceChange(-bet);

        try {
            const response = await fetch('https://cyber-slots.onrender.com/api/game/spin', {
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
            const response = await fetch('https://cyber-slots.onrender.com/api/game/bonus-spin', {
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

    const handleRestart = async () => {
        try {
            const response = await fetch('https://cyber-slots.onrender.com/api/game/restart', {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to restart game');
            }

            // Оновлюємо баланс
            await fetchBalance();

            // Скидаємо стан гри
            setGrid(Array(4).fill(Array(3).fill('')));
            setWinningLine(null);
            setError(null);
            setBalanceChange(null);
            setIsSpinning(false);

        } catch (error) {
            console.error('Error restarting game:', error);
            setError('Failed to restart game');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <AppWrapper>
                <InfoButton />
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                   <span style={{ color: theme.colors.text }}>
    Session ID: {sessionId}
</span>
                    <button
                        onClick={handleRestart}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: theme.colors.primary,
                            color: theme.colors.text,
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Restart Demo
                    </button>
                </div>
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
