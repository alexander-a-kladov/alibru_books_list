let full_info_show = false;
let table_descriptions=[];
let table_index=0;

let editable = {
dbclick_handler: (event) => {
        cell = event.target;
        row = event.target.parentNode.rowIndex-1;
        col = event.target.cellIndex;
        event.target.innerHTML = getText(row, col);
        editable.row = row;
        editable.col = col;
        editable.edit(cell); 
    },
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
setText(editable.row, editable.col, editable.selected.innerHTML);
if (editable.col != Columns.Rubric && editable.col != Columns.Fotos) {
    if (!full_info_show) {
        editable.selected.innerHTML = `${editable.selected.innerHTML.slice(0,8)}...`;
    }
}
window.getSelection().removeAllRanges();
editable.selected.contentEditable = false;
// ВОССТАНОВИТЬ КЛИК-СЛУШАТЕЛИ
window.removeEventListener("click", editable.close);
let cell = editable.selected;
cell.ondblclick = editable.dbclick_handler;
// "СНЯТЬ ПОМЕТКУ" ТЕКУЩЕЙ ВЫБРАННОЙ ЯЧЕЙКИ
editable.selected.classList.remove("edit");
editable.selected = null;
editable.row = undefined;
editable.col = undefined;
}}
};

function addRow() {
    table_descriptions[table_index] = new Array(table_info.Cols);
    table_index+=1;
}

function setText(index, column, text) {
    if (index<table_index && column>=0 && column <table_info.Cols) {
        table_descriptions[index][column] = text;
    }
}

function getText(index, column) {
    if (index<table_index && column>=0 && column <table_info.Cols) {
        return table_descriptions[index][column];
    }
    return undefined;
}

function deleteRow(index) {
    if (index >= 0 && index<table_index) {
        table_descriptions.splice(index, 1);
        table_index--;
    }
}

function findBookByInputData() {
    i = findBook(0,makeLineList());
    if (~i) {
        showLastString(table_descriptions[i]);
    } else {
        showLastString(['Не найдено']);
    }
}

function findBook(index, list) {
    let isFind;
    for (let i=index;i<table_index;i++) {
        isFind = true;
        for (let j=0;j<table_info.Cols;j++) {
            if (list[j] && list[j] != table_descriptions[i][j]) {
                isFind = false;
                break;
            }
        }
        if (isFind) {
            return i;
        }
    }
    return -1;
}
