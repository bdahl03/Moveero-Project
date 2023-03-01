class Table {
    constructor(HTMLTableTag, num_rows, num_cols, tolerance_index, ok_index, nom_index = null, tol_index = null, dev_index = null) {
        this.table = document.getElementById(HTMLTableTag)
        this.tolerance_index = tolerance_index
        this.ok_index = ok_index
        this.num_rows = num_rows
        this.num_cols = num_cols

        this.nom_index = nom_index
        this.tol_index = tol_index
        this.dev_index = dev_index
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

        this.HTMLToInternalTable()
    }

    HTMLToInternalTable() {
        var html_table = this.getHTMLTableRows()
        var table = []
        for (let i = 0, row; row = html_table[i]; i++) {
            let temp_list = []
            for (let j = 0, cell; cell = row.cells[j]; j++) {
                cell = cell.firstChild
                // console.log(cell)
                if (cell == null)             {temp_list.push(null); continue}
                if (cell.nodeName == "INPUT") {temp_list.push(cell.value); continue}
                else                          {temp_list.push(cell.nodeValue); continue}
            }
            table.push(temp_list)
        }
        // console.log(table)
        this.internal_table = table
    }

    internalToHTMLTable() {
        var html_table = this.getHTMLTableRows()
        for (let i = 0, row; row = html_table[i]; i++) {
            for (let j = 0, cell; cell = row.cells[j]; j++) {
                if (cell.firstChild == null || cell.firstChild.nodeName != "INPUT") {
                    if (j == this.tolerance_index) {
                        let percent = Math.round(this.internal_table[i][j] * 100)
                        let string = "conic-gradient(Grey " + percent + "%, White " + percent + "% 100%)"
                        cell.firstChild.style.background = string
                        continue
                    }
                    cell.innerHTML = this.internal_table[i][j]
                }
            }
        }
    }

    getHTMLTableRows() {
        var table_body = this.table.getElementsByTagName('tbody')[0]
        var table_rows = table_body.getElementsByTagName('tr')
        return table_rows
    }

    HideColumns(indexes) {
        // console.log(this.table)
        var table_rows = this.getHTMLTableRows()
        for (let i = 0, index; index = indexes[i]; i++) {
            for (let i = 0, row; row = table_rows[i]; i++) {
                let x = row.childNodes[index]
                x.style.display = "none";
            }
        }
    }

    ShowColumns(indexes) {
        // console.log(this.table)
        var table_rows = this.getHTMLTableRows()
        for (let i = 0, index; index = indexes[i]; i++) {
            for (let i = 0, row; row = table_rows[i]; i++) {
                let x = row.childNodes[index]
                x.style.display = "";
            }
        }
    }

    toggleHideColumns(indexes) {
        var table_rows = this.getHTMLTableRows()
        for (let i = 0, index; index = indexes[i]; i++) {
            for (let i = 0, row; row = table_rows[i]; i++) {
                let x = row.childNodes[index]
                if (x.style.display == "none") {x.style.display = "";}
                else                           {x.style.display = "none";}
            }
        }
    }

    updateTable(num_rows = this.num_rows, num_cols = this.num_cols) {
        this.updateTableSize(num_rows, num_cols)
        var table_rows = this.getHTMLTableRows()

        for (let i = 0, row; row = table_rows[i]; i++) {
            row.cells[this.tolerance_index].appendChild(createPieChartObject())
    
            // row.cells[this.ok_index].innerHTML = "None"
        }
    }
}

// separate class with inputs and outputs that extends the from the Table class
class InputTable extends Table {
    constructor(HTMLTableTag, num_rows, num_cols, input_index, tolerance_index, ok_index, nom_index = null, tol_index = null, dev_index = null) {
        super(HTMLTableTag, num_rows, num_cols, tolerance_index, ok_index, nom_index, tol_index, dev_index)
        this.input_index = input_index
        // this.tolerance_index = tolerance_index
        // this.ok_index = ok_index
    }

    updateTable(num_rows = this.num_rows, num_cols = this.num_cols) {
        this.updateTableSize(num_rows, num_cols)
        var table_rows = this.getHTMLTableRows()

        for (let i = 0, row; row = table_rows[i]; i++) {
            row.cells[this.input_index].appendChild(createNumberInputObject())
    
            row.cells[this.tolerance_index].appendChild(createPieChartObject())
        }
    }

