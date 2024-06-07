'use client';

import { Key, useState } from 'react';
import BoardCell, { BoardCellInput } from "./board-cell/board-cell";
import './board.css';
import { CellValue, Turn, fillRows, getWinner, swapTurns } from './board.utils';

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
    const initRows = (value?: Turn) => fillRows(rowCount, width, value);
    const [rowStates, setRows] = useState(initRows());
    const [turn, SetTurn] = useState<Turn>('X');

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


            SetTurn(swapTurns(turn))
            setRows(newRows);
        }
    }

    return <div className="board">
        {
            BoardTopLabel(turn, getWinner(rowStates))
        }
        {
            rowStates.map((cellValues, index) => {
                const key = index + 1;
                return <Row key={key} elementKey={key} cellValues={cellValues} onCellClicked={handleClick(index)}></Row>
            })
        }
    </div>
}