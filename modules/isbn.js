isbn_list = []
isbn_index = 0

function setISBN(isbn_str) {
    let isbn = "";
    if (isbn_str) {
        isbn = isbn_str.trim().replaceAll('-','');
    }
    if (isbn.length && isFinite(isbn.slice(0,isbn.length-1))) {
        document.getElementById('isbn-id').value = isbn;
    } else {
        document.getElementById('isbn-id').value = "";
    }
}

function getTrueISBN(isbn) {
    isbn_str = isbn.trim();
    if (!isbn_str.length) {
        return "";
    }
    if (isbn_str.length==13) {
        return `${isbn_str.slice(0,3)}-${isbn_str.slice(3,4)}-${isbn_str.slice(4,6)}-${isbn_str.slice(6,12)}-${isbn_str.slice(12,13)}`;
    } else {
        return `${isbn_str.slice(0,1)}-${isbn_str.slice(1,3)}-${isbn_str.slice(3,9)}-${isbn_str.slice(9,10)}`;
    }
}

function getPlainISBN() {
    return document.getElementById('isbn-id').value.trim().replaceAll('-','');
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
                    addRubricToAccum(rubric);
                }
            }
        })
        .catch(error => console.log(error));
}
