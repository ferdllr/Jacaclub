namespace jacaclub_backend.Clients;

public interface IGameClient
{
    Task ReceiveMessage(string message);
}