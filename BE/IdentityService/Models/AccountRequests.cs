namespace IdentityService.Models
{
    public class ChangePasswordRequest
    {
        public Guid UserId { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }

    public class ChangeEmailRequest
    {
        public Guid UserId { get; set; }
        public string NewEmail { get; set; }
        public string Password { get; set; }
    }

    public class UpdateCandidateProfileRequest
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class UpdateRecruiterProfileRequest
    {
        public Guid UserId { get; set; }
        public string CompanyName { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyWebsite { get; set; }
    }

    public class AccountInfoResponse
    {
        public Guid UserId { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string? FullName { get; set; } // For candidate
        public string? Phone { get; set; } // For candidate
        public string? CompanyName { get; set; } // For recruiter
    }
}
