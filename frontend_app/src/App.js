import React, { useMemo, useState } from "react";
import "./App.css";

const PLAYERS = {
  X: "X",
  O: "O",
};

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

/**
 * Evaluate the current board state and determine game status.
 * Returns winner ('X'|'O'), winningLine (number[]|null), and isDraw boolean.
 */
function evaluateBoard(board) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningLine: line, isDraw: false };
    }
  }

  const isDraw = board.every((cell) => cell !== null);
  return { winner: null, winningLine: null, isDraw };
}

// PUBLIC_INTERFACE
function App() {
  /** 9 cells: null | 'X' | 'O' */
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYERS.X);
  const [xStartsNext, setXStartsNext] = useState(false);

  const evaluation = useMemo(() => evaluateBoard(board), [board]);
  const isGameOver = Boolean(evaluation.winner) || evaluation.isDraw;

  const status = useMemo(() => {
    if (evaluation.winner) return `Winner: ${evaluation.winner}`;
    if (evaluation.isDraw) return "Draw!";
    return `Turn: ${currentPlayer}`;
  }, [evaluation.winner, evaluation.isDraw, currentPlayer]);

  // PUBLIC_INTERFACE
  function handleCellClick(index) {
    if (isGameOver) return;
    if (board[index] !== null) return;

    setBoard((prev) => {
      const next = [...prev];
      next[index] = currentPlayer;
      return next;
    });

    setCurrentPlayer((prev) => (prev === PLAYERS.X ? PLAYERS.O : PLAYERS.X));
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    const nextStartingPlayer = xStartsNext ? PLAYERS.X : PLAYERS.O;
    setBoard(Array(9).fill(null));
    setCurrentPlayer(nextStartingPlayer);
    setXStartsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function startNewGameSameStarter() {
    setBoard(Array(9).fill(null));
  }

  return (
    <div className="App">
      <main className="appShell">
        <header className="header">
          <div className="brand">
            <div className="brandBadge" aria-hidden="true">
              TTT
            </div>
            <div className="brandText">
              <h1 className="title">Tic Tac Toe</h1>
              <p className="subtitle">Retro grid. Soft Gray vibes. Local 2-player.</p>
            </div>
          </div>

          <section
            className={[
              "statusCard",
              evaluation.winner ? "statusCard--win" : "",
              evaluation.isDraw ? "statusCard--draw" : "",
            ].join(" ")}
            aria-live="polite"
          >
            <div className="statusRow">
              <span className="statusLabel">Status</span>
              <span className="statusValue">{status}</span>
            </div>

            <div className="chipRow" role="group" aria-label="Player markers">
              <span
                className={[
                  "chip",
                  "chip--x",
                  currentPlayer === PLAYERS.X && !isGameOver ? "chip--active" : "",
                  evaluation.winner === PLAYERS.X ? "chip--winner" : "",
                ].join(" ")}
              >
                X
              </span>
              <span
                className={[
                  "chip",
                  "chip--o",
                  currentPlayer === PLAYERS.O && !isGameOver ? "chip--active" : "",
                  evaluation.winner === PLAYERS.O ? "chip--winner" : "",
                ].join(" ")}
              >
                O
              </span>
            </div>
          </section>
        </header>

        <section className="gameArea" aria-label="Tic Tac Toe game">
          <div className="boardWrap">
            <div className="board" role="grid" aria-label="3 by 3 Tic Tac Toe board">
              {board.map((cell, i) => {
                const isWinningCell = evaluation.winningLine?.includes(i) ?? false;
                const isDisabled = isGameOver || cell !== null;

                return (
                  <button
                    key={i}
                    type="button"
                    className={[
                      "cell",
                      cell === PLAYERS.X ? "cell--x" : "",
                      cell === PLAYERS.O ? "cell--o" : "",
                      isWinningCell ? "cell--win" : "",
                    ].join(" ")}
                    onClick={() => handleCellClick(i)}
                    disabled={isDisabled}
                    role="gridcell"
                    aria-label={`Cell ${i + 1}${cell ? `: ${cell}` : ""}`}
                  >
                    <span className="cellInner" aria-hidden="true">
                      {cell ?? ""}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="helperText">
              Tip: Press <span className="kbd">New game</span> to alternate who starts each round.
            </p>
          </div>

          <aside className="controls" aria-label="Game controls">
            <div className="panel">
              <h2 className="panelTitle">Controls</h2>

              <div className="btnRow">
                <button type="button" className="btn btnPrimary" onClick={resetGame}>
                  New game
                </button>
                <button
                  type="button"
                  className="btn btnGhost"
                  onClick={startNewGameSameStarter}
                  disabled={board.every((c) => c === null)}
                >
                  Reset board
                </button>
              </div>

              <div className="meta">
                <div className="metaRow">
                  <span className="metaLabel">Next starter</span>
                  <span className="metaValue">{xStartsNext ? "X" : "O"}</span>
                </div>
                <div className="metaRow">
                  <span className="metaLabel">Game state</span>
                  <span className="metaValue">{isGameOver ? "Finished" : "In progress"}</span>
                </div>
              </div>
            </div>

            <div className="panel panel--rules">
              <h2 className="panelTitle">How to play</h2>
              <ul className="rules">
                <li>Take turns placing <strong>X</strong> and <strong>O</strong>.</li>
                <li>First to align 3 in a row wins.</li>
                <li>If the grid fills up, it’s a draw.</li>
              </ul>
            </div>
          </aside>
        </section>

        <footer className="footer">
          <span className="footerText">Built with React • Responsive • Keyboard-friendly</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
