

const user = JSON.parse(localStorage.getItem('user'));
const userId = user ? user.id : null; // Usa el ID del usuario si existe


// Sidebar
const menuItems = document.querySelectorAll('.menu-item');

// Feeds
const myFeed = document.getElementById('myfeed');
const publicFeed = document.getElementById('publicfeed');


// Hide all feeds
const hideAllFeeds = () => {
    myFeed.style.display = 'none';
    publicFeed.style.display = 'none';
};

const showFeed = (feed) => {
    hideAllFeeds();
    feed.style.display = 'block';
};
// Initially hide all feeds except the public one
hideAllFeeds();
showFeed(publicFeed);


// ============== SIDEBAR ============== 

// Remove active class from all menu items
const changeActiveItem = () => {
    menuItems.forEach(item => {
        item.classList.remove('active');
    })
}

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        changeActiveItem();
        item.classList.add('active');

        // Show the correct feed based on the menu item clicked
        if (item.querySelector('h3').innerText === 'Inicio') {
            showFeed(publicFeed);
        } else if (item.querySelector('h3').innerText === 'Mis publicaciones') {
            showFeed(myFeed);
        }
    });
});


// remove active class from spans or font size selectors
const removeSizeSelectors = () => {
    fontSize.forEach(size => {
        size.classList.remove('active');
    })
}


// Remove active class from colors
const changeActiveColorClass = () => {
    colorPalette.forEach(colorPicker => {
        colorPicker.classList.remove('active');
    })
}



document.addEventListener("DOMContentLoaded", function() {
    cargarmisPublicaciones();
});

function cargarmisPublicaciones() {
    fetch(`http://localhost:3000/api/mispublicaciones/${userId}`)
        .then(response => response.json())
        .then(publicaciones => {
            const feedContainer = document.getElementById('myfeed');
            feedContainer.innerHTML = '';  // Limpiar el contenedor
            publicaciones.forEach(publicacion => {
                const feed = document.createElement('div');
                feed.classList.add('feed');
                // Determinar el número de comentarios
                const comentarios = publicacion.comentarios;
                const numComentarios = comentarios.length;
                
                // Generar el HTML para los comentarios
                const comentariosHTML = comentarios.slice(0, 2).map(comentario => `
                    <div class="comment">
                        <div class="profile-photo-comment">
                            <img src="../resources/assets/images/profile-14.jpg" alt="Profile Photo">
                        </div>
                        <div class="comment-content">
                            <p><strong>${comentario.autor}</strong></p>
                            <p>${comentario.contenido}</p>
                        </div>
                    </div>
                `).join('');
                
                const masComentariosHTML = numComentarios > 2 ? `
                    <div class="more-comments hidden">
                        ${comentarios.slice(2).map(comentario => `
                            <div class="comment">
                                <div class="profile-photo-comment">
                                    <img src="../resources/assets/images/profile-14.jpg" alt="Profile Photo">
                                </div>
                                <div class="comment-content">
                                    <p><strong>${comentario.autor}</strong></p>
                                    <p>${comentario.contenido}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '';

                const verComentariosHTML = numComentarios > 2 ? `
                    <div class="comments text-muted">
                        <button class="view-comments-btn" data-publicacion-id="${publicacion.id}">
                            View all ${numComentarios} comments
                        </button>
                    </div>
                ` : '';

                feed.innerHTML = `
                    <div class="head">
                        <div class="user">
                            <div class="profile-photo">
                                <img src="../resources/assets/images/user.png" alt="Profile Photo">
                            </div>
                            <div class="info">
                                <h3>${publicacion.autor}</h3>
                                <small>${new Date(publicacion.fecha).toLocaleString()}</small>
                            </div>
                        </div>
                        <span class="edit">
                            <i class="uil uil-ellipsis-h"></i>
                        </span>
                    </div>
                    <div class="caption">
                        <p>${publicacion.contenido}</p>
                    </div>
                    <div class="action-buttons">
                        <div class="interaction-buttons">
                            <span><i class="uil uil-heart"></i></span>
                            <span><i class="uil uil-comment-dots"></i></span>
                        </div>
                    </div>
                    ${verComentariosHTML}
                    <div class="comments-section" id="comments-${publicacion.id}">
                        ${comentariosHTML}
                        ${masComentariosHTML}
                    </div>
                    <div class="commentContainer">
                        <div class="profile-photo-comment">
                            <img src="../resources/assets/images/user.png" alt="Profile Photo">
                        </div>
                        <div class="messageBox">
                            <input required placeholder="Escribe un comentario" type="text" data-publicacion-id="${publicacion.id}" class="messageInput" />
                            <button class="sendButton">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
                                    <path fill="none" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"></path>
                                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="33.67" stroke="#6c6c6c" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                `;
                feedContainer.appendChild(feed);
            });

            // Asignar evento de click a los botones de ver todos los comentarios
            document.querySelectorAll('.view-comments-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const publicacionId = this.getAttribute('data-publicacion-id');
                    const commentsSection = document.getElementById(`comments-${publicacionId}`);
                    const moreComments = commentsSection.querySelector('.more-comments');
                    if (moreComments) {
                        moreComments.classList.toggle('hidden');
                        this.textContent = moreComments.classList.contains('hidden') 
                            ? `View all ${moreComments.children.length} comments` 
                            : `Hide comments`;
                    }
                });
            });

            // Asignar evento de click a los botones de enviar comentario
            document.querySelectorAll('.sendButton').forEach(button => {
                button.addEventListener('click', enviarComentario);
            });
        })
        .catch(error => console.error('Error cargando publicaciones:', error));
}

