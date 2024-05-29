// Функція для встановлення розміру ключа
function selectKeySize(size) {
    var keyInput = document.getElementById("key");
    keyInput.value = ''; // Очищення поля ключа

    // Підсвічування обраної кнопки
    var keyButtons = document.querySelectorAll(".key-button");
    keyButtons.forEach(function(button) {
        if (parseInt(button.dataset.size) === size) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });

    // Встановлення максимальної довжини ключа відповідно до розміру
    if (size === 128) {
        keyInput.maxLength = 16;
    } else if (size === 192) {
        keyInput.maxLength = 24;
    } else if (size === 256) {
        keyInput.maxLength = 32;
    }
}

// Функція для генерації випадкового ключа
function generateKey(length) {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Функція для генерації ключа відповідно до розміру на кнопці
function generateKeyAutomatically() {
    var keySize = parseInt(document.querySelector('.key-button.selected').getAttribute('data-size'));
    var key = generateKey(keySize / 8);
    document.getElementById("key").value = key;
}

// Функція для шифрування файлу
function encryptFile(file, key) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var plaintext = event.target.result;
        var encrypted = CryptoJS.AES.encrypt(plaintext, key).toString();
        var encryptedBlob = new Blob([encrypted], { type: 'text/plain' });
        var encryptedFileName = file.name + '.encrypted';
        downloadFile(encryptedBlob, encryptedFileName);
    };
    reader.readAsText(file);
}

// Функція для дешифрування файлу
function decryptFile(file, key) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var ciphertext = event.target.result;
        var decrypted = CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
        var decryptedBlob = new Blob([decrypted], { type: 'text/plain' });
        var decryptedFileName = file.name.replace('.encrypted', '');
        downloadFile(decryptedBlob, decryptedFileName);
    };
    reader.readAsText(file);
}

// Функція для завантаження файлу
function downloadFile(blob, filename) {
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Функція для шифрування файлу після натискання кнопки
function encryptFileHandler() {
    var fileInput = document.getElementById('file-input');
    var file = fileInput.files[0];
    var key = document.getElementById('key').value;
    encryptFile(file, key);
}

// Функція для дешифрування файлу після натискання кнопки
function decryptFileHandler() {
    var fileInput = document.getElementById('file-input');
    var file = fileInput.files[0];
    var key = document.getElementById('key').value;
    decryptFile(file, key);
}
