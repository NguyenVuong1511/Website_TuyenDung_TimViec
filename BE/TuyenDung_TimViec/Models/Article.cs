using System;

namespace TuyenDung_TimViec.Models
{
    public class Article
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Excerpt { get; set; }
        public string Content { get; set; }
        public string Category { get; set; }
        public string Image { get; set; }
        public string ReadTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Status { get; set; }
    }
}
