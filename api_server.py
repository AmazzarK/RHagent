from flask import Flask, request, jsonify
from flask_cors import CORS
from backend import (
    get_backend,
    parse_query,
    search_candidates,
    save_shortlist,
    analytics_summary,
)

app = Flask(__name__)
CORS(app)

@app.route('/api/analytics', methods=['GET'])
def api_analytics():
    try:
        data = analytics_summary()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/shortlists', methods=['GET', 'POST'])
def api_shortlists():
    backend = get_backend()
    if request.method == 'GET':
        return jsonify(backend.get_shortlists())
    elif request.method == 'POST':
        data = request.get_json()
        name = data.get('name')
        indices = data.get('candidate_indices', [])
        success = save_shortlist(name, indices)
        return jsonify({'success': success})

@app.route('/api/search', methods=['POST'])
def api_search():
    data = request.get_json()
    filters = data.get('filters')
    if not filters:
        query = data.get('query', '')
        filters = parse_query(query)
    results = search_candidates(filters)
    return jsonify(results)

@app.route('/api/parse_query', methods=['POST'])
def api_parse_query():
    data = request.get_json()
    query = data.get('query', '')
    filters = parse_query(query)
    return jsonify(filters)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
