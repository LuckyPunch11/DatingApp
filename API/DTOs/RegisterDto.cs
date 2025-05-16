using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 3)]
        public string Password { get; set; }
    }
}