// API Base URL
const API_URL = '/beleške';

// State
let currentEditingId = null;

// DOM Elements
const noteForm = document.getElementById('note-form');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const notesList = document.getElementById('notes-list');
const notesCount = document.getElementById('notes-count');
const formTitle = document.getElementById('form-title');

// Event Listeners
noteForm.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', resetForm);

// Inicijalizacija
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});

// Funkcija za učitavanje svih beleški
async function loadNotes() {
    try {
        showLoading();
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Greška pri učitavanju beleški');
        }
        
        const notes = await response.json();
        displayNotes(notes);
        updateNotesCount(notes.length);
    } catch (error) {
        console.error('Greška:', error);
        showError('Greška pri učitavanju beleški');
        notesList.innerHTML = '<div class="error-message">Greška pri učitavanju beleški</div>';
    }
}

// Funkcija za prikazivanje beleški
function displayNotes(notes) {
    if (notes.length === 0) {
        notesList.innerHTML = `
            <div class="empty-state">
                <p>Nema beleški. Kreiraj prvu!</p>
            </div>
        `;
        return;
    }

    notesList.innerHTML = notes.map(note => `
        <div class="note-card" data-id="${note.id}">
            <div class="note-header">
                <div class="note-title">${escapeHtml(note.title)}</div>
            </div>
            <div class="note-content">${escapeHtml(note.content)}</div>
            <div class="note-footer">
                <div class="note-date">
                    Kreirano: ${formatDate(note.createdAt)}<br>
                    ${note.updatedAt !== note.createdAt ? `Ažurirano: ${formatDate(note.updatedAt)}` : ''}
                </div>
                <div class="note-actions">
                    <button class="btn btn-edit" onclick="editNote('${note.id}')">
                        ✏️ Izmeni
                    </button>
                    <button class="btn btn-danger" onclick="deleteNote('${note.id}')">
                        🗑️ Obriši
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Funkcija za kreiranje/ažuriranje beleške
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    
    if (!title || !content) {
        showError('Naslov i sadržaj su obavezni');
        return;
    }
    
    try {
        const noteData = { title, content };
        let response;
        
        if (currentEditingId) {
            // Ažuriranje postojeće beleške
            response = await fetch(`${API_URL}/${currentEditingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(noteData)
            });
        } else {
            // Kreiranje nove beleške
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(noteData)
            });
        }
        
        if (!response.ok) {
            throw new Error('Greška pri čuvanju beleške');
        }
        
        const savedNote = await response.json();
        showSuccess(currentEditingId ? 'Beleška je uspešno ažurirana!' : 'Beleška je uspešno kreirana!');
        
        resetForm();
        loadNotes();
    } catch (error) {
        console.error('Greška:', error);
        showError('Greška pri čuvanju beleške');
    }
}

// Funkcija za brisanje beleške
async function deleteNote(id) {
    if (!confirm('Da li ste sigurni da želite da obrišete ovu belešku?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Greška pri brisanju beleške');
        }
        
        showSuccess('Beleška je uspešno obrisana!');
        loadNotes();
    } catch (error) {
        console.error('Greška:', error);
        showError('Greška pri brisanju beleške');
    }
}

// Funkcija za editovanje beleške
async function editNote(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error('Greška pri učitavanju beleške');
        }
        
        const note = await response.json();
        
        // Popuni formu sa podacima beleške
        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
        currentEditingId = note.id;
        
        // Promeni UI
        formTitle.textContent = 'Izmeni Belešku';
        submitBtn.textContent = 'Sačuvaj Izmene';
        cancelBtn.style.display = 'block';
        
        // Scroll do forme
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Greška:', error);
        showError('Greška pri učitavanju beleške');
    }
}

// Funkcija za resetovanje forme
function resetForm() {
    noteForm.reset();
    currentEditingId = null;
    formTitle.textContent = 'Nova Beleška';
    submitBtn.textContent = 'Sačuvaj';
    cancelBtn.style.display = 'none';
}

// Funkcija za ažuriranje brojača beleški
function updateNotesCount(count) {
    notesCount.textContent = count;
}

// Funkcija za formatiranje datuma
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('sr-RS', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Funkcija za escape HTML (za bezbednost)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Funkcija za prikazivanje loading stanja
function showLoading() {
    notesList.innerHTML = '<div class="loading">Učitavanje...</div>';
}

// Funkcija za prikazivanje poruke o uspehu
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(successDiv, container.firstChild);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Funkcija za prikazivanje poruke o grešci
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Eksportuj funkcije za globalni pristup
window.editNote = editNote;
window.deleteNote = deleteNote;


