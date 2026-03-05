const popupOverlay = document.getElementById("popupOverlayInicial");
const fecharBtn = document.getElementById("fecharPopup");
const checkBox = document.getElementById("naoMostrarMais");
const menu = document.getElementById("menu-1");
menu.style.display = "none";
const jaViuPopup = localStorage.getItem("popupVisto");

const tituloMenu = document.querySelector(".titulo-menu");
const texto = "Crônicas de Faspasol";
let index = 0;

function playMenuMusic(){
    const menuMusic = document.getElementById("menuMusic");
    menuMusic.volume = 0.5;
    menuMusic.play();
    menuMusic.loop = true;
}

function showMenu() {
    const butoesMenu = document.querySelectorAll(".butoes-menu button");
    let delay = 0;
    butoesMenu.forEach((botao) => {
        setTimeout(() => {
            botao.style.display = "block";
            botao.style.opacity = "1";
            botao.style.pointerEvents = "auto";
        }, delay);
        delay += 200;
    });
}

function typeWriter() {
    if (index < texto.length) {
        tituloMenu.innerHTML += texto.charAt(index);
        index++;
        setTimeout(typeWriter, 150);
    } else {
        showMenu();
    }
}

if (jaViuPopup) {
    console.log("popup inicial negado");
    popupOverlay.style.display = "none";
    menu.style.display = "block";
    typeWriter();
    setTimeout(() => {
        menu.style.opacity = "1";
        playMenuMusic();
    }, 50);
}

fecharBtn.addEventListener("click", () => {
    if (checkBox.checked) {
        localStorage.setItem("popupVisto", "true");
    }
    popupOverlay.style.display = "none";
    menu.style.display = "block";
    typeWriter();
    setTimeout(() => {
        menu.style.opacity = "1";
        playMenuMusic();
    }, 50);
});