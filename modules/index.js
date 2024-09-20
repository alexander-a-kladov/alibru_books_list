const table_info = {Cols: 18};
const Columns = {
    Rubric:0,
    Authors:1,
    Title:2,
    SecondName:3,
    Place:4,
    Publisher:5,
    Year:6,
    Pages:7,
    Binding:8,
    Format:9,
    Price:11,
    Description:12,
    Condition:13,
    Date:14,
    Fotos:15,
    UchCodes:16,
    Isbn:17
};

let full_price = 0;

// ИНИЦИАЛИЗАЦИЯ - ДВОЙНОЙ ЩЕЛЧОК ДЛЯ РЕДАКТИРОВАНИЯ ЯЧЕЙКИ
window.addEventListener("DOMContentLoaded", () => {
  setRubricsOptions();
  initLists();
});

window.onbeforeunload = function() {
  return "Are you sure to close the window?"
};

function makeLineList() {
  pic = [];
      default_names=['Обложка','Задняя обл.', '1', '2', '3'];
      pic.push(document.getElementById('pic1-id').value);
      pic.push(document.getElementById('pic2-id').value);
      pic.push(document.getElementById('pic3-id').value);
      pic.push(document.getElementById('pic4-id').value);
      pic.push(document.getElementById('pic5-id').value);
      pic_str = ""
      for (let i = 0;i < pic.length;i++) {
        if (pic[i].length>0) {
        if (pic[i].slice(7).split(':').length==1) {
            pic[i] = `<a href="${pic[i]}" target="_blanc">:${default_names[i]}</a>`;
        } else {
            pic[i] = `<a href="${pic[i].slice(0,7)}${pic[i].slice(7).split(':')[0]}" target="_blanc">:${pic[i].slice(7).split(':')[1]}</a>`;
        }
        pic_str += ((pic[i])?`${pic[i]}:`:"")
        }
      }

     let obj = {
                rubric:document.getElementById('rubrics-accum-id').value.trim(),
                authors:document.getElementById('authors-id').value.trim(),
                name:document.getElementById('name-id').value.trim(),
                second_name:document.getElementById('second-name-id').value.trim(),
                publ_place:document.getElementById('publ-place-id').value.trim(),
                publisher:document.getElementById('publisher-id').value.trim(),
                date:document.getElementById('date-id').value.trim(),
                pages:document.getElementById('pages-id').value.trim(),
                description:document.getElementById('description-id').value.trim(),
                binding:getListValue("binding-id"),
                condition:getListValue("condition-id"),
                defects:getListValue("defects-id"),
                format:getListValue("format-id").split('(')[0],
                price:document.getElementById('price-id').value.trim(),
                isbn:getPlainISBN(),
                sellers_code:document.getElementById('sellers-code-id').value.trim()
            };
                if ((obj.pages.length>0)&&(Number(obj.pages)>0)) {
                    obj.pages=`${obj.pages} с.`;
                } else {
                    obj.pages='';
                }
                isbn_str = getTrueISBN(obj.isbn);
                let condition = "";
                if (obj.defects.length>0) {
                   condition = `${obj.condition}, ${obj.defects}`;
                } else {
                  condition = obj.condition;
                }
                //new_date = ((day.length==2)?day : `0${day}`)+'.'+((month.length==2)?month : `0${month}`)+'.'+new_date.getFullYear();
                new_date = document.getElementById('advert-date-id').value;
                if (new_date) {
                  new_date = `${new_date.slice(8,10)}.${new_date.slice(5,7)}.${new_date.slice(0,4)}`;
                }
    return [obj.rubric, obj.authors, obj.name, obj.second_name, obj.publ_place, obj.publisher, obj.date, obj.pages, obj.binding, obj.format, '',
    obj.price, obj.description, condition, new_date, pic_str, obj.sellers_code, isbn_str];
}

function addFilledLine() {
      stopTimer();
      addLine(makeLineList());
}

function showLastString(list) {
  document.getElementById('new-book-string-id').innerHTML = list.toString();
}

function addLine(list = []) {
  addRow();
  updateUchCodeList(list[Columns.UchCodes]);
  updateRubrics(list[Columns.Rubric]);
  let line = document.createElement("tr");
  showLastString(list);
  for (let i=0; i<table_info.Cols;i++) { 
  	let td = document.createElement("td");
  	if (list.length>0) {
      setText(table_index-1, i, list[i]);
      if (!full_info_show && i != Columns.Rubric && i != Columns.Fotos) {
        td.innerHTML = `${list[i].slice(0,8)}...`;
      } else {
  		  td.innerHTML = list[i];
      }
  	} else {
  		td.innerHTML = "";
  	}
  	td.ondblclick = editable.dbclick_handler;
  	line.appendChild(td);
  }

  let books = document.getElementById("books-body");
  books.appendChild(line);
  quantity = Number(document.getElementById("quantity-id").innerText)+1;
  full_price += Number(list[Columns.Price]);
  document.getElementById("full-price-id").innerHTML = `Сумма: <b>${full_price}</b>`;
  document.getElementById("quantity-id").innerText = `${quantity}`;
}

function deleteLine() {
  
}
