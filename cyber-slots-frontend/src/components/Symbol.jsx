// Symbol.jsx
import { useState, useEffect } from 'react';
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

    animation: ${props => props.isWinning ? 'glow 1.5s ease-in-out infinite' : 'none'};

    @keyframes glow {
        0% {
            box-shadow: 0 0 5px #00ff9f, 0 0 10px #00ff9f, 0 0 15px #00ff9f;
        }
        50% {
            box-shadow: 0 0 10px #00ff9f, 0 0 20px #00ff9f, 0 0 30px #00ff9f;
        }
        100% {
            box-shadow: 0 0 5px #00ff9f, 0 0 10px #00ff9f, 0 0 15px #00ff9f;
        }
    }

    @media (max-width: 768px) {
        width: 50px;
        height: 50px;
        font-size: 32px;
        padding: 4px;
    }
`;

const Symbol = ({ icon, isWinning, isSpinning, delay }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getSymbolIcon = () => {
        if (isMobile) {
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

    return (
        <SymbolContainer
            isWinning={isWinning}
            animate={isSpinning ? "spin" : isWinning ? "pulse" : "initial"}
            variants={isSpinning ? spinVariants : winVariants}
        >
            <SymbolContent
                initial={false}
                animate={isSpinning ? { rotateX: [0, 360] } : { rotateX: 0 }}
                transition={{
                    duration: 1,
                    delay,
                    ease: "easeInOut",
                    repeat: isSpinning ? Infinity : 0
                }}
            >
                {getSymbolIcon()}
            </SymbolContent>
        </SymbolContainer>
    );
};

export default Symbol;