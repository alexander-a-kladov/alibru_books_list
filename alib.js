// ИНИЦИАЛИЗАЦИЯ - ДВОЙНОЙ ЩЕЛЧОК ДЛЯ РЕДАКТИРОВАНИЯ ЯЧЕЙКИ
const cols = 18
const Columns = {
    Rubric:0,
    Title:2,
    Price:11,
    Fotos:15
};
isbn_list = []
isbn_index = 0
alib_win = null;
pic_url = 'http://alib.photo/gallery/ak8/';

window.addEventListener("DOMContentLoaded", () => {
for (let cell of document.querySelectorAll("#books td")) {
cell.ondblclick = () => { editable.edit(cell); };
}
});
let editable = {
// "ПРЕОБРАЗОВАТЬ" В РЕДАКТИРОВАННУЮ ЯЧЕЙКУ
edit: (cell) => {
// УДАЛИТЬ "ДВОЙНОЙ ЩЕЛЧОК ДЛЯ РЕДАКТИРОВАНИЯ"
cell.ondblclick = "";
// РЕДАКТИРУЕМОЕ СОДЕРЖИМОЕ
cell.contentEditable = true;
cell.focus();
// "ОТМЕТИТЬ" ТЕКУЩУЮ ВЫБРАННУЮ ЯЧЕЙКУ
cell.classList.add("edit");
editable.selected = cell;
// НАЖМИТЕ ENTER ИЛИ ЩЕЛКНИТЕ ВНЕ, ЧТОБЫ ЗАВЕРШИТЬ РЕДАКТИРОВАНИЕ
window.addEventListener("click", editable.close);
cell.onkeydown = (evt) => { if (evt.key=="Enter") {
editable.close(true);
return false;
}};
},
// ЗАВЕРШИТЬ "РЕЖИМ РЕДАКТИРОВАНИЯ"
selected: null, // текущая выбранная ячейка
close: (evt) => { if (evt.target != editable.selected) {
// ДЕЛАЙТЕ ВСЕ, ЧТО ВАМ НУЖНО
// проверить значение?
// отправить значение на сервер?
// обновить расчеты в таблице?
// УДАЛИТЬ "РЕДАКТИРОВАНИЕ"
window.getSelection().removeAllRanges();
editable.selected.contentEditable = false;
// ВОССТАНОВИТЬ КЛИК-СЛУШАТЕЛИ
window.removeEventListener("click", editable.close);
let cell = editable.selected;
cell.ondblclick = () => { editable.edit(cell); };
// "СНЯТЬ ПОМЕТКУ" ТЕКУЩЕЙ ВЫБРАННОЙ ЯЧЕЙКИ
editable.selected.classList.remove("edit");
editable.selected = null;
}}
};



function getAlibGoogleApisCategory(category, title) {
    console.log(category);
    regex = /^[a-z\s]+$/i;
    if (!title.match(regex)) {
    const googleapis_alib = JSON.parse('{"Russian poetry":"t19poem"}');
    rubric = googleapis_alib[category];
    } else {
        rubric = "tlingbook";
    }
    return rubric;
}

function setRubric(rubric) {
    document.getElementById("tipfind-id").value = rubric;
}

function readInputData() {
  let rubrics_file = null;
  fetch("rubrics.txt")
  .then(response => response.text())
  .then(text => rubrics_file = text)
  .catch(console.log("Error file read"));
    console.log(rubrics_file);
  if (rubrics_file) {
    lines = rubrics_file.split('\n');
    rubrics_body = document.getElementById("rubrics-body")
    console.log(lines.length)
    for (let i = 0; i < lines.length; i++) {
        console.log(lines[i]);
        if (lines[i].length > 0) {
            let line = document.createElement("tr");
            let td = document.createElement("td");
            td.innerHTML = lines[i].split("\t")[0];
            line.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = lines[i].split("\t")[1];
            line.appendChild(td);
            rubrics_body.appendChild(line);
        }
    }
}
}

function addRubricToAccum() {
    rubrics = document.getElementById('rubrics-accum-id').value;
    if (rubrics.split('.').length<4) {
        document.getElementById('rubrics-accum-id').value = `${rubrics}${document.getElementById('tipfind-id').value}.`;
    }
}

function clearRubricsAccum() {
    document.getElementById('rubrics-accum-id').value = '';
}

function getTrueISBN(isbn_str) {
    if (isbn_str.length==13) {
        return `${isbn_str.slice(0,3)}-${isbn_str.slice(3,4)}-${isbn_str.slice(4,6)}-${isbn_str.slice(6,12)}-${isbn_str.slice(12,13)}`;
    } else {
        return `${isbn_str.slice(0,1)}-${isbn_str.slice(1,3)}-${isbn_str.slice(3,9)}-${isbn_str.slice(9,10)}`;
    }
}

