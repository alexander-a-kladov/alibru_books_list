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