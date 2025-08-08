export type BoardCell = -1 | 0 | 1;
export type WinningLine = [
  [number, number],
  [number, number],
  [number, number]
] | null;

export function checkWinner(board: BoardCell[][]): WinningLine {
  const lines: [number, number][][] = [
    // Rows
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    // Columns
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    // Diagonals
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
  ];

  for (const line of lines) {
    const [[r1, c1], [r2, c2], [r3, c3]] = line;
    if (
      board[r1][c1] !== -1 &&
      board[r1][c1] === board[r2][c2] &&
      board[r1][c1] === board[r3][c3]
    ) {
      // If a winning line is found, return its coordinates
      return line as WinningLine;
    }
  }

  return null;
}

export function isDraw(board: BoardCell[][]): boolean {
  return board.every(row => row.every(cell => cell !== -1));
}