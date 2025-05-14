using System.Collections.Concurrent;
using jacaclub_backend.Clients;
using Microsoft.AspNetCore.SignalR;
using jacaclub_backend.Models;
namespace jacaclub_backend.Hub;


public class GameHub : Microsoft.AspNetCore.SignalR.Hub
{
    private static readonly ConcurrentDictionary<string, Player> ConnectedPlayers =
        new ConcurrentDictionary<string, Player>();
    
    public override async Task OnConnectedAsync()
    {
        var player = new Player { ConnectionId = Context.ConnectionId, Name = "teste" };
        ConnectedPlayers.TryAdd(Context.ConnectionId, player);
        await UpdateConnectedPlayers();
        await base.OnConnectedAsync();
    }
    
    private async Task UpdateConnectedPlayers()
    {
        await Clients.All.SendAsync("ReceiveConnectedPlayers", ConnectedPlayers.Values.ToList());
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        ConnectedPlayers.TryRemove(Context.ConnectionId, out _);
        await UpdateConnectedPlayers();

        await base.OnDisconnectedAsync(exception);
    }

    public async Task GetConnectedPlayers()
    {
        await Clients.Caller.SendAsync("ReceiveConnectedPlayers", ConnectedPlayers.Values.ToList());
    }

    public async Task MovePlayer(int x, int y)
    {
        try
        {
            if (ConnectedPlayers.TryGetValue(Context.ConnectionId, out var player))
            {
                player.X = Math.Max(0, Math.Min(x, 800));
                player.Y = Math.Max(0, Math.Min(y, 600));
                await Clients.All.SendAsync("PlayerMoved", new
                {
                    player.ConnectionId,
                    player.Name,
                    X = player.X,
                    Y = player.Y
                });
                Console.WriteLine($"Player {player.ConnectionId} moved to x: {player.X}, y: {player.Y}");
            }
            else
            {
                Console.WriteLine($"Player with ConnectionId {Context.ConnectionId} not found");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in MovePlayer: {ex.Message}");
            throw;
        }
    }
}