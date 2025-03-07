import styled from '@emotion/styled';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InfoButtonContainer = styled.button`
    position: fixed;
    top: 20px;
    left: 20px;
    background: ${props => props.theme.colors.primary};
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1000;
`;

const InfoPopup = styled(motion.div)`
    position: fixed;
    top: 70px;
    left: 20px;
    background: ${props => props.theme.colors.surface};
    padding: 20px;
    border-radius: 10px;
    border: 2px solid ${props => props.theme.colors.primary};
    max-width: 300px;
    z-index: 1000;
`;

const InfoButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <InfoButtonContainer onClick={() => setIsOpen(!isOpen)}>
                ⋮
            </InfoButtonContainer>
            <AnimatePresence>
                {isOpen && (
                    <InfoPopup
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <h3>Виграшні комбінації:</h3>
                        <p>CYBER_PUNK🤖🤖🤖 - x5</p>
                        <p>CHIP💾💾💾 - x4</p>
                        <p>NEON💡💡💡 - x3</p>
                        <p>LASER⚡⚡⚡ - x3</p>
                        <p>MATRIX🌐🌐🌐 - x2</p>
                        <p>HOLOGRAM👾👾👾 - x2</p>
                    </InfoPopup>
                )}
            </AnimatePresence>
        </>
    );
};

export default InfoButton;