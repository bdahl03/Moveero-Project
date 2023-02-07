
function updateTables() {
    const num_holes = parseInt(document.getElementById("NumHoles").value)
    var bolt_hole_table = document.getElementById("boltHoleTable")

    updateTableSize(bolt_hole_table, num_holes, 3)


    // writeOutputsTableRepeat(0, bolt_hole_table, input_obj)
    for (var i = 0, row; row = bolt_hole_table.rows[i]; i++) {
        row.cells[0].appendChild(createNumberInputObject())
        row.cells[1].innerHTML = "0.0"
        row.cells[2].innerHTML = "None"
    }
}

function updateTableSize(table, num_rows, num_cols) {
    removeAllTableRows(table)
    for (var i = 0; i < num_rows; i++) {
        row = table.insertRow()
        for (var j = 0; j < num_cols; j++) {
            cell = row.insertCell()
        }
    }
}

function removeAllTableRows(table) {
    var len = table.rows.length
    // console.log(len)
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
    var tolerance_output_index = 1
    var ok_output_index = 2
    var table = document.getElementById("boltHoleTable")
    holes = getInputsTable(input_index, table)
    // console.log(holes)
    doCheckTolerance(tolerance_output_index, table, holes, min, max)
    doCheckOk(ok_output_index, table, holes, min, max)
}


//====Calculations====
// =ABS(B22 - AVERAGE($G$7, $H$7)) / (($G$7 - $H$7) / 2)
// abs(hole-avg(max,min)) / ((max-min) / 2)
function doCheckTolerance(output_index, table, holes, min, max) {
    var outputs = []
    for (var i = 0; i < table.rows.length; i++) {
        outputs.push(calculateTolerance(holes[i], min, max))
    }
    writeOutputsTable(output_index, table, outputs)
}

function calculateTolerance(hole, min, max) {
    return Math.abs(hole - ((max + min) / 2)) / ((max - min) / 2)
}

// =IF(B22<=$G$7,IF(B22>=$H$7,"OK","NOK"),"NOK")
// 
function doCheckOk(output_index, table, holes, min, max) {
    var outputs = []
    for (var i = 0; i < table.rows.length; i++) {
        outputs.push(calculateOk(holes[i], min, max))
    }
    writeOutputsTable(output_index, table, outputs)
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

function writeOutputsTableRepeat(output_index, table, output) {
    for (var i = 0, row; row = table.rows[i]; i++) {
        row.cells[output_index].innerHTML = output
    }
}

function createNumberInputObject() {
    // <input type="number" step="any" min="0" value="0.8360">
    var input_obj = document.createElement("INPUT")
    input_obj.setAttribute("type", "number")
    input_obj.setAttribute("step", "any")
    input_obj.setAttribute("min", "0")
    input_obj.setAttribute("value", "0.8360")
    return input_obj
}
