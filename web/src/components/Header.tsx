import Link from "next/link";
import { Star, TreePine, ChevronDown } from "lucide-react";
import { getYearConfig, getAvailableYears, defaultYear } from "@/lib/config";

interface HeaderProps {
  totalStars: number;
  year?: number;
}

export function Header({ totalStars, year = defaultYear }: HeaderProps) {
  const yearConfig = getYearConfig(year);
  const availableYears = getAvailableYears();
  const maxStars = yearConfig?.maxStars ?? 50;

  return (
    <header className="border-b border-gray-800 bg-aoc-darker/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href={`/${year}`} className="flex items-center gap-3 group">
            <TreePine className="w-8 h-8 text-aoc-green group-hover:text-aoc-gold transition-colors" />
            <div>
              <h1 className="text-xl font-bold text-white">
                Advent of Code{" "}
                <span className="text-aoc-green">{year}</span>
              </h1>
              <p className="text-xs text-gray-500">My Solutions</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            {/* Year Selector */}
            {availableYears.length > 1 && (
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors">
                  <span className="text-sm text-gray-300">{year}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <div className="absolute right-0 mt-1 py-1 bg-aoc-darker border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {availableYears.map((y) => (
                    <Link
                      key={y}
                      href={`/${y}`}
                      className={`block px-4 py-2 text-sm hover:bg-gray-800 transition-colors ${
                        y === year ? "text-aoc-green" : "text-gray-300"
                      }`}
                    >
                      {y}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {/* Stars Counter */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700">
              <Star className="w-4 h-4 fill-aoc-gold text-aoc-gold" />
              <span className="text-sm font-medium text-aoc-gold">
                {totalStars}
              </span>
              <span className="text-xs text-gray-500">/ {maxStars}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
