import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const ControlsWrapper = styled.div`
    display: flex;
    gap: 20px;
    margin-top: 20px;

    @media (max-width: 768px) {
        gap: 8px;
        flex-wrap: wrap;
        justify-content: center;
    }
`;

const Button = styled(motion.button)`
    padding: 15px 30px;
    font-family: 'Orbitron', sans-serif;
    font-size: 18px;
    background: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.surface};
    color: ${props => props.primary ? props.theme.colors.background : props.theme.colors.text};
    border: 2px solid ${props => props.theme.colors.primary};
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 120px;
    text-align: center;

    &:hover {
        box-shadow: ${props => props.theme.shadows.neon};
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    @media (max-width: 768px) {
        padding: 8px 15px;
        font-size: 14px;
        min-width: 60px;
        border-width: 1px;
    }
`;

const BetAmount = styled.div`
    font-size: 24px;
    color: ${props => props.theme.colors.primary};
    margin: 0 20px;
    min-width: 100px;
    text-align: center;

    @media (max-width: 768px) {
        font-size: 16px;
        margin: 0 10px;
        min-width: 60px;
    }
`;


// Додайте нову кнопку в Controls.jsx
const Controls = ({ onSpin, onIncreaseBet, onDecreaseBet, bet, isSpinning, onBuyBonus }) => (
    <ControlsWrapper>
        <Button onClick={onDecreaseBet} disabled={isSpinning || bet <= 0.5}>-</Button>
        <Button
            onClick={onSpin}
            disabled={isSpinning}
            primary
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            SPIN
        </Button>
        <Button onClick={onIncreaseBet} disabled={isSpinning || bet >= 100}>+</Button>
        <BetAmount>{bet}€</BetAmount>
        <Button onClick={onBuyBonus} disabled={isSpinning}>
            BUY BONUS
        </Button>
    </ControlsWrapper>
);

export default Controls;