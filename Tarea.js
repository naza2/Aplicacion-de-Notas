const addContainer = document.getElementById('addContainer');
    const colorMenuMenu = document.getElementById('colorMenu');
    const colorDots = document.querySelectorAll('.color-dot');
    const notesContainer = document.getElementById('notesContainer');
    const searchInput = document.getElementById('search');

    // Cargar notas desde localStorage
    let notes = JSON.parse(localStorage.getItem('docketNotes')) || [];

    // Renderizar todas las notas
    function renderNotes() {
      notesContainer.innerHTML = '';
      const query = searchInput.value.toLowerCase();

      const filteredNotes = notes.filter(note => 
        note.text.toLowerCase().includes(query)
      );

      if (filteredNotes.length === 0) {
        notesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #aaa; font-style: italic;">No hay notas que coincidan.</p>';
        return;
      }

      filteredNotes.forEach((note, index) => {
        const noteEl = document.createElement('div');
        noteEl.className = 'note';
        noteEl.style.background = note.color;

        const date = new Date(note.date).toLocaleDateString('es-MX', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });

        noteEl.innerHTML = `
          <p contenteditable="false">${note.text || 'New Note'}</p>
          <span class="date">${date}</span>
          <div class="actions">
            <button class="fav-btn ${note.favorite ? 'active' : ''}">${note.favorite ? '★' : '☆'}</button>
            <button class="delete-btn">🗑</button>
          </div>
        `;

        // Editar al hacer clic
        const p = noteEl.querySelector('p');
        p.addEventListener('click', () => {
          if (!noteEl.classList.contains('editing')) {
            noteEl.classList.add('editing');
            p.contentEditable = true;
            p.focus();
          }
        });

        // Guardar al presionar Enter o perder foco
        p.addEventListener('blur', () => {
          noteEl.classList.remove('editing');
          p.contentEditable = false;
          const newText = p.textContent.trim();
          if (newText === '') p.textContent = 'New Note';
          notes[notes.indexOf(note)].text = p.textContent;
          saveNotes();
        });

        p.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            p.blur();
          }
        });

        // Favoritos
        const favBtn = noteEl.querySelector('.fav-btn');
        favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          note.favorite = !note.favorite;
          favBtn.classList.toggle('active');
          saveNotes();
        });

        // Eliminar
        const deleteBtn = noteEl.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          noteEl.style.transform = 'scale(0.8)';
          noteEl.style.opacity = '0';
          setTimeout(() => {
            notes = notes.filter(n => n !== note);
            saveNotes();
            renderNotes();
          }, 300);
        });

        notesContainer.appendChild(noteEl);
      });
    }

    // Guardar en localStorage
    function saveNotes() {
      localStorage.setItem('docketNotes', JSON.stringify(notes));
    }

    // Crear nueva nota
    function crearNota(color) {
      const newNote = {
        id: Date.now(),
        text: 'New Note',
        color: color,
        date: new Date().toISOString(),
        favorite: false
      };
      notes.unshift(newNote);
      saveNotes();
      renderNotes();
    }

    // Mostrar menú de colores
    addContainer.addEventListener('mouseenter', () => {
      colorMenu.classList.add('active');
    });

    colorMenu.addEventListener('mouseenter', () => {
      colorMenu.classList.add('active');
    });

    addContainer.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!colorMenu.matches(':hover') && !addContainer.matches(':hover')) {
          colorMenu.classList.remove('active');
        }
      }, 150);
    });

    colorMenu.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!addContainer.matches(':hover') && !colorMenu.matches(':hover')) {
          colorMenu.classList.remove('active876');
        }
      }, 150);
    });

    // Seleccionar color
    colorDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const color = dot.getAttribute('data-color');
        crearNota(color);
        colorMenu.classList.remove('active');
      });
    });

    // Búsqueda en tiempo real
    searchInput.addEventListener('input', renderNotes);

    // Inicializar
    renderNotes();
