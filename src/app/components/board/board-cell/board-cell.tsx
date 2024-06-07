import { MouseEventHandler, useState } from "react";
// we use css fiels by importing them
import "./board-cell.css";

export type BoardCellInput = {
    filling?: string;
    onCellClicked?: MouseEventHandler<HTMLButtonElement>;
};

// const useState = (value: any) => {
//     return [value, (x: any) => { }];
// }

export default function BoardCell({ filling, onCellClicked }: BoardCellInput): JSX.Element {
    const value = filling;
    // const [value, setValue] = useState(filling);

    // const handleClick = () => {
    //     setValue(value ? undefined : 'X');
    // };
    return <button className="board-cell" onClick={onCellClicked}>{value}</button>;
}