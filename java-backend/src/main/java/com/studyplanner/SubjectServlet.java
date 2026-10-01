package com.studyplanner;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * Simple Java Servlet for Study Planner API
 * URL Route: http://localhost:8080/api/subjects
 */
@WebServlet("/api/subjects")
public class SubjectServlet extends HttpServlet {

    // GET Request: Fetch subjects (like app.get('/api/subjects'))
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        PrintWriter out = response.getWriter();
        
        String jsonResponse = """
            {
              "success": true,
              "message": "Subject list from Java Servlet",
              "data": [
                {
                  "_id": "subj_1",
                  "name": "Java Programming",
                  "code": "CS101",
                  "estimatedHours": 40,
                  "completedHours": 10
                }
              ]
            }
            """;

        out.print(jsonResponse);
        out.flush();
    }

    // POST Request: Create a new subject (like app.post('/api/subjects'))
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "*");

        PrintWriter out = response.getWriter();

        String jsonResponse = """
            {
              "success": true,
              "message": "Subject created successfully via Java Servlet"
            }
            """;

        out.print(jsonResponse);
        out.flush();
    }
}
