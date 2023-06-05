#!/usr/bin/python3

import os
import cv2
import pytesseract
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

isbn = 0
gpath = '/home/alexander/Downloads/Alib/app/books'
def set_isbn(file_name):
    global isbn
    img = cv2.imread(file_name)
    # Adding custom options
    custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=SN:0123456789X-'
    raw_str = pytesseract.image_to_string(img, config=custom_config)
    clean_line = raw_str.replace("-", "").replace(" ", "")
    if ~clean_line.find("SN:"):
        isbn = clean_line.split("SN:")[1][:13].strip()
    else:
        isbn = clean_line.split("SN")[1][:13].strip()

def read_name(file_name):
    img = cv2.imread(file_name)
    # Adding custom options
    custom_config = r'--oem 3 --psm 6'
    raw_str = pytesseract.image_to_string(img, config=custom_config)
    clean_line = raw_str.replace("\n", "").replace("\t", " ").strip().lower()
    print(clean_line)


def append_to_isbn_file(val):
    f = open("{0}/isbn.txt".format(gpath), "a")
    if f:
        f.write("{0}\n".format(str(val)))
        f.close()

class Handler(FileSystemEventHandler):
    def on_created(self, event):
        global isbn
        name = os.path.basename(event.src_path)
        path = event.src_path[:-len(name)]
        time.sleep(0.1)
        if ~name.find("new."):
            set_isbn(event.src_path)
            print(isbn)
            #append_to_isbn_file(isbn)
            new_path = path+str(isbn)+"_i."+name.split("new.")[1]
            os.remove(event.src_path)
        elif ~name.find("f.") or ~name.find("b.") or ~name.find("p."):
            if isbn:
                new_path = path+str(isbn)+'_'+name
                os.rename(event.src_path, new_path)
            else:
                print("error isbn not set")
                os.remove(event.src_path)
        elif ~name.find("n."):
            read_name(event.src_path)
            os.remove(event.src_path)

    def on_deleted(self, event):
        print(event)

    def on_moved(self, event):
        print(event)


if __name__ == "__main__":
    try:
        os.remove(gpath+'/new.png')
    except:
        print("All clear")
    observer = Observer()
    observer.schedule(Handler(), path=gpath, recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(0.1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
