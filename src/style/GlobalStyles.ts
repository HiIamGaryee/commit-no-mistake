import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: ${(props) => props.theme.typography.fontFamily};
  }
  body {
    background-color: ${(props) => props.theme.colors.spaceCadet1};
    color: ${(props) => props.theme.colors.white};
  }
`;

export default GlobalStyles;