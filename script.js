
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
    constructor(HTMLTableTag, num_rows, num_cols, input_index, tolerance_index, ok_index) {
        super(HTMLTableTag, num_rows, num_cols)
        this.input_index = input_index
        this.tolerance_index = tolerance_index
        this.ok_index = ok_index
    }

    updateTable(num_rows = this.num_rows, num_cols = this.num_cols) {
        this.updateTableSize(num_rows, num_cols)
        var table_rows = this.getHTMLTableRows()

        for (let i = 0, row; row = table_rows[i]; i++) {
            row.cells[this.input_index].appendChild(createNumberInputObject())
    
            row.cells[this.tolerance_index].innerHTML = "0.0"
    
            row.cells[this.ok_index].innerHTML = "None"
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

    // calculateTolerance(){}
    // calculateOK(){}
}

// InputTable(HTMLTableTag, num_rows, num_cols, input_index, tolerance_index, ok_index)
const PilotHoleTable   = new InputTable('PilotHoleTable', 1, 3, 0, 1, 2)

const BoltHoleTable    = new InputTable('BoltHoleTable', 1, 4, 1, 2, 3)
const BoltCircleTable  = new InputTable('BoltCircleTable', 1, 7, 1, 5, 6)
const HoleToPilotTable = new InputTable('HoleToPilotTable', 1, 7, 1, 5, 6)
const HoleToHoleTable  = new InputTable('HoleToHoleTable', 1, 7, 1, 5, 6)

// set individual functions
setTables()

function setTables() {
    PilotHoleTable.calculateTolerance   = function(min, max) {
        var pilot_hole = this.getInputsTable()[0]
        // row = this.getHTMLTableRows()
    
        var tol = Math.abs((pilot_hole - (max + min) / 2) / (max - min) / 2)
        writeOutputsTable(this.tolerance_index, this, [tol])
    }
    PilotHoleTable.calculateOK          = function(min, max) {
        var pilot_hole = this.getInputsTable()[0]
    
        var isOK = null
        if (pilot_hole <= max) {
            if (pilot_hole >= min) {isOK = "OK"}
            else {isOK = "NOK"}
        }
        else {isOK = "NOK"}
    
        writeOutputsTable(this.ok_index, this, [isOK])
    }


    // abs(hole-avg(max,min)) / ((max-min) / 2)
    BoltHoleTable.calculateTolerance    = function(min, max) {
        var holes = this.getInputsTable()
        var outputs = []
        var len = this.getHTMLTableRows().length
    
        for (let i = 0; i < len; i++) {
            // add image to table here
            let tol = Math.abs(holes[i] - ((max + min) / 2)) / ((max - min) / 2)
            outputs.push(tol)
        }
    
        writeOutputsTable(this.tolerance_index, this, outputs)
    }
    // if hole <= max: { if hole >= min: {return "OK"}} else: {return "NOK"}
    BoltHoleTable.calculateOK           = function(min, max) {
        var holes = this.getInputsTable()
        var outputs = []
    
        for (let i = 0; i < this.table.rows.length; i++) {
            let isOK = null
            if (holes[i] <= max) {
                if (holes[i] >= min) {isOK = "OK"}
                else {isOK = "NOK"}
            }
            else {isOK = "NOK"}
            outputs.push(isOK)
        }
        
        writeOutputsTable(this.ok_index, this, outputs)
    }


    BoltCircleTable.nom_index = 2
    BoltCircleTable.tol_index = 3
    BoltCircleTable.dev_index = 4
    BoltCircleTable.calculateTolerance  = function() {
        console.log("BoltCircleTable calculateTolerance")
    }
    BoltCircleTable.calculateOK         = function() {
        console.log("BoltCircleTable calculateOK")
    }


    
    HoleToPilotTable.nom_index = 2
    HoleToPilotTable.tol_index = 3
    HoleToPilotTable.dev_index = 4
    HoleToPilotTable.calculateNom = function(bolt_circle_dia, pilot_hole, bolt_holes) {
        var outputs = []

        for (let i; i < this.table.rows.length; i++) {
            let nom = (bolt_circle_dia - pilot_hole) / 2 - bolt_holes[i] / 2
            outputs.push(nom)
        }

        writeOutputsTable(this.nom_index, this, outputs)
    }
    HoleToPilotTable.calculateTol = function(MMC, true_pos, min, bolt_holes) {
        var outputs = []

        if (MMC == "YES") {
            for (let i; i < this.table.rows.length; i++) {
                let tol = (bolt_holes[i] - min + true_pos) / 2
                outputs.push(tol)
            }
        }
        else {
            let tol = true_pos / 2
            outputs.push(tol)
        }

        writeOutputsTable(this.tol_index, this, outputs)
    }
    HoleToPilotTable.calculateDev = function() {
        var outputs = []
        var table_rows = this.getHTMLTableRows()
        
        for (let i = 0, row; row = table_rows[i]; i++) {
            let hole = parseFloat(row.cells[this.input_index].firstChild.value)
            let nom = parseFloat(row.cells[this.nom_index].innerHTML)
            let dev = Math.abs(hole - nom)
            outputs.push(dev)
        }

        writeOutputsTable(this.dev_index, this, outputs)
    }
    HoleToPilotTable.calculateTolerance = function() {
        var outputs = []
        var table_rows = this.getHTMLTableRows()
        
        for (let i = 0, row; row = table_rows[i]; i++) {
            let tol = parseFloat(row.cells[this.tol_index].innerHTML)
            let dev = parseFloat(row.cells[this.dev_index].innerHTML)
            
            let tolerance = dev / tol
            outputs.push(tolerance)
        }

        writeOutputsTable(this.tolerance_index, this, outputs)
    }
    HoleToPilotTable.calculateOK        = function() {
        var outputs = []
        var table_rows = this.getHTMLTableRows()

        for (let i = 0, row; row = table_rows[i]; i++) {
            let tol = parseFloat(row.cells[this.tol_index].innerHTML)
            let dev = parseFloat(row.cells[this.dev_index].innerHTML)
            let isOK = null
            if (dev <= tol) {
                isOK = "OK"
            }
            else {
                isOK = "NOK"
            }
            outputs.push(isOK)
        }

        writeOutputsTable(this.ok_index, this, outputs)
    }
    

    
    HoleToHoleTable.nom_index = 2
    HoleToHoleTable.tol_index = 3
    HoleToHoleTable.dev_index = 4
    HoleToHoleTable.calculateNom  = function(hole_to_hole_calculation, bolt_holes) {
        var outputs = []
        var length = self.table.rows.length

        for (let i = 0; i < length; i++) {
            let nom = hole_to_hole_calculation - (bolt_holes[i] / 2) - (bolt_holes[(i + 1) % length] / 2)
            outputs.push(nom)
        }

        writeOutputsTable(this.nom_index, this, outputs)
    }
    HoleToHoleTable.calculateTol  = function(hole_to_pilot_tol_rows) {
        var outputs = []
        var length = self.table.rows.length

        for (let i = 0; i < length; i++) {
            let tol = hole_to_pilot_tol_rows[i] / 2 + hole_to_pilot_tol_rows[(i + 1) % length] / 2
            outputs.push(tol)
        }

        writeOutputsTable(tol_index, this, outputs)
    }
    HoleToHoleTable.calculateDev  = function() {
        var outputs = []
        var table_rows = this.getHTMLTableRows()
        
        for (let i = 0, row; row = table_rows[i]; i++) {
            let nom = parseFloat(row.cells[this.nom_index].innerHTML)
            let hole = parseFloat(row.cells[this.input_index].firstChild.value)
            let dev = Math.abs(hole - nom)
            outputs.push(dev)
            writeOutputsTable(dev_index, this, outputs)
        }
    }
    HoleToHoleTable.calculateTolerance  = function() {
        var outputs = []
        var table_rows = this.getHTMLTableRows()
        
        for (let i = 0, row; row = table_rows[i]; i++) {
            let tol = parseFloat(row.cells[this.tol_index].innerHTML)
            let dev = parseFloat(row.cells[this.dev_index].innerHTML)
            let tolerance = tol/dev
            outputs.push(tolerance)
        }
        writeOutputsTable(this.tolerance_index, this, outputs)
    }
    HoleToHoleTable.calculateOK         = function() {
        var outputs = []
        var table_rows = this.getHTMLTableRows()
        
        for (let i = 0, row; row = table_rows[i]; i++) {
            let tol = parseFloat(row.cells[this.tol_index].innerHTML)
            let dev = parseFloat(row.cells[this.dev_index].innerHTML)

            let isOK = null
            if (dev <= tol) {
                isOK = "OK"
            }
            else {
                isOK = "NOK"
            }

            outputs.push(isOK)
        }
        writeOutputsTable(this.ok_index, this, outputs)

    }
}

function calculate() {

    const num_holes       = parseFloat(document.getElementById("NumHoles").value)
    const bolt_hole_dia   = parseFloat(document.getElementById("BoltHoleDia").value)
    const upper_tol       = parseFloat(document.getElementById("UpperTol").value)
    const lower_tol       = parseFloat(document.getElementById("LowerTol").value)
    const true_pos        = parseFloat(document.getElementById("TruePosition").value)
    const MMC             = document.getElementById("MMC").value
    const bolt_circle_dia = parseFloat(document.getElementById("BoltCircleDia").value)
    const pilot_hole      = PilotHoleTable.getInputsTable()[0]
    const pilot_hole_min  = parseFloat(document.getElementById("pilotHoleMin").value)
    const pilot_hole_max  = parseFloat(document.getElementById("pilotHoleMax").value)

    const min = bolt_hole_dia - lower_tol
    const max = bolt_hole_dia + upper_tol
    const num_holes_radians = convertToRadians(360/num_holes)
    const hole_to_hole_calculation = Math.sqrt(2 * ((bolt_circle_dia / 2) ** 2 ) - ((2 * (bolt_circle_dia / 2)) ** 2 * Math.cos(num_holes_radians)))

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


//====Calculations====
// =ABS(B22 - AVERAGE($G$7, $H$7)) / (($G$7 - $H$7) / 2)
// abs(hole-avg(max,min)) / ((max-min) / 2)

function calculateBoltHoleTable() {
    return
}

// could move to the table class
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

function convertToRadians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}
