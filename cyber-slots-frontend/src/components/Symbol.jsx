import styled, { keyframes } from '@emotion/styled';
import { motion } from 'framer-motion';

const glowingAnimation = keyframes`
    0% {
        box-shadow: 0 0 5px #00ff9f, 0 0 10px #00ff9f, 0 0 15px #00ff9f;
    }
    50% {
        box-shadow: 0 0 10px #00ff9f, 0 0 20px #00ff9f, 0 0 30px #00ff9f;
    }
    100% {
        box-shadow: 0 0 5px #00ff9f, 0 0 10px #00ff9f, 0 0 15px #00ff9f;
    }
`;

const SymbolContainer = styled(motion.div)`
    font-size: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    background: ${props => props.isWinning ? 'rgba(0, 255, 159, 0.2)' : 'rgba(26, 26, 36, 0.5)'};
    border-radius: 10px;
    border: 2px solid ${props => props.isWinning ? props.theme.colors.primary : 'transparent'};
    width: 70px;
    height: 70px;
    perspective: 1000px;
    animation: ${props => props.isWinning ? glowingAnimation : 'none'} 1.5s ease-in-out infinite;

    @media (max-width: 768px) {
        width: 50px;
        height: 50px;
        font-size: 32px;
        padding: 4px;
    }
`;

const Symbol = ({ icon, isWinning, isSpinning, delay }) => {
    const getSymbolIcon = (icon) => {
        if (window.innerWidth <= 768) {
            switch(icon) {
                case 'CYBER_PUNK': return '🤖';
                case 'NEON': return '💡';
                case 'CHIP': return '💾';
                case 'MATRIX': return '🌐';
                case 'LASER': return '⚡';
                case 'HOLOGRAM': return '👾';
                default: return icon;
            }
        }
        return icon;
    };

    const variants = {
        spinning: {
            rotateX: [0, 360],
            transition: {
                duration: 1,
                delay,
                ease: "easeInOut",
                repeat: Infinity,
            }
        },
        static: {
            rotateX: 0
        }
    };

    return (
        <SymbolContainer
            isWinning={isWinning}
            animate={isSpinning ? "spinning" : "static"}
            variants={variants}
        >
            {getSymbolIcon(icon)}
        </SymbolContainer>
    );
};



export default Symbol;