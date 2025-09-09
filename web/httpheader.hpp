#pragma once
#include <string>

namespace httpHeader
{
    inline std::string getResponseHeadersHtml()
    {
        return "HTTP/1.1 200 OK\r\n"
               "Content-Type: text/html\r\n"
               "Connection: close\r\n"
               "\r\n";
    }
    inline std::string getResponseHeadersCss(){
        return "HTTP/1.1 200 OK\r\n"
               "Content-Type: text/css\r\n"
               "Connection: close\r\n"
               "\r\n";
    }
    inline std::string getResponseHeadersJs(){
        return "HTTP/1.1 200 OK\r\n"
               "Content-Type: application/javascript\r\n"
               "Connection: close\r\n"
               "\r\n";
    }
    inline std::string getResponseHeadersJson(){
        return "HTTP/1.1 200 OK\r\n"
               "Content-Type: application/json\r\n"
               "Connection: close\r\n"
               "\r\n";
    }
    inline std::string getResponseHeadersNotFound(){
        return "HTTP/1.1 404 Not Found\r\n"
               "Content-Type: text/html\r\n"
               "Connection: close\r\n"
               "\r\n";
    }
} // namespace httpHeader