    getInputsTable() {
        // input_index: the column for inputs
        // console.log(table)
        var input_list = []
    
        // loop though rows and cols of the table
        var table_rows = this.internal_table
        for (let i = 0, row; row = table_rows[i]; i++) {
    
            // let col_val = parseFloat(row.cells[this.input_index].firstChild.value)
            input_list.push(parseFloat(row[this.input_index]))
        }
    
        return input_list
    }

    getRowValues(index) {
        // input_index: the column for inputs
        // console.log(table)
        var list = []
    
        // loop though rows and cols of the table
        // var table_rows = this.getHTMLTableRows(this.table)
        for (let i = 0, row; row = this.internal_table[i]; i++) {
    
            let col_val = parseFloat(row[index])
            list.push(col_val)
        }
    
        return list
    }
}



//      Table(HTMLTableTag, num_rows, num_cols,              tolerance_index, ok_index, nom_index = null, tol_index = null, dev_index = null)
// InputTable(HTMLTableTag, num_rows, num_cols, input_index, tolerance_index, ok_index, nom_index = null, tol_index = null, dev_index = null)
const PilotHoleTable   = new InputTable('PilotHoleTable', 1, 3, 0, 1, 2)

const BoltHoleTable    = new InputTable('BoltHoleTable', 1, 4, 1, 2, 3)
// BoltHoleTable.HTMLToInternalTable()
const BoltCircleTable  = new InputTable('BoltCircleTable', 1, 7, 1, 5, 6, 2, 3, 4)
// const AverageBoltCircleTable  = new Table('BoltCircleTable', 1, 7, 1, 5, 6, 2, 3, 4)

const HoleToPilotTable = new InputTable('HoleToPilotTable', 1, 7, 1, 5, 6, 2, 3, 4)
const HoleToHoleTable  = new InputTable('HoleToHoleTable', 1, 7, 1, 5, 6, 2, 3, 4)

var show_additional_info = false
// set individual functions
setTables()

// fillInputs()

