const fs = require('fs');
//esses arrays serão preechidos com informaçoes coletadas de um modo a ser definido nas proximas atividades

function processarFrases(caminhoEntrada, caminhoSaida, array1, array2, array3, p_weight1, p_weight2, p_weight3, p_weight4) {
    // Lê o arquivo de entrada
    const conteudoArquivo = fs.readFileSync(caminhoEntrada, 'utf-8');

    // Cria um mapa: número -> frase
    const mapaFrases = {};
    const regex = /(\d+)\.\s([^;]+);/g;
    let match;
    while ((match = regex.exec(conteudoArquivo)) !== null) {
        const numero = parseInt(match[1]);
        const frase = match[2].trim();
        mapaFrases[numero] = frase;
    }
    // HTML foi escolhida como estrutura intermediaria da devolutiva pela sua facil construção para fins de ser lido por um humano
    // será convertido a PDF futuramente para ser entregue como arquivo pessoal do cliente
    // Começa estrutura HTML
    let htmlSaida = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Frases</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
        h2 { color: #333366; }
        p { margin-left: 20px; }
    </style>
</head>
<body>
    <h1>Mapa do Comportamento Alimentar</h1>
`;
    htmlSaida += `<h2>1. Ola!</h2>
    <p>Que bom que você dedicou um tempo para responder ao nosso mapeamento
comportamental.<br> Esse é um passo valioso no caminho para compreender com
mais profundidade sua relação com o peso, a alimentação e as emoções.</p>
    `;
    htmlSaida += `<h2>2. Estágios de Prontidão - Eat Behavior Plan</h2>
    <p>Cada comportamento alimentar está em uma fase diferente de prontidão para
mudança.<br> Reconhecer isso é essencial para direcionar seus esforços com mais
clareza e leveza.<br> Respeitar o tempo de mudança é uma das atitudes mais
importantes para evitar frustração e promover resultados duradouros.</p>
    `;
    // Seção 1
    htmlSaida += `<h3>Isto é o que você deve manter</h3>\n`;
    for (let numero of array1) {
        if (mapaFrases[numero]) {
            htmlSaida += `<p>${mapaFrases[numero]}</p>\n`;
        }
    }

    // Seção 2
    htmlSaida += `<h3>Isto é o que você talvez ainda não esteja pronto para mudar</h3>\n`;
    for (let numero of array2) {
        if (mapaFrases[numero]) {
            htmlSaida += `<p>${mapaFrases[numero]}</p>\n`;
        }
    }

    // Seção 3
    htmlSaida += `<h3>Isto é o que você pode mudar</h3>\n`;
    for (let numero of array3) {
        if (mapaFrases[numero]) {
            htmlSaida += `<p>${mapaFrases[numero]}</p>\n`;
        }
    }
    const percent_emocional = (p_weight1/55)*100;
    const percent_acao = (p_weight2/60)*100;
    const percent_ambiente = (p_weight3/25)*100;
    const percent_peso = (p_weight4/25)*100;

    htmlSaida += `<h2>3. P-Weight - Processos Cognitivos e Emocionais</h2>
    <p>A escala P-Weight avalia quanto você utiliza recursos internos e sociais no
processo de emagrecimento. suas respostas deram um valor de:<br>
${percent_ambiente}% para suporte ambiental<br>
${percent_emocional}% para reavaliação emocional<br>
${percent_acao}% para escore de ação, que indica o quanto voce está disposto a colocar em pratica<br>
${percent_peso}% para a sua preucupação com as consequencias do excesso de peso<br>
</p>
    `;
    // Fecha HTML
    htmlSaida += `</body>\n</html>`;

    // Escreve no arquivo de saída
    fs.writeFileSync(caminhoSaida, htmlSaida.trim());
}
module.exports = {processarFrases};

