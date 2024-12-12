from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

# Create a Flask app 
app = Flask(__name__)
# Enable CORS so that the frontend can make HTTP requests to the backend
CORS(app)
# Define the shape of the player and bot as global variables and initialize them to empty strings
PLAYER_SHAPE = ""
BOT_SHAPE = ""
CURRENT_TURN = ""
LAST_PLAYED = ""
# Define the route for the homepage
@app.route('/')
# Define a function that returns the index.html file as a response
def home():
    global PLAYER_SHAPE
    global BOT_SHAPE
    global CURRENT_TURN
    global LAST_PLAYED
    # Reset the global variables to empty strings when the homepage is loaded/reloaded
    PLAYER_SHAPE = ""
    BOT_SHAPE = ""
    CURRENT_TURN = ""
    LAST_PLAYED = ""
    # Return the index.html file as a response
    return render_template('index.html')
# Define the route for the shape endpoint with support for GET, POST, and DELETE requests
@app.route('/shape', methods=['GET','POST','DELETE'])
# Define a function that handles the shape endpoint
def shape():
    global PLAYER_SHAPE
    global BOT_SHAPE
    global CURRENT_TURN
    global LAST_PLAYED
    # Check if the request method is POST
    if request.method == 'POST':
        # Get the shape from the request JSON data and store it in the PLAYER_SHAPE global variable
        PLAYER_SHAPE = request.json['shape']
        # Set the BOT_SHAPE based on the PLAYER_SHAPE
        # Set the CURRENT_TURN to "PLAYER" if the PLAYER_SHAPE is "X", otherwise set it to "BOT"
        if PLAYER_SHAPE == "X":
            BOT_SHAPE = "O"
            CURRENT_TURN = "PLAYER"
        else:
            BOT_SHAPE = "X"
            CURRENT_TURN = "BOT"
            # Return a JSON response with the player_shape, bot_shape, and current_turn
        return jsonify({"player_shape": PLAYER_SHAPE, "bot_shape": BOT_SHAPE, "current_turn": CURRENT_TURN})
    # Check if the request method is GET
    if request.method == 'GET':
        # Return a JSON response with the player_shape, bot_shape, and current_turn
        return jsonify({"player_shape": PLAYER_SHAPE, "bot_shape": BOT_SHAPE, "current_turn": CURRENT_TURN})
    # Check if the request method is DELETE
    if request.method == 'DELETE':
        # Reset the global variables to empty strings when the shape is deleted
        PLAYER_SHAPE = ""
        BOT_SHAPE = ""
        CURRENT_TURN = ""
        LAST_PLAYED = ""
        return jsonify({"player_shape": PLAYER_SHAPE, "bot_shape": BOT_SHAPE, "current_turn": CURRENT_TURN})
# Define the route for the move endpoint with support for GET and POST requests
@app.route('/last-played', methods=['GET','POST'])
# Define a function that handles the last-played endpoint
def move():
    global LAST_PLAYED
    # Check if the request method is POST
    if request.method == 'POST':
        # Get the last_played from the request JSON data and store it in the LAST_PLAYED global variable
        LAST_PLAYED = request.json['last_played']
        # Return a JSON response with the last_played
        return jsonify({"last_played": LAST_PLAYED})
    # Check if the request method is GET
    if request.method == 'GET':
        # Return a JSON response with the last_played
        return jsonify({"last_played": LAST_PLAYED})
# Define the route for the play endpoint with support for POST requests
if __name__ == '__main__':
    # Run the Flask app on port 5000
    app.run(host='0.0.0.0')