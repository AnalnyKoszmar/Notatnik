let currentNote = null;
const notesList = document.getElementById('notesList');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const saveBtn = document.getElementById('saveBtn');
const deleteBtn = document.getElementById('deleteBtn');

function loadNotes() {
  notesList.innerHTML = '';
  const notes = JSON.parse(localStorage.getItem('notes')) || {};

  for (const key in notes) {
    const btn = document.createElement('button');
    btn.textContent = key;
    btn.onclick = () => selectNote(key);
    if (key === currentNote) btn.classList.add('active');
    notesList.appendChild(btn);
  }

  updateEditorVisibility();
}

function createNote() {
  const title = noteTitle.value.trim();
  if (!title) return;

  const notes = JSON.parse(localStorage.getItem('notes')) || {};
  if (notes[title]) {
    alert('Notatka o takiej nazwie już istnieje!');
    return;
  }

  notes[title] = '';
  localStorage.setItem('notes', JSON.stringify(notes));
  currentNote = title;
  noteTitle.value = '';
  noteContent.value = '';
  loadNotes();
}

function selectNote(title) {
  const notes = JSON.parse(localStorage.getItem('notes')) || {};
  currentNote = title;
  noteContent.value = notes[title];
  updateEditorVisibility();
  loadNotes();
}

function saveNote() {
  if (!currentNote) return;
  const notes = JSON.parse(localStorage.getItem('notes')) || {};
  notes[currentNote] = noteContent.value;
  localStorage.setItem('notes', JSON.stringify(notes));
}

function deleteNote() {
  if (!currentNote) return;
  const modal = document.getElementById('modalOverlay');
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('modalOverlay');
  modal.style.display = 'none';
}

function confirmDelete() {
  const notes = JSON.parse(localStorage.getItem('notes')) || {};
  delete notes[currentNote];
  localStorage.setItem('notes', JSON.stringify(notes));

  currentNote = null;
  noteContent.value = '';
  updateEditorVisibility();
  loadNotes();
  closeModal();
}

function updateEditorVisibility() {
  const visible = !!currentNote;
  noteContent.style.display = visible ? 'block' : 'none';
  saveBtn.style.display = visible ? 'inline-block' : 'none';
  deleteBtn.style.display = visible ? 'inline-block' : 'none';
  noteContent.disabled = !visible;
  saveBtn.disabled = !visible;
  deleteBtn.disabled = !visible;
}

loadNotes();
