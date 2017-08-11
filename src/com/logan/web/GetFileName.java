package com.logan.web;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.util.*;

public class GetFileName extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String type = request.getParameter("type_select");
        request.setAttribute("type", type);

        String fileName = request.getParameter("file_select");
        String filePath = "//data//" + "type=" + type + "//" + fileName + ".txt";
        request.setAttribute("file_path", filePath);

        RequestDispatcher view = request.getRequestDispatcher("Demo.jsp");
        view.forward(request, response);
    }
}