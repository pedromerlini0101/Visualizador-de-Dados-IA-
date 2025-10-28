function doGet() {
  // Define o tipo de resposta como JSON
  return ContentService.createTextOutput(JSON.stringify(getSheetData()))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheetData() {
  // Acessa a planilha ativa
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Dados');  // Nome correto da aba
  
  if (!sheet) {
    throw new Error('Aba "Dados" não encontrada!');
  }

  // Lê os dados a partir da linha 2 (ignorando os cabeçalhos)
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  
  // Verifica se há dados
  if (lastRow <= 1 || lastColumn <= 0) {
    return [];
  }

  const data = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();

  // Retorna os dados como array de objetos JSON
  const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  
  return data.map(function(row) {
    let obj = {};
    for (let i = 0; i < row.length; i++) {
      obj[headers[i]] = row[i];
    }
    return obj;
  });
}

function doPost(e) {
  try {
    // Parsea os dados recebidos (JSON)
    var data = JSON.parse(e.postData.contents);

    // Acessa a planilha ativa
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Dados');  // Nome da aba

    // Verifica se a planilha existe
    if (!sheet) {
      throw new Error('Aba "Dados" não encontrada!');
    }

    // Adiciona os dados na planilha (linha 2 para baixo)
    sheet.appendRow([new Date(), data.sensor, data.value, data.note]);

    // Retorna uma resposta de sucesso
    return ContentService.createTextOutput(
      JSON.stringify({status: "success"})
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Se houver erro, retorna uma resposta de erro
    return ContentService.createTextOutput(
      JSON.stringify({status: "error", message: err.toString()})
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
