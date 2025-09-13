#pragma once
#include <string>
#include <sstream>
#include <iostream>
#include <vector>
#include <algorithm>
#include <array>
#include <cctype>
#include "json.hpp"
#include "httpheader.hpp"
#include "fileEdit.hpp"
struct httpRequest
{
    std::string method;
    std::string uri;
    std::string version;
    std::string koneksi;
    std::string contentType;
    std::string body;
};
inline char hekstochar(std::array<char, 2> hex)
{
    return static_cast<char>(std::stoi(std::string(hex.data(), 2), nullptr, 16));
}
/**
 * list of important characters
 * space = %20
 * %= %25
 * ! = %21
 * + = %2B
 * , = %2C
 */
inline std::string uridecoder(const std::string& uri)
{
    std::string decoded;
    for (size_t i = 0; i < uri.length(); ++i)
    {
        if (uri[i] == '%' && i + 2 < uri.length())
        {
            std::array<char, 2> hex = {uri[i + 1], uri[i + 2]};
            decoded += hekstochar(hex);
            i += 2;
        }
        else if (uri[i] == '+')
        {
            decoded += ' ';
        }
        else
        {
            decoded += uri[i];
        }
    }
    return decoded;
}
inline std::string toLowerCase(std::string msg)
{
    std::string lowerMsg = msg;
    std::transform(lowerMsg.begin(), lowerMsg.end(), lowerMsg.begin(), [](unsigned char c) { return std::tolower(c); });
    return lowerMsg;
}
namespace httpParser
{
     httpRequest parser(const std::string& msg)
    {
        // Implementasi parsing request HTTP
        httpRequest req;
        std::string header = msg.substr(0, msg.find("\r\n\r\n")); // Hanya ambil header saja
        std::string body = msg.substr(msg.find("\r\n\r\n") + 4);   // Ambil body setelah header

        // Lakukan parsing pada header dan isi objek req
        // Misalnya, kita bisa memecah header berdasarkan baris
        std::istringstream headerStream(header);
        std::string line;
        while (std::getline(headerStream, line))
        {
            if (line.find("GET") == 0)
            {
                req.method = "GET";
                req.uri = line.substr(4, line.find(" ", 4) - 4);
                req.version = line.substr(line.find(" ", 4) + 1);
            }else if(line.find("POST") == 0)
            {
                req.method = "POST";
                req.uri = line.substr(5, line.find(" ", 5) - 5);
                req.version = line.substr(line.find(" ", 5) + 1);
            }else if(line.find("PUT") == 0)
            {
                req.method = "PUT";
                req.uri = line.substr(4, line.find(" ", 4) - 4);
                req.version = line.substr(line.find(" ", 4) + 1);
            }else if (line.find("DELETE") == 0)
            {
                req.method = "DELETE";
                req.uri = line.substr(7, line.find(" ", 7) - 7);
                req.version = line.substr(line.find(" ", 7) + 1);
            }else if (line.find("Content-Type:") == 0)
            {
                req.contentType = line.substr(14);
            }else if (line.find("Connection:") == 0)
            {
                req.koneksi = line.substr(12);
            }
            
        }
        req.body = body;
        return req;
    }
    nlohmann::json bodytojson(const httpRequest& req)
    {
        nlohmann::json jsonBody;
        jsonBody = nlohmann::json::parse(req.body);
        return jsonBody;
    }
} // namespace httpParser
std::string responsfunc(std::string msg){
    httpRequest req = httpParser::parser(msg);
    std::string response;
    std::string decodedUri = uridecoder(req.uri);
    req.uri = decodedUri;
    if (req.method == "GET")
    {
        std::cout<<req.uri;
        if (req.uri.find("/?") == 0)
        {
            std::vector<int> idc;
            std::vector<int> ids;
            unsigned char boolSearch = 0x11;
            std::cout<<"pencarian\n";
            if(req.uri.find("tag=") != std::string::npos)
            {
                std::string searchQuery = req.uri.substr(req.uri.find("tag=") + 4,
                 ((req.uri.rfind("&?")!=std::string::npos ? req.uri.rfind("&?") : req.uri.length()) - (req.uri.find("tag=") + 4)));
                //response = httpHeader::getResponseHeadersJson();
                nlohmann::json jsonResponse=nlohmann::json::parse(fileEdit::readFile("database/data.json"));
                std::cout<<"tag search\n";
                for (int i=0;i<jsonResponse["data"].size();i++)
                {
                    if (jsonResponse["data"][i]["category"] == searchQuery)
                    {
                        std::cout<<i;
                        idc.push_back(i);
                    }
                }
                std::cout<<"tag search selesai\n";
            }else{
                 boolSearch = 0x01;
            }
            if(req.uri.rfind("search=") != std::string::npos)
            {
                std::string searchQuery = req.uri.substr(req.uri.find("search=") + 7,
                ((req.uri.rfind("&?") != std::string::npos ? req.uri.rfind("&?") : req.uri.length()) - (req.uri.find("search=") + 7)));
                //response = httpHeader::getResponseHeadersJson();
                nlohmann::json jsonResponse=nlohmann::json::parse(fileEdit::readFile("database/data.json"));
                std::cout<<"search\n";
                for (int i=0;i<jsonResponse["data"].size();i++)
                {
                    if (toLowerCase(jsonResponse["data"][i]["title"].get<std::string>()).find(toLowerCase(searchQuery)) != std::string::npos)
                    {
                        std::cout<<i;
                        ids.push_back(i);
                    }
                }
                std::cout<<"search selesai\n";
            }else{
                 boolSearch = boolSearch & 0x10;
            }
            std::vector<int> idss;
            switch (boolSearch)
            {
            case 0x01:
                idss=ids;
                std::cout<<"Kategori 1\n";
                break;
            case 0x10:
                idss=idc;
                std::cout<<"kategori 2\n";
                break;
            case 0x11:
                // Kategori dan Judul ditemukan
                for(const auto& id : ids){
                    if(std::find(idc.begin(), idc.end(), id) != idc.end()){
                        idss.push_back(id);
                    }
                }
                std::cout<<"Kategori 3\n";
                break;
            default:
                // Tidak ada pencarian, kembalikan semua data
                response = httpHeader::getResponseHeadersJson();
                nlohmann::json jsonResponse=nlohmann::json::parse(fileEdit::readFile("database/data.json"));
                return response + jsonResponse.dump();
            }
            
            if(idss.size() != 0){
                std::cout<<"ada hasil\n";
                //response = httpHeader::getResponseHeadersJson();
                nlohmann::json jsonResponse=nlohmann::json::parse(fileEdit::readFile("database/data.json"));
                nlohmann::json filteredResults;
                response = httpHeader::getResponseHeadersJson();
                for (const auto& id : idss)
                {
                    filteredResults["data"].push_back(jsonResponse["data"][id]);
                }
                response += filteredResults.dump();
            }else{
                response = httpHeader::getResponseHeadersJson();
                response += "{\"message\": \"No results found.\"}";
            }
        }
        else if(req.uri == "/")
        {
            // Buat response untuk permintaan GET /index.html
           response =httpHeader::getResponseHeadersHtml();
           if(fileEdit::checkFileExists("frontend/index.html"))
           {
               response += fileEdit::readFile("frontend/index.html");
           }else{
               response += "<h1>File index.html tidak ditemukan</h1>";
           }
        }else if(req.uri.rfind(".html") == req.uri.length() - 5)
        {
            response = httpHeader::getResponseHeadersHtml();
            if(fileEdit::checkFileExists("frontend/"+req.uri.substr(1)))
           {
               response += fileEdit::readFile("frontend/"+req.uri.substr(1));
           }else{
               response += "<h1>File " + req.uri.substr(1) + " tidak ditemukan</h1>";
           }
       }else if(req.uri.rfind(".css") == req.uri.length() - 4)
       {
           response = httpHeader::getResponseHeadersCss();
           if(fileEdit::checkFileExists("frontend/"+req.uri.substr(1)))
           {
               response += fileEdit::readFile("frontend/"+req.uri.substr(1));
           }else{
               response += "/* File " + req.uri.substr(1) + " tidak ditemukan */";
           }
       }else if(req.uri.rfind(".js") == req.uri.length() - 3){
           response = httpHeader::getResponseHeadersJs();
           if(fileEdit::checkFileExists("frontend/"+req.uri.substr(1)))
           {
               response += fileEdit::readFile("frontend/"+req.uri.substr(1));
           }else{
               response += "// File " + req.uri.substr(1) + " tidak ditemukan";
           }

        }else if(req.uri.rfind(".ico") == req.uri.length() - 4){
           response = httpHeader::getResponseHeadersIco();
           if(fileEdit::checkFileExists("frontend/"+req.uri.substr(1)))
           {
               response += fileEdit::readFile("frontend/"+req.uri.substr(1));
           }else{
               response += "// File " + req.uri.substr(1) + " tidak ditemukan";
           }

        }
    }
    else if(req.method == "POST")
    {
        std::cout<<"POST request\n";
        if(req.uri == "/submit")
        {
            std::cout<<"nuh uh1\n";
            nlohmann::json jsonBody = httpParser::bodytojson(req);
            response = httpHeader::getResponseHeadersJson();
            std::string atm=fileEdit::readFile("database/data.json");
            nlohmann::json db = nlohmann::json::parse(atm);
            std::cout<<jsonBody.dump();
            if(!(jsonBody["title"].is_string() &&
            jsonBody["category"].is_string() &&
            jsonBody["description"].is_string() &&
            jsonBody.size() == 3)){

                response = httpHeader::getResponseHeadersJson();
                nlohmann::json errorResponse;
                errorResponse["error"] = "Bad Request: title, category, and content cannot be empty.";
                return response + errorResponse.dump();
            }
            //new code here
            for (const auto& item : db["data"])
            {
                if (item["title"] == jsonBody["title"])
                {
                    response = httpHeader::getResponseHeadersJson();
                    nlohmann::json errorResponse;
                    errorResponse["error"] = "Conflict: An item with the same title already exists.";
                    return response + errorResponse.dump();
                }
            }
            //end new code here
            std::cout<<"nuh uh\n";
            db["data"].push_back(jsonBody);
            fileEdit::editFile("database/data.json", db.dump(2));
            response += jsonBody.dump();
        }
        
    }
    else if(req.method == "PUT"){
        if(req.uri.rfind("/update/") == 0)
        {
            std::string title = req.uri.substr(8);
            nlohmann::json jsonBody = httpParser::bodytojson(req);
            response = httpHeader::getResponseHeadersJson();
            std::string atm=fileEdit::readFile("database/data.json");
            nlohmann::json db = nlohmann::json::parse(atm);
            bool found = false;
            for(int i=0; i<db["data"].size(); i++)
            {
                if(db["data"][i]["title"].get<std::string>() == title)
                {
                    auto& item = db["data"][i];
                    if(jsonBody["title"].is_string())
                    {
                        item["title"] = jsonBody["title"];
                    }
                    if(jsonBody["category"].is_string())
                    {
                        item["category"] = jsonBody["category"];
                    }
                    if(jsonBody["description"].is_string())
                    {
                        item["description"] = jsonBody["description"];
                    }
                    found = true;
                    response += item.dump();
                    break;
                }
            }
            if(!found)
            {
                response = httpHeader::getResponseHeadersJson();
                response += "{\"error\": \"Item with ID " + title + " not found.\"}";
                return response;
            }
            fileEdit::editFile("database/data.json", db.dump(2));
        }
    }else if(req.method=="DELETE"){
        if(req.uri.rfind("/delete/") == 0)
        {
            std::string title = req.uri.substr(8);
            response = httpHeader::getResponseHeadersJson();
            std::string atm=fileEdit::readFile("database/data.json");
            nlohmann::json db = nlohmann::json::parse(atm);
            bool found = false;
            for(int i=0; i<db["data"].size(); i++)
            {
                if(db["data"][i]["title"].get<std::string>() == title)
                {
                    db["data"].erase(i);
                    found = true;
                    response += "{\"message\": \"Item with ID " + title + " deleted successfully.\"}";
                    break;
                }
            }
            if(!found)
            {
                response = httpHeader::getResponseHeadersJson();
                response += "{\"error\": \"Item with ID " + title + " not found.\"}";
                return response;
            }
            fileEdit::editFile("database/data.json", db.dump(2));
        }
    }
    else{
        response = httpHeader::getResponseHeadersNotFound();
        response += "<h1>404 Not Found</h1>";
    }
    return response;
}
