import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const SymbolContainer = styled(motion.div)`
    font-size: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    background: rgba(26, 26, 36, 0.5);
    border-radius: 10px;
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

const Symbol = ({ icon, isSpinning, delay }) => {
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
            animate={isSpinning ? "spin" : "initial"}
            variants={spinVariants}
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