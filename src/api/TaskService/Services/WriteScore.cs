using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using TaskService.Models;

namespace TaskService.Services
{
    public static class WriteScore
    {
        public static void AddNewScore(string filePath, string owner, GameStat score)
        {
            string fileContents = "[]";
            string fullPath = filePath + "/" + owner + ".json";
            if (File.Exists(fullPath)) 
            {
                fileContents = File.ReadAllText(fullPath);
            }
            List<GameStat> currentScores = JsonConvert.DeserializeObject<List<GameStat>>(fileContents);

            currentScores.Add(score);
            string newFileContents = JsonConvert.SerializeObject(currentScores);
            File.WriteAllText(fullPath, newFileContents);
        }
    }
}