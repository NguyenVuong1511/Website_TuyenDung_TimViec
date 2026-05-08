using System.Data;
using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface IArticleRepository
    {
        Task<List<Article>> GetAllArticlesAsync(string category = null);
        Task<Article?> GetArticleByIdAsync(Guid id);
        Task<bool> CreateArticleAsync(Article article);
        Task<bool> UpdateArticleAsync(Article article);
        Task<bool> DeleteArticleAsync(Guid id);
    }

    public class ArticleRepository : IArticleRepository
    {
        private readonly string _connectionString;

        public ArticleRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<Article>> GetAllArticlesAsync(string category = null)
        {
            var articles = new List<Article>();
            string query = "SELECT * FROM Articles WHERE Status = 'Active'";
            
            if (!string.IsNullOrEmpty(category) && category != "Tất cả")
            {
                query += " AND Category = @Category";
            }
            
            query += " ORDER BY CreatedAt DESC";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    if (!string.IsNullOrEmpty(category) && category != "Tất cả")
                    {
                        command.Parameters.AddWithValue("@Category", category);
                    }

                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            articles.Add(MapArticle(reader));
                        }
                    }
                }
            }
            return articles;
        }

        public async Task<Article?> GetArticleByIdAsync(Guid id)
        {
            string query = "SELECT * FROM Articles WHERE Id = @Id";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return MapArticle(reader);
                        }
                    }
                }
            }
            return null;
        }

        public async Task<bool> CreateArticleAsync(Article article)
        {
            string query = @"
                INSERT INTO Articles (Id, Title, Excerpt, Content, Category, Image, ReadTime, CreatedAt, UpdatedAt, Status)
                VALUES (@Id, @Title, @Excerpt, @Content, @Category, @Image, @ReadTime, @CreatedAt, @UpdatedAt, @Status)";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", Guid.NewGuid());
                    command.Parameters.AddWithValue("@Title", article.Title);
                    command.Parameters.AddWithValue("@Excerpt", (object)article.Excerpt ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Content", article.Content);
                    command.Parameters.AddWithValue("@Category", article.Category);
                    command.Parameters.AddWithValue("@Image", (object)article.Image ?? DBNull.Value);
                    command.Parameters.AddWithValue("@ReadTime", (object)article.ReadTime ?? DBNull.Value);
                    command.Parameters.AddWithValue("@CreatedAt", DateTime.Now);
                    command.Parameters.AddWithValue("@UpdatedAt", DateTime.Now);
                    command.Parameters.AddWithValue("@Status", "Active");

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync() > 0;
                }
            }
        }

        public async Task<bool> UpdateArticleAsync(Article article)
        {
            string query = @"
                UPDATE Articles 
                SET Title = @Title, Excerpt = @Excerpt, Content = @Content, Category = @Category, 
                    Image = @Image, ReadTime = @ReadTime, UpdatedAt = @UpdatedAt, Status = @Status
                WHERE Id = @Id";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", article.Id);
                    command.Parameters.AddWithValue("@Title", article.Title);
                    command.Parameters.AddWithValue("@Excerpt", (object)article.Excerpt ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Content", article.Content);
                    command.Parameters.AddWithValue("@Category", article.Category);
                    command.Parameters.AddWithValue("@Image", (object)article.Image ?? DBNull.Value);
                    command.Parameters.AddWithValue("@ReadTime", (object)article.ReadTime ?? DBNull.Value);
                    command.Parameters.AddWithValue("@UpdatedAt", DateTime.Now);
                    command.Parameters.AddWithValue("@Status", article.Status);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync() > 0;
                }
            }
        }

        public async Task<bool> DeleteArticleAsync(Guid id)
        {
            string query = "UPDATE Articles SET Status = 'Deleted' WHERE Id = @Id";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync() > 0;
                }
            }
        }

        private Article MapArticle(SqlDataReader reader)
        {
            return new Article
            {
                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                Title = reader.GetString(reader.GetOrdinal("Title")),
                Excerpt = reader.IsDBNull(reader.GetOrdinal("Excerpt")) ? null : reader.GetString(reader.GetOrdinal("Excerpt")),
                Content = reader.GetString(reader.GetOrdinal("Content")),
                Category = reader.GetString(reader.GetOrdinal("Category")),
                Image = reader.IsDBNull(reader.GetOrdinal("Image")) ? null : reader.GetString(reader.GetOrdinal("Image")),
                ReadTime = reader.IsDBNull(reader.GetOrdinal("ReadTime")) ? null : reader.GetString(reader.GetOrdinal("ReadTime")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                UpdatedAt = reader.GetDateTime(reader.GetOrdinal("UpdatedAt")),
                Status = reader.GetString(reader.GetOrdinal("Status"))
            };
        }
    }
}
