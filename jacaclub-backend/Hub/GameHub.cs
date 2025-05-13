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
}