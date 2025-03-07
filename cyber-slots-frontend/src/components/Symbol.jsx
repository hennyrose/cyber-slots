import styled from '@emotion/styled';
import { motion } from 'framer-motion';

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

    @media (max-width: 768px) {
        width: 50px;
        height: 50px;
        font-size: 32px;
        padding: 4px;
    }
`;


const SymbolContent = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    backface-visibility: visible;
`;

const winVariants = {
    pulse: {
        scale: [1, 1.2, 1],
        transition: {
            duration: 0.5,
            repeat: Infinity
        }
    }
};

const spinVariants = {
    initial: {
        y: 0,
        rotateX: 0,
    },
    spin: {
        y: [-20, -200, 0],
        rotateX: [0, 1440],
        transition: {
            duration: 1.5,
            ease: "easeInOut",
            y: {
                type: "spring",
                stiffness: 300
            },
            rotateX: {
                type: "spring",
                stiffness: 50,
                damping: 15
            }
        }
    }
};

const Symbol = ({ icon, isWinning, isSpinning, delay }) => {
    // Convert text symbols to emoji on mobile
    const getSymbolIcon = () => {
        if (window.innerWidth <= 768) {
            switch(icon) {
                case 'CP': return '🤖';
                case 'N': return '💡';
                case 'CH': return '💾';
                case 'M': return '🌐';
                case 'L': return '⚡';
                case 'H': return '👾';
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
            {getSymbolIcon()}
        </SymbolContainer>
    );
};


export default Symbol;