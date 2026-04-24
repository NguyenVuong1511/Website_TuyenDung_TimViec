using System.Data;
using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface ICVRepository
    {
        Task<CVDetail?> GetCVDetailByUserIdAsync(Guid userId);
    }

    public class CVRepository : ICVRepository
    {
        private readonly string _connectionString;

        public CVRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<CVDetail?> GetCVDetailByUserIdAsync(Guid userId)
        {
            CVDetail? cv = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                // 1. Get the Candidate Info and their default/latest CV
                string queryCV = @"
                    SELECT TOP 1 
                           c.Id as CandidateId, c.FullName, c.Phone, c.Address, c.DateOfBirth, c.Avatar, c.AboutMe, c.Github, c.LinkedIn, c.Website,
                           u.Email,
                           cv.Id as CVId, cv.Title, cv.Type, cv.FileUrl, cv.UploadDate, cv.IsDefault
                    FROM Candidates c
                    INNER JOIN Users u ON c.UserId = u.Id
                    LEFT JOIN CVs cv ON c.Id = cv.CandidateId
                    WHERE c.UserId = @UserId 
                    ORDER BY cv.IsDefault DESC, cv.UploadDate DESC";

                using (SqlCommand cmd = new SqlCommand(queryCV, connection))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            cv = new CVDetail
                            {
                                CandidateId = reader.GetGuid(reader.GetOrdinal("CandidateId")),
                                FullName = reader.IsDBNull(reader.GetOrdinal("FullName")) ? string.Empty : reader.GetString(reader.GetOrdinal("FullName")),
                                Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? string.Empty : reader.GetString(reader.GetOrdinal("Email")),
                                Phone = reader.IsDBNull(reader.GetOrdinal("Phone")) ? string.Empty : reader.GetString(reader.GetOrdinal("Phone")),
                                Address = reader.IsDBNull(reader.GetOrdinal("Address")) ? string.Empty : reader.GetString(reader.GetOrdinal("Address")),
                                DateOfBirth = reader.IsDBNull(reader.GetOrdinal("DateOfBirth")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("DateOfBirth")),
                                Avatar = reader.IsDBNull(reader.GetOrdinal("Avatar")) ? string.Empty : reader.GetString(reader.GetOrdinal("Avatar")),
                                AboutMe = reader.IsDBNull(reader.GetOrdinal("AboutMe")) ? string.Empty : reader.GetString(reader.GetOrdinal("AboutMe")),
                                Github = reader.IsDBNull(reader.GetOrdinal("Github")) ? string.Empty : reader.GetString(reader.GetOrdinal("Github")),
                                LinkedIn = reader.IsDBNull(reader.GetOrdinal("LinkedIn")) ? string.Empty : reader.GetString(reader.GetOrdinal("LinkedIn")),
                                Website = reader.IsDBNull(reader.GetOrdinal("Website")) ? string.Empty : reader.GetString(reader.GetOrdinal("Website"))
                            };

                            // Map CV info if exists
                            if (!reader.IsDBNull(reader.GetOrdinal("CVId")))
                            {
                                cv.Id = reader.GetGuid(reader.GetOrdinal("CVId"));
                                cv.Title = reader.IsDBNull(reader.GetOrdinal("Title")) ? string.Empty : reader.GetString(reader.GetOrdinal("Title"));
                                cv.Type = reader.IsDBNull(reader.GetOrdinal("Type")) ? string.Empty : reader.GetString(reader.GetOrdinal("Type"));
                                cv.FileUrl = reader.IsDBNull(reader.GetOrdinal("FileUrl")) ? string.Empty : reader.GetString(reader.GetOrdinal("FileUrl"));
                                cv.UploadDate = reader.IsDBNull(reader.GetOrdinal("UploadDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("UploadDate"));
                                cv.IsDefault = reader.IsDBNull(reader.GetOrdinal("IsDefault")) ? false : reader.GetBoolean(reader.GetOrdinal("IsDefault"));
                            }
                            else
                            {
                                cv.Id = Guid.Empty;
                            }
                        }
                    }
                }

                if (cv == null) return null;

                // Only fetch child records if CVId is not empty
                if (cv.Id != Guid.Empty)
                {

                // 2. Get Educations
                string queryEdu = "SELECT * FROM CVEducations WHERE CVId = @CVId";
                using (SqlCommand cmd = new SqlCommand(queryEdu, connection))
                {
                    cmd.Parameters.AddWithValue("@CVId", cv.Id);
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            cv.Educations.Add(new CVEducation
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                CVId = reader.GetGuid(reader.GetOrdinal("CVId")),
                                SchoolName = reader.IsDBNull(reader.GetOrdinal("SchoolName")) ? string.Empty : reader.GetString(reader.GetOrdinal("SchoolName")),
                                Major = reader.IsDBNull(reader.GetOrdinal("Major")) ? string.Empty : reader.GetString(reader.GetOrdinal("Major")),
                                StartDate = reader.IsDBNull(reader.GetOrdinal("StartDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("StartDate")),
                                EndDate = reader.IsDBNull(reader.GetOrdinal("EndDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("EndDate")),
                                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? string.Empty : reader.GetString(reader.GetOrdinal("Description"))
                            });
                        }
                    }
                }

                // 3. Get Experiences
                string queryExp = "SELECT * FROM CVExperiences WHERE CVId = @CVId";
                using (SqlCommand cmd = new SqlCommand(queryExp, connection))
                {
                    cmd.Parameters.AddWithValue("@CVId", cv.Id);
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            cv.Experiences.Add(new CVExperience
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                CVId = reader.GetGuid(reader.GetOrdinal("CVId")),
                                CompanyName = reader.IsDBNull(reader.GetOrdinal("CompanyName")) ? string.Empty : reader.GetString(reader.GetOrdinal("CompanyName")),
                                Position = reader.IsDBNull(reader.GetOrdinal("Position")) ? string.Empty : reader.GetString(reader.GetOrdinal("Position")),
                                StartDate = reader.IsDBNull(reader.GetOrdinal("StartDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("StartDate")),
                                EndDate = reader.IsDBNull(reader.GetOrdinal("EndDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("EndDate")),
                                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? string.Empty : reader.GetString(reader.GetOrdinal("Description"))
                            });
                        }
                    }
                }

                // 4. Get Skills
                string querySkill = "SELECT * FROM CVSkills WHERE CVId = @CVId";
                using (SqlCommand cmd = new SqlCommand(querySkill, connection))
                {
                    cmd.Parameters.AddWithValue("@CVId", cv.Id);
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            cv.Skills.Add(new CVSkill
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                CVId = reader.GetGuid(reader.GetOrdinal("CVId")),
                                SkillName = reader.IsDBNull(reader.GetOrdinal("SkillName")) ? string.Empty : reader.GetString(reader.GetOrdinal("SkillName")),
                                Level = reader.IsDBNull(reader.GetOrdinal("Level")) ? string.Empty : reader.GetString(reader.GetOrdinal("Level"))
                            });
                        }
                    }
                }
                } // end if cv.Id != Guid.Empty
            }

            return cv;
        }
    }
}
