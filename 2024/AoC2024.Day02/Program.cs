using AoC2024.Utils;

var lines = FileUtils.ReadInputFile().ToList();

var list = lines.Select(line => line.Split(" ").Select(int.Parse).ToList()).ToList();

var count = list.Count(CheckNumbers);

Console.WriteLine("Part 1: " + count);

var count2 = list.Count(numbers =>
{
    for (var i = 0; i < numbers.Count; i++)
    {
        var copy = numbers.ToList();
        copy.RemoveAt(i);
        if (CheckNumbers(copy)) return true;
    }
    return false;
});

Console.WriteLine("Part 2: " + count2);
return;

bool CheckNumbers(List<int> numbers)
{
    var increasing = numbers[0] < numbers[1];
    for (var i = 0; i < numbers.Count - 1; i++)
    {
        if (Math.Abs(numbers[i] - numbers[i + 1]) > 3 || numbers[i] == numbers[i + 1]) return false;
        if ((increasing && numbers[i] > numbers[i + 1]) || (!increasing && numbers[i] < numbers[i + 1])) return false;
    }
    return true;
}
