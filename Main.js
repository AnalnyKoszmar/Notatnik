// Inicjalizacja elementów DOM
const noteNameInput = document.getElementById('note-name');
const noteContent = document.getElementById('note-content');
const saveButton = document.getElementById('save-btn');
const notesList = document.getElementById('notes-list');
const deleteButton = document.getElementById('delete-btn');
const cancelDeleteButton = document.getElementById('cancel-delete-btn');
const deleteConfirmModal = document.getElementById('delete-confirm-modal');

let noteToDelete = null;

// Funkcja do zapisu notatki do Firebase
function saveNote() {
  const name = noteNameInput.value.trim();
  const content = noteContent.value;

  if (!name) {
    alert('Podaj nazwę notatki');
    return;
  }

  firebase.database().ref('notes/' + name).set({
    content: content
  });
}

// Funkcja do usuwania notatki z Firebase
function deleteNote() {
  if (!noteToDelete) return;

  firebase.database().ref('notes/' + noteToDelete).remove();
  noteToDelete = null;
  hideDeleteConfirm();
  clearNoteEditor();
}

// Funkcja do wyświetlania modala z potwierdzeniem usunięcia
function showDeleteConfirm(noteName) {
  noteToDelete = noteName;
  deleteConfirmModal.style.display = 'flex';
  // Dodaj rozmycie tła, jeśli chcesz, np. przez klasę CSS
  document.body.classList.add('blurred-background');
}

// Funkcja do ukrywania modala
function hideDeleteConfirm() {
  deleteConfirmModal.style.display = 'none';
  document.body.classList.remove('blurred-background');
}

// Czyszczenie pola edycji notatki
function clearNoteEditor() {
  noteNameInput.value = '';
  noteContent.value = '';
}

// Nasłuch na kliknięcie zapisu
saveButton.addEventListener('click', saveNote);

// Nasłuch na kliknięcie usuwania — wyświetla modal
deleteButton.addEventListener('click', () => {
  const name = noteNameInput.value.trim();
  if (!name) return;
  showDeleteConfirm(name);
});

// Nasłuch na kliknięcie anulowania usuwania
cancelDeleteButton.addEventListener('click', hideDeleteConfirm);

// Nasłuch na potwierdzenie usunięcia
document.getElementById('confirm-delete-btn').addEventListener('click', deleteNote);

// Nasłuchujemy zmian w Firebase i aktualizujemy listę notatek na stronie
firebase.database().ref('notes').on('value', (snapshot) => {
  const notes = snapshot.val() || {};
  notesList.innerHTML = '';

  for (let key in notes) {
    const li = document.createElement('li');
    li.textContent = key;
    li.addEventListener('click', () => {
      noteNameInput.value = key;
      noteContent.value = notes[key].content;
    });
    notesList.appendChild(li);
  }
});
