using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using TaskService.Models;

namespace TaskService.Services
{
    public static class ReadScore
    {
        public static List<GameStat> ReadScores(string filePath, string owner)
        {
            string fileContents = "[]";

            string fullPath = filePath + "/" + owner + ".json";
            if (File.Exists(fullPath))
            {
                fileContents = File.ReadAllText(fullPath);
            }
            List<GameStat> currentScores = JsonConvert.DeserializeObject<List<GameStat>>(fileContents);
            return currentScores;
        }
    }
}