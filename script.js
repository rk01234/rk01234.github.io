// ユーザーからの入力を処理
let jsonData = null;
function processInput() {
    // ユーザーからの入力を取得
    let userInput = document.getElementById('userInput').value;
    // 切り取り
    // let cutInput = userInput.substring(7);
    let cutInput = userInput.replace("svdata=","");

    jsonData = JSON.parse(cutInput);

    let api_no_list = [];
    if ('api_no_list' in jsonData) {
        api_no_list = jsonData['api_no_list'];
    } else if('api_data' in jsonData) {
        for (let value of jsonData['api_data']['api_list']) {
            api_no_list.push(value['api_no']);
        }
    } else if ('api_id_list' in jsonData) {
        for (let id of jsonData['api_id_list']) {
            for (let value of dataMapping.quest) {
                if (value['id'] === id) {
                    api_no_list.push(value['api_no']);
                }
            }
        }
    }
    processAndDisplay(api_no_list);
}

function processAndDisplay(api_no_list) {
    let idOnlyMode = document.getElementById('idOnlyMode').checked;
    let shipsDisplayMode = document.getElementById('shipsDisplay').checked;

    let selectableShips = [];

    let nonValueQuests = [];
    let nonValueShips = [];

    let mandatoryShipsBoard = dataMapping.ships.map(innerArray => Array.from(innerArray));
    let selectableShipsBoard = dataMapping.ships.map(innerArray => Array.from(innerArray));

    let mandatoryShipsDisplay = [];
    let selectableShipsDisplay = [];

    
    // 表示セルの初期化(全削除) 後々増えた時に対応し易いように
    for (let i = 1; i < 8; i++) { // i 海域
        for (let j = 1; j < 8; j++) { // j ステージ番号
            if (j === 7) { // ステージ番号が7の場合は何もしない
                continue;
            } else if ((j === 6) && (i === 2 || i === 3 || i === 4 || i === 5 || i === 6 || i === 7)) {
                // ステージ番号が6かつ海域番号が2~7の場合は何もしない
                continue;
            } else {
                if ((i === 7 && j === 2) || (i === 7 && j === 3)) {
                    for (let k = 1; k < 3; k++) {
                        let cellId = `cell-${i}-${j}-${k}`;
                        let cellElement = document.getElementById(cellId);
                        cellElement.innerHTML = "";
                    }
                } else if (i === 7 && j === 5) {
                    for (let k = 1; k < 4; k++) {
                        let cellId = `cell-${i}-${j}-${k}`;
                        let cellElement = document.getElementById(cellId);
                        cellElement.innerHTML = "";
                    }
                } else {
                    let cellId = `cell-${i}-${j}`;
                    let cellElement = document.getElementById(cellId);
                    cellElement.innerHTML = "";
                }
            }
        }
    }

    for (let api_no of api_no_list) {
        // data.jsonに存在しない
        if (!(api_no.toString() in dataMapping.quest)) {
            nonValueQuest.push(api_no);
            continue;
        }
        if ('mandatory_stage' in dataMapping.quest[api_no]) {
            for (let stage of dataMapping.quest[api_no]['mandatory_stage']) {
                let A = stage.charAt(0);
                let B = stage.charAt(2);
                let cellId;
                if (A==='7' && B==='2'|| A==='7' && B==='3'|| A==='7' && B==='5') {
                    let C = stage.charAt(4);
                    cellId = `cell-${A}-${B}-${C}`;
                } else {
                    cellId = `cell-${A}-${B}`;
                }
                let cellElement = document.getElementById(cellId);
                let taskId = dataMapping.quest[api_no]['id'];
                
                let taskLink = `https://wikiwiki.jp/kancolle/%E4%BB%BB%E5%8B%99#id-${taskId}`;
                let taskDetailHover = dataMapping.quest[api_no]['api_detail'].replace(/<[^>]*>?/gm, '');
                let taskClass = taskId.replace(/\W/g, '-');
                let taskTitle = dataMapping.quest[api_no]['api_title'];
                if (idOnlyMode) {
                    // cellElement.innerHTML += `<a href="${taskLink}" target="_blank" class="task task-${taskClass}" title="${taskTitle} | ${taskDetailHover}">${taskId}</a><br>`;
                    cellElement.innerHTML += `<a href="${taskLink}" target="_blank" class="task task-${taskClass}" title="${taskTitle}\n${taskDetailHover}">${taskId}</a><br>`;

                } else {
                    cellElement.innerHTML += `<a href="${taskLink}" target="_blank" class="task task-${taskClass}" title="${taskDetailHover}">${taskId}</a>: ${taskTitle}<br>`;
                }
                if (shipsDisplayMode && 'mandatory_ships' in dataMapping.quest[api_no]) {
                    // 必要艦をカンマ区切りで表示
                    let shipNamesString = dataMapping.quest[api_no]['mandatory_ships'].join(', ');
                    cellElement.innerHTML += `必要艦: ${shipNamesString}<br>`;

                }
                if (shipsDisplayMode && 'selectable_ships' in dataMapping.quest[api_no]) {
                    // 必要艦をカンマ区切りで表示
                    let shipNamesString = dataMapping.quest[api_no]['selectable_ships']['ships'].join(', ');
                    shipNamesString += ` (${dataMapping.quest[api_no]['selectable_ships']['count']})` ;
                    cellElement.innerHTML += `選択艦: ${shipNamesString}<br>`;
                }
            }
        }
        if ('selectable_stage' in dataMapping.quest[api_no]) {
            for (let stage of dataMapping.quest[api_no]['selectable_stage']) {
                let A = stage.charAt(0);
                let B = stage.charAt(2);
                let cellId;
                if (A==='7' && B==='2'|| A==='7' && B==='3'|| A==='7' && B==='5') {
                    let C = stage.charAt(4);
                    cellId = `cell-${A}-${B}-${C}`;
                } else {
                    cellId = `cell-${A}-${B}`;
                }
                let cellElement = document.getElementById(cellId);
                let taskId = dataMapping.quest[api_no]['id'];
                
                let taskLink = `https://wikiwiki.jp/kancolle/%E4%BB%BB%E5%8B%99#id-${taskId}`;
                let taskDetailHover = dataMapping.quest[api_no]['api_detail'].replace(/<[^>]*>?/gm, '');
                let taskClass = taskId.replace(/\W/g, '-');
                if (idOnlyMode) {
                    cellElement.innerHTML += `<a href="${taskLink}" target="_blank" class="task task-${taskClass}" title="${taskDetailHover}">+ ${taskId}</a><br>`;
                } else {
                    let taskTitle = dataMapping.quest[api_no]['api_title'];
                    cellElement.innerHTML += `<a href="${taskLink}" target="_blank" class="task task-${taskClass}" title="${taskDetailHover}">+ ${taskId}</a>: ${taskTitle}<br>`;
                }
                if (shipsDisplayMode && 'mandatory_ships' in dataMapping.quest[api_no]) {
                    // 必要艦をカンマ区切りで表示
                    let shipNamesString = dataMapping.quest[api_no]['mandatory_ships'].join(', ');
                    cellElement.innerHTML += `必要艦: ${shipNamesString}<br>`;

                }
                if (shipsDisplayMode && 'selectable_ships' in dataMapping.quest[api_no]) {
                    // 必要艦をカンマ区切りで表示
                    let shipNamesString = dataMapping.quest[api_no]['selectable_ships']['ships'].join(', ');
                    shipNamesString += ` (${dataMapping.quest[api_no]['selectable_ships']['count']})` ;
                    cellElement.innerHTML += `選択艦: ${shipNamesString}<br>`;
                }
            }
        }
        if ('mandatory_ships' in dataMapping.quest[api_no]) {
            // idとapi_titleを:で区切ったものをmandatoryShipsDisplayに追加します
            mandatoryShipsDisplay.push(`${dataMapping.quest[api_no]['id']}: ${dataMapping.quest[api_no]['api_title']}`);
            for (let ship of dataMapping.quest[api_no]['mandatory_ships']) {
                mandatoryShipsDisplay.push(ship);
                for (let i = 0; i < mandatoryShipsBoard.length; i++) {
                    if (mandatoryShipsBoard[i].includes(ship)) {
                        let index = mandatoryShipsBoard[i].indexOf(ship);
                        if ( mandatoryShipsBoard[i][0] < index) {
                            mandatoryShipsBoard[i][0] = index;
                        } else {
                            mandatoryShipsBoard[i][0] = index;
                        }
                        break;
                    }
                }
            }
        }
        if ('selectable_ships' in dataMapping.quest[api_no]) {
            selectableShipsDisplay.push(`${dataMapping.quest[api_no]['id']}: ${dataMapping.quest[api_no]['api_title']}`);
            selectableShips = selectableShips.concat(dataMapping.quest[api_no]['selectable_ships']);
            for (let ship of dataMapping.quest[api_no]['selectable_ships']['ships']) {
                selectableShipsDisplay.push(ship);
                for (let i = 0; i < selectableShipsBoard.length; i++) {
                    if (selectableShipsBoard[i].includes(ship)) {
                        let index = selectableShipsBoard[i].indexOf(ship);
                        if ( selectableShipsBoard[i][0] < index) {
                            selectableShipsBoard[i][0] = index;
                        } else {
                            selectableShipsBoard[i][0] = index;
                        }
                        break;
                    }
                }
            }
        }
    }



    // selectableShipsDisplayを改行ありで結合します
    let rawnamesMandatoryShipsStr = mandatoryShipsDisplay.join('<br>');
    // 結果を<div id="mandatory_ships-display"></div>に表示します
    document.getElementById('mandatory_ships-display').innerHTML = rawnamesMandatoryShipsStr;


    // rawnamesSelectableShipsを改行ありで結合します
    let rawnamesSelectableShipsStr = selectableShipsDisplay.join('<br>');
    // 結果を<div id="selectable_ships-display"></div>に表示します
    document.getElementById('selectable_ships-display').innerHTML = rawnamesSelectableShipsStr;

    // xmlを出力します
    mandatoryShipsExportXml(mandatoryShipsBoard);
    selectableShipsExportXml(selectableShipsBoard);

    // nonValue配列をループします
    let nonValueQuestsStr = '';
    for (let item of nonValueQuests) {
        // itemが数字であれば、jsonDataから対応するapi_titleを取得します
        if (!isNaN(item)) {
            let questTitle = jsonData['api_data']['api_list'].find(quest => quest['api_no'] === item)['api_title'];
            nonValueQuestsStr += questTitle + '<br>';
        }
    }


    // 結果を<div id="nonValueQuests"></div>に表示します
    document.getElementById('nonValueQuests').innerHTML = nonValueQuestsStr;

    // 赤ポップアップの為の後処理
    $('.grid-cell').each(function() {
        var words = $(this).html().split('<br>');
        for (var i = 0; i < words.length; i++) {
            words[i] = '<span class="word">' + words[i] + '</span>';
        }
        $(this).html(words.join('<br>'));
    });
    $('.word').hover(function() {
        $('.word:contains("' + $(this).text() + '")').css('color', 'red');
    }, function() {
        $('.word:contains("' + $(this).text() + '")').css('color', '');
    });
}

