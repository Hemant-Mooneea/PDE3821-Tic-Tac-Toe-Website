from flask import Flask, request, jsonify, render_template

# Create a Flask app 
app = Flask(__name__)

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

@app.route('/shape', methods=['GET','POST'])
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
        
    if request.method == 'GET':
        return jsonify({"player_shape": PLAYER_SHAPE, "bot_shape": BOT_SHAPE, "current_turn": CURRENT_TURN})
    
if __name__ == '__main__':
    app.run(host='0.0.0.0')