// may be a better way
function setTables() {
    PilotHoleTable.calculateTolerance   = function(min, max) {
        var pilot_hole = this.getInputsTable()[0]
        // row = this.getHTMLTableRows()
        var tolerance = Math.abs((pilot_hole - (max + min) / 2)) / ((max - min) / 2)
        this.internal_table[0][this.tolerance_index] = tolerance
        // this.writeOutputsTable(this.tolerance_index, [tol])
    }
    PilotHoleTable.calculateOK          = function(min, max) {
        var pilot_hole = this.getInputsTable()[0]

        var isOK = null
        if (pilot_hole <= max) {
            if (pilot_hole >= min) {isOK = "OK"}
            else {isOK = "NOK"}
        }
        else {isOK = "NOK"}

        // this.writeOutputsTable(this.ok_index, [isOK])
        this.internal_table[0][this.ok_index] = isOK
    }


    // abs(hole-avg(max,min)) / ((max-min) / 2)
    BoltHoleTable.calculateTolerance    = function(min, max) {
        var holes = this.getInputsTable()
        // var outputs = []
        var len = this.internal_table.length

        for (let i = 0; i < len; i++) {
            // add image to table here
            let tolerance = Math.abs(holes[i] - ((max + min) / 2)) / ((max - min) / 2)
            // outputs.push(tol)
            this.internal_table[i][this.tolerance_index] = tolerance
        }

        // this.writeOutputsTable(this.tolerance_index, outputs)
    }
    // if hole <= max: { if hole >= min: {return "OK"}} else: {return "NOK"}
    BoltHoleTable.calculateOK           = function(min, max) {
        var holes = this.getInputsTable()
        // var outputs = []

        for (let i = 0; i < this.internal_table.length; i++) {
            let isOK = null
            if (holes[i] <= max) {
                if (holes[i] >= min) {isOK = "OK"}
                else {isOK = "NOK"}
            }
            else {isOK = "NOK"}
            // outputs.push(isOK)
            this.internal_table[i][this.ok_index] = isOK
        }
        
        // this.writeOutputsTable(this.ok_index, outputs)
    }


    BoltCircleTable.calculateNom = function(bolt_circle_dia, hole_to_pilot_tol_rows) {
        // var outputs = []

        for (let i = 0; i < this.num_rows; i++) {
            let nom = bolt_circle_dia + hole_to_pilot_tol_rows[i] + hole_to_pilot_tol_rows[i + 4]
            // outputs.push(roundDecimal(nom, 3))
            this.internal_table[i][this.nom_index] = roundDecimal(nom, 3)
        }

        // this.writeOutputsTable(this.nom_index, outputs)
    }
    BoltCircleTable.calculateTol = function(bolt_circle_dia, hole_to_pilot_tol_rows) {
        // var outputs = []

        for (let i = 0; i < this.num_rows; i++) {
            let tol = bolt_circle_dia - hole_to_pilot_tol_rows[i] - hole_to_pilot_tol_rows[i + 4]
            // outputs.push(roundDecimal(tol, 3))
            this.internal_table[i][this.tol_index] = roundDecimal(tol, 3)
        }

        // this.writeOutputsTable(this.tol_index, outputs)
    }
    BoltCircleTable.calculateDev = function(bolt_holes) {
        // var outputs = []
        var holes = this.getInputsTable()

        for (let i = 0; i < this.num_rows; i++) {
            let dev = holes[i] + bolt_holes[i] / 2 + bolt_holes[i + 4] / 2
            // outputs.push(roundDecimal(dev, 3))
            this.internal_table[i][this.dev_index] = roundDecimal(dev, 3)
        }

        // this.writeOutputsTable(this.dev_index, outputs)
    }
    BoltCircleTable.calculateTolerance  = function(bolt_circle_dia) {
        // var outputs = []
        var nom_values = this.getRowValues(this.nom_index)
        var dev_values = this.getRowValues(this.dev_index)

        for (let i = 0; i < this.num_rows; i++) {
        let tolerance = Math.abs(dev_values[i] - bolt_circle_dia) / Math.abs(nom_values[i] - bolt_circle_dia)
        // outputs.push(roundDecimal(tolerance, 3))
        this.internal_table[i][this.tolerance_index] = roundDecimal(tolerance, 3)
    }

    // this.writeOutputsTable(this.tolerance_index, outputs)
    }
    BoltCircleTable.calculateOK         = function() {
        // var outputs = []
        var nom_values = this.getRowValues(this.nom_index)
        var tol_values = this.getRowValues(this.tol_index)
        var dev_values = this.getRowValues(this.dev_index)

        for (let i = 0; i < this.num_rows; i++) {
            let isOK = null
            if (dev_values[i] <= nom_values[i]) {
                if (dev_values[i] >= tol_values[i]) {
                    isOK = "OK"
                }
                else {
                    isOK = "NOK"
                }
            }
            else {
                isOK = "NOK"
            }
            // outputs.push(isOK)
            this.internal_table[i][this.ok_index] = isOK
        }

        // this.writeOutputsTable(this.ok_index, outputs)
    }


    HoleToPilotTable.calculateNom = function(bolt_circle_dia, pilot_hole, bolt_holes) {
        // var outputs = []

        for (let i = 0; i < this.internal_table.length; i++) {
            let nom = (bolt_circle_dia - pilot_hole) / 2 - bolt_holes[i] / 2
            // outputs.push(roundDecimal(nom, 3))
            this.internal_table[i][this.nom_index] = roundDecimal(nom, 3)
        }

        // this.writeOutputsTable(this.nom_index, outputs)
    }
    HoleToPilotTable.calculateTol = function(MMC, true_pos, min, bolt_holes) {
        // var outputs = []

        if (MMC == "YES") {
            for (let i = 0; i < this.internal_table.length; i++) {
                let tol = (bolt_holes[i] - min + true_pos) / 2
                // outputs.push(roundDecimal(tol, 3))
                this.internal_table[i][this.tol_index] = roundDecimal(tol, 3)
            }
        }
        else {
            for (let i = 0; i < this.internal_table.length; i++) {
                let tol = true_pos / 2
                // outputs.push(tol)
                this.internal_table[i][this.tol_index] = roundDecimal(tol, 3)
            }
        }

        // this.writeOutputsTable(this.tol_index, outputs)
    }
    HoleToPilotTable.calculateDev = function() {
        // var outputs = []
        var table_rows = this.getHTMLTableRows()
        
        for (let i = 0, row; row = table_rows[i]; i++) {
            // let hole = parseFloat(row.cells[this.input_index].firstChild.value)
            // let nom = parseFloat(row.cells[this.nom_index].innerHTML)
            let hole = parseFloat(this.internal_table[i][this.input_index])
            let nom = parseFloat(this.internal_table[i][this.nom_index])
            let dev = Math.abs(hole - nom)
            // outputs.push(roundDecimal(dev, 3))
            this.internal_table[i][this.dev_index] = roundDecimal(dev, 3)
        }

        // this.writeOutputsTable(this.dev_index, outputs)
    }
    HoleToPilotTable.calculateTolerance = function() {
        // var outputs = []
        // var table_rows = this.getHTMLTableRows()
        
        for (let i = 0, row; row = this.internal_table[i]; i++) {
            // let tol = parseFloat(row.cells[this.tol_index].innerHTML)
            // let dev = parseFloat(row.cells[this.dev_index].innerHTML)
            let tol = parseFloat(row[this.tol_index])
            let dev = parseFloat(row[this.dev_index])
            
            let tolerance = dev / tol
            // outputs.push(roundDecimal(tolerance, 3))
            this.internal_table[i][this.tolerance_index] = roundDecimal(tolerance, 3)
        }

        // this.writeOutputsTable(this.tolerance_index, outputs)
    }
    HoleToPilotTable.calculateOK        = function() {
        // var outputs = []
        // var table_rows = this.getHTMLTableRows()

        for (let i = 0, row; row = this.internal_table[i]; i++) {
            let tol = parseFloat(row[this.tol_index])
            let dev = parseFloat(row[this.dev_index])
            let isOK = null
            if (dev <= tol) {
                isOK = "OK"
            }
            else {
                isOK = "NOK"
            }
            // outputs.push(isOK)
            this.internal_table[i][this.ok_index] = isOK
        }

        // this.writeOutputsTable(this.ok_index, outputs)
    }


    HoleToHoleTable.calculateNom  = function(hole_to_hole_calculation, bolt_holes) {
        // var outputs = []
        var length = this.num_rows

        for (let i = 0; i < length; i++) {
            let nom = hole_to_hole_calculation - (bolt_holes[i] / 2) - (bolt_holes[(i + 1) % length] / 2)
            // outputs.push(roundDecimal(nom, 4))
            this.internal_table[i][this.nom_index] = roundDecimal(nom, 4)
        }

        // this.writeOutputsTable(this.nom_index, outputs)
    }
    HoleToHoleTable.calculateTol  = function(hole_to_pilot_tol_rows) {
        // var outputs = []
        var length = this.num_rows

        for (let i = 0; i < length; i++) {
            let tol = hole_to_pilot_tol_rows[i] / 2 + hole_to_pilot_tol_rows[(i + 1) % length] / 2
            // outputs.push(roundDecimal(tol, 3))
            this.internal_table[i][this.tol_index] = roundDecimal(tol, 3)
        }

        // this.writeOutputsTable(this.tol_index, outputs)
    }
    HoleToHoleTable.calculateDev  = function() {
        // var outputs = []
        // var table_rows = this.getHTMLTableRows()
        
        for (let i = 0, row; row = this.internal_table[i]; i++) {
            // let nom = parseFloat(row.cells[this.nom_index].innerHTML)
            // let hole = parseFloat(row.cells[this.input_index].firstChild.value)
            let nom = parseFloat(row[this.nom_index])
            let hole = parseFloat(row[this.input_index])
            let dev = Math.abs(hole - nom)
            // outputs.push(roundDecimal(dev, 3))
            this.internal_table[i][this.dev_index] = roundDecimal(dev, 3)
            // this.writeOutputsTable(this.dev_index, outputs)
        }
    }
    HoleToHoleTable.calculateTolerance  = function() {
        // var outputs = []
        // var table_rows = this.getHTMLTableRows()
        
        for (let i = 0, row; row = this.internal_table[i]; i++) {
            let tol = parseFloat(row[this.tol_index])
            let dev = parseFloat(row[this.dev_index])
            let tolerance = dev/tol
            // outputs.push(roundDecimal(tolerance, 3))
            this.internal_table[i][this.tolerance_index] = roundDecimal(tolerance, 3)
        }
        // this.writeOutputsTable(this.tolerance_index, outputs)
    }
    HoleToHoleTable.calculateOK         = function() {
        // var outputs = []
        // var table_rows = this.getHTMLTableRows()
        
        for (let i = 0, row; row = this.internal_table[i]; i++) {
            let tol = parseFloat(row[this.tol_index])
            let dev = parseFloat(row[this.dev_index])

            let isOK = null
            if (dev <= tol) {
                isOK = "OK"
            }
            else {
                isOK = "NOK"
            }

            // outputs.push(isOK)
            this.internal_table[i][this.ok_index] = isOK
        }
        // this.writeOutputsTable(this.ok_index, outputs)

    }
}




