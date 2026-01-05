// --- VARIÁVEIS GLOBAIS ---
let levelUpTriggered = false;
const xpFill = document.getElementById('xpFill');
const audio = document.getElementById('levelupSound');
const overlay = document.getElementById('levelupOverlay');
const finalGiftSection = document.getElementById('finalGiftSection');
const body = document.body;

// --- 1. LÓGICA DA BARRA DE XP E LEVEL UP AO ROLAR ---
window.addEventListener('scroll', () => {
    // Calcula a porcentagem de rolagem
    const scrollTop = window.scrollY;
    const docHeight = document.body.offsetHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = scrollTop / (docHeight - winHeight);
    
    // Atualiza a largura da barra de XP (máximo 100%)
    let fillPercentage = Math.min(scrollPercent * 100, 100);
    xpFill.style.width = fillPercentage + '%';

    // Verifica se chegou perto do final (95%+) e se ainda não ativou o level up
    if (scrollPercent > 0.95 && !levelUpTriggered) {
        triggerLevelUp();
    }
});

function triggerLevelUp() {
    levelUpTriggered = true;
    
    // 1. Toca o som (requer interação prévia do usuário na maioria dos navegadores, 
    // mas como ele já rolou a página, deve funcionar)
    audio.volume = 0.5; // Volume a 50% para não estourar o ouvido
    audio.play().catch(e => console.log("Áudio bloqueado pelo navegador até interação."));

    // 2. Mostra o Overlay Gigante
    overlay.classList.remove('hidden');

    // 3. Muda o tema do site (cores douradas)
    body.classList.add('theme-levelup');
}

// Função para fechar o overlay e mostrar a loot box final
function closeOverlay() {
    overlay.classList.add('hidden');
    // Revela a seção final que estava escondida
    finalGiftSection.classList.add('reveal-loot');
    // Rola suavemente até a loot box
    finalGiftSection.scrollIntoView({ behavior: 'smooth' });
}


// --- 2. INTERSECTION OBSERVER (Animação de entrada dos cards) ---
const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

const hiddenElements = document.querySelectorAll('.timeline-item:not(.hidden-at-start)');
hiddenElements.forEach((el) => observer.observe(el));


// --- 3. LÓGICA DA LOOT BOX (Abrir e Copiar) ---
const locker = document.getElementById('giftLocker');
const revealedSection = document.getElementById('giftRevealed');

locker.addEventListener('click', () => {
    locker.style.transform = "scale(0.9)";
    setTimeout(() => {
        locker.classList.add('unlocked');
        revealedSection.classList.remove('hidden');
    }, 200);
});

function copyCode() {
    const codeText = document.getElementById("giftCode").innerText;
    const btn = document.getElementById("copyBtn");

    navigator.clipboard.writeText(codeText).then(() => {
        btn.innerText = "COPIADO! ✅";
        btn.style.backgroundColor = "#00ff88";
        btn.style.color = "#000";
        btn.style.boxShadow = "none";
        setTimeout(() => {
            btn.innerText = "COPIAR";
            btn.style.backgroundColor = "";
            btn.style.color = "";
            btn.style.boxShadow = "";
        }, 2000);
    });
}