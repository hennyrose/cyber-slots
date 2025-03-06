// Symbol.jsx
import React from 'react';
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
    },
    initial: { scale: 1 }
};

const Symbol = ({ icon, isWinning }) => {
    return (
        <SymbolContainer isWinning={isWinning}>
            <SymbolContent
                initial="initial"
                animate={isWinning ? 'pulse' : 'initial'}
                variants={winVariants}
            >
                {icon}
            </SymbolContent>
        </SymbolContainer>
    );
};

export default Symbol;