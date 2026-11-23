import http from "http";
import fs from "fs";
import path from "path";

const server = http.createServer((req, res) => {
    if (req.url === "/api/chat" && req.method === "POST") {
      let body = "";

      // request events to listen: data and end
      req.on("data", chunk => { body += chunk });
      req.on("end", async () => {
        try {
          const { input } = JSON.parse(body);

          const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              "model": "gpt-6-luna",
              "reasoning": { effort: "none" },  
              "input": `${input}`
            })
          })

          const data = await response.json();

          if (!response.ok) {
            console.log("API Error", data);
          } else {
            data.output_text = data.output
              .filter(item => item.type === "message")
              .flatMap(item => item.content)
              .filter(part => part.type === "output_text")
              .map(part => part.text)
              .join("");

            console.log(data.output_text);
            res.writeHead(200, { "Content-Type" : "application/json" });
            res.end(JSON.stringify({ result: data.output_text }));
          }
        } catch (error) {
          console.error("Error in /api/chat" + error);
          res.writeHead(400, { "Content-Type": "applicatio/json" });
          res.end(JSON.stringify({ error: "Invalid JSON payload" }));
        }
      });
    }

    else {
      const filePath = path.join("public", req.url === "/" ? "index.html" : req.url);
      const ext = path.extname(filePath);
      const contentType = ext == ".js" ? "text/javascript" : "text/html";

      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(404);
          res.end("Not found");
        }
        else {
          res.writeHead(200, { "Content-Type" : contentType });
          res.end(content);
        }
      })
    }
});

server.listen(3000, () => {
  console.log(`listening to request at http://localhost:3000`)
});
