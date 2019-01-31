class DB {
    static getTable(table) {
        if ( !(localStorage.getItem(table)) ) {
            let books = [
                new Book("Book Example 1", "Author 1", "Good"),
                new Book("Book Example 2", "Author 2", "Bad")
            ];
            localStorage.setItem( table, JSON.stringify( books ));
        }
        let data_table = JSON.parse( localStorage.getItem(table) );
        return data_table;
    }
    static insert(table, data_item) {
        let table_data = this.getTable(table);
        table_data.push( data_item );
        localStorage.setItem(table, JSON.stringify(table_data) );
    }
    static remove(table, data_item) {
        let table_data = this.getTable(table);
        table_data.pop( data_item );
        localStorage.setItem(table, JSON.stringify(table_data) );
    }
}

class Book {
    constructor(title, author, rating) {
        this.title = title;
        this.author = author;
        this.rating = ["Bad","Common","Good","Exceptional"][rating];
    }
}

class Shelf {
    constructor() {
        // HTML DOM Static Elements
        this.bookList = document.getElementById("bookList");
        this.addBookBtn = document.getElementById("addBookBtn");

        // Event Listeners
        addBookBtn.addEventListener("click", this.addBook);
        bookList.addEventListener("click", this.delBook);

        // Get books from localStorage and populate them on the Shelf
        DB.getTable("books").forEach((book) => {
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <tr>
                    <td>${book["title"]}</td>
                    <td>${book["author"]}</td>
                    <td>${book["rating"]}</td>
                    <td><a href="#" class="delBookBtn" style="text-decoration:none; color: #cc0000;">X</a></td>
                </tr>
            `
            bookList.appendChild(tr);
        })
    }
    static alertMsg(msg, color) {
        let colors = {"green":"#85e085", "red":"#ff3333"};
        const alertDiv = document.getElementById("alertDiv");
        alertDiv.innerText = msg;
        alertDiv.style.backgroundColor = colors[color];
        alertDiv.style.display = "";

        setTimeout(() => {
            alertDiv.style.display = "none";
        }, 3000);
    }
    addBook(e) {
        // HTML Elements
        let title = document.getElementById("bookTitle").value,
            author = document.getElementById("bookAuthor").value,
            rating = document.getElementById("bookRating").value;

        let newBook = new Book(title, author, rating);
        // validate input fields
        let invalid_data = false;
        Object.values(newBook).forEach((value) => {
            if (!(value) || value==""){
                Shelf.alertMsg("Please check your input fields!", "red");
                invalid_data = true;
            }});
        if (!invalid_data) {
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <tr>
                    <td>${newBook.title}</td>
                    <td>${newBook.author}</td>
                    <td>${newBook.rating}</td>
                    <td><a href="#" class="delBookBtn" style="text-decoration:none; color: #cc0000;">X</a></td>
                </tr>
            `;
            bookList.appendChild(tr);
            DB.insert("books", newBook);
            Shelf.alertMsg("Book added!","green");
        }
        e.preventDefault();
    }
    delBook(e) {
        // Event Delegation
        if (e.target.className == "delBookBtn") {
            if ( confirm("Are you sure?") ) {
                let row = e.target.parentElement.parentElement;
                let tds = row.querySelectorAll("td");
                let book_clicked = new Book(
                                        tds[0].innerText,
                                        tds[1].innerText,
                                        tds[2].innerText);
                row.remove();
                DB.remove("books", book_clicked);
                Shelf.alertMsg("Book deleted!", "green");
            }
        }
    }
}


// main logic
document.addEventListener("DOMContentLoaded", () => {
    const app = new Shelf();
})