function addFilledLine() {
      pic = [];
      default_names=['Обложка','Задняя обл.', 'Страницы'];
      pic.push(document.getElementById('pic1-id').value);
      pic.push(document.getElementById('pic2-id').value);
      pic.push(document.getElementById('pic3-id').value);
      for (let i = 0;i < pic.length;i++) {
        if ((pic[i].length>0)&&(pic[i].split(':').length==1)) {
            pic[i] = `<a href="${pic_url}${pic[i]}">:${default_names[i]}</a>`;
        }
      }

     let obj = {
                rubric:document.getElementById('rubrics-accum-id').value,
                authors:document.getElementById('authors-id').value,
                name:document.getElementById('name-id').value,
                second_name:document.getElementById('second-name-id').value,
                publ_place:document.getElementById('publ-place-id').value,
                publisher:document.getElementById('publisher-id').value,
                date:document.getElementById('date-id').value,
                pages:document.getElementById('pages-id').value,
                description:document.getElementById('description-id').value,
                binding:getListValue("bindings-id","Переплет").split(' ')[0],
                condition:getListValue("conditions-id","Состояние"),
                format:getListValue("formats-id","Формат").split(' ')[0],
                price:document.getElementById('price-id').value,
                isbn:document.getElementById('isbn-id').value,
                sellers_code:document.getElementById('sellers-code-id').value
            };
                pic_str = ((pic[0])?`${pic[0]}:`:"")+((pic[1])?`${pic[1]}:`:"")+((pic[2])?`${pic[2]}:`:"");
                new_date = new Date();
                day = `${new_date.getDate()}`;
                month = `${new_date.getMonth()+1}`;
                if ((obj.pages.length>0)&&(Number(obj.pages)>0)) {
                    obj.pages=`${obj.pages} с.`;
                } else {
                    obj.pages='';
                }
                isbn_str = getTrueISBN(obj.isbn);
                new_date = ((day.length==2)?day : `0${day}`)+'.'+((month.length==2)?month : `0${month}`)+'.'+new_date.getFullYear();

                addLine([obj.rubric, obj.authors, obj.name, obj.second_name, obj.publ_place, obj.publisher, obj.date, obj.pages, obj.binding, obj.format, '',
                    obj.price, obj.description, obj.condition, new_date, pic_str, obj.sellers_code, isbn_str]);
}

function addLine(list = null) {
  let line = document.createElement("tr");
  for (let i=0; i<cols;i++) { 
  	let td = document.createElement("td");
  	if (list) {
  		td.innerHTML = list[i];
  	} else {
  		td.innerHTML = "";
  	}
  	td.ondblclick = () => { editable.edit(td); };
  	line.appendChild(td);
  }

  let books = document.getElementById("books-body");
  books.appendChild(line);
}

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
            console.log(line);
            line = line.replaceAll(`<a href=${pic_url}`,"").replaceAll("</a>","").replaceAll(">:",":");
            console.log(line);
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
            console.log(line[Columns.Fotos]);
            images_str=line[Columns.Fotos].split(':');
            console.log(images_str);
            img_line=""
            for (let i=0;i<images_str.length;i++) {
                if (images_str[i].length>0) {
                if ((i%2)==0) {
                    img_line+=`<a href="${pic_url}${images_str[i]}">`
                } else {
                    img_line+=`:${images_str[i]}:</a>`
                }
                }
            }
            console.log(` after ${img_line}`);
            line[Columns.Fotos] = img_line;
            addLine(line);
        }
        });
   }
}

function getListValue(list_id, default_v) {
    return ((document.getElementById(list_id).innerHTML==default_v)?"":document.getElementById(list_id).innerHTML)
}

function readISBNFile(files) {
  let file = files[0];

  let reader = new FileReader();

  reader.readAsText(file);

  reader.onload = function() {
    isbns = reader.result.split('\n');
    isbn_list=[];
    for (let i=0;i<isbns.length;i++) {
        if (isbns[i].length) {
            isbn_list.push(isbns[i]);
        }
    }
    isbn_index = 0;
    document.getElementById('isbn-count').innerHTML = `Найдено ${isbn_list.length} книг`;
  };

  reader.onerror = function() {
    console.log(reader.error);
  };
}

function findOnAlib() {
    isbn = document.getElementById("isbn-id").value;
     if (alib_win) alib_win.close();
    alib_win = window.open(`https://www.alib.ru/findp.php4?isbnp=${isbn}`);
}

function getBookByISBN() {
    if (isbn_list.length) {
        if (isbn_index<isbn_list.length) {
            document.getElementById("isbn-id").value = isbn_list[isbn_index].split(':')[0];
            document.getElementById('pic1-id').value = isbn_list[isbn_index].split(':')[1]??"";
            document.getElementById('pic2-id').value = isbn_list[isbn_index].split(':')[2]??"";
            document.getElementById('pic3-id').value = isbn_list[isbn_index].split(':')[3]??"";
            isbn_index += 1;
        } else {
            document.getElementById("isbn-count").innerHTML = 'Все книги из файла обработаны';
            isbn_list = []
        }
    }
    isbn = document.getElementById("isbn-id").value;
    if (!isbn.length) return;
    let rest_request="https://www.googleapis.com/books/v1/volumes?q=isbn:"+isbn;
    fetch(rest_request)
        .then(response => {
        // indicates whether the response is successful (status code 200-299) or not
        if (!response.ok) {
            throw new Error(`Request failed with status ${reponse.status}`)
        }
        return response.json()
        })
        .then(data => {
            if (!data.totalItems) {
                document.getElementById('name-id').value="Книга не найдена GoogleBooks";
            }
            for (let i = 0; i<data.totalItems; i++) {
                volume = data.items[i].volumeInfo;
                document.getElementById('name-id').value = volume.title ?? "";
                document.getElementById('authors-id').value = volume.authors ?? "";
                document.getElementById('publisher-id').value = volume.publisher ?? "";
                document.getElementById('date-id').value = volume.publishedDate ?? "";
                document.getElementById('description-id').value = ((volume.description)?volume.description.slice(0,256):"");
                document.getElementById('pages-id').value = volume.pageCount ?? "";
                rubric = getAlibGoogleApisCategory(volume.categories[0], volume.title);
                console.log(rubric);
                if (rubric) {
                    setRubric(rubric);
                }
            }
        })
        .catch(error => console.log(error));
}

function listShow(list_id) {
  document.getElementById(list_id).classList.toggle("show");
}

function  selectList(list_id) {
    document.getElementById(list_id).innerHTML = event.target.innerHTML;  
}

// Закройте выпадающее меню, если пользователь щелкает за его пределами
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}