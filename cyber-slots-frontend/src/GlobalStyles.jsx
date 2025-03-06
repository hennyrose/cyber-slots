import { css } from '@emotion/react';

export const GlobalStyles = css`
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Orbitron', sans-serif;
        background-color: ${props => props.theme.colors.background};
        color: ${props => props.theme.colors.text};
        min-height: 100vh;
        overflow-x: hidden;
    }

    #root {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
    }
`;