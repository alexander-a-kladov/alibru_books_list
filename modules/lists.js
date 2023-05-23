const list_map = {
    "uchcodes-id": "sellers-code-id",
    "conditions-id":"condition-id",
    "formats-id":"format-id",
    "bindings-id":"binding-id"
};

let uch_codes = new Set();
let rubric_codes = new Set();
const bindings_list=["Бумажный (обложка)", "Самодельный", "Картонный", "Твердый", "Тканевый", "Владельческий", "Полукожанный", "Составной", "Кожанный"];
const formats_list=["Очень большой (cвыше 28 см)","Энциклопедический (25-27 см)","Увеличенный (22-24 см)",
"Обычный (19-21 см)","Уменьшенный (11-18 см)","Миниатюрный (менее 10 см)"];
const conditions_list=["идеальное", "отличное", "хорошее", "удовлетворительное", "плохое"];
const list_names={'bindings':[bindings_list, () => {selectList('bindings-id')}], 'formats':[formats_list,() => {selectList('formats-id')}],
'conditions':[conditions_list, () => {selectList('conditions-id')}]};

function initLists() {
    for (list in list_names) {
        for (el of list_names[list][0]) {
          addOptionToList(el, `${list}-id`, `${list}-body`, list_names[list][1]);
        }
    }
}

function addOptionToList(option, list_id, list_body_id, func) {
    tr = document.createElement('tr');
    td = document.createElement('td');
    td.innerHTML = option;
    tr.appendChild(td);
    td.onclick = func;
    document.getElementById(list_body_id).appendChild(tr);
}

function getListValue(list_id) {
    return document.getElementById(list_id).value;
}

function listShow(list_id) {
  document.getElementById(list_id).classList.toggle("show");
}

function selectList(list_id) {
    document.getElementById(list_map[list_id]).value = event.target.innerHTML;
}

function selectListRubrics() {
  addRubricToAccum(event.target.innerHTML);
}

function updateUchCodeList(uch_code) {
    if (!uch_code) return;
    if (!uch_codes.has(uch_code)) {
      uch_codes.add(uch_code);
      addOptionToList(uch_code, 'uchcodes-id', 'uchcodes-body', () => {selectList('uchcodes-id')});
    }
}

function updateRubrics(rubric) {
  if (!rubric) return;
  rubrics = rubric.split('.');
  for (let i=0; i<rubrics.length-1; i++) {
  rubric = rubrics[i];
  if (!rubric_codes.has(rubric)) {
    rubric_codes.add(rubric);
    addOptionToList(rubric, 'rubrics-id', 'rubrics-body', () => {selectListRubrics()});
  }
  }
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
    if (event.target.matches('td')) {
      console.log(event);
    }
}