function calculate() {
    document.getElementById("toggleAdditionalInfoButton").disabled = false



    PilotHoleTable.HTMLToInternalTable()
    BoltHoleTable.HTMLToInternalTable()
    BoltCircleTable.HTMLToInternalTable()
    HoleToPilotTable.HTMLToInternalTable()
    HoleToHoleTable.HTMLToInternalTable()


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


    const min                      = bolt_hole_dia - lower_tol
    const max                      = bolt_hole_dia + upper_tol
    const num_holes_radians        = convertToRadians(360/num_holes)
    const hole_to_hole_calculation = Math.sqrt(2 * ((bolt_circle_dia / 2) ** 2 ) - (2 * (bolt_circle_dia / 2) ** 2 * Math.cos(num_holes_radians)))


    // calculate table inputs
    PilotHoleTable.calculateTolerance(pilot_hole_min, pilot_hole_max)
    PilotHoleTable.calculateOK(pilot_hole_min, pilot_hole_max)

    BoltHoleTable.calculateTolerance(min, max)
    BoltHoleTable.calculateOK(min, max)

    HoleToPilotTable.calculateNom(bolt_circle_dia, pilot_hole, BoltHoleTable.getInputsTable())
    HoleToPilotTable.calculateTol(MMC, true_pos, min, BoltHoleTable.getInputsTable())
    HoleToPilotTable.calculateDev()
    HoleToPilotTable.calculateTolerance()
    HoleToPilotTable.calculateOK()

    BoltCircleTable.calculateNom(bolt_circle_dia, HoleToPilotTable.getRowValues(3))
    BoltCircleTable.calculateTol(bolt_circle_dia, HoleToPilotTable.getRowValues(3))
    BoltCircleTable.calculateDev(BoltHoleTable.getInputsTable())
    BoltCircleTable.calculateTolerance(bolt_circle_dia)
    BoltCircleTable.calculateOK()

    HoleToHoleTable.calculateNom(hole_to_hole_calculation, BoltHoleTable.getInputsTable())
    HoleToHoleTable.calculateTol(HoleToPilotTable.getRowValues(3))
    HoleToHoleTable.calculateDev()
    HoleToHoleTable.calculateTolerance()
    HoleToHoleTable.calculateOK()

    // write to table
    PilotHoleTable.internalToHTMLTable()
    BoltHoleTable.internalToHTMLTable()
    BoltCircleTable.internalToHTMLTable()
    HoleToPilotTable.internalToHTMLTable()
    HoleToHoleTable.internalToHTMLTable()

    // show columns
    PilotHoleTable.ShowColumns  ([PilotHoleTable.ok_index,   PilotHoleTable.tolerance_index])
    BoltHoleTable.ShowColumns   ([BoltHoleTable.ok_index,    BoltHoleTable.tolerance_index])
    BoltCircleTable.ShowColumns ([BoltCircleTable.ok_index,  BoltCircleTable.tolerance_index])
    HoleToPilotTable.ShowColumns([HoleToPilotTable.ok_index, HoleToPilotTable.tolerance_index])
    HoleToHoleTable.ShowColumns ([HoleToHoleTable.ok_index,  HoleToHoleTable.tolerance_index])

    colorAllHTMLOk()
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
    }
}

