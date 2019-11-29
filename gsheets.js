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
     signoutButton.style.display = 'block';
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

 /**
  * Print the names and majors of students in a sample spreadsheet:
  * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
  */
 function getMedSeries() {
   var data;
   gapi.client.sheets.spreadsheets.values.get({
     spreadsheetId: SPREADSHEET_ID,
     range: 'ProdutoLote!A2:D',
   }).then(function(response) {
     data = response.result;
     if (data.values.length > 0) {
       console.log(data.values)
       return data.values;
     } else {
       appendPre('No data found.');
     }
   }, function(response) {
     appendPre('Error: ' + response.result.error.message);
   });
 }

 function updateMeds(data) {
  var str='';
  for (var i=0; i < data.length;++i){
    str += '<option value="'+data[i]+'" />'; // Storing options in variable
    }
  var meds_list=document.getElementById("medicamentSelection");
  meds_list.innerHTML = str;
 }

 function updateSeries(data) {
  var medName=document.getElementById("medInput").value;
  console.log(medName)
  selectedItems = data.filter(function(el) {
      return el[0] == medName;
    })
  console.log(selectedItems)
  var str='';
  for (var i=0; i < selectedItems.length;++i){
    str += '<option value="'+selectedItems[i][1]+'" />'; // Storing options in variable
  }
  var seriesList=document.getElementById("seriesSelection");
  seriesList.innerHTML = str;

  var str2='';
  for (var i=0; i < selectedItems.length;++i){
    str2 += '<option data-option='+selectedItems[i][1]+' value="'+selectedItems[i][2]+'" />'; // Storing options in variable
  }
  var valList=document.getElementById("valDateSelection");
  valList.innerHTML = str2;
 }


 function updateForm(data){
  var barCode=document.getElementById("bar_code").value;

  selectedItems = data.filter(function(el) {
    return el[0] == barCode;
  });
  console.log(selectedItems.length)

  if(selectedItems.length==1){
    document.getElementById('medInput').value=selectedItems[0][1];
    document.getElementById('seriesInput').value=selectedItems[0][2];
    document.getElementById('valInput').value=selectedItems[0][3];

  } else if(selectedItems.length>1) {
    
  }

}


 function getSheet(sheetRange, callback) {
  var data;
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetRange,
  }).then(function(response) {
    data = response.result;
    if (data.values.length > 0) {
      console.log(data.values)
      callback(data.values);
      return data.values;
    } else {
      alert('Dados não encontrados '+sheetRange)
      appendPre('No data found.');
    }
  }, function(response) {
    alert('Erro ao carregar '+sheetRange)
    appendPre('Error: ' + response.result.error.message);
  });
 }



function valSel() {
  var seriesVal=document.getElementById("seriesInput").value;
  var valForm=document.getElementById("valDateSelection");
  var options = valForm.querySelectorAll('option');;
  var valDateInput = document.getElementById("valInput");
  for(var i = 0; i < options.length; i++) {
    if(options[i].dataset.option === seriesVal) {
      valDateInput.value=options[i].value;
    }
  }
}

 function sendReg(){
  medName=document.getElementById('medInput').value;
  seriesName=document.getElementById('seriesInput').value;
  valDate=document.getElementById('valInput').value;
  value=document.getElementById('qnt').value;

  addRegister(medName, seriesName, valDate, value)
 }

 function sendCod(){
  medName=document.getElementById('medInput').value;
  seriesName=document.getElementById('seriesInput').value;
  valDate=document.getElementById('valInput').value;
  value=document.getElementById('qnt').value;
  barCode=document.getElementById('bar_code').value;
  setBarCode(barCode, medName, seriesName, valDate)

 }
  function setBarCode(barCode, medName, seriesName, valDate) {
    var params = {
      spreadsheetId: '1nLBX1Y-3P_d-RsuD6IeJ1AEZ26IgCm1rQPhthocagZ0',  // TODO: Update placeholder value.
      range: 'BarCode!A1:D1',  // TODO: Update placeholder value.
      // How the input data should be interpreted.
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
    };

    var valueRangeBody = {
      "range": 'BarCode!A1:D1',  //Set this to cell want to add 'x' to.
        "majorDimension": "ROWS",
        "values": [
          [barCode, medName, seriesName, valDate]]
    };

    var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
      request.then(function(response) {
        // TODO: Change code below to process the `response` object:
        console.log(response.result);
      }, function(reason) {
        alert('error: ' + reason.result.error.message);
      }
    );
  }

  function addRegister(medName, seriesName, valDate, value) {
    var params = {
      spreadsheetId: '1nLBX1Y-3P_d-RsuD6IeJ1AEZ26IgCm1rQPhthocagZ0',  // TODO: Update placeholder value.
      range: 'Registros!A1:G',  // TODO: Update placeholder value.
      // How the input data should be interpreted.
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
    };

    var valueRangeBody = {
      "range": 'Registros!A1:G',  //Set this to cell want to add 'x' to.
        "majorDimension": "ROWS",
        "values": [
          [dataAtualFormatada(), 'FARMACIA INTERNA', 'SAIDA', medName, seriesName, valDate, value]]
    };

    var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
      request.then(function(response) {
        // TODO: Change code below to process the `response` object:
        console.log(response.result);
      }, function(reason) {
        alert('error: ' + reason.result.error.message);
      }
    );
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
