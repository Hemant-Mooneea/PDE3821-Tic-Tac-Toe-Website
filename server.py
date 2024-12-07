from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

# Create a Flask app 
app = Flask(__name__)
CORS(app)

PLAYER_SHAPE = ""
BOT_SHAPE = ""
CURRENT_TURN = ""

@app.route('/')
def hello_world():
    global PLAYER_SHAPE
    global BOT_SHAPE
    global CURRENT_TURN
    
    PLAYER_SHAPE = ""
    BOT_SHAPE = ""
    CURRENT_TURN = ""
    
    return render_template('index.html')

@app.route('/shape', methods=['GET','POST','DELETE'])
def shape():
    global PLAYER_SHAPE
    global BOT_SHAPE
    global CURRENT_TURN
    
    if request.method == 'POST':

        PLAYER_SHAPE = request.json['shape']
        
        if PLAYER_SHAPE == "X":
            BOT_SHAPE = "O"
            CURRENT_TURN = "PLAYER"
        else:
            BOT_SHAPE = "X"
            CURRENT_TURN = "BOT"
        return jsonify({"player_shape": PLAYER_SHAPE, "bot_shape": BOT_SHAPE, "current_turn": CURRENT_TURN})
    
    if request.method == 'GET':
        return jsonify({"player_shape": PLAYER_SHAPE, "bot_shape": BOT_SHAPE, "current_turn": CURRENT_TURN})
    
    if request.method == 'DELETE':
        PLAYER_SHAPE = ""
        BOT_SHAPE = ""
        CURRENT_TURN = ""
        return jsonify({"player_shape": PLAYER_SHAPE, "bot_shape": BOT_SHAPE, "current_turn": CURRENT_TURN})
        

if __name__ == '__main__':
    app.run(host='0.0.0.0')