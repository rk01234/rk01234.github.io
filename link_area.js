{/* <div id="link-area">
    <button id="createLinkButton" type="button" onclick="createLink()">リンク作成</button>
    <input type="text" id="linkText" size="50" onclick="this.select()">
    <button id="copyButton" type="button" onclick="copyLink()">コピー</button>
    <button id="bookmarkButton" type="button" onclick="bookmarkLink()">ブックマークに追加</button>
</div> */}
function createLink() {
    let numberList = [];
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
    if (obj.api_data) {
        var input_data = obj.api_data.api_list;
        // api_listのkeyを取り出し、numberListに追加
        for (let i = 0; i < input_data.length; i++) {
            numberList.push(input_data[i].api_no);
        }
    }
    else if (obj.api_no_list) {
        // {"api_no_list":[1,2,3...]}をnumberListに追加
        numberList = obj.api_no_list;
    }
    
    console.log(numberList);
    // {"api_no_list":[1,2,3...]}の形式にして、id="linkText"に表示
    document.getElementById("linkText").value = "https://rk01234.github.io/#" + JSON.stringify({ api_no_list: numberList });
}

function copyLink() {
    // id="linkText"の内容が空ではない場合はコピー
    if (document.getElementById("linkText").value) {
        document.getElementById("linkText").select();
        document.execCommand("copy");
    }
}
// できん！
// function bookmarkLink() {
//     // id="linkText"の内容が空ではない場合はブックマークに追加
//     if (document.getElementById("linkText").value) {
//         let linkText = document.getElementById("linkText").value;
//         let link = document.createElement('a');
//         link.href = linkText;
//         link.target = '_blank';
//         link.rel = 'noopener noreferrer';
//         link.click();
//     }
// }