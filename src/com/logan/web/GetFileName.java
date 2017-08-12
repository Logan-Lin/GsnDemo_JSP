package com.logan.web;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class GetFileName extends HttpServlet {
    private String[] type9 = {"5067025", "5073325"};

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String type = "6";
        String fileName = request.getParameter("file_select");
        for (int i = 0; i < type9.length; i++) {
            if (fileName.equals(type9[i])) {
                type = "9";
                break;
            }
        }
        String filePath = "//data//" + "type=" + type + "//" + fileName + ".txt";
        request.setAttribute("file_path", filePath);
        request.setAttribute("type", type);

        RequestDispatcher view = request.getRequestDispatcher("Demo.jsp");
        view.forward(request, response);
    }
}