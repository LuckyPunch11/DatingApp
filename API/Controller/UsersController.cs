using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controller
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepo;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository userRepo, IMapper mapper)
        {
            _mapper = mapper;
            _userRepo = userRepo;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await _userRepo.GetMembersAsync();
            return Ok(users);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<MemberDto>> GetUser(int id)
        {
            return await _userRepo.GetMemberByIdAsync(id);
        }

        [HttpGet("{email}")]
        public async Task<ActionResult<MemberDto>> GetUserByEmail(string email)
        {
            return await _userRepo.GetMemberByEmailAsync(email);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto member)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = await _userRepo.GetUserByEmailAsync(email);

            _mapper.Map(member, user);

            _userRepo.Update(user);

            if (await _userRepo.SaveAllAsync())
                return NoContent();

            return BadRequest("Failed to update user");
        }
    }
}