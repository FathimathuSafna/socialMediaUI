import React from 'react';
import styled from 'styled-components';
import { useTheme as useCustomTheme } from "../store/ThemeContext";

const SmallButton = ({ children = "BUTTON", onClick }) => {
  const { darkMode } = useCustomTheme();

  const bgColor = darkMode ? "#3a3a3a" :"#e0e0e0";
  const textColor = darkMode ? "#ffffff" : "#000000";

  return (
    <StyledWrapper>
      <StyledButton onClick={onClick} $bgColor={bgColor} $textColor={textColor}>
        {children}
      </StyledButton>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: inline-block;
`;

const StyledButton = styled.button`
  outline: none;
  border: 1px solid transparent; 
  padding: 0.4em 1em;
  font-size: 0.75rem;
  border-radius: 6px;
  transition: 0.1s ease-in-out, 0.4s color;
  cursor: pointer;
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ $textColor }) => $textColor};

  &:active {
    transform: translate(0.08em, 0.08em);
  }
`;

export default SmallButton;
