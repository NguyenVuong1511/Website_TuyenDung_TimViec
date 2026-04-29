using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface IJobTypeRepository
    {
        Task<List<JobType>> GetAllAsync();
    }

    public class JobTypeRepository : IJobTypeRepository
    {
        private readonly string _connectionString;

        public JobTypeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<JobType>> GetAllAsync()
        {
            var jobTypes = new List<JobType>();
            string query = "SELECT Id, Name FROM JobTypes ORDER BY Name";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            jobTypes.Add(new JobType
                            {
                                Id = reader.GetGuid(0),
                                Name = reader.GetString(1)
                            });
                        }
                    }
                }
            }
            return jobTypes;
        }
    }
}
