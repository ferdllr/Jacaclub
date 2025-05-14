namespace jacaclub_backend.Models;


public class Player
{
    public string ConnectionId { get; set; }
    public string Name { get; set; }
    public int X { get; set; } = 0;
    public int Y { get; set; } = 0;
    public string? Message { get; set; }

}