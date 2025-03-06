import { useState } from "react";

function Square({ value, onSquareClick, square, win }) {
  // const [value, setValue] = useState(null);

  // function handleClick() {
  //   setValue("X");
  // }

  const winClass = win ? "win" : "";

  return (
    <button
      className={`square ${winClass}`}
      id={square}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  const winnerSet = calculateWinner(squares, currentMove);

  function handleClick(i) {
    if (squares[i] || winnerSet.winner) {
      return;
    }

    const nextSquares = squares.slice();

    // nextSquares[i] = "X";
    // setSquares(nextSquares);

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    //setSquares(nextSquares);
    //setXIsNext(!xIsNext);
    onPlay(nextSquares);
  }

  //const winner = winnerSet.winner;
  let status;
  if (winnerSet.winner) {
    status = "Winner: " + winnerSet.winner;
  } else {
    if (winnerSet.isDraw) {
      status = "Draw";
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  }

  let rows = [];
  const boardSize = 3;
  for (let row = 0; row < boardSize; row++) {
    let cols = [];
    for (let col = 0; col < boardSize; col++) {
      let square = row * boardSize + col;
      const win = winnerSet.winLine && winnerSet.winLine.includes(square);
      cols.push(
        <Square
          key={square}
          value={squares[square]}
          square={square}
          onSquareClick={() => handleClick(square)}
          win={win}
        />
      );
    }
    rows.push(
      <div key={row} className="board-row">
        {cols}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  //const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  //const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    //setHistory([...history, nextSquares]);
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    //setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    //setXIsNext(nextMove % 2 === 0); // nextMove=true se o num for par
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    if (move === currentMove) {
      return (
        <li key={move} className={move + 1}>
          <strong>You are at move #{move}</strong>
        </li>
      );
    } else {
      return (
        <li key={move} className={move + 1}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          currentMove={currentMove}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares, currentMove) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const maxMoves = squares.length;

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winLine: lines[i],
        isDraw: false,
      };
    }
  }
  return {
    winner: null,
    winLine: null,
    isDraw: currentMove === maxMoves,
  };
}
