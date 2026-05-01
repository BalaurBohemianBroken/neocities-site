import http.server
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver

# From: https://stackoverflow.com/a/73848428
PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map={
    '.html': 'text/html',
    # '': 'text/html', # Default is 'application/octet-stream'
    '': 'text/plain', # Default is 'application/octet-stream'
    }
httpd = socketserver.TCPServer(("", PORT), Handler)

print("serving at port", PORT)
httpd.serve_forever()