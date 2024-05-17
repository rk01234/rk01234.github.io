
// jsなんもわからん
// ボタンが押された時の処理
function handleButtonClick() {
    // stageの内容を入れる配列
    const stage = [
        "1-1","1-2","1-3","1-4","1-5","1-6",
        "2-1","2-2","2-3","2-4","2-5",
        "3-1","3-2","3-3","3-4","3-5",
        "7-1","7-2-1","7-2-2","7-3-1","7-3-2","7-4","7-5-1","7-5-2","7-5-3",
        "4-1","4-2","4-3","4-4","4-5",
        "5-1","5-2","5-3","5-4","5-5",
        "6-1","6-2","6-3","6-4","6-5"
    ];
    // 表示内容を入れる配列
    let displayData = [];
    // id="userInput"の内容を変数に格納
    // 内容はjson形式
    // svdate=で始まる場合は、先頭のsvdata=を削除

    let json = document.getElementById("userInput").value;
    if (json.indexOf("svdata=") == 0) {
        json = json.substring(7);
    }
    // json形式に変換
    let obj = JSON.parse(json);
    console.log(obj);

    // api_dataがある場合、{"api_data":"api_list":[]}を取り出しinput_dataに追加
    if ("api_data" in obj) {
        var input_data = obj.api_data.api_list;
    }
    else if ("api_no_list" in obj) {
        // {"api_no_list":[1,2,3...]}を[{api_no:1},{api_no:2},{api_no:3}...]に変換
        var input_data = obj.api_no_list.map(function (x) { return { api_no: x }; });
    }
    // keyが全部数字なら、input_dataにそのまま追加
    else if (Object.keys(obj).every(function (x) { return !isNaN(x); })) {
        var input_data = Object.keys(obj).map(function (x) { return { api_no: x }; });
    }

    console.log(input_data);

    //  input_dataをforで回し、api_noがquest_detailsにある場合、<tbody id="quest_table">に追加していく
    // 
    for (let i = 0; i < input_data.length; i++) {
        let api_no = String(input_data[i].api_no);
        // quest_detailsのapi_no内にid
        if (quest_details[api_no] && "id" in quest_details[api_no]) {
            displayData.push(quest_details[api_no]);
        }
        else {
            displayData.push({ api_no: api_no, quest_name: "未登録" });
        }
    }
    // <tbody id="quest_table">の中身を空にする
    let table = document.getElementById("quest_table");
    table.innerHTML = "";
    // displayDataをforで回し、<tbody id="quest_table">に追加していく
    for (let i = 0; i < displayData.length; i++) {
        if (!('mandatory_stage' in displayData[i] || 'selectable_stage' in displayData[i])) {
            continue;
        }
        let row = table.insertRow(-1);
        // 挿入された行にidを付与
        row.id = "row_quest";
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = `<a href="https://wikiwiki.jp/kancolle/%E4%BB%BB%E5%8B%99#id-${String(displayData[i].id)}" target="_blank">${displayData[i].id}</a>`;
        cell2.innerHTML = `<span title="${String(displayData[i].api_detail).replace("<br>","&#13;&#10;")}">${displayData[i].api_title}</span>`;
        
        // 配列の初期化
        for (let j = 0; j < stage.length; j++) {
            // cellの挿入とidの付与
            cell = row.insertCell();
            // 背景を薄ピンクにする
            if (stage[j].split("-")[1] >= 5) {
                cell.style.backgroundColor = "#FFCCCC";
            }
            cell.id = "stage_" + String(stage[j]);

        }

        if ("mandatory_stage" in displayData[i]) {
            for (let j = 0; j < displayData[i].mandatory_stage.length; j++) {
                row.cells.namedItem("stage_" + displayData[i].mandatory_stage[j]).innerHTML = "●";
            }
        }
        if ("selectable_stage" in displayData[i]) {
            for (let j = 0; j < displayData[i].selectable_stage.length; j++) {
                row.cells.namedItem("stage_" + displayData[i].selectable_stage[j]).innerHTML = "○";
            }
        }
    }

}