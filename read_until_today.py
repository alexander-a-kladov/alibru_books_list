#!/usr/bin/python3
import sys
from datetime import datetime

if __name__ == "__main__":
    if len(sys.argv)>1:
        today = datetime.now()
        f = open(sys.argv[1])
        if f:
            for line in f.readlines():
                token_date=line.split('\t')[14]
                file_time=""
                if len(token_date)>0:
                    token_date=token_date.split('.')
                    file_time=datetime(int(token_date[2]),int(token_date[1]),int(token_date[0]))
                if file_time=="" or file_time<today:
                    print(line,end="")


