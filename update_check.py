#!/usr/bin/python3
import sys

def main():
    if len(sys.argv) != 4:
        print(
            f"Usage: {sys.argv[0]} <original_file> <result_file> <column_number>",
            file=sys.stderr
        )
        sys.exit(1)

    orig_file = sys.argv[1]
    result_file = sys.argv[2]
    col = int(sys.argv[3]) - 1  # 1-based → 0-based

    with open(orig_file, encoding="utf-8") as f1, \
         open(result_file, encoding="utf-8") as f2:

        for lineno, (l1, l2) in enumerate(zip(f1, f2), 1):
            c1 = l1.rstrip("\n").split("\t")
            c2 = l2.rstrip("\n").split("\t")

            if len(c1) != len(c2):
                sys.exit(
                    f"Line {lineno}: column count differs "
                    f"({len(c1)} != {len(c2)})"
                )

            for i, (a, b) in enumerate(zip(c1, c2)):
                if i == col:
                    continue
                if a != b:
                    sys.exit(
                        f"Line {lineno}, column {i+1}: '{a}' != '{b}'"
                    )

        # проверяем, что файлы одинаковой длины
        if f1.readline() or f2.readline():
            sys.exit("Files have different number of lines")

    print("OK: only the specified column was modified")

if __name__ == "__main__":
    main()

