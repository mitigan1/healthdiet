document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('questionarioForm');

    const urlDoGoogleScript = "https://script.google.com/macros/s/AKfycbxDj0aJTfui6KZ3K6RdsSItztX3NHdnCxaTPxf6DcowAVnlN4RX2NHPk8d6RbrltUop/exec";

    formulario.addEventListener('submit', async (event) => {
        // Previne o envio padrão do formulário, que recarregaria a página
        event.preventDefault();

        // Mostra um feedback para o usuário (opcional, mas bom)
        const botaoSubmit = formulario.querySelector('button[type="submit"]');
        botaoSubmit.disabled = true;
        botaoSubmit.textContent = 'Enviando...';

       // 1. Coletar dados dos radios
        const dadosRadios = {};
        const radios = formulario.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            if (radio.checked) {
                dadosRadios[radio.name] = radio.value;
            }
        });
        const username = 'mitigan1';
        const repo = 'healthdiet';
        const branch = 'main'; // e.g., 'main' or 'master'
        const file_path = 'perguntas.txt'; // e.g., 'data/users.json'

        const url = `raw.githubusercontent.com${username}/${repo}/${branch}/${file_path}`;
        const mapaFrases = {};
        await fetch(url)
        .then((res) => res.text())
        .then((text) => {
            const regex = /(\d+)\.\s([^;]+);/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
        const numero = parseInt(match[1]);
        const frase = match[2].trim();
        mapaFrases[numero] = frase;
        }
        })
        .catch((e) => console.error(e));
        // 2. Calcular os P-Weights
        let p_weight1 = 0;
        let p_weight2 = 0;
        let p_weight3 = 0;
        let p_weight4 = 0;
        let numeroSoma = 0;
        const grupo1 = [];
        const grupo2 = [];
        const grupo3 = [];

        for (const [numeroStr, letra] of Object.entries(dadosRadios)) {
            const numero = parseInt(numeroStr);
            if (numero > 100) {
                if(letra === 'A'){numeroSoma = 1;}
                else if(letra === 'B'){numeroSoma = 2;}
                else if(letra === 'C'){numeroSoma = 3;}
                else if(letra === 'D'){numeroSoma = 4;}
                else if(letra === 'E'){numeroSoma = 5;}
                
                if(numero > 100 && numero <= 111){ p_weight1 += numeroSoma; }
                else if(numero > 111 && numero <= 123){ p_weight2 += numeroSoma; } // Corrigi '112' para '111'
                else if(numero > 123 && numero <= 128){ p_weight3 += numeroSoma; }
                else if(numero > 128 && numero <= 133){ p_weight4 += numeroSoma; }
            }
            else if (letra === 'D' || letra ==='E') {
            grupo1.push(numero);
        } else if (letra === 'A' || letra === 'F') {
            grupo2.push(numero);
        } else if (letra === 'B' || letra ==='C') {
            grupo3.push(numero);
        }
        }
        
        // 3. Criar o objeto de resultados que a 'devolutiva.html' e o GAS esperam
        const resultados = {
            email: dadosRadios['email'] || '',
            mapaFrases: mapaFrases,
            grupo1: grupo1,
            grupo2: grupo2,
            grupo3: grupo3,
            p_weight1: p_weight1,
            p_weight2: p_weight2,
            p_weight3: p_weight3,
            p_weight4: p_weight4
        };
        const resultadosString = JSON.stringify(resultados);

        // --- Fim da lógica ---

        // AÇÃO 1: Salvar no LocalStorage (para a 'devolutiva.html' do paciente ler)
        localStorage.setItem('resultadosDevolutiva', resultadosString);

        try {
            await fetch(urlDoGoogleScript, {
                method: 'POST',
                mode: 'no-cors', // Necessário para evitar erro de CORS
                headers: {
                    'Content-Type': 'application/json',
                },
                body: resultadosString
            });
            // Nota: O 'no-cors' faz com que não saibamos se deu certo, mas o e-mail será enviado.
            // É uma limitação do GAS com 'fetch' simples. Não se preocupe, funciona.
            
        } catch (error) {
            console.error('Erro ao enviar para o Google Script:', error);
            // Mesmo se o e-mail falhar, o paciente segue o fluxo
        }

        // AÇÃO 3: Redirecionar o paciente para a página de devolutiva
        window.location.href = "devolutiva.html";
    });
});
