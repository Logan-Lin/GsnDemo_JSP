var type = "6";
var rowTag = [];
var colTag = [];
var rowStart;
var colNum = 7;
var rowNum;

var relationMatrix = [];
var historyMatrix = [];
var passengerMatrix = [];
var allocationMatrix = [];

var images = [];

var selectedRelationTable;
var graphElement;

$(document).ready(function() {
    for (var i = 0; i < 28; i++) {
        images.push("pictures/pic" + String(i + 1) + ".png");
    }

    $("#selected_passenger_information").find("table").attr("align", "center");
    $("#relation_graph").find("table").attr("align", "center");

    type = $("#type_data").text();
    var infoString = $("#data").text();
    processInfoString(infoString);
    initialSeatButtons();
});

function processInfoString(infoString) {
    var planeIndex = infoString.indexOf("Plane");
    var relationIndex = infoString.indexOf("Relation");
    var historyIndex = infoString.indexOf("Histroy");
    var passengerIndex = infoString.indexOf("Passenger");
    var allocationIndex = infoString.indexOf("Allocation");

    processPlaneInfoString(infoString.substr(planeIndex, relationIndex));
    relationMatrix = processInfoMatrix(infoString.substring(relationIndex, historyIndex - 1));
    historyMatrix = processInfoMatrix(infoString.substring(historyIndex, passengerIndex - 1));
    passengerMatrix = processInfoMatrix(infoString.substring(passengerIndex, allocationIndex - 1));
    allocationMatrix = processInfoMatrix(infoString.substring(allocationIndex, infoString.length - 2));
}

function processPlaneInfoString(infoString) {
    var lines = infoString.split("\n");
    var labelString = lines[0].substr(lines[0].indexOf(":") + 1);
    var labels = labelString.split(",");
    var values = (lines[1].substring(0, lines[1].indexOf("[") - 1).split(","));
    values.push(lines[1].substring(lines[1].indexOf("["), lines[1].indexOf("]") + 1));
    values.push(lines[1].substring(lines[1].indexOf("]") + 2).split(",")[0]);
    values.push(lines[1].substring(lines[1].indexOf("]") + 2).split(",")[1]);
    rowStart = Number(values[10]);
    rowNum = Number(values[9]) - rowStart + 1;

    var planeInfoArray = [];
    for (var i = 0; i < labels.length; i++) {
        var oneInfo = labels[i] + ": " + values[i];
        planeInfoArray.push(oneInfo);
    }
    $("#plane_information").html(planeInfoArray.join(", ")).append(", type: " + type);
}

// Initialize seat table, generate button elements and assign corresponding IDs to them.
function initialSeatButtons() {
    // Generate row tags(an range from rowStart to rowStart+rowNum).
    rowTag = [];
    for (var i = 0; i < rowNum; i++) {
        rowTag.push(i + rowStart);
    }
    // Adjust column tag according to plane type.
    if (Number(type) === 9) {
        colTag = ["A", "B", "C", " " , "J", "K", "L"];
    } else if (Number(type) === 6) {
        colTag = ["A", "B", "C", " " , "D", "E", "F"];
    }

    // Generate seat buttons in original seat table.
    var originalSeatTable = $("#original_seat_table");
    originalSeatTable.html("");
    var firstRow = $("<tr>");
    firstRow.append("<td>O</td>");
    for (i = 0; i < colNum; i++) {
        firstRow.append("<td>" + colTag[i] + "</td>")
    }
    originalSeatTable.append(firstRow);
    for (i = 0; i < rowNum; i++) {
        var tableRow = $("<tr>");
        tableRow.append("<td>" + rowTag[i] + "</td>");
        for (var j = 0; j < colNum; j++) {
            var id = String(rowTag[i])+ "-" + colTag[j];
            if (j === 3) {
                tableRow.append("<td>||||</td>");
            } else {
                tableRow.append("<td><button class='default'" + " id=" + id + ">"
                    + " </button></td>");
            }
        }
        originalSeatTable.append(tableRow);
    }
    // Just copy all the buttons to the arranged seat table.
    var arrangedSeatTable = $("#arranged_seat_table");
    arrangedSeatTable.html("");
    originalSeatTable.find("tr").clone().appendTo(arrangedSeatTable);

    initialButtons();
    // Assign click handler to the buttons in original seat table that have passenger on it.
    $("#original_seat").find("button.hasHistory").off("click").on(
        "click", historySeatClickHandler);
}

