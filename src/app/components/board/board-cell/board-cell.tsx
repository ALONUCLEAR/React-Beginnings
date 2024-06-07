import { MouseEventHandler } from "react";
// we use css fiels by importing them
import "./board-cell.css";

export type BoardCellInput = {
    filling?: string;
    onCellClicked?: MouseEventHandler<HTMLButtonElement>;
};

export default function BoardCell({ filling, onCellClicked }: BoardCellInput): JSX.Element {
    return <button className="board-cell" onClick={onCellClicked}>{filling}</button>;
}