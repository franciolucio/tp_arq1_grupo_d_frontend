import papa from "papaparse";

/**
 * Descarga como CSV un Array de datos indexado con enteros y además lo codifica en utf-8 para excel.
 * @param data_array
 */
 export async function downloadArrayAsCSV(file_name, data_array) {

    var universalBOM = "\uFEFF";

    let csvContent = "";
    data_array.forEach(function(line) {
        csvContent += line.join(";") + "\n";
    });

    let link = document.createElement("a");
    link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(universalBOM + csvContent));
    link.setAttribute("download", file_name + ".csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
}

/**
 * Lee un csv entero y devuelve su información en un array de objetos
 * con el nombre de la columna como clave
 *
 * @param fileName
 * @returns {Promise<any>}
 */
export async function readCsv(fileName) {

    let result = papa.parsePromise(fileName).then(function(results) {
        return results;
    });

    return result;
}

papa.parsePromise = function(file) {

    return new Promise(function(complete, error) {
        papa.parse(file, {encoding: "ISO-8859-1", complete, error});
    });
}