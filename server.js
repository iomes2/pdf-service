const express = require('express');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;

const app = express();
app.use(express.json());

app.post('/generate-pdf', async (req, res) => {
  try {
    const { data, atividades, atrasos, recursos } = req.body;

    // Carregar o template PDF
    const pdfBytes = await fs.readFile('template.pdf');
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();

    // Preencher os campos (ajuste os nomes dos campos conforme o template)
    // Se o PDF não tiver campos de formulário, usaremos drawText (veja a nota abaixo)
    form.getTextField('data').setText(data || '');
    form.getTextField('atividades').setText(atividades || '');
    form.getTextField('atrasos').setText(atrasos || '');
    form.getTextField('recursos').setText(recursos || '');

    // Salvar o PDF preenchido
    const pdfBytesFilled = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytesFilled).toString('base64');

    res.json({ pdf: pdfBase64 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));