using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensoins;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controller
{
    [Authorize]
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository _userRepo;
        private readonly ILikesRepository _likesRepo;
        public LikesController(IUserRepository userRepo, ILikesRepository likesRepo)
        {
            _userRepo = userRepo;
            _likesRepo = likesRepo;
        }

        [HttpPost("{email}")]
        public async Task<ActionResult> AddLike(string email)
        {
            var sourceId = User.GetId();
            var likedUser = await _userRepo.GetUserByEmailAsync(email);
            var sourceUser = await _likesRepo.GetUserWithLikes(sourceId);

            if (likedUser == null) return NotFound();

            if (sourceUser.Email == email) return BadRequest("You cannot like yourself");

            var userLike = await _likesRepo.GetUserLike(sourceId, likedUser.Id);

            if (userLike != null) return BadRequest("You already like this user");

            userLike = new UserLike
            {
                SourceId = sourceId,
                LikedId = likedUser.Id
            };

            sourceUser.LikedUsers.Add(userLike);

            if (await _userRepo.SaveAllAsync()) return Ok();

            return BadRequest("Failed to like user");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery] LikesParams likesParams)
        {
            likesParams.UserId = User.GetId();
            var users = await _likesRepo.GetUserLikes(likesParams);

            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(users);
        }
    }
}