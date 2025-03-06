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

const Symbol = ({ icon, isWinning, isSpinning, delay = 0 }) => {
    return (
        <SymbolContainer isWinning={isWinning}>
            <SymbolContent
                initial="initial"
                animate={isSpinning ? "spin" : (isWinning ? "pulse" : "initial")}
                variants={isSpinning ? spinVariants : winVariants}
                style={{ delay: delay }}
            >
                {icon}
            </SymbolContent>
        </SymbolContainer>
    );
};

export default Symbol;