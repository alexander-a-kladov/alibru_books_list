// ИНИЦИАЛИЗАЦИЯ - ДВОЙНОЙ ЩЕЛЧОК ДЛЯ РЕДАКТИРОВАНИЯ ЯЧЕЙКИ

const cols = 17
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

function  selectRubrics() {
    document.getElementById("rubrics-id").innerHTML = event.target.innerHTML;  
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
    if (i==0) {
        td.classList.add()
    } else {
  	    td.ondblclick = () => { editable.edit(td); };
    }
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

function getBookByISBN() {
    isbn = document.getElementById("isbn").value;
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
                let obj = { name:volume.title ?? "",
                        authors:volume.authors ?? "",
                        publisher:volume.publisher ?? "",
                        date:volume.publishedDate ?? "",
                        description:volume.description.slice(0,256) ?? "",
                        pages:volume.pageCount ?? ""};
                new_date = new Date();
                new_date = +new_date.getDate()+'.'+new_date.getMonth()+'.'+new_date.getFullYear();
                addLine(['', obj.authors, obj.name, '', '', obj.publisher, obj.date, obj.pages, '', '', '', obj.description, '', new_date, '', '', isbn]);
            }
        })
        .catch(error => console.log(error))
}

function listShow() {
  document.getElementById("dropDown").classList.toggle("show");
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