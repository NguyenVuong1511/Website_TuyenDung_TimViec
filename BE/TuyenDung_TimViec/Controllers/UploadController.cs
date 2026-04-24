using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace TuyenDung_TimViec.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly string _connectionString;
        private readonly IWebHostEnvironment _env;

        public UploadController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _env = env;
        }

        [HttpPost("avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file, [FromForm] Guid userId)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "Không có file được chọn." });

            try
            {
                // Construct path to FE/TuyenDung_TimViecLam/public/images/avatar
                var beDir = _env.ContentRootPath; // f:\SPKTHY_3\DoAn_3\Website_TuyenDung_TimViec\BE\TuyenDung_TimViec
                var feAvatarDir = Path.GetFullPath(Path.Combine(beDir, "..", "..", "FE", "TuyenDung_TimViecLam", "public", "images", "avatar"));

                if (!Directory.Exists(feAvatarDir))
                {
                    Directory.CreateDirectory(feAvatarDir);
                }

                // Create a unique filename
                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = $"avatar_{userId}_{DateTime.Now.Ticks}{fileExtension}";
                var filePath = Path.Combine(feAvatarDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Update Candidates table in DB and delete old file
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    
                    // 1. Get old avatar to delete
                    string oldAvatar = null;
                    var selectQuery = "SELECT Avatar FROM Candidates WHERE UserId = @UserId";
                    using (SqlCommand selectCmd = new SqlCommand(selectQuery, conn))
                    {
                        selectCmd.Parameters.AddWithValue("@UserId", userId);
                        var result = await selectCmd.ExecuteScalarAsync();
                        if (result != null && result != DBNull.Value)
                        {
                            oldAvatar = result.ToString();
                        }
                    }

                    // 2. Delete old avatar if it exists
                    if (!string.IsNullOrEmpty(oldAvatar))
                    {
                        var oldFilePath = Path.Combine(feAvatarDir, oldAvatar);
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            try
                            {
                                System.IO.File.Delete(oldFilePath);
                            }
                            catch (Exception)
                            {
                                // Ignore if cannot delete to avoid breaking the upload process
                            }
                        }
                    }

                    // 3. Update DB with new avatar
                    var updateQuery = "UPDATE Candidates SET Avatar = @Avatar WHERE UserId = @UserId";
                    using (SqlCommand updateCmd = new SqlCommand(updateQuery, conn))
                    {
                        updateCmd.Parameters.AddWithValue("@Avatar", fileName);
                        updateCmd.Parameters.AddWithValue("@UserId", userId);
                        int rowsAffected = await updateCmd.ExecuteNonQueryAsync();

                        if (rowsAffected == 0)
                        {
                            return NotFound(new { success = false, message = "Không tìm thấy hồ sơ ứng viên để cập nhật." });
                        }
                    }
                }

                return Ok(new { success = true, message = "Tải ảnh thành công.", data = fileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi lưu ảnh: " + ex.Message });
            }
        }
    }
}
