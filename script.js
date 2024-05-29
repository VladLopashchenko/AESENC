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
function generateKeyFromSelectedSize() {
    var keySize = parseInt(document.querySelector('.key-button.selected').getAttribute('data-size'));
    var key = generateKey(keySize / 8);
    document.getElementById("key").value = key;
}

// Функція для копіювання ключа до буфера обміну
function copyKeyToClipboard() {
    var keyInput = document.getElementById("key");
    keyInput.select();
    keyInput.setSelectionRange(0, 99999); // Для мобільних пристроїв
    document.execCommand("copy");
    var copyMessage = document.getElementById("copy-message");
    copyMessage.innerHTML = "Ключ скопійовано: " + keyInput.value;
    setTimeout(function() {
        copyMessage.innerHTML = "";
    }, 3000); // Видаляємо повідомлення через 3 секунди
}

// Функція для вибору формату виводу
function selectOutputFormat(format) {
    selectedOutputFormat = format;
    // Підсвічування обраної кнопки
    var formatButtons = document.querySelectorAll(".format-button");
    formatButtons.forEach(function(button) {
        if (button.dataset.format === format) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}

// Функція для шифрування тексту
function encrypt() {
    var plaintext = document.getElementById("input-text").value;
    var key = document.getElementById("key").value;

    if (!plaintext || !key) {
        alert("Будь ласка, введіть текст та ключ.");
        return;
    }

    var keySize = parseInt(document.querySelector('.key-button.selected').getAttribute('data-size'));
    if (key.length !== keySize / 8) {
        alert("Неправильна довжина ключа. Очікується " + (keySize / 8) + " символів.");
        return;
    }

    var iv = CryptoJS.lib.WordArray.random(16);
    var encrypted = CryptoJS.AES.encrypt(plaintext, CryptoJS.enc.Utf8.parse(key), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    var result;
    if (selectedOutputFormat === 'Base64') {
        result = CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext));
    } else {
        result = iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Hex
        );
    }

    document.getElementById("output-text").value = result;
}

// Функція для розшифрування тексту
function decrypt() {
    var ciphertext = document.getElementById("ciphertext").value;
    var key = document.getElementById("key-decrypt").value;

    if (!ciphertext || !key) {
        alert("Будь ласка, введіть зашифрований текст та ключ.");
        return;
    }

    var keySize = parseInt(document.querySelector('.key-button.selected').getAttribute('data-size'));
    if (key.length !== keySize / 8) {
        alert("Неправильна довжина ключа. Очікується " + (keySize / 8) + " символів.");
        return;
    }

    var iv;
    var encrypted;
    if (selectedOutputFormat === 'Base64') {
        var rawData = CryptoJS.enc.Base64.parse(ciphertext);
        iv = CryptoJS.lib.WordArray.create(rawData.words.slice(0, 4));
        encrypted = CryptoJS.lib.WordArray.create(rawData.words.slice(4));
    } else {
        iv = CryptoJS.enc.Hex.parse(ciphertext.substring(0, 32));
        encrypted = CryptoJS.enc.Hex.parse(ciphertext.substring(32));
    }

    var decrypted = CryptoJS.AES.decrypt({
        ciphertext: encrypted
    }, CryptoJS.enc.Utf8.parse(key), {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    var plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    document.getElementById("plaintext").value = plaintext;
}
