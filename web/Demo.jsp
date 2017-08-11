<%--
  Created by IntelliJ IDEA.
  User: loganlin
  Date: 2017/8/11
  Time: 下午9:43
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.logan.model.ReadFile"%>
<html>
<head>
    <meta charset="UTF-8">
    <title>Demo</title>
    <link href="icon.png" rel="icon">
    <link rel="stylesheet" type="text/css" href="style.css">
    <link rel="stylesheet" type="text/css" href="beautiful.css">
    <script src="jquery.js"></script>
    <script src="vivagraph.js"></script>
    <script src="script.js"></script>
</head>
<body>
<div id="type_data" style="display: none">
    <%
        String type = (String)request.getAttribute("type");
        out.print(type);
    %>
</div>
<div id="data" style="display: none;">
    <%
        String realPath = session.getServletContext().getRealPath("");
        String filePath = (String)request.getAttribute("file_path");
        out.print(ReadFile.getFileContent(realPath + filePath));
    %>
</div>
<%--<did id="test" class="block"></did>--%>
<div class="block">
    <h3>Selected Plane Information</h3>
    <p id="plane_information"></p>
</div>
<div class="table_container">
    <div class="table_row">
        <div class="block table_cell" id="original_seat">
            <p class="table_header">History allocation results</p>
            <table id="original_seat_table"></table>
        </div>
        <div id="center" class="table_cell">
            <div class="block" id="selected_passenger_information">
                <p class="table_header">Selected Passenger Information</p>
                <table id="selected_passenger_information_table"></table>
                <table id="selected_passenger_history_table"></table>
                <table id="selected_passenger_allocation_table"></table>
            </div>
            <div class="block" id="relation_graph" style="margin-top: 0">
                <p class="table_header">Relation Graph</p>
                <table id="selected_passenger_relation_table"></table>
                <div id="graph"></div>
            </div>
        </div>
        <div class="block table_cell" id="arranged_seat">
            <p class="table_header">Our allocation results</p>
            <table id="arranged_seat_table"></table>
        </div>
    </div>
</div>
<div id="credit"><a href="https://github.com/Logan-Lin/GsnDemo">view on GitHub</a></div>
</body>
</html>
