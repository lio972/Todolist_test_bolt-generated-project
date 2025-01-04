from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import uuid

class TodoHandler(BaseHTTPRequestHandler):
    todos = []

    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_GET(self):
        if self.path == '/todos':
            self._set_headers()
            todos_data = [{
                'id': t['id'],
                'text': t['text'],
                'completed': t['completed']
            } for t in self.todos]
            self.wfile.write(json.dumps(todos_data).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())

    def do_POST(self):
        if self.path == '/todos':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode())
            new_todo = {
                'id': str(uuid.uuid4()),
                'text': data['text'],
                'completed': data.get('completed', False)
            }
            self.todos.append(new_todo)
            self._set_headers(201)
            self.wfile.write(json.dumps(new_todo).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())

    def do_PUT(self):
        if self.path.startswith('/todos/'):
            todo_id = self.path.split('/')[-1]
            todo = next((t for t in self.todos if t['id'] == todo_id), None)
            if todo:
                content_length = int(self.headers['Content-Length'])
                put_data = self.rfile.read(content_length)
                data = json.loads(put_data.decode())
                todo['completed'] = data['completed']
                self._set_headers()
                self.wfile.write(json.dumps(todo).encode())
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({'error': 'Todo not found'}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())

    def do_DELETE(self):
        if self.path.startswith('/todos/'):
            todo_id = self.path.split('/')[-1]
            todo = next((t for t in self.todos if t['id'] == todo_id), None)
            if todo:
                self.todos = [t for t in self.todos if t['id'] != todo_id]
                self._set_headers(204)
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({'error': 'Todo not found'}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())

def run(server_class=HTTPServer, handler_class=TodoHandler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
