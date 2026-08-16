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

document.addEventListener('DOMContentLoaded', loadCarData);
