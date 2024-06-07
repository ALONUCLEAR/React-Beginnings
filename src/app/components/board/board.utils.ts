export type Turn = "X" | "O" | "Game Over";
export type CellValue = Turn | undefined;

export const fillRows = (
  rowCount: number,
  width: number,
  value?: Turn
): CellValue[][] => {
  return Array.from({ length: rowCount }, () =>
    Array.from({ length: width }, () => value)
  );
};

const numStr = (str: string) => str.charCodeAt(0);

const swapValues = <T extends string>(strA: T, strB: T, strInput: T): T => {
  const [a, b, input] = [strA, strB, strInput].map(numStr);

  return String.fromCharCode(a ^ b ^ input) as T;
};

export const swapTurns = (lastTurn: Turn): Turn => {
  return swapValues("X", "O", lastTurn);
};

const checkPartForWinner = (boardPart: CellValue[]): Turn | undefined => {
  const firstCell = boardPart[0];

  if (!firstCell) {
    return;
  }

  if (boardPart.every((value) => value === firstCell)) {
    return firstCell;
  }
};
export const getWinner = (boardState: CellValue[][]): Turn | undefined => {
  const height = boardState.length,
    width = boardState[0]?.length ?? 0;
  //check to see if the row matches
  for (let rowIndex = 0; rowIndex < height; rowIndex++) {
    const winningRowTurn = checkPartForWinner(boardState[rowIndex]);

    if (winningRowTurn) {
      return winningRowTurn;
    }
  }

  //check the columns
  for (let colIndex = 0; colIndex < width; colIndex++) {
    const column = boardState.map((row) => row[colIndex]);
    const winningColumnTurn = checkPartForWinner(column);

    if (winningColumnTurn) {
      return winningColumnTurn;
    }
  }

  if (width === height) {
    // check for diagonals
    const downDiagonal = boardState.map((row, index) => row[index]);
    const upDiagonal = boardState.map((row, index) => row[width - 1 - index]);

    const winningDiagonalTurn = [downDiagonal, upDiagonal]
      .map(checkPartForWinner)
      .find(Boolean);

    if (winningDiagonalTurn) {
      return winningDiagonalTurn;
    }
  }

  return boardState.every((row) => row.every((cell) => cell))
    ? "Game Over"
    : undefined;
};
