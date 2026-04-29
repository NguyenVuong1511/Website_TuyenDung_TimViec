using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface IExperienceRepository
    {
        Task<List<Experience>> GetAllAsync();
    }

    public class ExperienceRepository : IExperienceRepository
    {
        private readonly string _connectionString;

        public ExperienceRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<Experience>> GetAllAsync()
        {
            var experiences = new List<Experience>();
            string query = "SELECT Id, Name FROM Experiences ORDER BY Name";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            experiences.Add(new Experience
                            {
                                Id = reader.GetGuid(0),
                                Name = reader.GetString(1)
                            });
                        }
                    }
                }
            }
            return experiences;
        }
    }
}
