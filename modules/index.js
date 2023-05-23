const cols = 18
const Columns = {
    Rubric:0,
    Title:2,
    Price:11,
    Fotos:15,
    UchCodes:16
};

// ИНИЦИАЛИЗАЦИЯ - ДВОЙНОЙ ЩЕЛЧОК ДЛЯ РЕДАКТИРОВАНИЯ ЯЧЕЙКИ
window.addEventListener("DOMContentLoaded", () => {
  setRubricsOptions();
  initLists();
  for (let cell of document.querySelectorAll("#books td")) {
  cell.ondblclick = () => { editable.edit(cell); };
}
});

function addFilledLine() {
      pic = [];
      default_names=['Обложка','Задняя обл.', 'Страницы'];
      pic.push(document.getElementById('pic1-id').value);
      pic.push(document.getElementById('pic2-id').value);
      pic.push(document.getElementById('pic3-id').value);
      for (let i = 0;i < pic.length;i++) {
        if (pic[i].length>0) {
        if (pic[i].slice(7).split(':').length==1) {
            pic[i] = `<a href="${pic[i]}" target="_blanc">:${default_names[i]}</a>`;
        } else {
            pic[i] = `<a href="${pic[i].slice(0,7)}${pic[i].slice(7).split(':')[0]}" target="_blanc">:${pic[i].slice(7).split(':')[1]}</a>`;
        }
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
                binding:getListValue("binding-id").split(' ')[0],
                condition:getListValue("condition-id"),
                format:getListValue("format-id").split(' ')[0],
                price:document.getElementById('price-id').value,
                isbn:getPlainISBN(),
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

function addLine(list = []) {
  updateUchCodeList(list[Columns.UchCodes]);
  updateRubrics(list[Columns.Rubric]);
  let line = document.createElement("tr");
  for (let i=0; i<cols;i++) { 
  	let td = document.createElement("td");
  	if (list.length>0) {
  		td.innerHTML = list[i];
  	} else {
  		td.innerHTML = "";
  	}
  	td.ondblclick = () => { editable.edit(td); };
  	line.appendChild(td);
  }

  let books = document.getElementById("books-body");
  books.appendChild(line);
  quantity = Number(document.getElementById("quantity-id").innerText)+1;
  document.getElementById("quantity-id").innerText = `${quantity}`;
}
