import { useState } from "react";
import GameBoard from "./components/Gameboard";
import Player from "./components/Player";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";

const INITIAL_PLAYERS = { X: "Player 1", Y: "Player 2" };

let INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

// Function này sẽ không bị tạo lại mỗi khi Component re-render
function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";
  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }
  return currentPlayer;
}

function deriveGameboard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((arr) => [...arr])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { col, row } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
}

function deriveWinner(gameBoard, players) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);

  const activePlayer = deriveActivePlayer(gameTurns);

  const selectSquareHandler = (rowIndex, colIndex) => {
    setGameTurns((prevTurns) => {
      // Không sử dụng state activePlayer để set cho property player
      // Vì không đảm bảo được state activePlayer sẽ luôn nhận được giá trị mới nhất
      const currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  };

  const gameBoard = deriveGameboard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length === 9 && !winner;

  const rematchHandler = () => {
    setGameTurns([]);
  };

  const changePlayerNameHandler = (symbol, newName) => {
    setPlayers((prevPLayers) => {
      return { ...prevPLayers, [symbol]: newName };
    });
  };

  console.log(gameTurns);

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={INITIAL_PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={changePlayerNameHandler}
          />
          <Player
            initialName={INITIAL_PLAYERS.Y}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={changePlayerNameHandler}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={rematchHandler} />
        )}

        <GameBoard onSelectSquare={selectSquareHandler} board={gameBoard} />
      </div>

      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
