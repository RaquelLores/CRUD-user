
let popUpSection;
let booksList;

    // Este evento se activa cuando el DOM ha sido completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
    // Al cargar el DOM, se llama a la función printBooks para mostrar la información inicial.
    printBooks();

    popUpSection = document.getElementById("popUpForm");
});

// Método GET del CRUD (READ). La función printBooks realiza una solicitud GET a la API para obtener la lista de libros.
async function printBooks() {
    try {
        const result = await fetch("http://localhost:3000/books");
        // Obtenemos la lista de libros en formato JSON.
        const books = await result.json();
        const booksList = document.getElementById("books-list");
        booksList.innerHTML = ""; // Limpiar la lista antes de agregar nuevos libros
        // Se itera sobre cada libro y se genera una fila en la lista con su información.
        books.forEach(book => {
            booksList.innerHTML +=
                `<li id="book-${book.id}">
                    <h3>${book.title}</h3>
                    <p>Autor: ${book.author}</p> 
                    <button class="edit-button" onclick="popUpForm('${book.id}', '${book.title}', '${book.author}')">Editar</button>
                    <button class="delete-button" onclick="deleteBook('${book.id}')">Eliminar</button>
                </li>`;
        });
    } catch (error) {
        console.error('Error al cargar la lista de libros:', error);
    }
}
// Método UPDATE del CRUD (PUT)
async function popUpForm(id, title, author) {
    popUpSection.innerHTML = `
    <p>Modificando...</p>
    <form id="modify-form">
        <p><label for="modify-title">Título:</label><input id="modify-title" name="title" type="text" value="${title}"></p>
        <p><label for="modify-author">Autor:</label><input id="modify-author" name="author" type="text" value="${author}"></p>
        <button type="button" onclick="modifyBook('${id}')">Guardar cambios</button>
    </form>`;
    booksList.innerHTML = "";
}

async function modifyBook(id, originalTitle, originalAuthor) {
    const modifyTitleInput = document.getElementById("modify-title").value;
    const modifyAuthorInput = document.getElementById("modify-author").value;

    try {
        const result = await fetch(`http://localhost:3000/books/${id}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ title: modifyTitleInput, author: modifyAuthorInput })
        });

        if (result.ok) {
            // Ocultar el formulario de edición después de guardar los cambios
            hidePopUpForm();
            // Volver a cargar la lista de libros actualizada
            printBooks();
        } else {
            console.error('Error al modificar el libro:', result.statusText);
            // En caso de error, restaurar los valores originales en el formulario
            document.getElementById("modify-title").value = originalTitle;
            document.getElementById("modify-author").value = originalAuthor;
        }
    } catch (error) {
        console.error('Error al modificar el libro:', error);
        // En caso de error, restaurar los valores originales en el formulario
        document.getElementById("modify-title").value = originalTitle;
        document.getElementById("modify-author").value = originalAuthor;
    }
}


function hidePopUpForm() {
    // Limpiar la sección de formulario de edición después de guardar los cambios.
    popUpSection.innerHTML = "";
}

// Método DELETE del CRUD.
async function deleteBook(id) {
    try {
        const result = await fetch(`http://localhost:3000/books/${id}`, {
            method: "DELETE"
        });
        if (result.ok) {
            // Si la solicitud fue exitosa, volver a cargar la lista de libros actualizada.
            printBooks();
        } else {
            console.error('Error al eliminar el libro:', result.statusText);
        }
    } catch (error) {
        console.error('Error al eliminar el libro:', error);
    }
}

// Método POST C (CREATE) del CRUD con formulario
async function createBook() {
    // Solicitar al usuario ingresar información para el nuevo libro.
    const titleInput = document.getElementById("title").value;
    const authorInput = document.getElementById("author").value;

    // Validar si el título está vacío
    if (titleInput === '') {
        alert('Por favor, completa el campo "Título".');
        return; // Detener la función si el está vacío
    }
    try {
        const result = await fetch("http://localhost:3000/books", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: titleInput, author: authorInput })
        });

        if (result.ok) {
            // Si la solicitud fue exitosa, volver a cargar la lista de libros actualizada.
            printBooks();
            // Limpiar los campos del formulario después de agregar el libro
            document.getElementById("title").value = "";
            document.getElementById("author").value = "";
        } else {
            console.error('Error al agregar el libro:', result.statusText);
        }
    } catch (error) {
        console.error('Error al agregar el libro:', error);
    }
}
