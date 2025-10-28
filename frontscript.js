document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('questionarioForm');

    formulario.addEventListener('submit', async (event) => {
        // Previne o envio padrão do formulário, que recarregaria a página
        event.preventDefault();

        // Cria um objeto para armazenar os dados do formulário
        const dados = {};
        
        // Seleciona todos os inputs do tipo 'radio' no formulário
        const radios = formulario.querySelectorAll('input[type="radio"]');

        // Itera sobre os botões de rádio e coleta os valores selecionados
        radios.forEach(radio => {
            if (radio.checked) {
                // A chave do objeto será o 'name' do input (o número da pergunta)
                // O valor será o 'value' do input ('Sim' ou 'Não')
                dados[radio.name] = radio.value;
            }
        });

        console.log("Dados coletados para envio:", dados);

        try {
            // Envia os dados para o back-end usando a API Fetch
            const resposta = await fetch('https://healthdiet.onrender.com:3000/processar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados),
            });

            // Verifica se a resposta do servidor foi bem-sucedida (status 200 OK)
            if (resposta.ok) {
                // Se o envio foi um sucesso, redireciona o usuário para a página de devolutiva
                alert('Respostas enviadas com sucesso! Redirecionando para a devolutiva...');
                window.location.href = 'devolutiva.html'; 
            } else {
                // Se houve um erro no servidor, exibe uma mensagem
                alert('Erro ao enviar o formulário. Por favor, tente novamente.');
            }
        } catch (erro) {
            // Captura erros de rede ou de comunicação
            console.error('Erro de comunicação com o servidor:', erro);
            alert('Não foi possível conectar ao servidor. Verifique se ele está rodando.');
        }
    });
});