function mandatoryShipsExportXml(shipList) {
    fetch('template.xml')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(templateXml => {
        // テンプレートXMLの一行目と三行目を取得します
        let lines = templateXml.split('\n');
        let firstLine = lines[0];
        let thirdLine = lines[2];

        // shipListをループして、0番目の配列のに入っている数字の数だけ1番目からその番号まで艦の名前を__sample__に置換します
        let xmlStr = firstLine;
        for (let ships of shipList) {
            let number = ships[0];
            if (number === 0) {
                continue;
            }
            for (let i = 1; i <= number; i++) {
                let secondLine = lines[1].replace('__sample__', ships[i]); // __sample__を艦の名前に置換します
                xmlStr += '\n' + secondLine;
            }
        }
        xmlStr += '\n' + thirdLine;

        return xmlStr;
    })
    .then(updatedMandatoryShipsXml => {
        // テキストボックスに出力します
        document.getElementById("copy-textA").value = updatedMandatoryShipsXml;
    })
    .catch(error => {
        console.error('There was an error!', error);
    });
}
function selectableShipsExportXml(shipList) {
    fetch('template.xml')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(templateXml => {
        // テンプレートXMLの一行目と三行目を取得します
        let lines = templateXml.split('\n');
        let firstLine = lines[0];
        let thirdLine = lines[2];

        // shipListをループして、0番目の配列のに入っている数字の数だけ1番目からその番号まで艦の名前を__sample__に置換します
        let xmlStr = firstLine;
        for (let ships of shipList) {
            let number = ships[0];
            if (number === 0) {
                continue;
            }
            for (let i = 1; i <= number; i++) {
                let secondLine = lines[1].replace('__sample__', ships[i]); // __sample__を艦の名前に置換します
                xmlStr += '\n' + secondLine;
            }
        }

        xmlStr += '\n' + thirdLine;

        return xmlStr;
    })
    .then(updatedSelectableShipsXml => {
        // テキストボックスに出力します
        document.getElementById("copy-textB").value = updatedSelectableShipsXml;
    })
    .catch(error => {
        console.error('There was an error!', error);
    });
}