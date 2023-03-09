
// ===objects===
// adjust classes to have nom dev and tol variables to be created in there own class
class Table {
    constructor(HTMLTableTag, num_rows, num_cols) {
        this.table = document.getElementById(HTMLTableTag)
        this.num_rows = num_rows
        this.num_cols = num_cols

        // this.tolerance_index = tolerance_index
        // this.ok_index = ok_index
        // this.nom_index = nom_index
        // this.tol_index = tol_index
        // this.dev_index = dev_index
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

    // could have this start in the constructor
    HTMLToInternalTable() {
        var html_table = this.getHTMLTableRows()
        var table = []
        for (let i = 0, row; row = html_table[i]; i++) {
            let temp_list = []
            for (let j = 0, cell; cell = row.cells[j]; j++) {
                cell = cell.firstChild
                // console.log(cell)
                if (cell == null) { temp_list.push(null); continue }
                if (cell.nodeName == "INPUT") { temp_list.push(cell.value); continue }
                else { temp_list.push(cell.nodeValue); continue }
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
                if (x.style.display == "none") { x.style.display = ""; }
                else { x.style.display = "none"; }
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

// extended class with inputs and outputs
class InputTable extends Table {
    constructor(HTMLTableTag, num_rows, num_cols, input_index) {
        // inherit the Table class properties
        super(HTMLTableTag, num_rows, num_cols)

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
}

// ==Table Calculations==
class PilotHoleTable extends InputTable {
    constructor(HTMLTableTag, num_rows, num_cols, input_index = 0, tolerance_index = 1, ok_index = 2) {
        super(HTMLTableTag, num_rows, num_cols, input_index)
        this.tolerance_index = tolerance_index
        this.ok_index = ok_index
        // this.nom_index = nom_index
        // this.tol_index = tol_index
        // this.dev_index = dev_index
    }
    calculateTolerance(min, max) {
        var pilot_hole = this.getInputsTable()[0]
        // row = this.getHTMLTableRows()
        var tolerance = Math.abs((pilot_hole - (max + min) / 2)) / ((max - min) / 2)
        this.internal_table[0][this.tolerance_index] = tolerance
        // this.writeOutputsTable(this.tolerance_index, [tol])
    }
    calculateOK(min, max) {
        var pilot_hole = this.getInputsTable()[0]

        var isOK = null
        if (pilot_hole <= max) {
            if (pilot_hole >= min) { isOK = "OK" }
            else { isOK = "NOK" }
        }
        else { isOK = "NOK" }

        // this.writeOutputsTable(this.ok_index, [isOK])
        this.internal_table[0][this.ok_index] = isOK
    }
}



class BoltHoleTable extends InputTable {
    constructor(HTMLTableTag, num_rows, num_cols, input_index = 1, tolerance_index = 2, ok_index = 3) {
        super(HTMLTableTag, num_rows, num_cols, input_index)

        this.tolerance_index = tolerance_index
        this.ok_index = ok_index
        // this.nom_index = nom_index
        // this.tol_index = tol_index
        // this.dev_index = dev_index
    }
    calculateTolerance(min, max) {
        var holes = this.getInputsTable()
        // var outputs = []
        var len = this.num_rows

        for (let i = 0; i < len; i++) {
            // add image to table here
            let tolerance = Math.abs(holes[i] - ((max + min) / 2)) / ((max - min) / 2)
            // outputs.push(tol)
            this.internal_table[i][this.tolerance_index] = tolerance
        }

        // this.writeOutputsTable(this.tolerance_index, outputs)
    }
    // if hole <= max: { if hole >= min: {return "OK"}} else: {return "NOK"}
    calculateOK(min, max) {
        var holes = this.getInputsTable()
        // var outputs = []

        for (let i = 0; i < this.num_rows; i++) {
            let isOK = null
            if (holes[i] <= max) {
                if (holes[i] >= min) { isOK = "OK" }
                else { isOK = "NOK" }
            }
            else { isOK = "NOK" }
            // outputs.push(isOK)
            this.internal_table[i][this.ok_index] = isOK
        }

        // this.writeOutputsTable(this.ok_index, outputs)
    }
}



class BoltCircleTable extends InputTable {
    constructor(HTMLTableTag, num_rows, num_cols, input_index = 1, tolerance_index = 5, ok_index = 6, nom_index = 2, tol_index = 3, dev_index = 4) {
        super(HTMLTableTag, num_rows, num_cols, input_index)
        
        this.tolerance_index = tolerance_index
        this.ok_index = ok_index
        this.nom_index = nom_index
        this.tol_index = tol_index
        this.dev_index = dev_index
    }
    calculateNom(bolt_circle_dia, hole_to_pilot_tol_rows) {
        // var outputs = []

        for (let i = 0; i < this.num_rows; i++) {
            let nom = bolt_circle_dia + hole_to_pilot_tol_rows[i] + hole_to_pilot_tol_rows[i + 4]
            // outputs.push(roundDecimal(nom, 3))
            this.internal_table[i][this.nom_index] = roundDecimal(nom, 3)
        }

        // this.writeOutputsTable(this.nom_index, outputs)
    }
    calculateTol(bolt_circle_dia, hole_to_pilot_tol_rows) {
        // var outputs = []

        for (let i = 0; i < this.num_rows; i++) {
            let tol = bolt_circle_dia - hole_to_pilot_tol_rows[i] - hole_to_pilot_tol_rows[i + 4]
            // outputs.push(roundDecimal(tol, 3))
            this.internal_table[i][this.tol_index] = roundDecimal(tol, 3)
        }

        // this.writeOutputsTable(this.tol_index, outputs)
    }
    calculateDev(bolt_holes) {
        // var outputs = []
        var holes = this.getInputsTable()

        for (let i = 0; i < this.num_rows; i++) {
            let dev = holes[i] + bolt_holes[i] / 2 + bolt_holes[i + 4] / 2
            // outputs.push(roundDecimal(dev, 3))
            this.internal_table[i][this.dev_index] = roundDecimal(dev, 3)
        }

        // this.writeOutputsTable(this.dev_index, outputs)
    }
    calculateTolerance(bolt_circle_dia) {
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
    calculateOK() {
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

}

class AverageBoltCircleTable extends Table {
    constructor(HTMLTableTag, num_rows, num_cols, output_index = 0, tolerance_index = 4, ok_index = 5, nom_index = 1, tol_index = 2, dev_index = 3) {
        super(HTMLTableTag, num_rows, num_cols)
        
        this.output_index = output_index
        this.tolerance_index = tolerance_index
        this.ok_index = ok_index
        this.nom_index = nom_index
        this.tol_index = tol_index
        this.dev_index = dev_index
    }
    
    calculateAverageBC(bolt_circle_dev_list) {

        var AverageBC = roundDecimal(averageNumbers(bolt_circle_dev_list), 3)

        // console.log("AverageBoltCircle.calculateDev: ", AverageBC)
        this.internal_table[0][this.output_index] = AverageBC
    }

    calculateNom(MMC, bolt_circle_dia, true_pos, min, bolt_holes_average) {
        if (MMC == "YES") {
            var nom = roundDecimal(bolt_circle_dia + true_pos + (bolt_holes_average - min), 3);
        }
        else {
            var nom = bolt_circle_dia + true_pos;
        }
        // console.log("AverageBoltCircle.calculateNom: ", nom)
        this.internal_table[0][this.nom_index] = nom;
    }

    calculateTol(MMC, bolt_circle_dia, true_pos, bolt_holes_average, min) {
        if (MMC == "YES") {
            var tol = roundDecimal(bolt_circle_dia - true_pos - (bolt_holes_average - min), 3);
        }
        else {
            var tol = bolt_circle_dia - true_pos;
        }
        // console.log("AverageBoltCircle.calculateTol: ", tol)
        this.internal_table[0][this.tol_index] = tol;
    }

    calculateDev() {

        var dev = this.internal_table[0][0]

        // console.log("AverageBoltCircle.calculateDev: ", dev)
        this.internal_table[0][this.dev_index] = dev
    }

    calculateTolerance(bolt_circle_dia) {
        var nom = this.internal_table[0][this.nom_index]
        var dev = this.internal_table[0][this.dev_index]

        var tolerance = Math.abs((dev - bolt_circle_dia)) / Math.abs((nom - bolt_circle_dia))

        // console.log("AverageBoltCircle.calculateTolerance: ", tolerance)
        this.internal_table[0][this.tolerance_index] = tolerance
    }

    calculateOK() {
        var nom = this.internal_table[0][this.nom_index]
        var tol = this.internal_table[0][this.tol_index]
        var dev = this.internal_table[0][this.dev_index]

        var isOK = null
        if (dev <= nom) {
            if (dev >= tol) {
                isOK = "OK"
            }
            else {
                isOK = "NOK"
            }
        }
        else {
            isOK = "NOK"
        }

        // console.log("AverageBoltCircle.calculateOK: ", isOK)
        this.internal_table[0][this.ok_index] = isOK
    }
}

// is the number of rows relative to the number of holes or something else?
class OddBoltCircleTable extends Table {
    constructor(HTMLTableTag, num_rows, num_cols, output_index = 1, tolerance_index = 5, ok_index = 6, nom_index = 2, tol_index = 3, dev_index = 4) {
        super(HTMLTableTag, num_rows, num_cols)

        this.output_index = output_index
        this.tolerance_index = tolerance_index
        this.ok_index = ok_index
        this.nom_index = nom_index
        this.tol_index = tol_index
        this.dev_index = dev_index
    }
    
    calculateOutput() {
        // unfinished
        var dev_list = this.getRowValues(this.dev_index)

        for (let i = 0, dev; dev = dev_list[i]; i++) {
            this.internal_table[i][this.output_index] = dev
        }
    }

    calculateNom(bolt_circle_dia, hole_to_pilot_tol_rows) {
        for (let i = 0, hole_to_pilot_tol; hole_to_pilot_tol = hole_to_pilot_tol_rows[i]; i++) {
            let nom = bolt_circle_dia + 2 * hole_to_pilot_tol
            this.internal_table[i][this.nom_index] = nom
        }
    }

    calculateTol(bolt_circle_dia, hole_to_pilot_tol_rows) {
        for (let i = 0, hole_to_pilot_tol; hole_to_pilot_tol = hole_to_pilot_tol_rows[i]; i++) {
            let tol = bolt_circle_dia - 2 * hole_to_pilot_tol
            this.internal_table[i][this.tol_index] = tol
        }
    }

    calculateDev(pilot_hole, bolt_holes, hole_to_pilot_input_rows) {
        for (let i = 0; i < this.internal_table.length; i++) {
            let dev = pilot_hole + 2 * bolt_holes[i] + hole_to_pilot_input_rows[i]
            this.internal_table[i][this.dev_index] = dev
        }
    }

    calculateTolerance(bolt_circle_dia) {
        for (let i = 0; i < this.internal_table.length; i++) {
            let nom = this.internal_table[i][this.nom_index]
            let dev = this.internal_table[i][this.dev_index]
            
            let tolerance = Math.abs((nom - bolt_circle_dia)) / Math.abs((dev - bolt_circle_dia))
            this.internal_table[i][this.tolerance_index] = tolerance
        }
    }

    calculateOK() {
        for (let i = 0; i < this.internal_table.length; i++) {
            let nom = this.internal_table[i][this.nom_index]
            let tol = this.internal_table[i][this.tol_index]
            let dev = this.internal_table[i][this.dev_index]

            let isOK = null

            if (dev <= nom) {
                if (dev >= tol) {
                    isOK = "OK"
                }
                else {
                    isOK = "NOK"
                }
            }
            else {
                isOK = "NOK"
            }

            this.internal_table[i][this.ok_index] = isOK
        }
    }
}

class OddAverageBoltCircleTable extends Table {
    constructor(HTMLTableTag, num_rows, num_cols, output_index = 0, tolerance_index = 4, ok_index = 5, nom_index = 1, tol_index = 2, dev_index = 3) {
        super(HTMLTableTag, num_rows, num_cols)
        
        this.output_index = output_index
        this.tolerance_index = tolerance_index
        this.ok_index = ok_index
        this.nom_index = nom_index
        this.tol_index = tol_index
        this.dev_index = dev_index
    }

    calculateOutput(bolt_circle_dev_list) {
        this.internal_table[0][this.output_index] = averageNumbers(bolt_circle_dev_list)
    }

    calculateNom(bolt_holes_average, true_pos, bolt_circle_dia, min) {
        var nom = bolt_circle_dia + true_pos + (bolt_holes_average - min)
        this.internal_table[0][this.nom_index] = nom
    }

    calculateTol(bolt_holes_average, true_pos, bolt_circle_dia, min) {
        var tol = bolt_circle_dia - true_pos - (bolt_holes_average - min)
        this.internal_table[0][this.tol_index] = tol
    }

    calculateDev() {
        this.internal_table[0][this.dev_index] = this.internal_table[0][this.output_index]
    }

    calculateTolerance(bolt_circle_dia) {
        var nom = this.internal_table[0][this.nom_index]
        var dev = this.internal_table[0][this.dev_index]

        var tolerance = Math.abs((nom - bolt_circle_dia)) / Math.abs((dev - bolt_circle_dia))
        this.internal_table[0][this.tolerance_index] = tolerance
    }

    calculateOK(bolt_circle_nom1, bolt_circle_tol1) {
        var dev = this.internal_table[0][this.dev_index]

        var isOK = null
        if (dev <= bolt_circle_nom1) {
            if (dev <= bolt_circle_tol1) {
                isOK = "OK"
            }
            else {
                isOK = "NOK"
            }
        }
        else {
            isOK = "NOK"
        }

        this.internal_table[0][this.ok_index] = isOK
    }
}


class HoleToPilotTable extends InputTable {
    constructor(HTMLTableTag, num_rows, num_cols, input_index = 1, tolerance_index = 5, ok_index = 6, nom_index = 2, tol_index = 3, dev_index = 4) {
        super(HTMLTableTag, num_rows, num_cols, input_index)
        
        this.tolerance_index = tolerance_index
        this.ok_index = ok_index
        this.nom_index = nom_index
        this.tol_index = tol_index
        this.dev_index = dev_index
    }
    calculateNom(bolt_circle_dia, pilot_hole, bolt_holes) {
        // var outputs = []

        for (let i = 0; i < this.num_rows; i++) {
            let nom = (bolt_circle_dia - pilot_hole) / 2 - bolt_holes[i] / 2
            // outputs.push(roundDecimal(nom, 3))
            this.internal_table[i][this.nom_index] = roundDecimal(nom, 3)
        }

        // this.writeOutputsTable(this.nom_index, outputs)
    }
    calculateTol(MMC, true_pos, min, bolt_holes) {
        // var outputs = []

        if (MMC == "YES") {
            for (let i = 0; i < this.num_rows; i++) {
                let tol = (bolt_holes[i] - min + true_pos) / 2
                // outputs.push(roundDecimal(tol, 3))
                this.internal_table[i][this.tol_index] = roundDecimal(tol, 3)
            }
        }
        else {
            for (let i = 0; i < this.num_rows; i++) {
                let tol = true_pos / 2
                // outputs.push(tol)
                this.internal_table[i][this.tol_index] = roundDecimal(tol, 3)
            }
        }

        // this.writeOutputsTable(this.tol_index, outputs)
    }
    calculateDev() {
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
    calculateTolerance() {
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
    calculateOK() {
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



class HoleToHoleTable extends InputTable {
    constructor(HTMLTableTag, num_rows, num_cols, input_index = 1, tolerance_index = 5, ok_index = 6, nom_index = 2, tol_index = 3, dev_index = 4) {
        super(HTMLTableTag, num_rows, num_cols, input_index)
        
        this.tolerance_index = tolerance_index
        this.ok_index = ok_index
        this.nom_index = nom_index
        this.tol_index = tol_index
        this.dev_index = dev_index
    }
    
    calculateNom(hole_to_hole_calculation, bolt_holes) {
        // var outputs = []
        var length = this.num_rows

        for (let i = 0; i < length; i++) {
            let nom = hole_to_hole_calculation - (bolt_holes[i] / 2) - (bolt_holes[(i + 1) % length] / 2)
            // outputs.push(roundDecimal(nom, 4))
            this.internal_table[i][this.nom_index] = roundDecimal(nom, 4)
        }

        // this.writeOutputsTable(this.nom_index, outputs)
    }
    calculateTol(hole_to_pilot_tol_rows) {
        // var outputs = []
        var length = this.num_rows

        for (let i = 0; i < length; i++) {
            let tol = hole_to_pilot_tol_rows[i] / 2 + hole_to_pilot_tol_rows[(i + 1) % length] / 2
            // outputs.push(roundDecimal(tol, 3))
            this.internal_table[i][this.tol_index] = roundDecimal(tol, 3)
        }

        // this.writeOutputsTable(this.tol_index, outputs)
    }
    calculateDev() {
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
    calculateTolerance() {
        // var outputs = []
        // var table_rows = this.getHTMLTableRows()

        for (let i = 0, row; row = this.internal_table[i]; i++) {
            let tol = parseFloat(row[this.tol_index])
            let dev = parseFloat(row[this.dev_index])
            let tolerance = dev / tol
            // outputs.push(roundDecimal(tolerance, 3))
            this.internal_table[i][this.tolerance_index] = roundDecimal(tolerance, 3)
        }
        // this.writeOutputsTable(this.tolerance_index, outputs)
    }
    calculateOK() {
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



// ===globals===

// Table(HTMLTableTag, num_rows, num_cols)          // excluding defaults
const PilotHole = new PilotHoleTable('PilotHoleTable', 1, 3)

const BoltHole = new BoltHoleTable('BoltHoleTable', 1, 4)

const BoltCircle = new BoltCircleTable('BoltCircleTable', 1, 7)
const AverageBoltCircle = new AverageBoltCircleTable('AverageBoltCircleTable', 1, 6)
const OddBoltCircle = new OddBoltCircleTable('OddBoltCircleTable', 1, 7)
const OddAverageBoltCircle = new OddAverageBoltCircleTable('OddAverageBoltCircleTable', 1, 6)

const HoleToPilot = new HoleToPilotTable('HoleToPilotTable', 1, 7)
const HoleToHole = new HoleToHoleTable('HoleToHoleTable', 1, 7)

var show_additional_info = false



// ===main===
function calculate() {
    document.getElementById("toggleAdditionalInfoButton").disabled = false

    AverageBoltCircle.table.style.display = ""

    // likely not necessary
    PilotHole.HTMLToInternalTable()
    BoltHole.HTMLToInternalTable()
    BoltCircle.HTMLToInternalTable()
    HoleToPilot.HTMLToInternalTable()
    HoleToHole.HTMLToInternalTable()


    const num_holes = parseFloat(document.getElementById("NumHoles").value)
    const bolt_hole_dia = parseFloat(document.getElementById("BoltHoleDia").value)
    const upper_tol = parseFloat(document.getElementById("UpperTol").value)
    const lower_tol = parseFloat(document.getElementById("LowerTol").value)
    const true_pos = parseFloat(document.getElementById("TruePosition").value)
    const MMC = document.getElementById("MMC").value
    const bolt_circle_dia = parseFloat(document.getElementById("BoltCircleDia").value)
    const pilot_hole = PilotHole.getInputsTable()[0]
    const pilot_hole_min = parseFloat(document.getElementById("pilotHoleMin").value)
    const pilot_hole_max = parseFloat(document.getElementById("pilotHoleMax").value)


    const min = bolt_hole_dia - lower_tol
    const max = bolt_hole_dia + upper_tol
    const num_holes_radians = convertToRadians(360 / num_holes)
    const hole_to_hole_calculation = Math.sqrt(2 * ((bolt_circle_dia / 2) ** 2) - (2 * (bolt_circle_dia / 2) ** 2 * Math.cos(num_holes_radians)))
    const bolt_holes_average = sumNumbers(BoltHole.getInputsTable()) / num_holes


    const is_even_num_holes = isEven(num_holes)


    // calculate table inputs
    PilotHole.calculateTolerance(pilot_hole_min, pilot_hole_max)
    PilotHole.calculateOK(pilot_hole_min, pilot_hole_max)

    BoltHole.calculateTolerance(min, max)
    BoltHole.calculateOK(min, max)

    HoleToPilot.calculateNom(bolt_circle_dia, pilot_hole, BoltHole.getInputsTable())
    HoleToPilot.calculateTol(MMC, true_pos, min, BoltHole.getInputsTable())
    HoleToPilot.calculateDev()
    HoleToPilot.calculateTolerance()
    HoleToPilot.calculateOK()

    BoltCircle.calculateNom(bolt_circle_dia, HoleToPilot.getRowValues(3)) // replace hardcoded
    BoltCircle.calculateTol(bolt_circle_dia, HoleToPilot.getRowValues(3))
    BoltCircle.calculateDev(BoltHole.getInputsTable())
    BoltCircle.calculateTolerance(bolt_circle_dia)
    BoltCircle.calculateOK()

    AverageBoltCircle.calculateAverageBC(BoltCircle.getRowValues(BoltCircle.dev_index))
    AverageBoltCircle.calculateNom(MMC, bolt_circle_dia, true_pos, min, bolt_holes_average)
    AverageBoltCircle.calculateTol(MMC, bolt_circle_dia, true_pos, bolt_holes_average, min)
    AverageBoltCircle.calculateDev(BoltCircle.getRowValues(BoltCircle.dev_index))
    AverageBoltCircle.calculateTolerance(bolt_circle_dia)
    AverageBoltCircle.calculateOK()

    OddBoltCircle.calculateNom(bolt_circle_dia, HoleToPilot.getRowValues(HoleToPilot.tol_index))
    OddBoltCircle.calculateTol(bolt_circle_dia, HoleToPilot.getRowValues(HoleToPilot.tol_index))
    OddBoltCircle.calculateDev(pilot_hole, BoltHole.getInputsTable(), HoleToPilot.getInputsTable())
    OddBoltCircle.calculateTolerance(bolt_circle_dia)
    OddBoltCircle.calculateOK()
    OddBoltCircle.calculateOutput()

    OddAverageBoltCircle.calculateOutput(OddBoltCircle.getRowValues(OddBoltCircle.dev_index))
    OddAverageBoltCircle.calculateNom(bolt_holes_average, true_pos, bolt_circle_dia, min)
    OddAverageBoltCircle.calculateTol(bolt_holes_average, true_pos, bolt_circle_dia)
    OddAverageBoltCircle.calculateDev()
    OddAverageBoltCircle.calculateTolerance(bolt_circle_dia)
    OddAverageBoltCircle.calculateOK(OddBoltCircle.getRowValues(OddBoltCircle.nom_index)[0], OddBoltCircle.getRowValues(OddBoltCircle.tol_index)[0])

    HoleToHole.calculateNom(hole_to_hole_calculation, BoltHole.getInputsTable())
    HoleToHole.calculateTol(HoleToPilot.getRowValues(3))
    HoleToHole.calculateDev()
    HoleToHole.calculateTolerance()
    HoleToHole.calculateOK()

    // write to table
    PilotHole.internalToHTMLTable()
    BoltHole.internalToHTMLTable()
    BoltCircle.internalToHTMLTable()
    AverageBoltCircle.internalToHTMLTable()
    OddBoltCircle.internalToHTMLTable()
    OddAverageBoltCircle.internalToHTMLTable()
    HoleToPilot.internalToHTMLTable()
    HoleToHole.internalToHTMLTable()

    // show columns
    PilotHole.ShowColumns([PilotHole.ok_index, PilotHole.tolerance_index])
    BoltHole.ShowColumns([BoltHole.ok_index, BoltHole.tolerance_index])
    BoltCircle.ShowColumns([BoltCircle.ok_index, BoltCircle.tolerance_index])
    OddBoltCircle.ShowColumns([BoltCircle.ok_index, BoltCircle.tolerance_index])
    HoleToPilot.ShowColumns([HoleToPilot.ok_index, HoleToPilot.tolerance_index])
    HoleToHole.ShowColumns([HoleToHole.ok_index, HoleToHole.tolerance_index])

    colorHTMLTables()
}

// ===tools===
function updateTables() {
    const num_holes = parseInt(document.getElementById("NumHoles").value)

    PilotHole.updateTable()

    updateBoltHoleTable(num_holes)
    updateBoltCircleTable(num_holes)
    AverageBoltCircle.updateTable()
    updateOddBoltCircleTable(num_holes)
    OddAverageBoltCircle.updateTable()
    updateHoleToPilotTable(num_holes)
    updateHoleToHoleTable(num_holes)

}

// add update table function to classes
// updates the number of rows the table has
function updateBoltHoleTable(num_holes) {

    BoltHole.updateTable(num_holes)
    var table_rows = BoltHole.getHTMLTableRows()

    for (let i = 0, row; row = table_rows[i]; i++) {
        row.cells[0].innerHTML = i + 1
    }
}

function updateBoltCircleTable(num_holes) {
    num_holes = Math.floor(num_holes / 2)

    BoltCircle.updateTable(num_holes)
    var table_rows = BoltCircle.getHTMLTableRows()

    for (let i = 0, row; row = table_rows[i]; i++) {
        row.cells[0].innerHTML = (1 + i) + " to " + (num_holes + 1 + i)
    }
}
function updateOddBoltCircleTable(num_holes) {
    num_holes = Math.floor(num_holes)

    OddBoltCircle.updateTable(num_holes)
    var table_rows = OddBoltCircle.internal_table

    for (let i = 0, row; row = table_rows[i]; i++) {
        row[0] = i + 1
    }
}

function updateHoleToPilotTable(num_holes) {
    HoleToPilot.updateTable(num_holes)
    var table_rows = HoleToPilot.getHTMLTableRows()

    for (let i = 0, row; row = table_rows[i]; i++) {
        row.cells[0].innerHTML = i + 1
    }
}

function updateHoleToHoleTable(num_holes) {
    HoleToHole.updateTable(num_holes)
    var table_rows = HoleToHole.getHTMLTableRows()

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
    return degrees * (pi / 180);
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

function colorHTMLOk(HTML_Ok) {
    if (HTML_Ok.innerHTML == "OK") { HTML_Ok.className = "isOK" }
    else if (HTML_Ok.innerHTML == "NOK") { HTML_Ok.className = "isNOK" }
}

function colorHTMLTables() {
    var table_rows = PilotHole.getHTMLTableRows()
    for (let i = 0, row; row = table_rows[i]; i++) {
        colorHTMLOk(row.cells[PilotHole.ok_index])
    }


    var table_rows = BoltHole.getHTMLTableRows()
    for (let i = 0, row; row = table_rows[i]; i++) {
        colorHTMLOk(row.cells[BoltHole.ok_index])
    }

    var table_rows = BoltCircle.getHTMLTableRows()
    for (let i = 0, row; row = table_rows[i]; i++) {
        colorHTMLOk(row.cells[BoltCircle.ok_index])
    }

    var table_rows = AverageBoltCircle.getHTMLTableRows()
    for (let i = 0, row; row = table_rows[i]; i++) {
        row.cells[0].style.color = "White"
        row.cells[0].style.backgroundColor = "Purple"
        colorHTMLOk(row.cells[AverageBoltCircle.ok_index])
    }

    var table_rows = HoleToPilot.getHTMLTableRows()
    for (let i = 0, row; row = table_rows[i]; i++) {
        colorHTMLOk(row.cells[HoleToPilot.ok_index])
    }

    var table_rows = HoleToHole.getHTMLTableRows()
    for (let i = 0, row; row = table_rows[i]; i++) {
        colorHTMLOk(row.cells[HoleToHole.ok_index])
    }
}

function turnOnGlobals() {
    document.getElementById("StartButton").style.display = ""
    // find a better word then "disableable"
    let disableables = document.getElementsByClassName("DisableableInput")
    for (let i = 0, disableable; disableable = disableables[i]; i++) {
        disableable.disabled = false
    }
}

function turnOffGlobals() {
    document.getElementById("StartButton").style.display = "none"
    // find a better word then "disableable"
    let disableables = document.getElementsByClassName("DisableableInput")
    for (let i = 0, disableable; disableable = disableables[i]; i++) {
        disableable.disabled = true
    }
}

function showTables() {
    if (document.forms[0].checkValidity() == false) { return }
    turnOffGlobals()
    showHidables("HidableTables")
    updateTables()
    show_additional_info = false

    PilotHole.HideColumns([PilotHole.ok_index, PilotHole.tolerance_index])
    BoltHole.HideColumns([BoltHole.ok_index, BoltHole.tolerance_index])
    BoltCircle.HideColumns([BoltCircle.nom_index, BoltCircle.tol_index, BoltCircle.dev_index, BoltCircle.ok_index, BoltCircle.tolerance_index])
    AverageBoltCircle.HideColumns([AverageBoltCircle.nom_index, AverageBoltCircle.tol_index, AverageBoltCircle.dev_index])
    AverageBoltCircle.table.style.display = "none"
    HoleToPilot.HideColumns([BoltCircle.nom_index, BoltCircle.tol_index, BoltCircle.dev_index, HoleToPilot.ok_index, HoleToPilot.tolerance_index])
    HoleToHole.HideColumns([BoltCircle.nom_index, BoltCircle.tol_index, BoltCircle.dev_index, HoleToHole.ok_index, HoleToHole.tolerance_index])
}

function resetTables() {
    updateTables()

    hideHidables("HidableInfo")
    document.getElementById("toggleAdditionalInfoButton").textContent = "Show More"
    document.getElementById("toggleAdditionalInfoButton").disabled = true
    show_additional_info = false

    PilotHole.HideColumns([PilotHole.ok_index, PilotHole.tolerance_index])
    BoltHole.HideColumns([BoltHole.ok_index, BoltHole.tolerance_index])
    BoltCircle.HideColumns([BoltCircle.nom_index, BoltCircle.tol_index, BoltCircle.dev_index, BoltCircle.ok_index, BoltCircle.tolerance_index])
    AverageBoltCircle.HideColumns([AverageBoltCircle.nom_index, AverageBoltCircle.tol_index, AverageBoltCircle.dev_index])
    AverageBoltCircle.table.style.display = "none"
    HoleToPilot.HideColumns([BoltCircle.nom_index, BoltCircle.tol_index, BoltCircle.dev_index, HoleToPilot.ok_index, HoleToPilot.tolerance_index])
    HoleToHole.HideColumns([BoltCircle.nom_index, BoltCircle.tol_index, BoltCircle.dev_index, HoleToHole.ok_index, HoleToHole.tolerance_index])
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
    toggleHidables("HidableInfo")
    BoltCircle.toggleHideColumns([BoltCircle.nom_index, BoltCircle.tol_index, BoltCircle.dev_index])
    AverageBoltCircle.toggleHideColumns([AverageBoltCircle.nom_index, AverageBoltCircle.tol_index, AverageBoltCircle.dev_index])
    HoleToPilot.toggleHideColumns([HoleToPilot.nom_index, HoleToPilot.tol_index, HoleToPilot.dev_index])
    HoleToHole.toggleHideColumns([HoleToHole.nom_index, HoleToHole.tol_index, HoleToHole.dev_index])
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


// simple number functions
function roundDecimal(number, digits) {
    return Math.round((number + Number.EPSILON) * (10 ** digits)) / (10 ** digits)
}

function sumNumbers(numbers) {
    var sum = 0
    for (var i = 0, number; number = numbers[i]; i++) {
        sum += number
    }

    return sum
}

function averageNumbers(numbers) {
    var total = numbers.length
    var sum = sumNumbers(numbers)

    var average = sum / total

    return average
}

function isEven(n) {
    return n % 2 == 0;
}