auth.onAuthStateChanged((user) => {
    if (!user || user.email !== ADMIN_EMAIL) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('adminEmailDisplay').textContent = user.email;
        loadClients();
    }
});

function logoutAdmin() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}

function loadClients() {
    const tbody = document.getElementById('clientsTableBody');
    tbody.innerHTML = '<tr><td colspan="5" class="empty">Загрузка...</td></tr>';

    db.collection('clients').orderBy('name').get()
        .then((snapshot) => {
            const clients = [];
            snapshot.forEach((doc) => {
                clients.push({ id: doc.id, ...doc.data() });
            });

            document.getElementById('totalClients').textContent = clients.length;

            if (clients.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="empty">Нет клиентов</td></tr>';
                return;
            }

            let html = '';
            clients.forEach((client) => {
                html += `
                    <tr>
                        <td><span class="tag-id">${client.id}</span></td>
                        <td>${client.name || '—'}</td>
                        <td>${client.carModel || '—'}</td>
                        <td>${client.phone || '—'}</td>
                        <td><button class="btn-delete" onclick="deleteClient('${client.id}')">Удалить</button></td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        })
        .catch(() => {
            tbody.innerHTML = '<tr><td colspan="5" class="empty">Ошибка загрузки</td></tr>';
        });
}

function deleteClient(clientId) {
    if (!confirm(`Удалить клиента ${clientId}?`)) return;
    db.collection('clients').doc(clientId).delete()
        .then(() => loadClients())
        .catch(() => alert('Ошибка удаления'));
}

function openAddModal() {
    document.getElementById('addModal').classList.add('active');
    document.getElementById('addError').classList.remove('show');
}

function closeAddModal() {
    document.getElementById('addModal').classList.remove('active');
    document.getElementById('inputTagId').value = '';
    document.getElementById('inputName').value = '';
    document.getElementById('inputCarModel').value = '';
    document.getElementById('inputPhone').value = '';
}

document.getElementById('addModal').addEventListener('click', function(e) {
    if (e.target === this) closeAddModal();
});

function addClient() {
    const tagId = document.getElementById('inputTagId').value.trim();
    const name = document.getElementById('inputName').value.trim();
    const carModel = document.getElementById('inputCarModel').value.trim();
    const phone = document.getElementById('inputPhone').value.trim();
    const errorEl = document.getElementById('addError');

    if (!tagId || !name || !carModel || !phone) {
        errorEl.textContent = 'Заполните все поля!';
        errorEl.classList.add('show');
        return;
    }

    db.collection('clients').doc(tagId).set({ name, carModel, phone })
        .then(() => {
            closeAddModal();
            loadClients();
        })
        .catch((error) => {
            errorEl.textContent = 'Ошибка: ' + error.message;
            errorEl.classList.add('show');
        });
}
