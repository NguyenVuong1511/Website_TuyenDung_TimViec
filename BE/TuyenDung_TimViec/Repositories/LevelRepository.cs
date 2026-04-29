using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface ILevelRepository
    {
        Task<List<Level>> GetAllAsync();
    }

    public class LevelRepository : ILevelRepository
    {
        private readonly string _connectionString;

        public LevelRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<Level>> GetAllAsync()
        {
            var levels = new List<Level>();
            string query = "SELECT Id, Name FROM Levels ORDER BY Name";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            levels.Add(new Level
                            {
                                Id = reader.GetGuid(0),
                                Name = reader.GetString(1)
                            });
                        }
                    }
                }
            }
            return levels;
        }
    }
}
