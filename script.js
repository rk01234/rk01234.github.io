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
    if ('api_data' in jsonData) {
        for (let value of jsonData['api_data']['api_list']) {
            api_no_list.push(value['api_no']);
        }
    } else if('api_no_list' in jsonData) {
        api_no_list = jsonData['api_no_list'];
    } else if ('api_id_list' in jsonData) {
        for (let value of dataMapping.quest) {
            if (dataMapping.quest[value]["id"] in value){
                if (value['api_no'] in api_id_list) {
                    api_no_list.push(value['api_no']);
                }
            }
        }
    }
    processAndDisplay(api_no_list);
}

function processAndDisplay(api_no_list) {
    // グローバル変数の確認
    let idOnlyMode = document.getElementById('idOnlyMode').checked;
    let shipsDisplayMode = document.getElementById('shipsDisplay').checked;
    // 表示セルの初期化(全削除) 後々増えた時に対応し易いように
    for (let i = 1; i < 8; i++) { // i 海域
        for (let j = 1; j < 8; j++) { // j ステージ番号
            if (j === 7) {
                // ステージ番号が7の場合は何もしない
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

    let mandatory_ships = [];
    let selectable_ships = [];
    let nonValue = [];
    let nonValueShips = [];
    
    for (let api_no of api_no_list) {
        // data.jsonに存在しない
        if (!(api_no.toString() in dataMapping.quest)) {
            nonValue.push(api_no);
            continue;
        }
        if ('mandatory_stage' in dataMapping.quest[api_no]) {
            // console.log("mandatory_stage aruyo")
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
            }
        }
        if ('mandatory_ships' in dataMapping.quest[api_no]) {
            mandatory_ships = mandatory_ships.concat(dataMapping.quest[api_no]['mandatory_ships']);
            for (let ship of dataMapping.quest[api_no]['mandatory_ships']) {
                for (let i = 0; i < dataMapping.ships.length; i++) {
                    if (dataMapping.ships[i].includes(ship)) {
                        let index = dataMapping.ships[i].indexOf(ship);
                        if (dataMapping.ships[i][0] < index) {
                            dataMapping.ships[i][0] = index;
                        }
                        break;
                        
                    }
                }
                // shipsがdataMapping.shipsにない場合は、nonValueShipsに追加します
                if (!dataMapping.ships.some(shipArray => shipArray.includes(ship))) {
                    nonValueShips.push(ship);
                }
            }
        }
        if ('selectable_ships' in dataMapping.quest[api_no]) {
            selectable_ships = selectable_ships.concat(dataMapping.quest[api_no]['selectable_ships']);
        }
    }
    // console.log('dataMapping.ships')
    // console.log(dataMapping.ships);
    // 無限ループを続けるかどうかのフラグ
    let loopFlag = true;
    while (loopFlag) {
        loopFlag = false;
        console.log('selectable_shipsの長さ'+selectable_ships.length)
        // selectable_shipsの中身をループします
        for (let i = 0; i < selectable_ships.length; i++) {
            // selectable_shipsのshipsのcountが0の場合は、selectable_shipsから削除します
            if (selectable_ships[i]['count'] === 0) {
                selectable_ships.splice(i, 1);
                loopFlag = true;
                break;
            }
            // selectable_shipsのcountとshipsの長さが同じ場合は、shipsの中身をdataMapping.shipsに追加します
            if (selectable_ships[i]['count'] === selectable_ships[i]['ships'].length) {
                for (let ship of selectable_ships[i]['ships']) {
                    for (let j = 0; j < dataMapping.ships.length; j++) {
                        if (dataMapping.ships[j].includes(ship)) {
                            // 配列の何番目に入っているか
                            let index = dataMapping.ships[j].indexOf(ship);
                            if (dataMapping.ships[j][0] < index) {
                                dataMapping.ships[j][0] = index;
                            }
                            break;
                        }
                    }
                }
                // selectable_shipsから削除します
                selectable_ships.splice(i, 1);
                loopFlag = true;
                break;
            }
            // selectable_shipsのshipsの中身をループします
            for (let j = 0; j < selectable_ships[i]['ships'].length; j++) {
                // dataMapping.shipsの中身をループして同じものを探します
                for (let k = 0; k < dataMapping.ships.length; k++) {
                    if (dataMapping.ships[k][0] === 0) {
                        continue;
                    }
                    if (dataMapping.ships[k].includes(selectable_ships[i]['ships'][j])) {
                        // 配列の何番目に入っているか
                        let index = dataMapping.ships[k].indexOf(selectable_ships[i]['ships'][j]);
                        if (dataMapping.ships[k][0] < index) {
                            dataMapping.ships[k][0] = index;
                        }
                        // 選択した要素のみをselectable_shipsから削除し、countを1減らします
                        selectable_ships[i]['ships'].splice(j, 1);
                        selectable_ships[i]['count'] -= 1;
                        loopFlag = true;
                        break;
                    }
                }
            if (loopFlag) {
                break;
            }
            }
        }
    }

    // dataMapping.shipsの0が0のものを削除します
    // dataMapping.ships = dataMapping.ships.filter(ship => ship[0] !== 0);
    console.log('dataMapping.ships')
    console.log(dataMapping.ships)
    console.log('----------')
    console.log('selectable_ships')
    console.log(selectable_ships)
    console.log('----------')
    console.log('nonValueShips')
    console.log(nonValueShips)
    console.log('----------')
    // dataMapping.shipsのdataMapping.ships[n][dataMapping.ships[n][0]]をrawnamesに入れます
    let rawnameMandatoryShips = [];
    for (let ship of dataMapping.ships) {
        if (ship[0] === 0) {
            continue;
        }
        rawnameMandatoryShips.push(ship[ship[0]]);
    }
    // rawnamesを改行ありで結合します
    let rawnamesMandatoryShipsStr = rawnameMandatoryShips.join('<br>');
    // 結果を<div id="mandatory_ships-display"></div>に表示します
    document.getElementById('mandatory_ships-display').innerHTML = rawnamesMandatoryShipsStr;

    // selectable_ships-displayの表示
    let rawnamesSelectableShips = [];
    rawnamesSelectableShips.push('--------');
    for (let lines of selectable_ships) {
        // line['count']を追加
        rawnamesSelectableShips.push(`(${lines['count']})`);
        for (let ship of lines['ships']) {
            rawnamesSelectableShips.push(ship);
        }
        rawnamesSelectableShips.push('--------');
    }
    // rawnamesSelectableShipsを改行ありで結合します
    let rawnamesSelectableShipsStr = rawnamesSelectableShips.join('<br>');
    // 結果を<div id="selectable_ships-display"></div>に表示します
    document.getElementById('selectable_ships-display').innerHTML = rawnamesSelectableShipsStr;

    // xmlを出力します
    exportXml(dataMapping.ships);
    // selectable_shipsの中身をdataMapping.shipsに追加します
    for (let lines of selectable_ships) {
        for (let ship of lines['ships']) {
            for (let i = 0; i < dataMapping.ships.length; i++) {
                if (dataMapping.ships[i].includes(ship)) {
                    // 配列の何番目に入っているか
                    let index = dataMapping.ships[i].indexOf(ship);
                    if (dataMapping.ships[i][0] < index) {
                        dataMapping.ships[i][0] = index;
                    }
                    break;
                }
            }
        }
    }
    exportXmlB(dataMapping.ships);

    // nonValue配列をループします
    let nonValueQuestsStr = '';
    for (let item of nonValue) {
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

function exportXml(shipList) {
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

        // for (let key in jsonData) {
        //     let secondLine = lines[1].replace('__sample__', key); // __sample__を艦の名前に置換します
        //     xmlStr += '\n' + secondLine;
        // }
        xmlStr += '\n' + thirdLine;

        return xmlStr;
    })
    .then(updatedXml => {
        // テキストボックスに出力します
        document.getElementById("copy-textA").value = updatedXml;
    })
    .catch(error => {
        console.error('There was an error!', error);
    });
}
function exportXmlB(shipList) {
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

        // for (let key in jsonData) {
        //     let secondLine = lines[1].replace('__sample__', key); // __sample__を艦の名前に置換します
        //     xmlStr += '\n' + secondLine;
        // }
        xmlStr += '\n' + thirdLine;

        return xmlStr;
    })
    .then(updatedXml => {
        // テキストボックスに出力します
        document.getElementById("copy-textB").value = updatedXml;
    })
    .catch(error => {
        console.error('There was an error!', error);
    });
}