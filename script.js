
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

    updateTable(num_rows = this.num_rows, num_cols = this.num_cols) {
        this.updateTableSize(num_rows, num_cols)
        var table_rows = this.getHTMLTableRows()

        for (let i = 0, row; row = table_rows[i]; i++) {
            row.cells[this.input_index].appendChild(createNumberInputObject())
    
            row.cells[this.tolerance_output_index].innerHTML = "0.0"
    
            row.cells[this.ok_output_index].innerHTML = "None"
        }
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
const PilotHoleTable   = new InputTable('PilotHoleTable', 1, 3, 0, 1, 2)

const BoltHoleTable    = new InputTable('BoltHoleTable', 1, 4, 1, 2, 3)
const BoltCircleTable  = new InputTable('BoltCircleTable', 1, 7, 1, 5, 6)
const HoleToPilotTable = new InputTable('HoleToPilotTable', 1, 7, 1, 5, 6)
const HoleToHoleTable  = new InputTable('HoleToHoleTable', 1, 7, 1, 5, 6)

// set individual functions

PilotHoleTable.calculateTolerance   = function(min, max) {
    var pilot_hole = this.getInputsTable()[0]
    // row = this.getHTMLTableRows()

    var tol = Math.abs((pilot_hole - (max + min) / 2) / (max - min) / 2)
    writeOutputsTable(this.tolerance_output_index, this, [tol])
}

PilotHoleTable.calculateOK          = function(min, max) {
    var pilot_hole = this.getInputsTable()[0]

    var isOK = null
    if (pilot_hole <= max) {
        if (pilot_hole >= min) {isOK = "OK"}
        else {isOK = "NOK"}
    }
    else {isOK = "NOK"}

    writeOutputsTable(this.ok_output_index, this, [isOK])
}
// abs(hole-avg(max,min)) / ((max-min) / 2)
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
// if hole <= max: { if hole >= min: {return "OK"}} else: {return "NOK"}
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

    PilotHoleTable.updateTable()
    
    updateBoltHoleTable(num_holes)
    updateBoltCircleTable(num_holes)
    updateHoleToPilotTable(num_holes)
    updateHoleToHoleTable(num_holes)

}

function updateBoltHoleTable(num_holes) {

    BoltHoleTable.updateTable(num_holes)
    var table_rows = BoltHoleTable.getHTMLTableRows()

    for (let i = 0, row; row = table_rows[i]; i++) {
        row.cells[0].innerHTML = i + 1
        row.cells[0].style.textAlign = "center"
    }
}

function updateBoltCircleTable(num_holes) {
    num_holes = Math.floor(num_holes / 2)

    BoltCircleTable.updateTable(num_holes)
    var table_rows = BoltCircleTable.getHTMLTableRows()
    
    for (let i = 0, row; row = table_rows[i]; i++) {
        row.cells[0].innerHTML = (1 + i) + " to "+ (num_holes + 1 + i)
        row.cells[0].style.textAlign = "center"
    }
}

function updateHoleToPilotTable(num_holes) {
    HoleToPilotTable.updateTable(num_holes)
    var table_rows = HoleToPilotTable.getHTMLTableRows()
    
    for (let i = 0, row; row = table_rows[i]; i++) {
        row.cells[0].innerHTML = i + 1
        row.cells[0].style.textAlign = "center"
    }
}

function updateHoleToHoleTable(num_holes) {
    HoleToHoleTable.updateTable(num_holes)
    var table_rows = HoleToHoleTable.getHTMLTableRows()
    
    for (let i = 0, row; row = table_rows[i]; i++) {

        row.cells[0].innerHTML = (i + 1) + " to " + (((i + 1) % num_holes) + 1)
        row.cells[0].style.textAlign = "center"
    }
}

function calculate() {

    const bolt_hole_dia = parseFloat(document.getElementById("BoltHoleDia").value)
    const upper_tol     = parseFloat(document.getElementById("UpperTol").value)
    const lower_tol     = parseFloat(document.getElementById("LowerTol").value)
    
    const min = bolt_hole_dia - lower_tol
    const max = bolt_hole_dia + upper_tol

    const true_pos        = parseFloat(document.getElementById("TruePosition").value)
    const MMC             = document.getElementById("MMC").value
    const bolt_circle_dia = parseFloat(document.getElementById("BoltCircleDia").value)
    const pilot_hole_min  = parseFloat(document.getElementById("pilotHoleMin").value)
    const pilot_hole_max  = parseFloat(document.getElementById("pilotHoleMax").value)

    // calculate table inputs
    // tolerance is weird for PilotHoleTable
    PilotHoleTable.calculateTolerance(pilot_hole_min, pilot_hole_max)
    PilotHoleTable.calculateOK(pilot_hole_min, pilot_hole_max)

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

function writeOutputsTable(output_index, table, outputs) {
    table_rows = table.getHTMLTableRows()
    for (let i = 0, row; row = table_rows[i]; i++) {
        row.cells[output_index].innerHTML = outputs[i]
    }
}

function createNumberInputObject() {
    // <input type="number" step="any" min="0" value="0.8360">
    var input_obj = document.createElement("INPUT")
    input_obj.setAttribute("type", "number")
    input_obj.setAttribute("step", "any")
    input_obj.setAttribute("min", "0")
    input_obj.setAttribute("placeholder", "Enter...")
    return input_obj
}