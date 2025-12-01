using AoC2024.Utils;

var lines = FileUtils.ReadInputFile();

var array = lines.Select(line => line.ToCharArray()).ToArray();
char[] word = ['X', 'M', 'A', 'S'];

var count = 0;

for (var x = 0; x < array.Length; x++)
{
    for (var y = 0; y < array[x].Length; y++)
    {
        if (array[x][y] == word[0])
        {
            for (var dx = -1; dx <= 1; dx++)
            {
                for (var dy = -1; dy <= 1; dy++)
                {
                    if (dx == 0 && dy == 0) continue;

                    var valid = true;
                    for (var i = 1; i < word.Length; i++)
                    {
                        var nx = x + dx * i;
                        var ny = y + dy * i;

                        if (nx < 0 || nx >= array.Length || ny < 0 || ny >= array[nx].Length || array[nx][ny] != word[i])
                        {
                            valid = false;
                            break;
                        }
                    }

                    if (valid) count++;
                }
            }
        }
    }
}

Console.WriteLine("Part 1: " + count);

var count2 = 0;
const char check = 'A';
int[][] rotationOrder = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
List<char[]> validOrders =
    [['S', 'S', 'M', 'M'], ['S', 'M', 'M', 'S'], ['M', 'M', 'S', 'S'], ['M', 'S', 'S', 'M']];

for (var x = 0; x < array.Length; x++)
{
    for (var y = 0; y < array[x].Length; y++)
    {
        if (array[x][y] == check)
        {
            foreach (var order in validOrders)
            {
                var valid = true;
                for (var j = 0; j < order.Length; j++)
                {
                    var nx = x + rotationOrder[j][0];
                    var ny = y + rotationOrder[j][1];

                    if (nx < 0 || nx >= array.Length || ny < 0 || ny >= array[nx].Length || array[nx][ny] != order[j])
                    {
                        valid = false;
                        break;
                    }
                }
                if (valid) count2++;
            }
        }
    }
}

Console.WriteLine("Part 2: " + count2);
            
