using System;
using System.IO;
using System.Linq;

namespace AoC2024.Utils;

public static class FileUtils
{
    private static string GetInputFilePath(string fileName = "input.txt")
    {
        return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", fileName);
    }
    
    public static IEnumerable<string> ReadInputFile(string fileName = "input.txt") => 
        File.ReadLines(GetInputFilePath(fileName));
}