// Fade out on page load
        window.addEventListener('DOMContentLoaded', function() {
            const fade = document.getElementById('fadeTransition');
            setTimeout(() => {
                fade.classList.add('hide');
            }, 400); // Sedikit delay agar efek lebih terasa
        });

        // Teks mengetik
        const text =
  "Hai teman-teman, ayo kita berpetualang ke laut! Eh, tunggu dulu! Kenapa banyak banget sampah di laut? Gimana kalau kita bantu bersihin lautnya? Yuk, bersama-sama kita bersihkan laut dari sampah supaya ikan-ikan bisa hidup dengan nyaman!";
const typingSpeed = 30; // Kecepatan mengetik (ms per karakter)
let index = 0;

function typeText() {
  if (index < text.length) {
    document.getElementById("typing-text").innerHTML += text.charAt(index);
    index++;
    setTimeout(typeText, typingSpeed);
  } else {
    document.getElementById("next-button").style.display = "block"; // Munculkan tombol
  }
}

window.onload = () => {
  typeText();
};