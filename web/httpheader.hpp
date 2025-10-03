#pragma once
#include <string>

enum class contentType
{
    html,
    css,
    js,
    json,
    ico,
    notfound
};
namespace httpHeader
{
    const std::string getContentTypeString(contentType type)
    {
        switch (type)
        {
        case contentType::html:
            return "text/html";
        case contentType::css:
            return "text/css";
        case contentType::js:
            return "application/javascript";
        case contentType::json:
            return "application/json";
        case contentType::ico:
            return "image/x-icon";
        case contentType::notfound:
            return "text/html";
        default:
            return "text/plain";
        }
    }
    inline std::string getResponseHeaders(contentType type,bool notFound,unsigned long long panjang,bool conection=false)
    {
        std::string reti;
        if(!notFound){
            reti="HTTP/1.1 200 OK\r\n";
        }else{
            reti="HTTP/1.1 404 Not Found\r\n";
        }
        reti+="Content-Type: "+getContentTypeString(type)+" \r\n";

        if (conection)
        {
            reti+="conection: keep-alive\r\n";
        }else{
            reti+="Connection: close\r\n";
        }
        reti+=std::string("Content-Length: ")+std::to_string(panjang)+"\r\n";
        return (reti+"\r\n");
    }
    inline std::string getResponseHeadersHtml(){
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
    inline std::string getResponseHeadersJsonBad(){
        return "HTTP/1.1 404 Not Found\r\n"
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
    inline std::string getResponseHeadersIco(){
        return "HTTP/1.1 200 OK\r\n"
               "Content-Type: image/x-icon\r\n"
               "Connection: close\r\n"
               "\r\n";
    }
} // namespace httpHeader


class httpresponse{
    public:
    std::string header;
    size_t bodysize;
    std::string body;
    httpresponse(){
        header="";
        bodysize=0;
        body="";
    }
    httpresponse& pembentukan(contentType type,bool notFound,unsigned long long panjang,std::string body,bool conection=false){
        if(body.length()<panjang){
            std::cout<<"kesalahan berfikir\n";
            return *this;
        }
        header=httpHeader::getResponseHeaders(type,notFound,panjang,conection);
        bodysize=panjang;
        this->body=body;
        return *this;
    }
    std::vector<std::string> getbodybychunk(unsigned int maksSizePerChunk)const{
        std::vector<std::string> result;
        for (size_t i = 0; i < this->bodysize; i+=maksSizePerChunk)
        {
            result.push_back(this->body.substr(i,maksSizePerChunk));
        }
        return result;
    }
};
