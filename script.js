
class Table {
    constructor(HTMLTableTag, num_rows, num_cols) {
        this.table = document.getElementById(HTMLTableTag)
        this.num_rows = num_rows
        this.num_cols = num_cols
    }
    updateTableSize(num_rows = this.num_rows, num_cols = this.num_cols) {
        // removeAllTableRows(table)
        // var tbody = this.table.getElementsByTagName('tbody')[0]
        this.table.removeChild(this.table.getElementsByTagName('tbody')[0])
        var table_body = this.table.appendChild(document.createElement("TBODY"))
        // console.log(table_body)

        for (let i = 0; i < num_rows; i++) {
            let row = table_body.insertRow()
            for (let j = 0; j < num_cols; j++) {
                row.insertCell()
            }
        }

        this.num_rows = num_rows
        this.num_cols = num_cols

    }
    getHTMLTableRows() {
        var table_body = this.table.getElementsByTagName('tbody')[0]
        var table_rows = table_body.getElementsByTagName('tr')
        return table_rows
    }
}

// separate class with inputs and outputs that extends the from the Table class
class InputTable extends Table {
    constructor(HTMLTableTag, num_rows, num_cols, input_index, tolerance_output_index, ok_output_index) {
        super(HTMLTableTag, num_rows, num_cols)
        this.input_index = input_index
        this.tolerance_output_index = tolerance_output_index
        this.ok_output_index = ok_output_index
        // this.table = document.getElementById(HTMLTableTag)
        // this.num_rows = num_rows
        // this.num_cols = num_cols
    }
    getInputsTable() {
        // input_index: the column for inputs
        // console.log(table)
        var input_list = []
    
        // loop though rows and cols of the table
        var table_rows = this.getHTMLTableRows(this.table)
        for (let i = 0, row; row = table_rows[i]; i++) {
    
            let col_val = parseFloat(row.cells[this.input_index].firstChild.value)
            input_list.push(col_val)
        }
    
        return input_list
    }
    calculateTolerance(){}
    calculateOK(){}
}

// InputTable(HTMLTableTag, num_rows, num_cols, input_index, tolerance_output_index, ok_output_index)
var BoltHoleTable    = new InputTable('BoltHoleTable', 1, 4, 1, 2, 3)
var BoltCircleTable  = new InputTable('BoltCircleTable', 1, 4, 1, 2, 3)
var HoleToPilotTable = new InputTable('HoleToPilotTable', 1, 4, 1, 2, 3)
var HoleToHoleTable  = new InputTable('HoleToHoleTable', 1, 4, 1, 2, 3)

// set individual functions

BoltHoleTable.calculateTolerance    = function(min, max) {
    console.log("BoltHoleTable calculateTolerance")
    var holes = this.getInputsTable()
    var outputs = []
    var len = this.getHTMLTableRows().length

    for (let i = 0; i < len; i++) {
        // add image to table here
        let tol = Math.abs(holes[i] - ((max + min) / 2)) / ((max - min) / 2)
        outputs.push(tol)
    }

    writeOutputsTable(this.tolerance_output_index, this, outputs)
}
BoltHoleTable.calculateOK           = function(min, max) {
    console.log("BoltHoleTable calculateOK")
    var holes = this.getInputsTable()
    var outputs = []

    for (let i = 0; i < this.table.rows.length; i++) {
        var isOK = null
        if (holes[i] <= max) {
            if (holes[i] >= min) {isOK = "OK"}
            else {isOK = "NOK"}
        }
        else {isOK = "NOK"}
        outputs.push(isOK)
    }
    
    writeOutputsTable(this.ok_output_index, this, outputs)
}

BoltCircleTable.calculateTolerance  = function() {
    console.log("BoltCircleTable calculateTolerance")
}
BoltCircleTable.calculateOK         = function() {
    console.log("BoltCircleTable calculateOK")
}

HoleToPilotTable.calculateTolerance = function() {
    console.log("HoleToPilotTable calculateTolerance")
}
HoleToPilotTable.calculateOK        = function() {
    console.log("HoleToPilotTable calculateOK")
}

HoleToHoleTable.calculateTolerance  = function() {
    console.log("HoleToHoleTable calculateTolerance")
}
HoleToHoleTable.calculateOK         = function() {
    console.log("HoleToHoleTable calculateOK")
}


function updateTables() {
    const num_holes = parseInt(document.getElementById("NumHoles").value)

    updateBoltHoleTable(num_holes)
    updateBoltCircleTable(num_holes)
    updateHoleToPilotTable(num_holes)
    updateHoleToHoleTable(num_holes)

}

