import data_manager


def get_boards():
    """
    Gather all boards
    :return:
    """
  
    # return [{"title": "board1", "id": 1}, {"title": "board2", "id": 2}]

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_statuses():
  
    return data_manager.execute_select(
        """
        SELECT * FROM statuses
        ;
        """
    )


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status

def get_card_by_id(id):
    card = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE id = %(id)s
        ;
        """
        , {"id": id})

    return card


def get_cards_for_board(board_id):

    # return [{"title": "title1", "id": 1}, {"title": "board2", "id": 2}]

    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def get_cards_for_status(status_id):

    # return [{"title": "title1", "id": 1}, {"title": "board2", "id": 2}]

    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.status_id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return matching_cards


def get_number_of_cards_by_status(status_id):

    number_of_cards = data_manager.execute_select(
        """
        SELECT COUNT(*) FROM cards
        WHERE status_id = %(status_id)s
        ;
        """
        , {"status_id": status_id}, True)
    
    return number_of_cards


def create_new_board(title):
    board = data_manager.execute_insert(
        f"""
        INSERT into boards (title)
        VALUES ('{title}')
        RETURNING id, title;
        """
    )
    return board


def create_new_status(title):
    status = data_manager.execute_insert(
        f"""
        INSERT into statuses (title)
        VALUES ('{title}')
        RETURNING id, title;
        """
    )
    return status


def create_new_card(title, board_id, status_id, card_order):
    card = data_manager.execute_insert(
        f"""
        INSERT into cards (board_id, status_id, title, card_order)
        VALUES ({board_id}, {status_id}, '{title}', {card_order} )
        RETURNING id, board_id, status_id, title, card_order;
        """
    )
    return card


def edit_board_title(title, id):
    data_manager.execute_insert(f"""
        UPDATE boards
        SET title = '{title}'
        WHERE id = {id}
        RETURNING id, title;
        """
    )

def edit_status_title(title, id):
    data_manager.execute_insert(f"""
        UPDATE statuses
        SET title = '{title}'
        WHERE id = {id}
        RETURNING id, title;
        """
    )

def edit_card_title(title, id):
    data_manager.execute_insert(f"""
        UPDATE cards
        SET title = '{title}'
        WHERE id = {id}
        RETURNING id, title;
        """
    )

def edit_card_status(card_id, status_id):
    data_manager.execute_insert(f"""
        UPDATE cards
        SET status_id = {status_id}
        WHERE id = {card_id}
        RETURNING id, title;
        """
    )


def edit_card_order(card_id, card_order):
    data_manager.execute_insert(f"""
        UPDATE cards
        SET card_order = {card_order}
        WHERE id = {card_id}
        RETURNING id, title;
        """
    )


def delete_card(id):
    data_manager.execute_delete(f"""
        DELETE FROM cards
        WHERE id = {id};
        """
    )


def delete_status(id):
    data_manager.execute_delete(f"""
        DELETE FROM statuses
        WHERE id = {id};
        """
    )


def delete_board(id):
    data_manager.execute_delete(f"""
        DELETE FROM boards
        WHERE id = {id};
        """
    )



   
   