function updateBoltCircleTable(num_holes) {
    num_holes = Math.floor(num_holes / 2)

    BoltCircleTable.updateTable(num_holes)
    var table_rows = BoltCircleTable.getHTMLTableRows()
    
    for (let i = 0, row; row = table_rows[i]; i++) {
        row.cells[0].innerHTML = (1 + i) + " to "+ (num_holes + 1 + i)
    }
}

function updateHoleToPilotTable(num_holes) {
    HoleToPilotTable.updateTable(num_holes)
    var table_rows = HoleToPilotTable.getHTMLTableRows()
    
    for (let i = 0, row; row = table_rows[i]; i++) {
        row.cells[0].innerHTML = i + 1
    }
}

function updateHoleToHoleTable(num_holes) {
    HoleToHoleTable.updateTable(num_holes)
    var table_rows = HoleToHoleTable.getHTMLTableRows()
    
    for (let i = 0, row; row = table_rows[i]; i++) {

        row.cells[0].innerHTML = (i + 1) + " to " + (((i + 1) % num_holes) + 1)
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

function createPieChartObject() {
    chart = document.createElement("DIV")
    chart.className = "pie-chart"
    chart.background = 'conic-gradient(Grey 50%, White 50% 100%)'
    return chart
}

function convertToRadians(degrees) {
    var pi = Math.PI;
    return degrees * (pi/180);
}

// demo
function fillInputs() {
    var all_inputs = document.getElementsByTagName("input");

    var demo_list = [
        8,
        0.846,
        0.020,
        0.020,
        0.020,
        10.827,
        8.721,
        8.701,

        8.7210,
        0.8360,
        0.8390,
        0.8350,
        0.8390,
        0.8500,
        0.8380,
        0.8390,
        0.8390,
        10.0170,
        10.0175,
        10.0185,
        10.0180,
        0.6580,
        0.6450,
        0.6480,
        0.6500,
        0.6410,
        0.6510,
        0.6500,
        0.6490,
        3.3230,
        3.3150,
        3.3180,
        3.3060,
        3.3070,
        3.3110,
        3.3160,
        3.3120

    ]

    for (let i = 0, input; input = all_inputs[i]; i++) {
        input.value = demo_list[i]
        // console.log(input.value)
    }
}

function roundDecimal(number, digits) {
    return Math.round((number + Number.EPSILON) * (10 ** digits)) / (10 ** digits)
}

function colorHTMLOk(HTML_Ok) {
    // if (HTML_Ok.innerHTML == "OK")       {HTML_Ok.style.backgroundColor='#00FF00'}
    // else if (HTML_Ok.innerHTML == "NOK") {HTML_Ok.style.backgroundColor='#FF0000'}
    if (HTML_Ok.innerHTML == "OK")       {HTML_Ok.className = "isOK"}
    else if (HTML_Ok.innerHTML == "NOK") {HTML_Ok.className = "isNOK"}
}

function colorAllHTMLOk() {
    var table_rows = PilotHoleTable.getHTMLTableRows()
    for (let i = 0, row; row = table_rows[i]; i++) {
        colorHTMLOk(row.cells[PilotHoleTable.ok_index])
    }


    var table_rows = BoltHoleTable.getHTMLTableRows()
    for (let i = 0, row; row = table_rows[i]; i++) {
        colorHTMLOk(row.cells[BoltHoleTable.ok_index])
    }

    var table_rows = BoltCircleTable.getHTMLTableRows()
    for (let i = 0, row; row = table_rows[i]; i++) {
        colorHTMLOk(row.cells[BoltCircleTable.ok_index])
    }

    var table_rows = HoleToPilotTable.getHTMLTableRows()
    for (let i = 0, row; row = table_rows[i]; i++) {
        colorHTMLOk(row.cells[HoleToPilotTable.ok_index])
    }

    var table_rows = HoleToHoleTable.getHTMLTableRows()
    for (let i = 0, row; row = table_rows[i]; i++) {
        colorHTMLOk(row.cells[HoleToHoleTable.ok_index])
    }
}

function turnOnGlobals() {
    document.getElementById("StartButton").style.display = ""
    // find a better word then Disableable
    let disableables = document.getElementsByClassName("DisableableInput")
    for (let i = 0, disableable; disableable = disableables[i]; i++) {
        disableable.disabled = false
    }
}

function turnOffGlobals() {
    document.getElementById("StartButton").style.display = "none"
    // find a better word then Disableable
    let disableables = document.getElementsByClassName("DisableableInput")
    for (let i = 0, disableable; disableable = disableables[i]; i++) {
        disableable.disabled = true
    }
}

function showTables() {
    if (document.forms[0].checkValidity() == false) {return}
    turnOffGlobals()
    showHidables("HidableTables")
    updateTables()
    show_additional_info = false
    
    PilotHoleTable.HideColumns  ([PilotHoleTable.ok_index,   PilotHoleTable.tolerance_index])
    BoltHoleTable.HideColumns   ([BoltHoleTable.ok_index,    BoltHoleTable.tolerance_index])
    BoltCircleTable.HideColumns ([BoltCircleTable.nom_index, BoltCircleTable.tol_index, BoltCircleTable.dev_index, BoltCircleTable.ok_index,  BoltCircleTable.tolerance_index])
    HoleToPilotTable.HideColumns([BoltCircleTable.nom_index, BoltCircleTable.tol_index, BoltCircleTable.dev_index, HoleToPilotTable.ok_index, HoleToPilotTable.tolerance_index])
    HoleToHoleTable.HideColumns ([BoltCircleTable.nom_index, BoltCircleTable.tol_index, BoltCircleTable.dev_index, HoleToHoleTable.ok_index,  HoleToHoleTable.tolerance_index])
}

function resetTables() {
    updateTables()
    
    hideHidables("HidableInfo")
    document.getElementById("toggleAdditionalInfoButton").textContent = "Show More"
    document.getElementById("toggleAdditionalInfoButton").disabled = true
    show_additional_info = false
    
    PilotHoleTable.HideColumns  ([PilotHoleTable.ok_index,   PilotHoleTable.tolerance_index])
    BoltHoleTable.HideColumns   ([BoltHoleTable.ok_index,    BoltHoleTable.tolerance_index])
    BoltCircleTable.HideColumns ([BoltCircleTable.nom_index, BoltCircleTable.tol_index, BoltCircleTable.dev_index, BoltCircleTable.ok_index,  BoltCircleTable.tolerance_index])
    HoleToPilotTable.HideColumns([BoltCircleTable.nom_index, BoltCircleTable.tol_index, BoltCircleTable.dev_index, HoleToPilotTable.ok_index, HoleToPilotTable.tolerance_index])
    HoleToHoleTable.HideColumns ([BoltCircleTable.nom_index, BoltCircleTable.tol_index, BoltCircleTable.dev_index, HoleToHoleTable.ok_index,  HoleToHoleTable.tolerance_index])
}

function resetAll() {
    turnOnGlobals()
    hideHidables("HidableTables")

    resetTables()
}

function toggleAdditionalInfo() {
    if (show_additional_info == false) {
        // console.log(document.getElementById("toggleAdditionalInfoButton"))
        document.getElementById("toggleAdditionalInfoButton").textContent = "Show Less"
        show_additional_info = true
    }
    else {
        document.getElementById("toggleAdditionalInfoButton").textContent = "Show More"
        show_additional_info = false
    }
    // PilotHoleTable.toggleHideColumns  ([PilotHoleTable.ok_index,   PilotHoleTable.tolerance_index])
    // BoltHoleTable.toggleHideColumns   ([BoltHoleTable.ok_index,    BoltHoleTable.tolerance_index])
    toggleHidables("HidableInfo")
    BoltCircleTable.toggleHideColumns ([BoltCircleTable.nom_index, BoltCircleTable.tol_index, BoltCircleTable.dev_index])
    HoleToPilotTable.toggleHideColumns([BoltCircleTable.nom_index, BoltCircleTable.tol_index, BoltCircleTable.dev_index])
    HoleToHoleTable.toggleHideColumns ([BoltCircleTable.nom_index, BoltCircleTable.tol_index, BoltCircleTable.dev_index])
}

function toggleHidables(className) {
    var hidables = document.getElementsByClassName(className)
    // console.log(hidables)
    for (var i = 0, hidable; hidable = hidables[i]; i++) {
        if (hidable.style.display == "none") {
            hidable.style.display = ""
        } else {
            hidable.style.display = "none"
        }
    }
}

function showHidables(className) {
    var hidables = document.getElementsByClassName(className)
    // console.log(hidables)
    for (var i = 0, hidable; hidable = hidables[i]; i++) {
        hidable.style.display = ""
    }
}

function hideHidables(className) {
    var hidables = document.getElementsByClassName(className)
    // console.log(hidables)
    for (var i = 0, hidable; hidable = hidables[i]; i++) {
        hidable.style.display = "none"
    }
}