using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controller
{
    public class ErrorController : BaseApiController
    {
        private readonly DataContext _context;

        public ErrorController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return Unauthorized();
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var x = new AppUser();
            return NotFound();
        }

        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            object x = null;
            return x.ToString();
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("Custom bad request");
        }
    }
}