function fadeOut(audio, callback) {
  let v = audio.volume;
  const i = setInterval(() => {
    v -= 0.02;
    if (v <= 0) {
      audio.pause();
      audio.currentTime = 0;
      clearInterval(i);
      if (callback) callback();
    } else {
      audio.volume = v;
    }
  }, 80);
}

function fadeIn(audio, max = 0.4) {
  audio.volume = 0;
  audio.play();
  let v = 0;
  const i = setInterval(() => {
    v += 0.02;
    if (v >= max) {
      audio.volume = max;
      clearInterval(i);
    } else {
      audio.volume = v;
    }
  }, 80);
}


// CLASSE //

class Cena {
    constructor(cenaSelector, speed = 30) {
        this.container = document.querySelector(cenaSelector);
        this.narracao = Array.from(this.container.querySelectorAll('.narracao'));
        this.mensagens = Array.from(this.container.querySelectorAll('.mensagem'));
        this.indexNarracao = 0;
        this.indexMensagem = 0;
        this.speed = speed;
        this.isTyping = false;
        this.timeout = null;

        console.log("Cena iniciada:", cenaSelector);

        // Limpa narracao e mensagens
        this.narracao.forEach(p => {
            p.dataset.texto = p.textContent;
            p.textContent = '';
        });
        this.mensagens.forEach(m => {
            m.style.opacity = 0;
            m.style.pointerEvents = 'none';
        });


        // Musica
        this.music = this.container.querySelector('audio');
        console.log(this.music);
        if (this.music) fadeIn(this.music, 0.4);
        
        this.container.querySelectorAll('.next-scene').forEach(btn => {
            btn.addEventListener('click', (e) => this.nextScene(e));
    })

        document.addEventListener('click', () => this.next());
        this.typeNext();
    }

    typeNext() {
        if (this.indexNarracao >= this.narracao.length) return;

        const p = this.narracao[this.indexNarracao];
        const texto = p.dataset.texto;
        let i = 0;
        this.isTyping = true;

        const type = () => {
            if (i < texto.length) {
                p.textContent += texto[i];
                i++;
                this.timeout = setTimeout(type, this.speed);
            } else {
                this.isTyping = false;
            }
        };
        type();

    }

    showMensagem(msg){
        msg.style.opacity = 1;
        msg.style.pointerEvents = 'auto';
    }

    next() {
        if (this.isTyping) {
            // Completa a narracao instantaneamente
            clearTimeout(this.timeout);
            const p = this.narracao[this.indexNarracao];
            p.textContent = p.dataset.texto;
            this.isTyping = false;
        } else if (this.indexNarracao < this.narracao.length - 1) {
            this.indexNarracao++;
            this.typeNext();
        } else if (this.indexMensagem < this.mensagens.length) {
            this.showMensagem(this.mensagens[this.indexMensagem]);
            this.indexMensagem++;
        }
    }

    nextScene(event) {
        event.stopPropagation(); // evita disparar next() ao clicar no botão
        const btn = event.currentTarget;
        const cenaAtual = btn.closest('.cena');
        const proximaCena = cenaAtual.nextElementSibling;

        if (!proximaCena || !proximaCena.classList.contains('cena')) return;

        const musicaAtual = cenaAtual.querySelector('audio');
        const musicaProxima = proximaCena.querySelector('audio');

        // Troca visual
        cenaAtual.classList.remove('ativa');
        proximaCena.classList.add('ativa');

        // Troca música
        if (musicaAtual) {
        fadeOut(musicaAtual, () => {
            if (musicaProxima) fadeIn(musicaProxima, 0.4);
        });
        } else if (musicaProxima) {
        fadeIn(musicaProxima, 0.4);
        }

        // Inicia a cena seguinte
        new Cena(`.cena.ativa`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
  if(document.querySelector('.cena.ativa')){
    new Cena('.cena.ativa', 30);
  }});
