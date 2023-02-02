
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

function doCalculation(id_name, input_index, output_index) {
    var table = document.getElementById(id_name)
    inputs = getInputsTable(input_index, table)
    // console.log(inputs)

    testlist = [0,0]

    var bolt_hole_dia = parseFloat(document.getElementById("BoltHoleDia").value)
    var upper_tol = parseFloat(document.getElementById("UpperTol").value)
    var lower_tol = parseFloat(document.getElementById("LowerTol").value)
    var min = bolt_hole_dia - lower_tol
    var max = bolt_hole_dia + upper_tol


    for (var i = 0, row; row = table.rows[i]; i++) {
        row.cells[output_index].innerHTML = calculateOk(inputs[i], min, max)
    }
}

function calculateOk(hole, min, max) {

    if (hole <= max) {
        if (hole >= min) {return "OK"}
        else {return "NOK"}
    }
    else {return "NOK"}

}

function getInputsTable(input_index, table) {
    // input_index: the column for inputs
    // console.log(table)
    var input_list = []

    // loop though rows and cols of the table
    for (var i = 0, row; row = table.rows[i]; i++) {

        col_val = parseFloat(row.cells[input_index].firstChild.value)
        input_list.push(col_val)
    }

    return input_list
}