'use client';
import { Player } from '../../interfaces/player';
import React, { useRef, useMemo } from 'react';
import './style.css';
import PlayerCard from '../player/playerComponent';
import { HubConnection } from '@microsoft/signalr';

type GameScreenProps = {
  players: Player[];
  connection: HubConnection | null;
};

const GameScreen: React.FC<GameScreenProps> = ({ players, connection }) => {
  const gameScreenRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!connection || !gameScreenRef.current) {
      console.error('Connection or game screen ref is null');
      return;
    }

    if (connection.state !== 'Connected') {
      console.error('SignalR connection is not established:', connection.state);
      return;
    }

    const rect = gameScreenRef.current.getBoundingClientRect();
    const x = Math.floor(event.clientX - rect.left);
    let y = Math.floor(event.clientY - rect.top - 30);
    connection.invoke('MovePlayer', x, y).catch((err) => {
      console.error('Erro ao mover jogador:', err);
    });
  };

  const playerCards = useMemo(() => {
    return players.map((player) => (
      <PlayerCard
        key={player.connectionId}
        player={player}
        avatarUrl="./jacareIcon.png"
      />
    ));
  }, [players]);

  return (
    <div
      className="game-screen"
      style={{ width: '800px', height: '600px', position: 'relative', boxSizing: 'border-box' }}
      ref={gameScreenRef}
      onClick={handleClick}
    >
      <div className="player-list">{playerCards}</div>
    </div>
  );
};

export default GameScreen;