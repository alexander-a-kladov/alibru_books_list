#!/bin/bash
cat fbs_header.txt > fbs.txt
./read_until_today.py books.txt > books_pub.txt
iconv -f utf-8 -t cp1251 books_pub.txt >> fbs.txt