function getAutorId() {
    return userId; // Ejemplo de ID de autor, cámbialo según tu lógica.
}

document.addEventListener("DOMContentLoaded", function() {
    cargarPublicaciones();
});
function cargarPublicaciones() {
    fetch('http://localhost:3000/api/publicaciones')
        .then(response => response.json())
        .then(publicaciones => {
            const feedContainer = document.getElementById('publicfeed');
            feedContainer.innerHTML = '';  // Limpiar el contenedor

            // Obtén la información del usuario desde localStorage
            const user = JSON.parse(localStorage.getItem('user'));

            publicaciones.forEach(publicacion => {
                const feed = document.createElement('div');
                feed.classList.add('feed');

                // Determinar el número de comentarios
                const comentarios = publicacion.comentarios;
                const numComentarios = comentarios.length;
                
                // Generar el HTML para los comentarios
                const comentariosHTML = comentarios.slice(0, 2).map(comentario => `
                    <div class="comment">
                        <div class="profile-photo-comment">
                            <img src="../resources/assets/images/profile-14.jpg" alt="Profile Photo">
                        </div>
                        <div class="comment-content">
                            <p><strong>${comentario.autor}</strong></p>
                            <p>${comentario.contenido}</p>
                        </div>
                    </div>
                `).join('');
                
                const masComentariosHTML = numComentarios > 2 ? `
                    <div class="more-comments hidden">
                        ${comentarios.slice(2).map(comentario => `
                            <div class="comment">
                                <div class="profile-photo-comment">
                                    <img src="../resources/assets/images/profile-14.jpg" alt="Profile Photo">
                                </div>
                                <div class="comment-content">
                                    <p><strong>${comentario.autor}</strong></p>
                                    <p>${comentario.contenido}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '';

                const verComentariosHTML = numComentarios > 2 ? `
                    <div class="comments text-muted">
                        <button class="view-comments-btn" data-publicacion-id="${publicacion.id}">
                            Ver todos ${numComentarios} comentarios
                        </button>
                    </div>
                ` : '';

                // Genera el HTML del feed
                feed.innerHTML = `
                    <div class="head">
                        <div class="user">
                            <div class="profile-photo">
                                <img src="../resources/assets/images/user.png" alt="Profile Photo">
                            </div>
                            <div class="info">
                                <h3>${publicacion.autor}</h3>
                                <small>${new Date(publicacion.fecha).toLocaleString()}</small>
                            </div>
                        </div>
                        <span class="edit">
                            <i class="uil uil-ellipsis-h"></i>
                        </span>
                    </div>
                    <div class="caption">
                        <p>${publicacion.contenido}</p>
                    </div>
                    <div class="action-buttons">
                        <div class="interaction-buttons">
                            <span><i class="uil uil-heart"></i></span>
                            <span><i class="uil uil-comment-dots"></i></span>
                        </div>
                    </div>
                    ${verComentariosHTML}
                    <div class="comments-section" id="comments-${publicacion.id}">
                        ${comentariosHTML}
                        ${masComentariosHTML}
                    </div>
                    ${user ? `
                    <div class="commentContainer">
                        <div class="profile-photo-comment">
                            <img src="../resources/assets/images/user.png" alt="Profile Photo">
                        </div>
                        <div class="messageBox">
                            <input required placeholder="Escribe un comentario" type="text" data-publicacion-id="${publicacion.id}" class="messageInput" />
                            <button class="sendButton">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 664 663">
                                    <path fill="none" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"></path>
                                    <path stroke-linejoin="round" stroke-linecap="round" stroke-width="33.67" stroke="#6c6c6c" d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    ` : ''}
                `;

                feedContainer.appendChild(feed);
            });

            // Asignar evento de click a los botones de ver todos los comentarios
            document.querySelectorAll('.view-comments-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const publicacionId = this.getAttribute('data-publicacion-id');
                    const commentsSection = document.getElementById(`comments-${publicacionId}`);
                    const moreComments = commentsSection.querySelector('.more-comments');
                    if (moreComments) {
                        moreComments.classList.toggle('hidden');
                        this.textContent = moreComments.classList.contains('hidden') 
                            ? `Ver todos ${moreComments.children.length} comentarios` 
                            : `Ocultar comentarios`;
                    }
                });
            });

            // Asignar evento de click a los botones de enviar comentario
            document.querySelectorAll('.sendButton').forEach(button => {
                button.addEventListener('click', enviarComentario);
            });
        })
        .catch(error => console.error('Error cargando publicaciones:', error));
}

