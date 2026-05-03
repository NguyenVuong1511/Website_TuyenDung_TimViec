using System;
using System.Text.Json.Serialization;

namespace TuyenDung_TimViec.Models
{
    public class Company
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        
        [JsonPropertyName("logo")]
        public string? LogoUrl { get; set; }
        
        public string? Address { get; set; }
        public string? Website { get; set; }
        public string? Description { get; set; }
        public bool IsVerified { get; set; }

        // New profile fields
        public string? Industry { get; set; }
        public string? Size { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        
        [JsonPropertyName("cover")]
        public string? CoverImage { get; set; }
        
        public string? Culture { get; set; }
        public string? Benefits { get; set; }
    }
}