// something is off with the table



// ==bolt hole==

// =IF(B22<=$G$7,IF(B22>=$H$7,"OK","NOK"),"NOK")
// B22: hole (input); $G$7: max; $H$7: min;

// hole = input
// BoltHoleDia = input
// UpperTol = input
// LowerTol = input
// max = BoltHoleDia + UpperTol
// min = BoltHoleDia + LowerTol

// if hole <= max:
//   if hole >= min:
//     OK
//   else:
//     NOK
// else:
//   NOK
function calculate(input_index, output_index) {
    var table = document.getElementById("inputTable");
    inputs = getInputsTable(input_index, table);
    var length = inputs.length;

    for (var i = 0, row; row = table.rows[i]; i++) {
        row.cells[output_index].innerHTML = 0
    }
}

function getInputsTable(input_index, table) {
    // input_index: the column for inputs
    console.log(table);
    var input_list = [];

    // loop though rows and cols of the table
    for (var i = 0, row; row = table.rows[i]; i++) {
        // console.log(row);
        for (var j = 0, col; col = row.cells[j]; j++) {

            // console.log(col);
            console.log(col);
            // console.log(col.firstChild);
            // console.log(col.firstChild.value);
            var col_val = parseInt(col.childNodes[input_index].value);
            console.log(col_val);

            input_list.push(col_val);
        }
    }

    return input_list;
}