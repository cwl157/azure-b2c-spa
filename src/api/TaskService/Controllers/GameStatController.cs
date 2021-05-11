using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using System.Web.Http.Cors;
using TaskService.Models;
using TaskService.Services;

namespace TaskService.Controllers
{
    [Authorize]
    [Route("api/stats")]
    public class GameStatController : ApiController
    {
        // OWIN auth middleware constants -> These claims must match what's in your JWT, like for like. Click the 'claims' tab to check.
        public const string scopeElement = "http://schemas.microsoft.com/identity/claims/scope";
        public const string objectIdElement = "http://schemas.microsoft.com/identity/claims/objectidentifier";

        // API Scopes
        public static string ReadPermission = ConfigurationManager.AppSettings["api:ReadScope"];
        public static string WritePermission = ConfigurationManager.AppSettings["api:WriteScope"];

        /*
         * GET all scores for user
         */
        public IEnumerable<Models.GameStat> Get()
        {
            HasRequiredScopes(ReadPermission);

            var owner = CheckClaimMatch(ClaimTypes.NameIdentifier);

            var scores = ReadScore.ReadScores(ConfigurationManager.AppSettings["rootFolder"], owner);

            return scores;
        }

        /*
        * POST a new score for user
        */
       public HttpResponseMessage Post(GameStat stat)
        {
            stat.GameTime = DateTime.UtcNow;
            HasRequiredScopes(WritePermission);

            var owner = CheckClaimMatch(ClaimTypes.NameIdentifier);
            WriteScore.AddNewScore(ConfigurationManager.AppSettings["rootFolder"], owner, stat);

            return new HttpResponseMessage(HttpStatusCode.Created);
        }

        /*
         * Check user claims match task details
         */
        private string CheckClaimMatch(string claim)
        {
            try
            {
                return ClaimsPrincipal.Current.FindFirst(claim).Value;
            }
            catch (Exception e)
            {
                throw new HttpResponseException(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    ReasonPhrase = $"Unable to match claim '{claim}' against user claims; click the 'claims' tab to double-check. {e.Message}"
                });                
            }
        }

        // Validate to ensure the necessary scopes are present.
        private void HasRequiredScopes(String permission)
        {
            if (!ClaimsPrincipal.Current.FindFirst(scopeElement).Value.Contains(permission))
            {
                throw new HttpResponseException(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.Unauthorized,
                    ReasonPhrase = $"The Scope claim does not contain the {permission} permission."
                });
            }
        }
    }
}
