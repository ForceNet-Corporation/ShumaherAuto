function getTagIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function loadCarData() {
    const tagId = getTagIdFromURL();
    const list = document.getElementById('carList');

    if (!tagId) {
        list.innerHTML = '<li>Отсканируйте NFC-метку</li>';
        return;
    }

    list.innerHTML = '<li>Загрузка...</li>';

    db.collection('clients').doc(tagId).get()
        .then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                list.innerHTML = `
                    <li><strong>Владелец:</strong> ${data.name || 'Не указано'}</li>
                    <li><strong>Автомобиль:</strong> ${data.carModel || 'Не указано'}</li>
                    <li><strong>Телефон:</strong> ${data.phone || 'Не указан'}</li>
                    <li><strong>Метка:</strong> ${tagId}</li>
                `;
            } else {
                list.innerHTML = `<li>Клиент с меткой ${tagId} не найден</li>`;
            }
        })
        .catch(() => {
            list.innerHTML = '<li>Ошибка загрузки данных</li>';
        });
}

function openLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('loginError').classList.remove('show');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginError').classList.remove('show');
}

document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === this) closeLoginModal();
});

function loginAdmin() {
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('loginError');

    if (!email || !password) {
        errorEl.textContent = 'Заполните все поля!';
        errorEl.classList.add('show');
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            if (userCredential.user.email === ADMIN_EMAIL) {
                window.location.href = 'admin-panel.html';
            } else {
                auth.signOut();
                errorEl.textContent = 'Доступ только для администратора!';
                errorEl.classList.add('show');
            }
        })
        .catch((error) => {
            let msg = error.message;
            if (msg.includes('user-not-found')) msg = 'Пользователь не найден';
            else if (msg.includes('wrong-password')) msg = 'Неверный пароль';
            errorEl.textContent = msg;
            errorEl.classList.add('show');
        });
}

document.addEventListener('DOMContentLoaded', loadCarData);
