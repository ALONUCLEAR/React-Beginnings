import { CellValue, Turn, getWinner, swapTurns } from "./board.utils";

type Action = {
  row: number;
  col: number;
  value?: number;
  turn?: Turn;
};

type MinimaxResponse = {
  value: number;
  numberOfSteps: number;
};

const copyMatrix = <T>(board: T[][]): T[][] => [
  ...board.map((row) => [...row]),
];
export const getNextMove = (boardState: CellValue[][]): CellValue[][] => {
  return useMinimax(boardState);
};

const useMinimax = (board: CellValue[][]): CellValue[][] => {
  const actions = possibleActions(board, "O");
  const options = actions.map((action, index) => {
    const res = minimax(result(board, action), "X");

    return {
      row: action.row,
      col: action.col,
      value: res.value,
      nuberOfSteps: res.numberOfSteps,
      actionIndex: index,
    };
  });

  if (options.length > 0) {
    const lowestValue = Math.min(...options.map(({ value }) => value));
    const goodOptions = options.filter(({ value }) => value === lowestValue);
    // if we can win, do it quickly, else: at least lose slowly
    const desiredFunction = lowestValue < 0 ? Math.min : Math.max;
    const desiredNumberOfSteps = desiredFunction(
      ...goodOptions.map(({ nuberOfSteps }) => nuberOfSteps)
    );
    const actionIndex = goodOptions.find(
      ({ nuberOfSteps }) => nuberOfSteps === desiredNumberOfSteps
    )!.actionIndex;
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
function minimax(
  board: CellValue[][],
  turn: Turn,
  numberOfSteps = 0
): MinimaxResponse {
  const gameEndScore = evaluateGameEnd(board);
  if (gameEndScore) {
    return {
      value: gameEndScore,
      numberOfSteps,
    };
  }

  const actions = possibleActions(board, turn);
  const nextTurn = swapTurns(turn);
  const actionResponses = actions.map((action) =>
    minimax(result(board, action), nextTurn, numberOfSteps + 1)
  );
  const desiredFunction = turn === "X" ? Math.max : Math.min;

  const searchedValue = desiredFunction(
    ...actionResponses.map(({ value }) => value)
  );
  const goodActions = actionResponses.filter(
    ({ value }) => value === searchedValue
  );
  // if the opponent is bound to win, make it as slow as possible
  // if the current player is bound to win, make it as quick as possible
  let pathDesiredFunction = searchedValue < 0 ? Math.min : Math.max;
  if (turn === "X") {
    pathDesiredFunction = searchedValue > 0 ? Math.min : Math.max;
  }

  const bestGoodPathLength = Math.min(
    ...goodActions.map(({ numberOfSteps }) => numberOfSteps)
  );

  return {
    value: searchedValue,
    numberOfSteps: bestGoodPathLength,
  };
}
