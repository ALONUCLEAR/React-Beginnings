import { CellValue, Turn, getWinner, swapTurns } from "./board.utils";

type Action = {
  row: number;
  col: number;
  value?: number;
  turn?: Turn;
};

const copyMatrix = <T>(board: T[][]): T[][] => [
  ...board.map((row) => [...row]),
];
export const getNextMove = (boardState: CellValue[][]): CellValue[][] => {
  return useMinimax(boardState);
};

const useMinimax = (board: CellValue[][]): CellValue[][] => {
  const actions = possibleActions(board, "O");
  const options = actions.map((action) => ({
    row: action.row,
    col: action.col,
    value: minimax(result(board, action), "X"),
  }));

  if (options.length > 0) {
    const lowestValue = Math.min(...options.map(({ value }) => value));
    const actionIndex = options.findIndex(({ value }) => value === lowestValue);
    return result(board, actions[actionIndex]);
  }

  return board;
};

function possibleActions(board: CellValue[][], turn: Turn): Action[] {
  return board.flatMap((row, rowIndex) =>
    row
      .map((_, colIndex) => ({ row: rowIndex, col: colIndex, turn }))
      .filter(({ col }) => !row[col])
  );
}

function evaluateGameEnd(board: CellValue[][]): number | undefined {
  const winner = getWinner(board);

  switch (winner) {
    case "Game Over":
      return 0.1;
    case "X":
      return 1;
    case "O":
      return -1;
    default:
      break;
  }

  return undefined;
}
function result(board: CellValue[][], action: Action): CellValue[][] {
  const res = copyMatrix(board);
  res[action.row][action.col] = action.turn;

  return res;
}
function minimax(board: CellValue[][], turn: Turn): number {
  const gameEndScore = evaluateGameEnd(board);
  if (gameEndScore) {
    return gameEndScore;
  }

  const actions = possibleActions(board, turn);
  const nextTurn = swapTurns(turn);
  const actionValues = actions.map((action) =>
    minimax(result(board, action), nextTurn)
  );

  if (turn === "X") {
    return Math.max(...actionValues);
  }

  return Math.min(...actionValues);
}
