let currentUser = ""
init()

function init(){
    const user = prompt("Enter your Username:")
    if(user){
        fetchUsers(user)
    }
    else {
        init()
    }
}

function fetchUsers(user){
     fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(users => checkNewUser(user,users))
    .catch(error => window.alert(error.message))
}

function checkNewUser(user, users){
    users.forEach(u => {
        if(user === u.username){
            currentUser = u
            fetchBooks()}
        })
       if(currentUser === ""){
        addUser(user)
    }
}
function addUser(user){
    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": user
        })
    })
    .then(response => response.json())
    .then(user => {
        currentUser = user
        fetchBooks()
        })
    .catch(error => window.alert(error.message))
}

function fetchBooks(){
    fetch('http://localhost:3000/books')
    .then(response => response.json())
    .then(books => books.forEach(book => bookList(book)))
    .catch(error => window.alert(error.message))
}

function bookList(book){
    const listContainer = document.getElementById('list')
    const bookName = document.createElement('li')
    bookName.innerText = book.title
    listContainer.append(bookName)
    bookName.addEventListener('mouseover', e => {
        e.target.style.textDecoration = "underline"
        document.body.style.cursor = "pointer"
     })
    bookName.addEventListener('mouseleave', e => {
        e.target.style.textDecoration = ""
        document.body.style.cursor = "default"})
    bookName.addEventListener('click', () => displayBookInfo(book.id) )
}

function displayBookInfo(id){
    fetchThisBook(id)
    .then(book => {
        const panel = document.getElementById('show-panel')
        panel.innerHTML = ""
        const bookImage = document.createElement('img')
        bookImage.src = book.img_url
        const bookTitle = createBookElement(book, "h3", "title")
        const bookSubitle = createBookElement(book, "h4", "subtitle")
        const bookAuthor = createBookElement(book, "h4", "author")
        const bookDescription = createBookElement(book, "p", "description")
        const bookLikes = getLikes(book)
        const likeBtn = document.createElement("button")
        setLikeBtn(likeBtn, book)
        panel.append(bookImage, bookTitle, bookSubitle, bookAuthor, bookDescription, bookLikes, likeBtn)
    })
}
function fetchThisBook(id){
    return fetch(`http://localhost:3000/books/${id}`)
    .then(response => response.json())
    .catch(error => window.alert(error.message))

}

function setLikeBtn(btn, book){
    const likedBy = book.users
    const foundAt = likedBy.findIndex(u => u.username === currentUser.username)
    if(foundAt > 0){
        btn.innerText = "Unlike Book"
        btn.addEventListener('click', e => likedBy.splice(foundAt, 1))
    }
    else{
        btn.innerText = "Like Book"
        likedBy.push(currentUser)
    }
    btn.addEventListener('click', e => modifyBooks(book, likedBy))
}

function modifyBooks(book, likedBy){
        fetch(`http://localhost:3000/books/${book.id}`,{
                method: "PATCH",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "users": likedBy
                })
            })
        .then(response => response.json())
        .then(obj =>  displayBookInfo(obj.id))
        .catch(error => window.alert(error.message))
}
    

function createBookElement(book, htmlElement, bookElement){
    const bookE = document.createElement(htmlElement)
    bookE.innerText = book[bookElement]
    return bookE
}

function getLikes(book){
    const bookLikes = document.createElement('ul')
    bookLikes.id ="book-likes"
    book.users.forEach(user => {
        const listItem = document.createElement('li')
        listItem.innerText = user.username
        bookLikes.append(listItem)
    })
return bookLikes
}