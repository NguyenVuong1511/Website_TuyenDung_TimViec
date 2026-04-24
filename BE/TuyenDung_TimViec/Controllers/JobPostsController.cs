using Microsoft.AspNetCore.Mvc;
using TuyenDung_TimViec.Repositories;

namespace TuyenDung_TimViec.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobPostsController : ControllerBase
    {
        private readonly IJobPostRepository _jobPostRepository;

        public JobPostsController(IJobPostRepository jobPostRepository)
        {
            _jobPostRepository = jobPostRepository;
        }

        [HttpGet("top")]
        public async Task<IActionResult> GetTopJobs()
        {
            try
            {
                var jobs = await _jobPostRepository.GetTopJobPostsAsync(12);
                return Ok(RepositoryResult<object>.Ok(jobs, "Lấy danh sách top jobs thành công!"));
            }
            catch (Exception ex)
            {
                var message = ex.InnerException != null ? $"{ex.Message} | {ex.InnerException.Message}" : ex.Message;
                return StatusCode(500, $"Lỗi hệ thống: {message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetPagedJobs([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var (jobs, totalCount) = await _jobPostRepository.GetPagedJobPostsAsync(pageNumber, pageSize);
                var result = new
                {
                    Jobs = jobs,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };
                return Ok(RepositoryResult<object>.Ok(result, "Lấy danh sách jobs thành công!"));
            }
            catch (Exception ex)
            {
                var message = ex.InnerException != null ? $"{ex.Message} | {ex.InnerException.Message}" : ex.Message;
                return StatusCode(500, $"Lỗi hệ thống: {message}");
            }
        }
    }
}
