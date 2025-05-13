"use client";

import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

interface Player {
  connectionId: string;
  name: string;
}

export default function Home() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl("http://localhost:8080/hub/game", { withCredentials: true })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connect.on("ReceiveConnectedPlayers", (players: Player[]) => {
      setPlayers(players);
      console.log("Jogadores conectados atualizados:", players);
    });
    connect.start()
      .then(() => {
        console.log("Conectado ao GameHub");
        connect.invoke("GetConnectedPlayers");

      })
      .catch((err) => console.error("Erro ao conectar ao SignalR:", err));

    setConnection(connect);

    return () => {
      connect.stop();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Lobby</h1>
      <p className="mb-4">Total de jogadores no lobby: <strong>{players.length}</strong></p>
    </div>
  );
}
