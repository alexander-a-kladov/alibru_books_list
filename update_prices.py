#!/usr/bin/python3
import sys
import math

def round_to_tens(value: float) -> int:
    return int(round(value / 10.0) * 10)

def main():
    if len(sys.argv) != 4:
        print(f"Usage: {sys.argv[0]} <input_file> <column_number> <multiplier>", file=sys.stderr)
        sys.exit(1)

    filename = sys.argv[1]
    column_index = int(sys.argv[2]) - 1  # делаем индекс 0-based
    multiplier = float(sys.argv[3])

    with open(filename, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")

            # пропускаем пустые строки
            if not line:
                print()
                continue

            columns = line.split("\t")

            # проверяем наличие столбца
            if column_index >= len(columns):
                print(line)
                continue

            try:
                value = int(columns[column_index])
                result = round_to_tens(value * multiplier)
                columns[column_index] = str(result)
            except ValueError:
                # если в столбце не число — оставляем строку без изменений
                pass

            print("\t".join(columns))


if __name__ == "__main__":
    main()

