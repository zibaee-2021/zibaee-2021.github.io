#!/usr/bin/env python3
"""Serve the gallery and allowlisted local project task files on loopback only."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

SITE_ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = SITE_ROOT.parent
MANUSCRIPT_ROOT = PROJECT_ROOT.parent / 'Manuscripts' / 'manuscripts'
TASK_FILES = {
    'salsa-app': PROJECT_ROOT / 'SALSA/TodoList/TODO.md',
    'ada-app': PROJECT_ROOT / 'ADA/app/TodoList/TODO.md',
    'lagtime-app': PROJECT_ROOT / 'LagtimeEstimator/TodoList/TODO.md',
    'amyloid-experiments': PROJECT_ROOT / 'SALSA/TodoList/amyloid-experiments.md',
    'helical-experiments': PROJECT_ROOT / 'SALSA/TodoList/helical-experiments.md',
    'ideas': SITE_ROOT / 'TodoList/thought-experiments.md',
}
MANUSCRIPTS = {
    'salsa-manuscript': 'salsa-webapp', 'ada-manuscript': 'ada',
    'lagtime-manuscript': 'lagtime-calculator',
    'amyloid-manuscript': 'amyloid-beta-sheet-contiguity',
    'helical-manuscript': 'salsa-helical-amphipathicity',
}


def task_file(item):
    if item in MANUSCRIPTS:
        name = MANUSCRIPTS[item]
        overleaf = MANUSCRIPT_ROOT / name / 'TodoList' / 'TODO.md'
        return overleaf if overleaf.is_file() else MANUSCRIPT_ROOT / 'TodoList' / f'{name}.md'
    return TASK_FILES.get(item)


class PreviewHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/__preview/salsa-todo.md':
            source = task_file('salsa-app')
        elif path.startswith('/__preview/tasks/') and path.endswith('.md'):
            source = task_file(path.removeprefix('/__preview/tasks/').removesuffix('.md'))
        elif path.startswith('/__preview/'):
            self.send_error(404)
            return
        else:
            return super().do_GET()
        if source is None:
            self.send_error(404)
            return
        try:
            body = source.read_bytes()
        except OSError:
            self.send_error(503, 'Project task file is unavailable')
            return
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8765)
    args = parser.parse_args()
    handler = partial(PreviewHandler, directory=str(SITE_ROOT))
    server = ThreadingHTTPServer(('127.0.0.1', args.port), handler)
    print(f'Gallery preview: http://127.0.0.1:{args.port}/', flush=True)
    print('Serving allowlisted local app and manuscript task lists.', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
