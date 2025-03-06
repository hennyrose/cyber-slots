import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const Modal = styled(motion.div)`
    background: ${props => props.theme.colors.surface};
    padding: 2rem;
    border-radius: 1rem;
    border: 2px solid ${props => props.theme.colors.primary};
    max-width: 600px;
    width: 90%;

    h2 {
        color: ${props => props.theme.colors.primary};
        text-align: center;
        margin-bottom: 1.5rem;
        font-family: 'Orbitron', sans-serif;
    }
`;

const BonusOption = styled.div`
    margin: 1rem 0;
    padding: 1.5rem;
    border: 1px solid ${props => props.theme.colors.primary};
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    background: rgba(0, 0, 0, 0.2);

    h3 {
        color: ${props => props.theme.colors.primary};
        margin-bottom: 0.5rem;
        font-family: 'Orbitron', sans-serif;
    }

    p {
        color: ${props => props.theme.colors.text};
        margin: 0.5rem 0;
        font-size: 0.9rem;
    }

    &:hover {
        background: rgba(0, 255, 159, 0.1);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 255, 159, 0.2);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(0, 255, 159, 0.1);
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 0.5rem;
        border: 1px solid transparent;
        transition: all 0.3s ease;
    }

    &:hover::before {
        border-color: ${props => props.theme.colors.primary};
        transform: scale(1.02);
    }
`;

const BonusPrice = styled.div`
    color: ${props => props.theme.colors.primary};
    font-size: 1.2rem;
    margin-top: 1rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    &::before {
        content: '💎';
        margin-right: 0.5rem;
    }
`;

const BonusDetails = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
    align-items: center;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const SpinsCount = styled.div`
    color: #00ff9f;
    font-weight: bold;
`;

const BonusModal = ({ isOpen, onClose, onSelectBonus, bet }) => {
    const bonusOptions = [
        {
            id: 'neon-rush',
            name: 'Neon Rush',
            description: '5 free spins with increased chances of CYBER_PUNK and CHIP symbols',
            multiplier: 50,
            spins: 5
        },
        {
            id: 'cyberstorm',
            name: 'Cyberstorm',
            description: '12 free spins with guaranteed wins and double win chances',
            multiplier: 100,
            spins: 12
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <Overlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <Modal
                        onClick={e => e.stopPropagation()}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                    >
                        <h2>Select Bonus Mode</h2>
                        {bonusOptions.map(option => (
                            <BonusOption
                                key={option.id}
                                onClick={() => onSelectBonus(option)}
                            >
                                <h3>{option.name}</h3>
                                <p>{option.description}</p>
                                <BonusDetails>
                                    <SpinsCount>{option.spins} Free Spins</SpinsCount>
                                    <BonusPrice>
                                        {bet * option.multiplier}€
                                    </BonusPrice>
                                </BonusDetails>
                            </BonusOption>
                        ))}
                    </Modal>
                </Overlay>
            )}
        </AnimatePresence>
    );
};

export default BonusModal;