function updateBoltHoleTable(num_holes) {
    // const num_cols = 4
    // var bolt_hole_table = document.getElementById("BoltHoleTable") // gets table
    // updateTableSize(bolt_hole_table, num_holes, num_cols)
    // var table_rows = getHTMLTableRows(bolt_hole_table)


    // for (var i = 0, row; row = table_rows[i]; i++) {
    //     row.cells[0].innerHTML = i + 1
    //     row.cells[0].style.textAlign = "center"

    //     row.cells[1].appendChild(createNumberInputObject())

    //     row.cells[2].innerHTML = "0.0"

    //     row.cells[3].innerHTML = "None"
    // }

    BoltHoleTable.updateTableSize(num_holes)
    var table_rows = BoltHoleTable.getHTMLTableRows()
    
    for (let i = 0, row; row = table_rows[i]; i++) {
        row.cells[0].innerHTML = i + 1
        row.cells[0].style.textAlign = "center"

        row.cells[1].appendChild(createNumberInputObject())

        row.cells[2].innerHTML = "0.0"

        row.cells[3].innerHTML = "None"
    }
}

function updateBoltCircleTable(num_holes) {
    num_holes = Math.floor(num_holes / 2) // divide by 2 rounded down
    // const num_cols = 4
    // var bolt_hole_table = document.getElementById("BoltCircleTable") // gets table
    // updateTableSize(bolt_hole_table, num_holes, num_cols)
    // var table_rows = getHTMLTableRows(bolt_hole_table)


    // for (let i = 0, row; row = table_rows[i]; i++) {
    //     row.cells[0].innerHTML = (1 + i) + " to "+ (num_holes + 1 + i)
    //     row.cells[0].style.textAlign = "center"

    //     row.cells[1].appendChild(createNumberInputObject())

    //     row.cells[2].innerHTML = "0.0"

    //     row.cells[3].innerHTML = "None"
    // }

    BoltCircleTable.updateTableSize(num_holes)
    var table_rows = BoltCircleTable.getHTMLTableRows()
    
    for (let i = 0, row; row = table_rows[i]; i++) {
        row.cells[0].innerHTML = (1 + i) + " to "+ (num_holes + 1 + i)
        row.cells[0].style.textAlign = "center"

        row.cells[1].appendChild(createNumberInputObject())

        row.cells[2].innerHTML = "0.0"

        row.cells[3].innerHTML = "None"
    }
}

function updateHoleToPilotTable(num_holes) {
    // const num_cols = 4
    // var bolt_hole_table = document.getElementById("HoleToPilotTable") // gets table
    // updateTableSize(bolt_hole_table, num_holes, num_cols)
    // var table_rows = getHTMLTableRows(bolt_hole_table)


    // for (let i = 0, row; row = table_rows[i]; i++) {
    //     row.cells[0].innerHTML = i + 1
    //     row.cells[0].style.textAlign = "center"

    //     row.cells[1].appendChild(createNumberInputObject())

    //     row.cells[2].innerHTML = "0.0"

    //     row.cells[3].innerHTML = "None"
    // }
    HoleToPilotTable.updateTableSize(num_holes)
    var table_rows = HoleToPilotTable.getHTMLTableRows()
    
    for (let i = 0, row; row = table_rows[i]; i++) {
        row.cells[0].innerHTML = i + 1
        row.cells[0].style.textAlign = "center"

        row.cells[1].appendChild(createNumberInputObject())

        row.cells[2].innerHTML = "0.0"

        row.cells[3].innerHTML = "None"
    }
}

function updateHoleToHoleTable(num_holes) {
    // const num_cols = 4
    // var bolt_hole_table = document.getElementById("HoleToHoleTable") // gets table
    // updateTableSize(bolt_hole_table, num_holes, num_cols)
    // var table_rows = getHTMLTableRows(bolt_hole_table)


    // for (let i = 0, row; row = table_rows[i]; i++) {
    //     row.cells[0].innerHTML = (i + 1) + " to " + (((i + 1) % num_holes) + 1)
    //     row.cells[0].style.textAlign = "center"

    //     row.cells[1].appendChild(createNumberInputObject())

    //     row.cells[2].innerHTML = "0.0"

    //     row.cells[3].innerHTML = "None"
    // }
    HoleToHoleTable.updateTableSize(num_holes)
    var table_rows = HoleToHoleTable.getHTMLTableRows()
    
    for (let i = 0, row; row = table_rows[i]; i++) {

        row.cells[0].innerHTML = (i + 1) + " to " + (((i + 1) % num_holes) + 1)
        row.cells[0].style.textAlign = "center"

        row.cells[1].appendChild(createNumberInputObject())

        row.cells[2].innerHTML = "0.0"

        row.cells[3].innerHTML = "None"
    }
}

