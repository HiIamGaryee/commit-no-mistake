import React from "react";
import styled from "styled-components";
import { media } from "../style/theme/theme";

const DashboardScreenWrap = styled.div`
  overflow-x: hidden;
  padding: 24px;

  .dboard-blocks-row {
    display: grid;
    gap: 20px;

    &.first-row {
      grid-template-columns: repeat(2, 1fr);

      ${media.xl`
            grid-template-columns: repeat(1, 1fr);
       `}
    }

    &.second-row {
      grid-template-columns: 2fr 400px 1fr;

      ${media.xxxl`
            grid-template-columns: repeat(8, 1fr);

            & > div {
                &:nth-child(1) { grid-column: 1 / 5; }
                &:nth-child(2) { grid-column: 5 / 9; }
                &:nth-child(3) { grid-column: 1 / 4; }
                &:nth-child(4) { grid-column: 4 / 9; }
                &:nth-child(5) { grid-column: 1 / 4; min-width: 400px; }
                &:nth-child(6) { grid-column: 4 / 9; }
            }
        `}

      ${media.lg`
            & > div {
                &:nth-child(1) { grid-column: 1 / 9; }
                &:nth-child(2) { grid-column: 1 / 4; }
                &:nth-child(3) { grid-column: 4 / 9; }
                &:nth-child(4) { grid-column: 1 / 9; }
                &:nth-child(5) { grid-column: 1 / 5; min-width: 400px; }
                &:nth-child(6) { grid-column: 5 / 9; }
            }
        `}

        ${media.md`
            & > div {
                grid-column: 1 / 9 !important;
            }
        `}
    }

    ${media.xxxl`
        gap: 12px;
    `}
  }

  [class$="row"].dboard-blocks-row {
    margin-bottom: 20px;

    ${media.xxxl`
        margin-bottom: 12px;
    `}
  }

  .home-content {
    background: #222;
    color: white;
    padding: 20px;
    border-radius: 8px;
  }

  .neon-button {
    background-color: #6b46c1;
    color: white;
    padding: 8px 16px;
    border-radius: 5px;
    transition: background 0.3s ease-in-out;
    cursor: pointer;

    &:hover {
      background-color: #553c9a;
    }
  }
`;

const HomePage: React.FC = () => {
  return (
    <DashboardScreenWrap>
      <div className="home-content">
        <h2 className="text-2xl font-semibold mb-2">Home Page</h2>
        <button className="neon-button">Open AiBot</button>
      </div>

      <div className="dboard-blocks-row first-row">
        <div>Block 1</div>
        <div>Block 2</div>
      </div>

      <div className="dboard-blocks-row second-row">
        <div>Block 3</div>
        <div>Block 4</div>
        <div>Block 5</div>
        <div>Block 6</div>
      </div>
    </DashboardScreenWrap>
  );
};

export default HomePage;