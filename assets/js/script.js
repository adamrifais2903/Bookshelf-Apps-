const bookshelf = [];
const RENDER_EVENT = 'render-bookshelf';
const SAVED_EVENT = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSHELF_APPS';

const modalInsert = document.getElementById("modalInsert");
const modalEdit = document.getElementById("modalEdit");
const modalDelete = document.getElementById("modalDelete");
const modalInfoSaved = document.getElementById("modalInfoSaved");

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    };
}

// Find Book by ID
function findBook(bookId) {
    for (const bookItem of bookshelf) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

// Find Book by ID for Delete Book
function findBookIndex(bookId) {
    for (const index in bookshelf) {
        if (bookshelf[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

// CHECK LOCAL STORAGE AVAILABLE
function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser Anda tidak mendukung local storage, harap gunakan browser lain!');
        return false;
    }
    return true;
}

// Save Book to Local Storage
function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bookshelf);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

// Get Book from Local Storage
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
        for (const book of data) {
            bookshelf.push(book);
        }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Create Element Item Book
function makeBook(bookObject) {
    const {id, title, author, year, isCompleted} = bookObject;

    // Create Element for Data Book
    const textTitle = document.createElement('h4');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis: " + author;
  
    const textYear = document.createElement('p');
    textYear.innerText = "Tahun: " + year;

    // Wrapper Data Book
    const textContainer = document.createElement('div');
    textContainer.classList.add('data-book');
    textContainer.append(textTitle, textAuthor, textYear);

    // Create Action Button 
    const btnEdit = document.createElement('button');
    btnEdit.classList.add('button', 'light-blue', 'size-150px', "margin-right-8px");
    btnEdit.innerText = "Edit";
    btnEdit.addEventListener('click', function () {
        modalEdit.style.paddingTop = "130px";
        modalEdit.style.display = "block";
        loadDataBookById(id);
    });

    const btnDelete = document.createElement('button');
    btnDelete.classList.add('button', 'red', 'size-150px');
    btnDelete.innerText = "Hapus";
    btnDelete.addEventListener('click', function () {
        removeBook(id);
    });

    // Wrapper Action Button
    const btnActionContainer = document.createElement('div');
    btnActionContainer.classList.add('action-button');
    btnActionContainer.append(btnEdit, btnDelete);

    // Wrapper Item Book
    const container = document.createElement('article');
    container.classList.add('book-item');
    container.setAttribute('id', `book-${id}`);
    container.append(textContainer, btnActionContainer);

    // Selection when book already read
    if (isCompleted) {
        const btnMarkUnread = document.createElement('button');
        btnMarkUnread.classList.add('button', 'blue', 'size-100percent');
        btnMarkUnread.innerText = "Tandai belum dibaca";
        btnMarkUnread.addEventListener('click', function () {
            addBookToUncomplete(id);
        });
    
        container.append(btnMarkUnread);
    } else {
        const btnMarkRead = document.createElement('button');
        btnMarkRead.classList.add('button', 'green', 'size-100percent');
        btnMarkRead.innerText = "Tandai selesai dibaca";
        btnMarkRead.addEventListener('click', function () {
            addBookToCompleted(id);
        });
    
        container.append(btnMarkRead);
    }
  
    return container;
}

// Add Book to Object Bookshelf 
function addBook() {
    const id = generateId();
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const year = document.getElementById('bookYear').value;
    const valueIsComplete = document.getElementById('bookStatus').value;

    if (valueIsComplete === "true") {
        const bookObject = generateBookObject(id.toString(), title, author, parseInt(year), true);
        bookshelf.push(bookObject);
    } else {
        const bookObject = generateBookObject(id.toString(), title, author, parseInt(year), false);
        bookshelf.push(bookObject);
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// Add Book to complete read bookshelf
function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
  
    if (bookTarget == null) return;
  
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// Add Book to unread bookshelf
function addBookToUncomplete(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
  
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// Show dialog confirmation delete and delete book by index
function removeBook(bookId) {
    modalDelete.style.paddingTop = "300px";
    modalDelete.style.display = "block";
    
    const btnDeleteBook = document.getElementById("btnDeleteBook");
    btnDeleteBook.addEventListener('click', function () {
        const bookTarget = findBookIndex(bookId);
  
        if (bookTarget === -1) return;
    
        bookshelf.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();

        modalDelete.style.display = "none";
    });
}

// Load Data Book for Edit Book
function loadDataBookById(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    const titleElement = document.getElementById('bookTitle1');
    const authorElement = document.getElementById('bookAuthor1');
    const yearElement = document.getElementById('bookYear1');

    titleElement.value = bookTarget.title;
    authorElement.value = bookTarget.author;
    yearElement.value = bookTarget.year;

    const btnSubmitEdit = document.getElementById("submitEdit");

    btnSubmitEdit.addEventListener('click', function () {
        bookTarget.title = document.getElementById('bookTitle1').value;
        bookTarget.author = document.getElementById('bookAuthor1').value;
        bookTarget.year = parseInt(document.getElementById('bookYear1').value);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    });
}

// Search Book by Title Book
document.getElementById('submitSearch').addEventListener("click", function (event){
    event.preventDefault();
    const titleBook = document.getElementById('searchTitleBook').value.toLowerCase();
    const listBook = document.querySelectorAll('.book-item h4:nth-child(1)');
      for (const itemBook of listBook) {
        if (itemBook.innerText.toLowerCase().includes(titleBook)) {
            itemBook.parentElement.parentElement.style.display = "block";
        } else {
            itemBook.parentElement.parentElement.style.display = "none";
        }
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const formInsert = document.getElementById('bookInsert');

    formInsert.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();

        modalInsert.style.display = "none";
        modalInfoSaved.style.paddingTop = "300px";
        modalInfoSaved.style.display = "block";
    });
  
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});
  
document.addEventListener(SAVED_EVENT, () => {
    console.log('Buku berhasil di simpan!');
});
  
document.addEventListener(RENDER_EVENT, function () {
    const uncompleteCount = document.getElementById("uncomplete-count");
    const completeCount = document.getElementById("complete-count");
    const totalBookCount = document.getElementById("total-book-count");

    const uncompletedList = document.getElementById('uncompleteList');
    const completeList = document.getElementById('completeList');
  
    uncompletedList.innerHTML = '';
    completeList.innerHTML = '';
  
    for (const bookItem of bookshelf) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted) {
            completeList.append(bookElement);
        } else {
            uncompletedList.append(bookElement);
        }
    }

    uncompleteCount.innerText = uncompletedList.children.length;
    completeCount.innerText = completeList.children.length;
    totalBookCount.innerText = bookshelf.length;

    const elementImgNoDataComplete = document.getElementById("img-container-complete");
    if (completeList.children.length == 0) {
        elementImgNoDataComplete.style.display = "flex";
    } else {
        elementImgNoDataComplete.style.display = "none";
    }

    const elementImgNoDataUncomplete = document.getElementById("img-container-uncomplete");
    if (uncompletedList.children.length == 0) {
        elementImgNoDataUncomplete.style.display = "flex";
    } else {
        elementImgNoDataUncomplete.style.display = "none";
    }
});

// Show Dialog
document.getElementById('bookEdit').addEventListener('submit', function (event) {
    modalEdit.style.display = "none";
    modalInfoSaved.style.paddingTop = "300px";
    modalInfoSaved.style.display = "block";
    event.preventDefault();
});

document.getElementById("btnAdd").addEventListener('click', function () {
    modalInsert.style.display = "block";
});

document.getElementById("btnCancel").addEventListener('click', function () {
    modalDelete.style.display = "none";
});

document.getElementById("btnOk").addEventListener('click', function () {
    modalInfoSaved.style.display = "none";
    location.reload();
});

window.onclick = function(event) {
    if (event.target == modalInsert) {
        modalInsert.style.display = "none";
    }
    if (event.target == modalEdit) {
        modalEdit.style.display = "none";
    }
    if (event.target == modalDelete) {
        modalDelete.style.display = "none";
    }
    if (event.target == modalInfoSaved) {
        modalInfoSaved.style.display = "none";
    }
}
    
