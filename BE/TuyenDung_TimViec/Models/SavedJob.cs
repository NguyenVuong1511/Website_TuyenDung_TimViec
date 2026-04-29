namespace TuyenDung_TimViec.Models
{
    public class SavedJob
    {
        public Guid CandidateId { get; set; }
        public Guid JobPostId { get; set; }
        public DateTime SavedDate { get; set; }
        
        // Navigation properties (optional for Dapper/SQL, but good for reference)
        public JobPost? JobPost { get; set; }
    }
}
