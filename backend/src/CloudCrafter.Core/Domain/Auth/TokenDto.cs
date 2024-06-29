namespace CloudCrafter.Core.Domain.Auth;

public record TokenDto(string Token, DateTime ValidTo);
