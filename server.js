const {processarFrases} = require('./scriptQuenia.js')
const express = require('express');
const app = express();
const porta = 3000;

app.use(express.json()); // Middleware para analisar JSON

app.post('/processar', (req, res) => {
    const dados = req.body;

    // Preparar três arrays
    const grupo1 = [];
    const grupo2 = [];
    const grupo3 = [];
    //preparar PWeights
    let p_weight1 = 0;
    let p_weight2 = 0;
    let p_weight3 = 0;
    let p_weight4 = 0;
    //numero para somar ao weight
    let numeroSoma = 0;
    // Percorrer cada entrada no objeto JSON
    for (const [numeroStr, letra] of Object.entries(dados)) {
        const numero = parseInt(numeroStr);
        if(numero > 100){
            if(letra === 'A'){numeroSoma = 1;}
            else if(letra === 'B'){numeroSoma = 2;}
            else if(letra === 'C'){numeroSoma = 3;}
            else if(letra === 'D'){numeroSoma = 4;}
            else if(letra === 'E'){numeroSoma = 5;}
            if(numero > 100 && numero <= 111){
                p_weight1 += numeroSoma;
            } else if(numero > 112 && numero <= 123){
                p_weight2 += numeroSoma;
            } else if(numero > 123 && numero <= 128){
                p_weight3 += numeroSoma;
            } else if(numero > 128 && numero <= 133){
                p_weight4 += numeroSoma;
            } else continue;
        }
        if (letra === 'D' || letra ==='E') {
            grupo1.push(numero);
        } else if (letra === 'A' || letra === 'F') {
            grupo2.push(numero);
        } else if (letra === 'B' || letra ==='C') {
            grupo3.push(numero);
        }
    }
    
    processarFrases('quenia perguntas.txt', 'devolutiva.html',grupo1,grupo2,grupo3,p_weight1,p_weight2,p_weight3,p_weight4);
    res.sendStatus(200); // Resposta provisória
});

app.listen(porta, () => {
    console.log(`API ouvindo em http://localhost:${porta}`);
});
