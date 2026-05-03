using System;
using Microsoft.AspNetCore.Mvc;
using TuyenDung_TimViec.Models;
using TuyenDung_TimViec.Repositories;

namespace TuyenDung_TimViec.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyRepository _companyRepo;

        public CompaniesController(ICompanyRepository companyRepo)
        {
            _companyRepo = companyRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? top)
        {
            try
            {
                var companies = await _companyRepo.GetAllAsync(top);
                return Ok(new { success = true, data = companies });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var company = await _companyRepo.GetByIdAsync(id);
                if (company == null) return NotFound(new { success = false, message = "Không tìm thấy công ty." });
                return Ok(new { success = true, data = company });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("my-company/{userId}")]
        public async Task<IActionResult> GetMyCompany(Guid userId)
        {
            try
            {
                var company = await _companyRepo.GetByUserIdAsync(userId);
                if (company == null) return NotFound(new { success = false, message = "Bạn chưa liên kết với công ty nào." });
                return Ok(new { success = true, data = company });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Company company)
        {
            try
            {
                bool result = await _companyRepo.UpdateAsync(company);
                if (result) return Ok(new { success = true, message = "Cập nhật thông tin công ty thành công." });
                return BadRequest(new { success = false, message = "Không thể cập nhật thông tin công ty." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}