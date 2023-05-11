#!/bin/bash
cat fbs_header.txt > fbs.txt
iconv -f utf-8 -t cp1251 books.txt >> fbs.txt
