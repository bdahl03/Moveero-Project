
// ==bolt hole==

// =IF(B22<=$G$7,IF(B22>=$H$7,"OK","NOK"),"NOK")
// B22: hole (input); $G$7: max; $H$7: min;

// hole = input
// BoltHoleDia = input
// UpperTol = input
// LowerTol = input
// max = BoltHoleDia + UpperTol
// min = BoltHoleDia - LowerTol

// if hole <= max:
//   if hole >= min:
//     OK
//   else:
//     NOK
// else:
//   NOK

function updateTableSize() {
    var table = document.getElementById("inputTable")
    removeAllTableRows(table)
}

function removeAllTableRows(table) {
    var len = table.rows.length
    console.log(len)
    for (var i = 0; i < len; i++) {
        table.deleteRow(0)
    }

}

function calculate() {

    const bolt_hole_dia = parseFloat(document.getElementById("BoltHoleDia").value)
    const upper_tol = parseFloat(document.getElementById("UpperTol").value)
    const lower_tol = parseFloat(document.getElementById("LowerTol").value)
    const min = bolt_hole_dia - lower_tol
    const max = bolt_hole_dia + upper_tol

    var input_index = 0
    var output_index = 1
    var table = document.getElementById("inputTable")
    holes = getInputsTable(input_index, table)
    console.log(holes)

    doCheckOk(table, holes, min, max)
}

function doCheckOk(table, holes, min, max) {
    var outputs = []
    for (var i = 0; i < table.rows.length; i++) {
        outputs.push(calculateOk(holes[i], min, max))
    }
    writeOutputsTable(1, table, outputs)
}

function calculateOk(hole, min, max) {

    if (hole <= max) {
        if (hole >= min) {return "OK"}
        else {return "NOK"}
    }
    else {return "NOK"}

}

function getInputsTable(input_index, table, row_min = 0) {
    // input_index: the column for inputs
    // console.log(table)
    var input_list = []

    // loop though rows and cols of the table
    for (var i = row_min, row; row = table.rows[i]; i++) {

        col_val = parseFloat(row.cells[input_index].firstChild.value)
        input_list.push(col_val)
    }

    return input_list
}

function writeOutputsTable(output_index, table, outputs) {
    for (var i = 0, row; row = table.rows[i]; i++) {
        row.cells[output_index].innerHTML = outputs[i]
    }
}