using System.Text.RegularExpressions;
using AoC2024.Utils;

var lines = FileUtils.ReadInputFile().ToList();

var sum = lines.Select(line => MulRegex().Matches(line).Sum(match => int.Parse(match.Groups[1].Value) * int.Parse(match.Groups[2].Value))).Sum();

Console.WriteLine("Part 1: " + sum);

var entireString = lines.Aggregate((a, b) => a + b);
var sum2 = 0;
var enabled = true;
var tokens = SplitRegex().Split(entireString);

foreach (var token in tokens)
{
    if (token == "do()") enabled = true;
    else if (token == "don't()") enabled = false;
    else if (token.StartsWith("mul(") && enabled)
    {
        var match = MulRegex().Match(token);
        if (match.Success) sum2 += int.Parse(match.Groups[1].Value) * int.Parse(match.Groups[2].Value);
    }
}
Console.WriteLine("Part 2: " + sum2);


internal partial class Program
{
    [GeneratedRegex(@"mul\((\d{1,3}),(\d{1,3})\)")]
    private static partial Regex MulRegex();
    
    [GeneratedRegex(@"(mul\(\d+,\d+\)|do\(\)|don't\(\))")]
    private static partial Regex SplitRegex();
}