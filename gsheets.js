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

 /**
  *  On load, called to load the auth2 library and API client library.
  */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}


 /**
  *  Initializes the API client library and sets up sign-in state
  *  listeners.
  */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    
    
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}

 /**
  *  Called when the signed in status changes, to update the UI
  *  appropriately. After a sign-in, the API is called.
  */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'none';
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

 /**
  *  Sign in the user upon button click.
  */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

 /**
  *  Sign out the user upon button click.
  */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

 /**
  * Append a pre element to the body containing the given message
  * as its text node. Used to display the results of the API call.
  *
  * @param {string} message Text to be placed in pre element.
  */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}


function updateMeds(data) {
  var str='';
  for (var i=0; i < data.length;++i){
    str += '<option value="'+data[i]+'" />'; // Storing options in variable
    }
  var meds_list=document.getElementById("medicamentSelection");
  meds_list.innerHTML = str;
}

function updateFormMedName(data) {
  var medName              = document.getElementById("medInput").value;
  var seriesNameOptions    = document.getElementById("seriesSelection");
  var valDateOptions       = document.getElementById("valDateSelection");
  var seriesNameOptionsStr = '';
  var valDateOptionsStr    = '';
  var selectedItems        = data.filter(function(el) {return el[0] == medName;})
  console.log(selectedItems)

  for (var i = 0; i < selectedItems.length; ++i){
    seriesNameOptionsStr += '<option value="'+selectedItems[i][1]+'" />'; // Storing options in variable
    valDateOptionsStr    += '<option data-option='+selectedItems[i][1]+' value="'+selectedItems[i][2]+'" />'; // Storing options in variable
  }

  seriesNameOptions.innerHTML = seriesNameOptionsStr;
  valDateOptions.innerHTML    = valDateOptionsStr;
}

function updateFormBarCode(data){
  var barCode       = document.getElementById('bar_code').value;
  var medInput      = document.getElementById('medInput');
  var seriesInput   = document.getElementById('seriesInput');
  var valInput      = document.getElementById('valInput');
  var selectedItems = data.filter(function(el) {return el[0] == barCode;});
  console.log(selectedItems.length)

  if(selectedItems.length == 1){
    sendCodButton.style.display = 'none';
    medInput.value    = selectedItems[0][1];
    seriesInput.value = selectedItems[0][2];
    valInput.value    = selectedItems[0][3];

  } else if (selectedItems.length == 0) {
    sendCodButton.style.display = 'block';
    medInput.value    = '';
    seriesInput.value = '';
    valInput.value    = '';

  } else if (selectedItems.length > 1){
    alert('Mais de um medicamento com código de barras correpondente');
  }
}

function valSel() {
  var seriesVal    = document.getElementById('seriesInput').value;
  var valForm      = document.getElementById('valDateSelection');
  var options      = valForm.querySelectorAll('option');;
  var valDateInput = document.getElementById('valInput');
  for (var i = 0; i < options.length; i++) {
    if(options[i].dataset.option === seriesVal) {
      valDateInput.value=options[i].value;
    }
  }
}

function insertRowSheet(sheetRange, rowArray, callback) {
  var params = {
    spreadsheetId:    SPREADSHEET_ID,
    range:            sheetRange,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
  };

  var valueRangeBody = {
    "range":          sheetRange,  //Set this to cell want to add 'x' to.
    "majorDimension": "ROWS",
    "values":         [rowArray]
  };

  var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
    request.then(function(response) {
      console.log(response.result);
      callback();
    }, function(reason) {
      gapi.auth2.getAuthInstance().signIn();
      alert('error: ' + reason.result.error.message);
    }
  );
}

function getSheet(sheetRange, callback) {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetRange,
  }).then(function(response) {
    var data = response.result;
    console.log(data.values)
    if (data.values.length > 0) {
      console.log(data.values)
      callback(data.values);
      return data.values;
    } else {
      alert('Dados não encontrados '+sheetRange)
      appendPre('No data found.');
    }
  }, function(response) {
    gapi.auth2.getAuthInstance().signIn();
    alert('Erro ao carregar '+sheetRange)
    appendPre('Error: ' + response.result.error.message);
  });
}

function sendReg(){
  medName    = document.getElementById('medInput').value;
  seriesName = document.getElementById('seriesInput').value;
  valDate    = document.getElementById('valInput').value;
  value      = document.getElementById('qnt').value;
  rowArray   = ['SAIDA', dataAtualFormatada(), 'FARMACIA INTERNA (CONSUMO)', medName, seriesName, valDate, 0, value];
  info = `Medicamento: ${medName}
  Lote: ${seriesName} 
  Validade: ${valDate}
  Quantidade: ${value} `
  if (window.confirm(`Por favor confirme os dados de saida e aperte OK 
     ${info} `)) { 
    insertRowSheet('Registros!B2:I', rowArray, function(){alert('Saida efetuada com sucesso\n'+info)
    window.location.replace("index.html");
  });
    
  }
}

function sendCod(){
  barCode    = document.getElementById('bar_code').value;
  medName    = document.getElementById('medInput').value;
  seriesName = document.getElementById('seriesInput').value;
  valDate    = document.getElementById('valInput').value;
  rowArray   = [barCode, medName, seriesName, valDate];
  info = `Código de barra: ${barCode}
  Medicamento: ${medName}
  Lote: ${seriesName} 
  Validade: ${valDate}`
  if (window.confirm(`Por favor confirme os dados de saida e aperte OK 
    ${info}`)) { 
    insertRowSheet('BarCode!A1:D1', rowArray, function(){alert('Código cadastrado com sucesso\n'+info)
    sendCodButton.style.display = 'none';
  });
  }
}

function dataAtualFormatada(){
  var data = new Date(),
      dia  = data.getDate().toString(),
      diaF = (dia.length == 1) ? '0'+dia : dia,
      mes  = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
      mesF = (mes.length == 1) ? '0'+mes : mes,
      anoF = data.getFullYear();
  return diaF+"/"+mesF+"/"+anoF;
}

function createTable(tableData, tableId){
  var table = document.getElementById(tableId);
  var tableBody = document.createElement('tbody');
  table.innerHTML = '';

  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');

    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

tableBody.appendChild(row);
});

table.appendChild(tableBody);
document.body.appendChild(table);

    }