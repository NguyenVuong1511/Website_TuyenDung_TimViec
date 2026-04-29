using Microsoft.AspNetCore.Mvc;
using TuyenDung_TimViec.Models;
using TuyenDung_TimViec.Repositories;

namespace TuyenDung_TimViec.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MetadataController : ControllerBase
    {
        private readonly ILevelRepository _levelRepository;
        private readonly IExperienceRepository _experienceRepository;
        private readonly IJobTypeRepository _jobTypeRepository;

        public MetadataController(
            ILevelRepository levelRepository,
            IExperienceRepository experienceRepository,
            IJobTypeRepository jobTypeRepository)
        {
            _levelRepository = levelRepository;
            _experienceRepository = experienceRepository;
            _jobTypeRepository = jobTypeRepository;
        }

        [HttpGet("levels")]
        public async Task<IActionResult> GetLevels()
        {
            try
            {
                var levels = await _levelRepository.GetAllAsync();
                return Ok(RepositoryResult<List<Level>>.Ok(levels, "Lấy danh sách cấp bậc thành công!"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        [HttpGet("experiences")]
        public async Task<IActionResult> GetExperiences()
        {
            try
            {
                var experiences = await _experienceRepository.GetAllAsync();
                return Ok(RepositoryResult<List<Experience>>.Ok(experiences, "Lấy danh sách kinh nghiệm thành công!"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        [HttpGet("jobtypes")]
        public async Task<IActionResult> GetJobTypes()
        {
            try
            {
                var jobTypes = await _jobTypeRepository.GetAllAsync();
                return Ok(RepositoryResult<List<JobType>>.Ok(jobTypes, "Lấy danh sách loại hình công việc thành công!"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }
    }
}
