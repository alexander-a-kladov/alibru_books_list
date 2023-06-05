alib_win = null;
input_fields = ['authors-id', 'name-id', 'publ-place-id', 'publisher-id', 'date-id', 'pages-id', 'binding-id', 'format-id', 'isbn-id', 'price-id', 'description-id'];
input_field_names = ['Авторы', 'Название', 'Место изд.', 'Издательство', 'Год издания', 'Кол-во страниц', 'Переплет', 'Формат', 'ISBN', 'Цена', 'Описание'];
field_index = 0;

// const undoStack = {
// _stack: [],
// _top: 0,
// function push(field_id, field_text, new_text) {
//   _stack[_top] = {id: field_id, text: field_text, new: new_text};
//   _top+=1; 
// },
// function pop() {
//     if (_top>0) {

//     }
// }
// };

function findOnAlib() {
    isbn = document.getElementById("isbn-id").value;
    if (alib_win) alib_win.close();
    if (isbn) {
        alib_win = window.open(`https://www.alib.ru/findp.php4?isbnp=${isbn}`);
    } else {
        title = `${document.getElementById("name-id").value.trim().replaceAll(' ', '+').toLowerCase()}+&`;
        alib_win = window.open(`https://www.alib.ru/findp.php4?title=${title}`);
    }
}


function skipWord() {
    descr = document.getElementById('book-info-id').value.replaceAll('\n',' ');
    stop = descr.indexOf(" ");
    if (~stop) {
        document.getElementById('book-info-id').value = descr.slice(stop+1);
    }
}

function fixTextFields(field_id, text) {
    if (field_id == 'authors-id') {
        return text;
    }
    if (field_id == 'name-id') {
        if (text[text.length-2]=='.') {
            return text.slice(0, text.length-2);
        } else {
            return text;
        }
    }
    if (field_id == 'publisher-id') {
        return text;
    }
    if (field_id == 'date-id') {
        return text.replaceAll('г','').replaceAll('.','');
    }
    if (field_id == 'pages-id') {
        return text.replaceAll('с.','')
    }
    if (field_id == 'publ-place-id') {
        if (text[text.length-1]==':') {
            return text.slice(0,text.length-1);
        } else {
            return text;
        }
    }
    return text;
}

function addToInputField() {
    inputId = input_fields[field_index];
    descr = document.getElementById('book-info-id').value.replaceAll('\n',' ');
    stop = descr.indexOf(" ");
    if (~stop) {
        input = document.getElementById(inputId);
        text = input.value+fixTextFields(inputId,descr.slice(0,stop+1));
        input.value = text;
        document.getElementById('book-info-id').value = descr.slice(stop+1);
    }
}

function nextInputField() {
    if (field_index<input_fields.length-1) {
        field_index+=1;
        document.getElementById('input-field-name-id').innerHTML = input_field_names[field_index];
    }
}

function prevInputField() {
    if (field_index>0) {
        field_index-=1;
        document.getElementById('input-field-name-id').innerHTML = input_field_names[field_index];
    }
}