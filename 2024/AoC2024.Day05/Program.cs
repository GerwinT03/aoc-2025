using AoC2024.Utils;

var lines = FileUtils.ReadInputFile().ToList();

var orderingRules = lines
    .TakeWhile(line => !string.IsNullOrWhiteSpace(line))
    .Select(line => line.Split("|", StringSplitOptions.RemoveEmptyEntries))
    .Select(rule => (rule[0].Trim(), rule[1].Trim()))
    .ToHashSet();

var updates = lines
    .SkipWhile(line => !string.IsNullOrWhiteSpace(line))
    .Skip(1)
    .Select(line => line.Split(",", StringSplitOptions.RemoveEmptyEntries).ToList())
    .ToList();

var sum = updates
    .Where(update =>
        update.Count > 0
        && CheckValidUpdate(update))
    .Select(update => int.Parse(update[update.Count / 2]))
    .Sum();

Console.WriteLine("Part 1: " + sum);

var invalidUpdates = updates
    .Where(update =>
        update.Count > 0
        && !CheckValidUpdate(update))
    .ToList();

foreach (var invalidUpdate in invalidUpdates)
{
    while (!CheckValidUpdate(invalidUpdate))
    {

        var violationList = orderingRules
            .Where(rule =>
                invalidUpdate.Contains(rule.Item1)
                && invalidUpdate.Contains(rule.Item2)
                && invalidUpdate.IndexOf(rule.Item1) > invalidUpdate.IndexOf(rule.Item2))
            .ToList();

        if (violationList.Count == 0)
        {
            break;
        }

        foreach (var violation in violationList)
        {
            var index1 = invalidUpdate.IndexOf(violation.Item1);
            var index2 = invalidUpdate.IndexOf(violation.Item2);

            if (index1 > index2)
            {
                invalidUpdate.RemoveAt(index1);
                invalidUpdate.Insert(index2, violation.Item1);
            }
        }
    }
}

var sum2 = invalidUpdates
    .Select(update => int.Parse(update[update.Count / 2]))
    .Sum();

Console.WriteLine("Part 2: " + sum2);
return;

bool CheckValidUpdate(List<string> update)
{
    return update.Count > 0
           && orderingRules.All(rule =>
               !update.Contains(rule.Item1)
               || !update.Contains(rule.Item2)
               || update.IndexOf(rule.Item1) <= update.IndexOf(rule.Item2));
}