// Initialize every buttons' default class and background images.
function initialButtons() {
    var passengerPIDCol = passengerMatrix.map(function(value) {return value[0]});

    for (var i = 1; i < historyMatrix.length; i++) {
        var buttonObject = $("#original_seat").find("button[id='" +
            historyMatrix[i][2] + "']");
        buttonObject.attr("class", "hasHistory").text("P");
        if (Number(passengerMatrix[passengerPIDCol.indexOf(historyMatrix[i][0])][1]) !== 0) {
            buttonObject.addClass("hasData").attr("style", "background-image:url("
                + images[Number(historyMatrix[i][0]) % images.length] + ")").text(" ");
        }
    }

    for (i = 1; i < allocationMatrix.length; i++) {
        var id = getId(allocationMatrix[i][2], allocationMatrix[i][3]);
        buttonObject = $("#arranged_seat").find("button[id='" + id + "']");
        buttonObject.attr("class", "hasHistory").text("P");
        if (Number(passengerMatrix[passengerPIDCol.indexOf(allocationMatrix[i][0])][1]) !== 0) {
            buttonObject.addClass("hasData").attr("style", "background-image:url("
                + images[Number(allocationMatrix[i][0]) % images.length] + ")").text(" ");
        }
    }
}

// Handler for click on seats in original seat table.
function historySeatClickHandler(e) {
    var selectedID = e.target.getAttribute("id");
    $("table button").removeClass("selected").removeClass("related"); // Clear selected class in other buttons.
    $(e.target).addClass("selected"); // Set the clicked button to selected mode.

    // Get the column in historyMatrix that represents seat ID.
    var historySeatIDCol = historyMatrix.map(function(value) {return value[2]});
    var historySeatPIDCol = historyMatrix.map(function(value) {return value[0]});
    var historyRowIndex = historySeatIDCol.indexOf(selectedID);
    var selectedPid = historyMatrix[historyRowIndex][0];

    // Get the column in passengerMatrix that represents user ID.
    var passengerSeatPIDCol = passengerMatrix.map(function(value) {return value[0]});
    var passengerRowIndex = passengerSeatPIDCol.indexOf(selectedPid);

    var allocationSeatPIDCol = allocationMatrix.map(function(value) {return value[0]});
    var allocationRowIndex = allocationSeatPIDCol.indexOf(selectedPid);

    // Display information about the passenger on the selected seat.
    var selectedIDTable = $("#selected_passenger_information_table");
    var selectedHistoryTable = $("#selected_passenger_history_table");
    displayInfoTable(selectedIDTable, historyMatrix, historyRowIndex, 0);
    displayInfoTable(selectedHistoryTable, passengerMatrix, passengerRowIndex, 1);

    var selectedAllocationTable = $("#selected_passenger_allocation_table");
    selectedAllocationTable.html("");
    if (allocationRowIndex !== -1) {
        displayInfoTable(selectedAllocationTable, allocationMatrix, allocationRowIndex, 1);
        // Set the corresponding seat in the arranged seat table to selected mode.
        $("#arranged_seat_table").find("button[id='" +
            getId(allocationMatrix[allocationRowIndex][2],
                allocationMatrix[allocationRowIndex][3]) + "']").addClass("selected");
    }

    // Display the relationship information about the passenger on the selected seat and draw relation graph.
    var relationMatrixPIDCol1 = relationMatrix.map(function (value) {return value[0]});
    var relationMatrixPIDCol2 = relationMatrix.map(function (value) {return value[1]});
    var relationRowIndexes1 = getAllIndexes(relationMatrixPIDCol1, selectedPid);
    var relationRwoIndexes2 = getAllIndexes(relationMatrixPIDCol2, selectedPid);
    selectedRelationTable = $("#selected_passenger_relation_table");
    selectedRelationTable.html("");

    var relatedPersonPIDs = [];
    for (var i = 0; i < relationRowIndexes1.length; i++) {
        var oneRow = [];
        oneRow.push(relationMatrix[relationRowIndexes1[i]][1]);
        oneRow.push(relationMatrix[relationRowIndexes1[i]][2]);
        relatedPersonPIDs.push(oneRow);
    }
    for (i = 0; i < relationRwoIndexes2.length; i++) {
        oneRow = [];
        oneRow.push(relationMatrix[relationRwoIndexes2[i]][0]);
        oneRow.push(relationMatrix[relationRwoIndexes2[i]][2]);
        relatedPersonPIDs.push(oneRow);
    }

    graphElement = document.getElementById("graph");
    $(graphElement).html("");
    if (relatedPersonPIDs.length > 0) {
        var relationRow = $("<tr>");
        var relationWeightRow = $("<tr>");
        relationRow.append($("<td>Related person</td>"));
        relationWeightRow.append($("<td>Relation Weight</td>"));
        for (i = 0; i < relatedPersonPIDs.length; i++) {
            relationRow.append($("<td>" + "<img src='"
                + images[Number(relatedPersonPIDs[i][0]) % images.length]
                + "' width='60' height='60'><br>"
                + relatedPersonPIDs[i][0] + "</td>"));
            relationWeightRow.append($("<td>" + relatedPersonPIDs[i][1] + "</td>"));

            var relatedAllocationIndex = allocationSeatPIDCol.indexOf(relatedPersonPIDs[i][0]);
            var id = getId(allocationMatrix[relatedAllocationIndex][2], allocationMatrix[relatedAllocationIndex][3]);
            $("#arranged_seat_table").find("button[id='" + id + "']").addClass("related");

            var relatedHistoryIndex = historySeatPIDCol.indexOf(relatedPersonPIDs[i][0]);
            id = historyMatrix[relatedHistoryIndex][2];
            $("#original_seat_table").find("button[id='" + id + "']").addClass("related");
        }
        selectedRelationTable.append(relationRow);
        selectedRelationTable.append(relationWeightRow);

        var relationGraph = Viva.Graph.graph();
        relationGraph.addNode(selectedPid, {url: images[Number(selectedPid) % images.length]});
        for (i = 0; i < relatedPersonPIDs.length; i++) {
            var relatedPID = relatedPersonPIDs[i][0];
            relationGraph.addNode(relatedPID,
                {url: images[Number(relatedPID) % images.length]});
            relationGraph.addLink(selectedPid, relatedPID);
        }

        var graphics = Viva.Graph.View.svgGraphics();
        graphics.node(function(node) {
            return Viva.Graph.svg('image')
                .attr('width', 50)
                .attr('height', 50)
                .link(node.data.url);
        }).placeNode(function(nodeUI, pos){
                nodeUI.attr('x', pos.x - 20).attr('y', pos.y - 20);
        });

        var renderer = Viva.Graph.View.renderer(relationGraph, {
            container: graphElement,
            graphics: graphics
        });
        renderer.run();
    }
}

function displayInfoTable(tableObject, infoMatrix, rowIndex, infoStartColIndex) {
    tableObject.html("");
    var row1 = $("<tr>");
    var row2 = $("<tr>");
    for (var i = infoStartColIndex; i < infoMatrix[0].length; i++) {
        row1.append($("<td>" + infoMatrix[0][i] + "</td>"));
        row2.append($("<td>" + infoMatrix[rowIndex][i] + "</td>"));
    }
    tableObject.append(row1);
    tableObject.append(row2);
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) !== -1){
        indexes.push(i);
    }
    return indexes;
}

function getId(rowStr, colStr) {
    var temColTag = [];
    for (var i = 0; i < 3; i++) {
        temColTag.push(colTag[i])
    }
    for (i = 4; i < colNum; i++) {
        temColTag.push(colTag[i]);
    }
    return rowStr + "-" + temColTag[Number(colStr) - 1];
}

function processInfoMatrix(infoString) {
    var lines = infoString.split("\n");
    var infoMatrix = [];
    infoMatrix.push(lines[0].substring(lines[0].indexOf(":") + 1).split(","));
    for (var i = 1; i < lines.length; i++) {
        infoMatrix.push(lines[i].split(","));
    }
    return infoMatrix;
}