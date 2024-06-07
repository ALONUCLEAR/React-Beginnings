'use client';

import { Key, useState } from 'react';
import BoardCell, { BoardCellInput } from "./board-cell/board-cell";
import Toggle from './board-cell/toggle/toggle';
import './board.css';
import { CellValue, Turn, fillRows, getWinner, setSchemeStyle, swapTurns } from './board.utils';
import { getNextMove } from './minimax.utils';

type RowInput = {
    elementKey?: Key,
    cellValues: CellValue[];
    onCellClicked?: (index: number) => void;
};

const Row = ({ elementKey, cellValues, onCellClicked }: RowInput): JSX.Element => {
    const cellsInput: BoardCellInput[] = cellValues.map((value) => ({ filling: value }));

    return <div className="board-row">
        {
            cellsInput.map((input, index) => {
                const parentKey = elementKey?.toString() ?? '';
                const placement = index + 1;
                const key = parentKey + placement;
                const onClick = onCellClicked ? () => onCellClicked(index) : undefined;

                return <BoardCell key={key} filling={input.filling} onCellClicked={onClick} />;
            })
        }
    </div>
}

type BoardInput = {
    width: number,
    height?: number,
};

function BoardTopLabel(currentTurn: Turn, winner?: Turn): JSX.Element {
    switch (winner) {
        case 'X': case 'O':
            return <label className="winner">{winner} wins!</label>;
        case 'Game Over':
            return <label className="draw">Draw!</label>;
        default:
            break;
    }

    return <label className="turn-label">{currentTurn}'s turn!</label>;
}

export default function Board({ width, height }: BoardInput): JSX.Element {
    const rowCount = height ?? width;
    const filledRows = (value?: Turn) => fillRows(rowCount, width, value);
    const [rowStates, setRows] = useState(filledRows());
    const initalTurn: Turn = 'X';
    const [turn, setTurn] = useState<Turn>(initalTurn);
    const [useAI, setUseAI] = useState(false);

    const initBoard = () => {
        setRows(filledRows());
        setTurn(initalTurn);
    }

    const handleClick = (rowIndex: number) => {
        return (cellIndex: number) => {
            const newRows = rowStates.slice();
            const cellValue = rowStates[rowIndex][cellIndex];
            const winner = getWinner(newRows);

            if (winner) {
                if (winner != 'Game Over') {
                    alert(`Game already won by ${winner}`);
                } else {
                    alert(`Game already ended in a draw`);
                }

                return;
            }

            if (cellValue) {
                alert(`Cell already occupied`);
                return;
            }

            newRows[rowIndex][cellIndex] = turn;

            if (useAI && !getWinner(newRows)) {
                setRows(getNextMove(newRows));
            } else {
                setTurn(swapTurns(turn))
                setRows(newRows);
            }
        }
    }

    const controlRowStyle = {
        width: `calc(var(--cell-size) * ${width})`
    };

    let prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const setDarkMode = (useDarkMode: boolean) => {
        setSchemeStyle(useDarkMode ? "dark" : 'light');
    }
    const toggleWidth = '4rem';

    const changeAIPreference = (state: boolean) => {
        setUseAI(state);

        if (state && turn === 'O') {
            setRows(getNextMove(rowStates));
            setTurn('X');
        }
    }

    return <div className="board">
        {
            BoardTopLabel(turn, getWinner(rowStates))
        }
        <div className="control-row" style={controlRowStyle}>
            <button className="btn reset-btn" onClick={initBoard}>Reset</button>
            <Toggle toggleFunc={setDarkMode} defaultState={prefersDarkMode} text="Dark Mode" width={toggleWidth} />
            <Toggle toggleFunc={changeAIPreference} text="AI" width={toggleWidth} />
        </div>
        <div className="rows">
            {
                rowStates.map((cellValues, index) => {
                    const key = index + 1;
                    return <Row key={key} elementKey={key} cellValues={cellValues} onCellClicked={handleClick(index)}></Row>
                })
            }
        </div>
    </div >
}