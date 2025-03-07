package com.game.cyberslots.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.UUID;

@Component
public class SessionFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpSession session = httpRequest.getSession(false);

        if (session == null) {
            session = httpRequest.getSession(true);
            session.setAttribute("playerId", UUID.randomUUID().toString());
            String userAgent = httpRequest.getHeader("User-Agent");
            session.setAttribute("deviceIdentifier", userAgent);
        } else {
            String currentUserAgent = httpRequest.getHeader("User-Agent");
            String sessionUserAgent = (String) session.getAttribute("deviceIdentifier");

            if (!currentUserAgent.equals(sessionUserAgent)) {
                session.invalidate();
                session = httpRequest.getSession(true);
                session.setAttribute("playerId", UUID.randomUUID().toString());
                session.setAttribute("deviceIdentifier", currentUserAgent);
            }
        }

        chain.doFilter(request, response);
    }
}