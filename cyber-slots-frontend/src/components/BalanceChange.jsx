// components/BalanceChange.jsx
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const ChangeIndicator = styled(motion.span)`
    position: absolute;
    font-size: 18px;
    font-weight: bold;
    color: ${props => props.isPositive ? props.theme.colors.success : props.theme.colors.error};
`;

const BalanceChange = ({ amount }) => {
    if (!amount) return null;

    const isPositive = amount > 0;

    return (
        <AnimatePresence>
            <ChangeIndicator
                isPositive={isPositive}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >
                {isPositive ? '+' : ''}{amount}€
            </ChangeIndicator>
        </AnimatePresence>
    );
};

export default BalanceChange;