/**
 * Builds JSON from Votes.csv file.
 * @param {!Event} event - file upload event
 */
function buildJsonFromCSV(event) {
    var file = event.target.files[0];
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            saveJson(buildGraphModelFromCSV(results.data));
        }
    });
}

/**
 * @typedef {Object} CountryNode
 * @property {!number} id
 * @property {!string} country
 */

/**
 * @typedef {Object} CountryLink
 * @property {!string} source - id of country voted
 * @property {!string} target - id of country the vote is for
 * @property {!number} score - vote
 */

/**
 * @typedef {Object} GraphModel
 * @property {!CountryNode[]} nodes - array of nodes
 * @property {!CountryLink[]} links - array of links
 */

/**
 * Links/Nodes structure needed for D3 force layout
 * @param {!{Country: !string, year: !number, score: !number, Target: !string}[]} parsedCSV - parsed results
 * @return {!GraphModel}
 * @private
 * @function
 */
function buildGraphModelFromCSV(parsedCSV) {
    var i = 0;
    var graphModel = {
        nodes: [],
        links: []
    };
    // First generate list of countries with unique IDs
    parsedCSV.forEach(function (parsedRowObject) {
        if (!graphModel.nodes.find(function(node){return node.country === parsedRowObject.Country})) {
            graphModel.nodes.push({
                id: i,
                country: parsedRowObject.Country
            });
            i++;
        }
    });
    // Then build links based on countries IDs and score
    parsedCSV.forEach(function (parsedRowObject) {
        if(parsedRowObject.year === 2015 && parsedRowObject.score > 8) {
            graphModel.links.push({
                source:  graphModel.nodes.find(function(node){return node.country === parsedRowObject.Country}).id,
                target: graphModel.nodes.find(function(node){return node.country === parsedRowObject.Target}).id,
                score: parsedRowObject.score
            });
        }
    });

    return graphModel;
}

/**
 * Uses new GraphModel to create JSON which will be saved on users PC
 * @param {!GraphModel} graphModel - parsed results from Papa service
 * @private
 * @function
 */
function saveJson(graphModel) {
    var json = JSON.stringify(graphModel);
    var blob = new Blob([json], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    // Some bicycle to load JSON
    var a = document.createElement('a');
    a.download = "Votes.json";
    a.href = url;
    a.textContent = "Download Votes.json";
    a.click(); // simulate click so file is loaded immediately
}