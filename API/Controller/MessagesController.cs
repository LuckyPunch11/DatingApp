using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensoins;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controller
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IUserRepository _userRepo;
        private readonly IMessageRepository _messageRepo;
        private readonly IMapper _mapper;
        public MessagesController(IUserRepository userRepo, IMessageRepository messageRepo, IMapper mapper)
        {
            _mapper = mapper;
            _messageRepo = messageRepo;
            _userRepo = userRepo;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto messageDto)
        {
            var email = User.GetEmail();

            if (string.Equals(email, messageDto.RecipientEmail, StringComparison.OrdinalIgnoreCase))
                return BadRequest("You cannot send message to yourself");

            var sender = await _userRepo.GetUserByEmailAsync(email);
            var recipient = await _userRepo.GetUserByEmailAsync(messageDto.RecipientEmail);

            if (recipient == null) return NotFound();

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderEmail = sender.Email,
                RecipientEmail = recipient.Email,
                Content = messageDto.Content
            };

            _messageRepo.AddMessage(message);

            if (await _messageRepo.SaveAllAsync())
                return Ok(_mapper.Map<MessageDto>(message));

            return BadRequest("Failed to send message");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Email = User.GetEmail();

            var messages = await _messageRepo.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);

            return messages;
        }

        [HttpGet("thread/{email}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string email)
        {
            var currentEmail = User.GetEmail();

            return Ok(await _messageRepo.GetMessageThread(currentEmail, email));
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var email = User.GetEmail();

            var message = await _messageRepo.GetMessage(id);

            if (message.Sender.Email != email && message.Recipient.Email != email)
                return Unauthorized();

            if (message.Sender.Email == email) message.SenderDeleted = true;

            if (message.Recipient.Email == email) message.RecipientDeleted = true;

            if (message.SenderDeleted && message.RecipientDeleted)
                _messageRepo.DeleteMessage(message);

            if (await _messageRepo.SaveAllAsync()) return Ok();

            return BadRequest("Problem deleting the message");
        }
    }
}