pic_url = 'http://alib.photo/gallery/ak8/';

function saveBooks() {
    let error = false;
    let errors=0;
    let count_books=0;
    let books="";
    let count=0;
    for (let cell of document.querySelectorAll("#books td")) {
     if (count < cols) {
         line = cell.innerHTML.replaceAll("\n"," ").replaceAll("\t"," ").replaceAll('"','').replaceAll('«',' ')
                             .replaceAll('»',' ').replaceAll('\'',' ').replaceAll(' .','. ').replaceAll(' ,',', ')
                             .replaceAll(' ;','; ').replaceAll(' :',': ').replaceAll(' !','! ').replaceAll('<br>',' ').replaceAll('  ',' ').trim();
            if (count == Columns.Fotos) {
             line = line.replaceAll(`<a href=${pic_url}`,"").replaceAll(" target=_blanc","").replaceAll("</a>","").replaceAll(">:",":");
         }
         books += line;
         if ((line.length==0) && (count == Columns.Rubric || count == Columns.Title || count == Columns.Price)) {
             error = true;
         }
 
            if (count < cols -1)
                books += "\t";
            count += 1;
            if (count == cols) {
                count = 0;
                books += "\n";
             if (error) {
                 error = false;
                 errors += 1;
             }
             count_books += 1;
            }
        }
    }
     alert(`Книг обработано ${count_books}, ошибок ${errors} (не заданы Рубрика, Название или Цена)`);
     let file = new File([books], "test_save.txt", {type: "text/plain"});
     let link = document.createElement('a');
     link.download = file.name;
 
     link.href = URL.createObjectURL(file);
     link.click();
     URL.revokeObjectURL(link.href);
 
 }
 
 function loadBooks(files) {
    let file = files[0];
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