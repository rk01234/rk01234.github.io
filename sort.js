// SortTestでconsole.logにevent.target.classNameを表示
// https://qiita.com/yowatsuyoengineer/items/05294c7e6eb201dc6061
// <th id="stage_5-3" rowspan="2" onclick="SortTest(event)">3</th>

function SortTest(event) {
    console.log("id", event.target.id);

    const table = document.getElementById("quest_table");
    console.log("table", table);

    let array_True = [];
    let array_False = [];

    for (let i = 0; i < table.rows.length; i++) {
        let row = table.rows[i];
        if (row.cells.namedItem(event.target.id).textContent) {
            array_True.push(row);
        }
        else {
            array_False.push(row);
        }
    }
    console.log(array_True);
    console.log(array_False);

    // TrueとFalseを結合
    let after_sorted_array = array_True.concat(array_False);
    // <tbody id="quest_table">の中身を空にする
    table.innerHTML = "";

    after_sorted_array.forEach((item) => {
        table.appendChild(item);
      });
    // const trs = Array.from(table.querySelectorAll("row_quest"));
    // console.log(trs);
}
// function SortTest() {
//     element.addEventListener('click', function(event) {
//         console.log("classname", event.target.className);
//     });
//     // console.log("id",event.target.id); //id

//     // console.log("classname",event.target.className);

//     const table = document.getElementById("quest_table");
//     // quest_tableのtr要素を全て取得し、配列に格納
//     const trs = Array.from(table.querySelectorAll("tr"));
//     // trsの中身を表示
//     console.log(trs);

//     }