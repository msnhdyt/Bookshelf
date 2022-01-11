function addBook(){
    const judul = document.getElementById("judul").value;
    const penulis = document.getElementById("penulis").value;
    const tahun = document.getElementById("tahun").value;
    const isComplete = document.getElementById("completed-checkbox").checked;
    
    const book = {
        "id": Date.now(),
        "title": judul,
        "author": penulis,
        "year": tahun,
        "isComplete": isComplete,
    }
    createElementBook(book);
    addToStorage(book);
}

document.addEventListener("DOMContentLoaded", (event)=>{
    const submitForm = document.getElementById("main-form");
    submitForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        addBook();
    })
    const searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", (event)=>{
        event.preventDefault();
        showResultSearch();
    })
    showBook();
    const removeAllElement = document.querySelectorAll(".remove-all");
    removeAllElement.forEach((button) => {
        button.addEventListener("click", (event)=>{
            removeAllButton(event.target)
        })
    })
})

function createElementBook(book){
    let article = document.createElement("article");
    article.setAttribute("class", "book");
    article.setAttribute("id", book["id"]);

    let judul = document.createElement("h4");
    judul.innerText = book["title"];

    let penulis = document.createElement("p");
    penulis.innerText = "Penulis: " + book["author"];

    let tahun = document.createElement("p");
    tahun.innerText = "Tahun: " + book["year"];

    article.appendChild(judul);
    article.appendChild(penulis);
    article.appendChild(tahun);
    if(book["isComplete"]){
        article.appendChild(createButton("uncompletedButton", uncompletedButton, "belum selesai"));
        article.appendChild(createButton("removeButton uncompletedButton", removeButton, ""));
        document.getElementById("completed").appendChild(article);
    } else{
        article.appendChild(createButton("completedButton", completedButton, "selesai dibaca"));
        article.appendChild(createButton("removeButton completedButton", removeButton, ""));
        document.getElementById("uncomplete").appendChild(article);
    }
}

function createButton(buttonClass, eventListener, text){
    let button = document.createElement("button");
    button.innerText = text;
    button.setAttribute("class", buttonClass);
    button.addEventListener("click", (event) => {
        eventListener(event.target);
    })
    return button;
}

function completedButton(elementBook){
    const id = elementBook.parentElement.getAttribute("id");
    const parent = elementBook.parentElement;

    elementBook.remove();

    document.querySelector("#uncomplete .removeButton").setAttribute("class", "removeButton uncompletedButton");
    parent.appendChild(createButton("uncompletedButton", uncompletedButton, "belum selesai"));
 
    document.getElementById("completed").appendChild(parent);

    let uncompletedBooks = JSON.parse(localStorage.getItem(uncompletedListKey));
    let movingElement = uncompletedBooks.filter(book => book["id"] == id);
    let newUncompletedBooks = uncompletedBooks.filter(book => book["id"] != id);
    localStorage.setItem(uncompletedListKey, JSON.stringify(newUncompletedBooks));
    movingElement[0]["isComplete"] = true;
    addToStorage(movingElement[0]);
}

function uncompletedButton(elementBook){
    const id = elementBook.parentElement.getAttribute("id");
    const parent = elementBook.parentElement;

    elementBook.remove();

    document.querySelector("#completed .removeButton").setAttribute("class", "removeButton completedButton");
    parent.appendChild(createButton("completedButton", completedButton, "selesai dibaca"));

    document.getElementById("uncomplete").appendChild(parent);

    let completedBooks = JSON.parse(localStorage.getItem(completedListKey));
    let movingElement = completedBooks.filter(book => book["id"] == id);
    let newCompletedBooks = completedBooks.filter(book => book["id"] != id);
    localStorage.setItem(completedListKey, JSON.stringify(newCompletedBooks));
    movingElement[0]["isComplete"] = false;
    addToStorage(movingElement[0]);
}

function removeButton(elementBook){
    const id = elementBook.parentElement.getAttribute("id");
    const parent = elementBook.parentElement;

    document.getElementById(id).remove();

    const classElement = elementBook.classList;

    if(classElement.contains("uncompletedButton")){
        let completedBooks = JSON.parse(localStorage.getItem(completedListKey));
        let newCompletedBooks = completedBooks.filter(book => book["id"] != id);
        localStorage.setItem(completedListKey, JSON.stringify(newCompletedBooks));

    } else if(classElement.contains("completedButton")){

        let uncompletedBooks = JSON.parse(localStorage.getItem(uncompletedListKey));
        let newUncompletedBooks = uncompletedBooks.filter(book => book["id"] != id);
        localStorage.setItem(uncompletedListKey, JSON.stringify(newUncompletedBooks));
    }
}

function showBook(){
    let completedBooks = showStorage(completedListKey);
    let uncompletedBooks = showStorage(uncompletedListKey);

    for(let book of completedBooks){
        createElementBook(book);
    }

    for(let book of uncompletedBooks){
        createElementBook(book);
    }
}

function showResultSearch(){
    const judul = document.getElementById("search-judul").value;
    const completedBooks = JSON.parse(localStorage.getItem(completedListKey));
    const uncompletedBooks = JSON.parse(localStorage.getItem(uncompletedListKey));

    let result = completedBooks.filter(book => book["title"].includes(judul));
    result = result.concat(uncompletedBooks.filter(book => book["title"].includes(judul)));

    const classBookElement = document.querySelectorAll(".book");

    for(let element of classBookElement){
        if(element.parentNode){
            element.parentNode.removeChild(element);
        }
    }
    for(book of result){
        createElementBook(book);
    }
}

function removeAllButton(elementButton){
    const parent = elementButton.parentElement;

    if(parent.getAttribute("id")==="completed"){
        const child = document.querySelectorAll("#completed > .book");
        for(let element of child){
            parent.removeChild(element);
        }
        localStorage.setItem(completedListKey, JSON.stringify([]));
    } else{
        const child = document.querySelectorAll("#uncomplete > .book");
        for(let element of child){
            parent.removeChild(element);
        }
        localStorage.setItem(uncompletedListKey, JSON.stringify([]));
    }
}