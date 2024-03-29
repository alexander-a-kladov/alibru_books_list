pic_url = 'https://alib.photo/gallery/ak8/';

function makeBooksText() {
    let error = false;
    let errors=0;
    let count_books=0;
    let books="";
    let add_book = true;
    let count=0;
    for (let i=0;i<table_index;i++) {
     add_book = true;
     for (let c=0;c<table_info.Cols;c++) {
         line = getText(i, c).replaceAll("\n"," ").replaceAll("\t"," ").replaceAll('"','').replaceAll('«',' ')
                             .replaceAll('»',' ').replaceAll('\'',' ').replaceAll(' .','. ').replaceAll(' ,',', ')
                             .replaceAll(' ;','; ').replaceAll(' :',': ').replaceAll(' !','! ').replaceAll('<br>',' ').replaceAll('  ',' ').trim();
        if (c == Columns.Rubric) {
            if (~line.split('.').indexOf('del')) {
                add_book = false;
                break;
            }
        }
        if (c == Columns.Fotos) {
             line = line.replaceAll(`<a href=${pic_url}`,"").replaceAll(" target=_blanc","").replaceAll("</a>","").replaceAll(">:",":");
        }
         books += line;
         if ((line.length==0) && (c == Columns.Rubric || c == Columns.Title || c == Columns.Price)) {
             error = true;
         }
 
            if (c < table_info.Cols -1)
                books += "\t";
        }
        if (add_book) {
        books += "\n";
        if (error) {
            error = false;
            errors += 1;
        }
        count_books += 1;
        }
    }
    alert(`Книг обработано ${count_books}, ошибок ${errors} (не заданы Рубрика, Название или Цена)`);
    return books;
}

function saveBooks() {
     let books = makeBooksText();
     let file = new File([books], "test_save.txt", {type: "text/plain"});
     let link = document.createElement('a');
     link.download = file.name;
 
     link.href = URL.createObjectURL(file);
     link.click();
     URL.revokeObjectURL(link.href);
 
 }
 
 function loadBooks(files) {
    let file = files[0];
    if (document.getElementById('isbn-id').value) {
        full_info_show = true; 
    }
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function() {
         arr = reader.result.split('\n');
         arr.forEach(function(item) {
         if (item.length>0) {
             line = item.split('\t');
             images_str=line[Columns.Fotos].split(':');
             img_line=""
             for (let i=0;i<images_str.length;i++) {
                 if (images_str[i].length>0) {
                 if ((i%2)==0) {
                     img_line+=`<a href="${pic_url}${images_str[i]}" target="_blanc">`
                 } else {
                     img_line+=`:${images_str[i]}:</a>`
                 }
                 }
             }
             line[Columns.Fotos] = img_line;
             addLine(line);
         }
         });
    }
 }