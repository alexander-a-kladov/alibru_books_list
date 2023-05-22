const list_map = {
    "uchcodes-id": "sellers-code-id",
    "conditions-id":"condition-id",
    "formats-id":"format-id",
    "bindings-id":"binding-id"
};

let uch_codes = new Set();
const bindings_list=["Бумажный (обложка)", "Самодельный", "Картонный", "Твердый", "Тканевый", "Владельческий", "Полукожанный", "Составной", "Кожанный"];
const formats_list=["Очень большой (cвыше 28 см)","Энциклопедический (25-27 см)","Увеличенный (22-24 см)",
"Обычный (19-21 см)","Уменьшенный (11-18 см)","Миниатюрный (менее 10 см)"];
const conditions_list=["идеальное", "отличное", "хорошее", "удовлетворительное", "плохое"];
const list_names={'bindings':bindings_list, 'formats':formats_list, 'conditions':conditions_list};

function initLists() {
    for (list in list_names) {
        for (el of list_names[list]) {
            addOptionToList(el, `${list}-id`, `${list}-body`);
        }
    }
}

function addOptionToList(option, list_id, list_body_id) {
    tr = document.createElement('tr');
    td = document.createElement('td');
    td.innerHTML = option;
    tr.appendChild(td);
    td.onclick = () => {selectList(list_id);}
    document.getElementById(list_body_id).appendChild(tr);
}

function getListValue(list_id) {
    return document.getElementById(list_id).innerHTML;
}

function listShow(list_id) {
  document.getElementById(list_id).classList.toggle("show");
}

function  selectList(list_id) {
    document.getElementById(list_id).innerHTML = event.target.innerHTML;
    document.getElementById(list_map[list_id]).value = event.target.innerHTML;
}

function updateUchCodeList(uch_code) {
    if (!uch_code) return;
    if (!uch_codes.has(uch_code)) {
      uch_codes.add(uch_code);
      addOptionToList(uch_code, 'uchcodes-id', 'uchcodes-body');
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