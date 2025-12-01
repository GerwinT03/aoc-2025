using AoC2024.Utils;

var lines = FileUtils.ReadInputFile().ToArray();

var listOne = lines.Select(line => int.Parse(line.Split("   ")[0])).OrderBy(x => x).ToList();
var listTwo = lines.Select(line => int.Parse(line.Split("   ")[1])).OrderBy(x => x).ToList();

var sum = listOne.Zip(listTwo, (a, b) => Math.Abs(a - b)).Sum();

Console.WriteLine("Part 1: " + sum); 

var sum2 = listOne.Sum(item => listTwo.FindAll(x => x == item).Count * item);

Console.WriteLine("Part 2: " + sum2); 


