// ИНИЦИАЛИЗАЦИЯ - ДВОЙНОЙ ЩЕЛЧОК ДЛЯ РЕДАКТИРОВАНИЯ ЯЧЕЙКИ
const cols = 17
isbn_list = []
isbn_index = 0
alib_win = null;
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

function addFilledLine() {
     let obj = {
                rubric:getListValue("rubrics-id","Рубрика"),
                authors:document.getElementById('authors-id').value,
                name:document.getElementById('name-id').value,
                publisher:document.getElementById('publisher-id').value,
                date:document.getElementById('date-id').value,
                pages:document.getElementById('pages-id').value,
                description:document.getElementById('description-id').value,
                binding:getListValue("bindings-id","Переплет"),
                condition:getListValue("conditions-id","Состояние"),
                format:getListValue("formats-id","Формат"),
                isbn:document.getElementById('isbn-id').value};
                new_date = new Date();
                new_date = +new_date.getDate()+'.'+new_date.getMonth()+'.'+new_date.getFullYear();
                addLine([obj.rubric, obj.authors, obj.name, '', '', obj.publisher, obj.date, obj.pages, obj.binding, obj.format, '', obj.description, obj.condition, new_date, '', '', isbn]);
}

function addLine(list = null) {
  let line = document.createElement("tr");
  for (let i=0; i<cols;i++) { 
  	let td = document.createElement("td");
  	if (list) {
  		td.innerHTML = list[i];
  	} else {
  		td.innerHTML = "abc";
  	}
  	td.ondblclick = () => { editable.edit(td); };
  	line.appendChild(td);
  }

  let books = document.getElementById("books-body");
  books.appendChild(line);
}

function saveBooks() {
   let books="";
   let count=0;
   for (let cell of document.querySelectorAll("#books td")) {
   	if (count < cols) {
   	    books += cell.innerHTML;
   	    if (count < cols -1)
   	    	books += "\t";
   	    count += 1;
   	    if (count == cols) {
   	    	count = 0;
   	    	books += "\n";
   	    }
   	}
   }
   navigator.clipboard.writeText(books)
                .then(() => {
                console.log('Copy to clipboard');
                alert("Скопировано в буфер обмена")
                    })
                .catch(err => {
                console.log('Something went wrong', err);
                });
}

function loadBooks() {
   list = document.getElementById("book-list").value;
   console.log(list);
   arr = list.split('\n');
   arr.forEach(function(item) {
   	if (item.length>0) {
   		addLine(item.split('\t'));
   	}
   });
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
            document.getElementById("isbn-id").value = isbn_list[isbn_index];
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
            for (let i = 0; i<data.totalItems; i++) {
                volume = data.items[i].volumeInfo;
                document.getElementById('name-id').value = volume.title ?? "";
                document.getElementById('authors-id').value = volume.authors ?? "";
                document.getElementById('publisher-id').value = volume.publisher ?? "";
                document.getElementById('date-id').value = volume.publishedDate ?? "";
                document.getElementById('description-id').value = volume.description.slice(0,256) ?? "";
                document.getElementById('pages-id').value = volume.pageCount ?? "";
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