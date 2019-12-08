// Client ID and API key from the Developer Console
var CLIENT_ID = '563495082806-bm7vhcbjlhfehrno3fjhj69mbaqlhoje.apps.googleusercontent.com';
var API_KEY = 'AIzaSyD_gDTleT4TDiv_tzfaDEDrqwaF3cqhSB0';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var sendCodButton = document.getElementById('sendCodId');

var SPREADSHEET_ID = '1nLBX1Y-3P_d-RsuD6IeJ1AEZ26IgCm1rQPhthocagZ0';

function handleClientLoad(callback) {
  gapi.load('client:auth2', callback);
}


function initClient(callback) {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get()
    // Handle the initial sign-in state.
    updateSigninStatus(isSignedIn);
    if (isSignedIn) {
      callback();
    }
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function (error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'none';
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

function updateMeds(data) {
  var str = '';
  for (var i = 0; i < data.length; ++i) {
    str += '<option value="' + data[i] + '" />'; // Storing options in variable
  }
  var meds_list = document.getElementById("medicamentSelection");
  meds_list.innerHTML = str;
}

function updateFormMedName(data) {
  var medName = document.getElementById("medInput").value;
  var seriesNameOptions = document.getElementById("seriesSelection");
  var valDateOptions = document.getElementById("valDateSelection");
  var seriesNameOptionsStr = '';
  var valDateOptionsStr = '';
  var selectedItems = data.filter(function (el) { return el[0] == medName; })
  console.log(selectedItems)

  for (var i = 0; i < selectedItems.length; ++i) {
    seriesNameOptionsStr += `<option selected="selected" hidden></option>`
    seriesNameOptionsStr += `<option value="${selectedItems[i][1]}">${selectedItems[i][1]}</option>`; // Storing options in variable
    valDateOptionsStr += '<option data-option=' + selectedItems[i][1] + ' value="' + selectedItems[i][2] + '" />'; // Storing options in variable
  }

  seriesNameOptions.innerHTML = seriesNameOptionsStr;
  valDateOptions.innerHTML = valDateOptionsStr;
}

function updateFormBarCode(data) {
  var barCode = document.getElementById('bar_code').value;
  var barCodeSelection = document.getElementById('barCodeSelection')
  var barCodeOptionsStr = '';
  var selectedItems = data.filter(function (el) { return el[0] == barCode; });
  console.log(selectedItems.length)
  if (selectedItems.length != 0) {
    barCodeOptionsStr += `<option selected="selected" hidden>Selecione o produto</option>`
    document.getElementById('form-register').style.display = 'none';
  } else {
    document.getElementById('form-register').style.display = 'block';
  }
  for (var i = 0; i < selectedItems.length; ++i) {
    selectedItems[i][1] = typeof selectedItems[i][1] === "undefined" ? '' : selectedItems[i][1];
    selectedItems[i][2] = typeof selectedItems[i][2] === "undefined" ? '' : selectedItems[i][2];
    selectedItems[i][3] = typeof selectedItems[i][3] === "undefined" ? '' : selectedItems[i][3];
    console.log(JSON.stringify(selectedItems))
    barCodeOptionsStr += `<option value='${JSON.stringify(selectedItems[i])}'>${selectedItems[i][1]} \nL: ${selectedItems[i][2]}</option>`;
  }
  var no_items = ['', '', '', '']
  barCodeOptionsStr += `<option value=${JSON.stringify(no_items)}>Produto não cadastrado</option>`;
  barCodeSelection.innerHTML = barCodeOptionsStr;
  updateFormSelectBarCode();

}

function updateFormSelectBarCode() {
  var barCodeSelection = document.getElementById('barCodeSelection').value;
  console.log(barCodeSelection);
  var medInput = document.getElementById('medInput');
  var seriesInput = document.getElementById('seriesInput');
  var valInput = document.getElementById('valInput');
  selectedItem = JSON.parse(barCodeSelection);
  medInput.value = selectedItem[1];
  seriesInput.value = selectedItem[2];
  valInput.value = selectedItem[3];
  document.getElementById('form-register').style.display = 'block';
  if (barCodeSelection == '["","","",""]') {
    medInput.readOnly = false;
    seriesInput.readOnly = false;
    valInput.readOnly = false;
    sendCodButton.style.display = 'block';
  } else {
    medInput.readOnly = true;
    seriesInput.readOnly = true;
    valInput.readOnly = true;
    sendCodButton.style.display = 'none';
  }
}

function valSel() {
  var seriesVal = document.getElementById('seriesInput').value;
  var valForm = document.getElementById('valDateSelection');
  var options = valForm.querySelectorAll('option');
  var valDateInput = document.getElementById('valInput');
  valDateInput.value = '';
  for (var i = 0; i < options.length; i++) {
    if (options[i].dataset.option === seriesVal) {
      valDateInput.value = options[i].value;
    }
  }
}

function insertRowSheet(sheetRange, rowArray, callback) {
  var params = {
    spreadsheetId: SPREADSHEET_ID,
    range: sheetRange,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
  };

  var valueRangeBody = {
    "range": sheetRange,  //Set this to cell want to add 'x' to.
    "majorDimension": "ROWS",
    "values": [rowArray]
  };

  var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
  request.then(function (response) {
    console.log(response.result);
    callback();
  }, function (reason) {
    gapi.auth2.getAuthInstance().signIn();
    alert('error: ' + reason.result.error.message);
  }
  );
}

function getSheet(sheetRange, callback) {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetRange,
  }).then(function (response) {
    var data = response.result;
    if (data.values.length > 0) {
      console.log(data.values)
      callback(data.values);
      return data.values;
    } else {
      alert('Dados não encontrados ' + sheetRange)
      appendPre('No data found.');
    }
  }, function (response) {
    gapi.auth2.getAuthInstance().signIn();
    alert('Erro ao carregar ' + sheetRange)
    appendPre('Error: ' + response.result.error.message);
  });
}