function enviarComentario(event) {
    const button = event.target.closest('button');
    const messageBox = button.previousElementSibling;
    const comentario = messageBox.value;
    const publicacionId = messageBox.getAttribute('data-publicacion-id');

    if (!comentario.trim()) return;

    fetch(`http://localhost:3000/api/publicaciones/${publicacionId}/comentarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            autor: userId,  // Aquí debes usar el ID del usuario autenticado
            contenido: comentario,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Comentario creado con ID:', data.id);
        messageBox.value = '';  // Limpiar la caja de texto

        // Recargar los comentarios
        cargarPublicaciones();
        cargarmisPublicaciones();
    })
    .catch(error => console.error('Error creando comentario:', error));
}

document.getElementById('create-post-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const content = document.getElementById('create-post-content').value;
    fetch('http://localhost:3000/api/publicaciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            autor: userId, // Cambia esto por el ID del usuario real
            contenido: content
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Publicación creada con éxito:', data);
        document.getElementById('create-post-content').value = ''; // Limpiar campo

        // Recargar todas las publicaciones
        cargarPublicaciones();
    })
    .catch((error) => {
        console.error('Error al crear la publicación:', error);
    });
});

















function showForm(formId) {
    document.querySelectorAll('.form').forEach(form => {
        if (form.id === formId) {
            form.classList.add('active');
        } else {
            form.classList.remove('active');
        }
    });
}

document.getElementById('show-signup').addEventListener('click', function() {
    showForm('signup');
});

document.getElementById('show-login').addEventListener('click', function() {
    showForm('login');
});

// Mostrar el formulario de inicio de sesión por defecto
showForm('login');






document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.querySelector('#login input[placeholder="Correo electronico"]').value;
    const password = document.querySelector('#login input[placeholder="Contraseña"]').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.reload();
        } else {
            alert('Error al iniciar sesión');
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('signup').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.querySelector('#signup input[placeholder="Ingresa tu nombre"]').value;
    const email = document.querySelector('#signup input[placeholder="Ingresa tu correo electronico"]').value;
    const password = document.querySelector('#signup input[placeholder="Contraseña"]').value;
    console.log(nombre, email, password)
    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, password }),
        
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        showForm('login');
    })
    .catch(error => console.error('Error:', error));
});








document.addEventListener('DOMContentLoaded', function() {
    var modalContainer = document.getElementById('modal-container');
    var openModalButton = document.getElementById('open-modal');

    openModalButton.addEventListener('click', function() {
        modalContainer.style.display = 'flex';
    });

    // Opcional: Cierra el modal si se hace clic fuera del formulario
    window.addEventListener('click', function(event) {
        if (event.target === modalContainer) {
            modalContainer.style.display = 'none';
        }
    });
});



window.addEventListener('DOMContentLoaded', () => {
    // Obtener los datos del usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        // Actualizar el nombre y el correo electrónico en el perfil
        document.getElementById('profile-name').textContent = user.nombre;
        document.getElementById('profile-email').textContent = `@${user.email.split('@')[0]}`;
        
        // Aquí puedes agregar lógica para actualizar la foto de perfil si tienes una URL almacenada en el `user` objeto
        // Por ejemplo, si `user.photo` tuviera la URL de la foto:
        // document.getElementById('profile-photo').src = user.photo;
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Obtén la información del usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Selecciona el formulario de creación de publicaciones
    const createPostForm = document.getElementById('create-post-form');

    // Selecciona el div con la clase .left
    const sidebar = document.querySelector('.sidebar');

    // Selecciona el botón con id `open-modal`
    const openModalBtn = document.getElementById('open-modal');

    // Verifica si el usuario existe
    if (!user) {
        // Oculta el formulario de creación de publicaciones si no hay usuario
        if (createPostForm) {
            createPostForm.style.display = 'none';
        }


        // Oculta el div con la clase .left si no hay usuario
        if (sidebar) {
            sidebar.style.display = 'none';
        }

        // Muestra el botón de iniciar sesión o registrarse si no hay usuario
        if (openModalBtn) {
            openModalBtn.style.display = 'block';
        }
    } else {
        // Oculta el botón de iniciar sesión o registrarse si hay usuario
        if (openModalBtn) {
            openModalBtn.style.display = 'none';
        }
    }
});
