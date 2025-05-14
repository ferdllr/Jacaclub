'use client';
import './style.css';
import { Player } from '../interfaces/player';
import { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import GameScreen from '../components/gameComponent/gameComponent';

export default function Home() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [localConnectionId, setLocalConnectionId] = useState<string | null>(null);

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl('http://localhost:8080/hub/game', { withCredentials: true })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connect.onclose(() => setLocalConnectionId(null));
    connect.on('ReceiveConnectedPlayers', (players: Player[]) => {
      setPlayers(players);
      console.log('Jogadores conectados atualizados:', players);
    });

    connect.on('PlayerMoved', (data: { connectionId: string; name: string; x: number; y: number }) => {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.connectionId === data.connectionId
            ? { ...player, x: data.x, y: data.y }
            : player
        )
      );
      console.log('PlayerMoved received:', data);
    });
    connect.on('PlayerSentMessage', (data: { connectionId: string; message: string }) => {
    setPlayers(prevPlayers =>
        prevPlayers.map(player =>
        player.connectionId === data.connectionId
            ? { ...player, message: data.message }
            : player
        )
    );
    setTimeout(() => {
        setPlayers(prevPlayers =>
        prevPlayers.map(player =>
            player.connectionId === data.connectionId
            ? { ...player, message: undefined }
            : player
        )
        );
    }, 5000);
    });
    connect.start()
      .then(() => {
        console.log('Conectado ao GameHub');
        connect.invoke('GetConnectedPlayers');
        setLocalConnectionId(connect.connectionId);
      })
      .catch((err) => console.error('Erro ao conectar ao SignalR:', err));

    setConnection(connect);

    return () => {
      connect.stop();
    };
  }, []);

  return (
    <div className="main-div">
        <div className="div-footer">
        <h1 className="text-xl font-bold mb-2">jogo</h1>
        </div>
        <GameScreen players={players} connection={connection} />
        <div className="chat-input-wrapper">
            <input
            type="text"
            className="chat-input"
            placeholder="escreve ai"
            onKeyDown={(e) => {
                if (e.key === 'Enter' && connection) {
                const message = e.currentTarget.value.trim();
                if (message.length > 0) {
                    connection.invoke('SendMessage', message);
                    e.currentTarget.value = '';
                }
                }
            }}
            />
        </div>
    </div>
  );
}