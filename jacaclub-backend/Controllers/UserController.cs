using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using jacaclub_backend.Models;
using jacaclub_backend.Dtos;

namespace jacaclub_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IMongoCollection<User> _usersCollection;

        public UsersController(IMongoCollection<User> usersCollection)
        {
            _usersCollection = usersCollection;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateDto userDto)
        {
            // Validações básicas
            if (string.IsNullOrEmpty(userDto.Email) || string.IsNullOrEmpty(userDto.Username) || string.IsNullOrEmpty(userDto.Password))
            {
                return BadRequest("Email, username e senha são obrigatórios.");
            }

            // Verificar se o email ou username já existe
            var existingUser = await _usersCollection
                .Find(u => u.Email == userDto.Email || u.Username == userDto.Username)
                .FirstOrDefaultAsync();

            if (existingUser != null)
            {
                return Conflict("Email ou username já está em uso.");
            }

            // Criar o hash da senha
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);



            // Criar o objeto User
            var user = new User
            {
                Email = userDto.Email,
                Username = userDto.Username,
                Password = passwordHash
            };

            // Inserir no MongoDB
            await _usersCollection.InsertOneAsync(user);

            return Ok("Usuário criado com sucesso!");
        }
    }
}