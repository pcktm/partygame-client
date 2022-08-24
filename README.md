# @pcktm's party game
##### web client


@pcktm's party game is a game in which you answer questions and then vote on who said what. The game is played by two or more players. The object of the game is to correctly guess who said what. Players take turns answering questions, and then voting on who they think said what. The player with the most correct guesses wins!

### Installation

Clone the repo, fill out `.env` with your variables:
```
VITE_COLYSEUS_SERVER_URL="http://localhost:4000"
VITE_COLYSEUS_SOCKET_URL="ws://localhost:4000" 
```
then run:
```bash
$ yarn
$ yarn dev # or yarn build
```
---
Written in TypeScript & React.