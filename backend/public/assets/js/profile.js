/*
* profile.js
*/

// サムネイル画像表示
const target = document.getElementById('profile-file');
window.addEventListener('DOMContentLoaded', function() {
target.addEventListener('change', function (e) {
    const file = e.target.files[0]
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.getElementById("profile-file-preview")
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
}, false);
}, false);