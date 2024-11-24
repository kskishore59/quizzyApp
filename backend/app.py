from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

participants = {}
scores = {}
quizzes = {}

@app.route('/api/participants', methods=['POST'])
def add_participants():
    data = request.json
    print(data)
    participant_list = [p.strip() for p in data['participants'].split(',')]
    quiz_ids = data['quizIds']
    
    for participant in participant_list:
        if participant not in participants:
            participants[participant] = {
                'quizzes': quiz_ids,
                'scores': {quiz_id: None for quiz_id in quiz_ids}
            }
    
    return jsonify({
        'participants': participants,
        'message': 'Participants added successfully'
    })

@app.route('/api/scores/<participant>/<quiz_id>', methods=['POST'])
def update_score(participant, quiz_id):
    data = request.json
    score = data['score']
    
    if participant in participants:
        participants[participant]['scores'][quiz_id] = score
        
    return jsonify({
        'message': 'Score updated successfully',
        'participants': participants
    })

@app.route('/api/scores', methods=['GET'])
def get_scores():
    return jsonify(participants)

if __name__ == '__main__':
    app.run(debug=True, port=5000)