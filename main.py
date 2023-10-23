from flask import Flask, render_template, url_for, request, redirect, session, jsonify
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries
import user_data_handler



mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
app.secret_key = b'\xd7S@C\xe00\xf8\x11\xefj\xf1\xbcN\xb1$\xd5'


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()

@app.route("/api/boards/cards/<int:card_id>")
def get_card(card_id):
    card = queries.get_card_by_id(card_id)
    return jsonify(card)


@app.route("/api/boards/statuses/<int:status_id>")
@json_response
def get_card_status(status_id):
    return queries.get_card_status(status_id)


@app.route("/api/boards/statuses/")
@json_response
def get_statuses():
    return queries.get_statuses()


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)

@app.route("/api/<int:status_id>")
def getNumberOfCardsByStatus(status_id):
    number_of_cards = queries.get_number_of_cards_by_status(status_id)
    number_of_cards = number_of_cards[0]

    return jsonify(number_of_cards['count'])

@app.route("/api/boards", methods=["POST"])
def create_new_board():
    title = request.get_json()
    board = queries.create_new_board(title)

    return jsonify(board)

    
@app.route("/api/boards/card", methods=["POST"])
def create_new_card():
    data = request.get_json()
    title = data['title']
    board_id = data['board_id']
    status_id = data['status_id']
    card_order = data['card_order']
    card = queries.create_new_card(title, board_id, status_id, card_order)

    return jsonify(card)


@app.route("/api/statuses", methods=["POST"])
def create_new_status():
    title = request.get_json()
    status = queries.create_new_status(title)
   
    return jsonify(status)


@app.route("/api/boards/<int:id>", methods=["PATCH"])
def edit_board_title(id):
    title = request.get_json()
    queries.edit_board_title(title, id)

    return jsonify("ok")


@app.route("/api/statuses/<int:id>", methods=["PATCH"])
def edit_status_title(id):
    title = request.get_json()
    queries.edit_status_title(title, id)

    return jsonify("ok")


@app.route("/api/boards/cards/<int:card_id>", methods=["PATCH"])
def edit_card_title(card_id):
    title = request.get_json()
    queries.edit_card_title(title, card_id)

    return jsonify("ok")


@app.route("/api/boards/statuses/<int:card_id>", methods=["PATCH"])
def edit_card_status(card_id):
    status_id = int(request.get_json())
    queries.edit_card_status(card_id, status_id)

    return jsonify("ok")

@app.route("/api/boards/s/<int:card_id>", methods=["PATCH"])
def edit_card_order(card_id):
    card_order = int(request.get_json())
    queries.edit_card_order(card_id, card_order)

    return jsonify("ok")


@app.route("/api/boards/cards/<int:card_id>", methods=["DELETE"])
def delete_card(card_id):
    queries.delete_card(card_id)

    return jsonify("ok")


@app.route("/api/statuses/<int:status_id>", methods=["DELETE"])
def delete_status(status_id):

    cards_to_delete = queries.get_cards_for_status(status_id)

    for card in cards_to_delete:
        queries.delete_card(card['id'])

    queries.delete_status(status_id)

    return jsonify("ok")


@app.route("/api/boards/<int:board_id>", methods=["DELETE"])
def delete_board(board_id):

    statuses_to_delete = []
    cards_to_delete = queries.get_cards_for_board(board_id)

    for card in cards_to_delete:
        if(card['status_id'] not in statuses_to_delete):
            statuses_to_delete.append(card['status_id'])

        queries.delete_card(card['id'])
    
    for statusId in statuses_to_delete:
        queries.delete_status(statusId)

    queries.delete_board(board_id)

    return jsonify("ok")



@app.route('/login', methods=['GET', 'POST'])
def login():
    message = ''
    if request.method == 'POST':
        is_user_registered = user_data_handler.is_user_registered(request.form['user_name'])
        if is_user_registered:
            hashed_password = user_data_handler.get_user_hash_password(request.form['user_name'])
            passwrod_valid = user_data_handler.verify_password(request.form['password'], hashed_password)

            if passwrod_valid:
                session['user_name'] = request.form['user_name']
                session.permanent = True
                return redirect(url_for('index'))
            else:
                message = 'Wrong password'
        else:
            message = 'Wrong user'

    return render_template('login.html', message=message)


@app.route("/registration", methods=["GET", "POST"])
def register_user():
    if request.method == "POST":
        user_name = request.form['user_name']
        password = user_data_handler.hash_password(request.form['password'])
        user_data_handler.register_user(user_name, password)

        return redirect(url_for('index'))  
    else:    
        return render_template("registration.html")
    
    
@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.pop('user_name', None)
    return redirect(url_for('index'))


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
