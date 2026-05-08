using Microsoft.AspNetCore.Mvc;
using TuyenDung_TimViec.Models;
using TuyenDung_TimViec.Repositories;

namespace TuyenDung_TimViec.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly IArticleRepository _articleRepository;

        public ArticleController(IArticleRepository articleRepository)
        {
            _articleRepository = articleRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllArticles([FromQuery] string category = null)
        {
            try
            {
                var articles = await _articleRepository.GetAllArticlesAsync(category);
                return Ok(new { success = true, data = articles });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticleById(Guid id)
        {
            try
            {
                var article = await _articleRepository.GetArticleByIdAsync(id);
                if (article == null) return NotFound(new { success = false, message = "Không tìm thấy bài viết" });
                return Ok(new { success = true, data = article });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateArticle([FromBody] Article article)
        {
            try
            {
                var result = await _articleRepository.CreateArticleAsync(article);
                return Ok(new { success = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}
