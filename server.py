from flask import Flask, request, jsonify, render_template

# Create a Flask app 
app = Flask(__name__)

PLAYER_SHAPE = ""
BOT_SHAPE = ""

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/shape', methods=['GET','POST'])
def shape():
    global PLAYER_SHAPE
    global BOT_SHAPE
    
    if request.method == 'POST':

        PLAYER_SHAPE = request.json['shape']
        
        if PLAYER_SHAPE == "X":
            BOT_SHAPE = "O"
        else:
            BOT_SHAPE = "X"
            
        return jsonify({"player_shape": PLAYER_SHAPE, "bot_shape": BOT_SHAPE})
    
    if request.method == 'GET':
        return jsonify({"player_shape": PLAYER_SHAPE, "bot_shape": BOT_SHAPE})
    
if __name__ == '__main__':
    app.run(host='0.0.0.0')