function sendReg() {
  destinations = document.getElementsByName('destinationRadio');
  medName = document.getElementById('medInput').value;
  seriesName = document.getElementById('seriesInput').value;
  valDate = document.getElementById('valInput').value;
  value = document.getElementById('qnt').value;
  var destinationValue = '';
  for (var i = 0, length = destinations.length; i < length; i++) {
   if (destinations[i].checked) {
    destinationValue = destinations[i].value; 
    break;
   }
  }  rowArray = ['SAIDA', dataAtualFormatada(), destinationValue, medName, seriesName, valDate, 0, value];
  info = `
  Destino: ${destinationValue}
  Medicamento: ${medName}
  Lote: ${seriesName} 
  Validade: ${valDate}
  Quantidade: ${value}`
  if (window.confirm(`Por favor confirme os dados de saida e aperte OK 
     ${info} `)) {
    insertRowSheet('Registros!B2:I', rowArray, function () {
      alert('Saida efetuada com sucesso\n' + info)
      window.location.replace("index.html");
    });

  }
}

function sendCod() {
  barCode = document.getElementById('bar_code').value;
  medName = document.getElementById('medInput').value;
  seriesName = document.getElementById('seriesInput').value;
  valDate = document.getElementById('valInput').value;
  rowArray = [barCode, medName, seriesName, valDate];
  info = `Código de barra: ${barCode}
  Medicamento: ${medName}
  Lote: ${seriesName} 
  Validade: ${valDate}`
  if (window.confirm(`Por favor confirme os dados de saida e aperte OK 
    ${info}`)) {
    insertRowSheet('BarCode!A1:D1', rowArray, function () {
      alert('Código cadastrado com sucesso\n' + info)
      sendCodButton.style.display = 'none';
    });
  }
}

function dataAtualFormatada() {
  var data = new Date(),
    dia = data.getDate().toString(),
    diaF = (dia.length == 1) ? '0' + dia : dia,
    mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
    mesF = (mes.length == 1) ? '0' + mes : mes,
    anoF = data.getFullYear();
  return diaF + "/" + mesF + "/" + anoF;
}

function createTable(tableData, tableId, ignore=[], caption='') {
  var table = document.getElementById(tableId);
  var tableBody = document.createElement('tbody');
  table.innerHTML = '';

  for (var i=0; i<tableData.length; i++) {
    var row = document.createElement('tr');
    var rowData = tableData[i];
    for (var j=0; j<tableData[i].length; j++) {
      var cell = document.createElement('td');
      if(!ignore.includes(j)){
      cell.appendChild(document.createTextNode(tableData[i][j]));
      row.appendChild(cell);}

  }
   tableBody.appendChild(row);

  }
  table.appendChild(tableBody);
  document.body.appendChild(table);
  captionObj = table.createCaption();
  captionObj.innerHTML = caption
}

function sendInventory() {
  medName = document.getElementById('medInput').value;
  seriesName = document.getElementById('seriesInput').value;
  valDate = document.getElementById('valInput').value;
  value = document.getElementById('qnt').value;
  var destinationValue = 'INVENTARIO';
  rowArray = ['ENTRADA', dataAtualFormatada(), destinationValue, medName, seriesName, valDate, value, 0];
  info = `
  Destino: ${destinationValue}
  Medicamento: ${medName}
  Lote: ${seriesName} 
  Validade: ${valDate}
  Quantidade: ${value}`
  if (window.confirm(`Por favor confirme os dados de saida e aperte OK 
     ${info} `)) {
    insertRowSheet('Inventario!B2:I', rowArray, function () {
      alert('Saida efetuada com sucesso\n' + info)
      window.location.replace("inventory-form.html");
    });

  }
}