'use client';
import { Player } from '@/app/interfaces/player';
import './style.css';
import React from 'react';

type PlayerProps = {
  player: Player;
  avatarUrl?: string;
};

const PlayerCard: React.FC<PlayerProps> = ({ player, avatarUrl }) => {
  const left = Math.max(0, Math.min(player.x - 25, 800 - 50));
  const top = Math.max(0, Math.min(player.y - 25, 600 - 50));

  return (
    <div
      className="player-card"
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        transition: 'left 0.3s linear, top 0.3s linear',
      }}
    >
      <div className="player-info">
        {player.message && (
          <div className="player-message">
            <p>{player.message}</p>
          </div>
        )}
        <p className="player-name">{player.name}</p>
      </div>
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt={`${player.name}'s avatar`}
          className="player-avatar"
        />
      )}
    </div>
  );
};

export default React.memo(PlayerCard);