#!/usr/bin/python3
import sys
from datetime import datetime, timedelta

if __name__ == "__main__":
    if len(sys.argv)>1:
        if len(sys.argv)>2:
            quan_max = int(sys.argv[2])
        else:
            quan_max = 250
        today = datetime.now()
        tomorrow = today + timedelta(days=1)
        f = open(sys.argv[1])
        if f:
            count = 0
            for line in f.readlines():
                token_date=line.split('\t')[14]
                if line[:5]=='prod.':
                    quan_max += 1 # want to have such line in result output, but don't count it
                file_time=""
                if len(token_date)>0:
                    token_date=token_date.split('.')
                    try:
                        file_time=datetime(int(token_date[2]),int(token_date[1]),int(token_date[0]))
                    except:
                        file_time=""
                if file_time=="" or file_time<=tomorrow:
                    count += 1
                    print(line,end="")
                elif file_time > tomorrow:
                    continue
                if count >= quan_max:
                    break
            f.close()