// function updateTableSize(table, num_rows, num_cols) {
//     // removeAllTableRows(table)
//     tbody = table.getElementsByTagName('tbody')[0]
//     table.removeChild(table.getElementsByTagName('tbody')[0])
//     table_body = table.appendChild(document.createElement("TBODY"))
//     // console.log(table_body)

//     for (var i = 0; i < num_rows; i++) {
//         row = table_body.insertRow()
//         for (var j = 0; j < num_cols; j++) {
//             cell = row.insertCell()
//         }
//     }
// }

function calculate() {

    const bolt_hole_dia = parseFloat(document.getElementById("BoltHoleDia").value)
    const upper_tol     = parseFloat(document.getElementById("UpperTol").value)
    const lower_tol     = parseFloat(document.getElementById("LowerTol").value)
    
    const min = bolt_hole_dia - lower_tol
    const max = bolt_hole_dia + upper_tol

    // a class for each table may be better
    // var input_index = 1
    // var tolerance_output_index = 2
    // var ok_output_index = 3
    // var table = document.getElementById("BoltHoleTable")
    // holes = getInputsTable(input_index, table)
    // // console.log(holes)
    // doCheckTolerance(tolerance_output_index, table, holes, min, max)
    // doCheckOk(ok_output_index, table, holes, min, max)

    // temp
    // var holes = BoltHoleTable.getInputsTable()
    // doCheckTolerance(BoltHoleTable, holes, min, max)

    // calculate table inputs
    BoltHoleTable.calculateTolerance(min, max)
    BoltHoleTable.calculateOK(min, max)

    BoltCircleTable.calculateTolerance()
    BoltCircleTable.calculateOK()

    HoleToPilotTable.calculateTolerance()
    HoleToPilotTable.calculateOK()

    HoleToHoleTable.calculateTolerance()
    HoleToHoleTable.calculateOK()
}


//====Calculations====
// =ABS(B22 - AVERAGE($G$7, $H$7)) / (($G$7 - $H$7) / 2)
// abs(hole-avg(max,min)) / ((max-min) / 2)

function calculateBoltHoleTable() {
    return
}

// function doCheckTolerance(table, holes, min, max) {
//     var outputs = []
//     var len = table.getHTMLTableRows().length
//     for (let i = 0; i < len; i++) {
//         // add image to table here
//         outputs.push(calculateTolerance(holes[i], min, max))
//     }
//     writeOutputsTable(table.tolerance_output_index, table, outputs)
// }

// function calculateTolerance(hole, min, max) {
//     return Math.abs(hole - ((max + min) / 2)) / ((max - min) / 2)
// }

// =IF(B22<=$G$7,IF(B22>=$H$7,"OK","NOK"),"NOK")
// if hole <= max: { if hole >= min: {return "OK"}} else: {return "NOK"}
// function doCheckOk(table, holes, min, max) {
//     var outputs = []
//     for (let i = 0; i < table.rows.length; i++) {
//         outputs.push(calculateOK(holes[i], min, max))
//     }
//     writeOutputsTable(output_index, table, outputs)
// }

// function calculateOK(hole, min, max) {

//     if (hole <= max) {
//         if (hole >= min) {return "OK"}
//         else {return "NOK"}
//     }
//     else {return "NOK"}

// }
//====


// function getInputsTable(input_index, table, row_min = 0) {
//     // input_index: the column for inputs
//     // console.log(table)
//     var input_list = []

//     // loop though rows and cols of the table
//     table_rows = getHTMLTableRows(table)
//     for (let i = row_min, row; row = table_rows[i]; i++) {

//         col_val = parseFloat(row.cells[input_index].firstChild.value)
//         input_list.push(col_val)
//     }

//     return input_list
// }

function writeOutputsTable(output_index, table, outputs) {
    table_rows = table.getHTMLTableRows()
    for (let i = 0, row; row = table_rows[i]; i++) {
        row.cells[output_index].innerHTML = outputs[i]
    }
}

// function writeOutputsTableRepeat(output_index, table, output) {
//     for (var i = 0, row; row = table.rows[i]; i++) {
//         row.cells[output_index].innerHTML = output
//     }
// }

function createNumberInputObject() {
    // <input type="number" step="any" min="0" value="0.8360">
    var input_obj = document.createElement("INPUT")
    input_obj.setAttribute("type", "number")
    input_obj.setAttribute("step", "any")
    input_obj.setAttribute("min", "0")
    input_obj.setAttribute("placeholder", "Enter...")
    return input_obj
}

// function getHTMLTableRows(table) {
//     var table_body = table.getElementsByTagName('tbody')[0]
//     var table_rows = table_body.getElementsByTagName('tr')
//     return table_rows
// }