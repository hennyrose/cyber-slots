import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const PopupContent = styled(motion.div)`
    background: ${props => props.theme.colors.surface};
    padding: 2rem;
    border-radius: 1rem;
    border: 2px solid ${props => props.theme.colors.success};
    box-shadow: ${props => props.theme.shadows.success};
    text-align: center;
`;

const WinAmount = styled.h2`
    color: ${props => props.theme.colors.success};
    font-size: 2rem;
    margin-bottom: 1rem;
`;

const WinPopup = ({ win, isVisible, onClose }) => (
    <AnimatePresence>
        {isVisible && (
            <Overlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <PopupContent
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                >
                    <WinAmount>Виграш: {win}€!</WinAmount>
                </PopupContent>
            </Overlay>
        )}
    </AnimatePresence>
);

export default WinPopup;