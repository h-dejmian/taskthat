import data_manager
import bcrypt

def hash_password(plain_text_password):
    hashed_bytes = bcrypt.hashpw(plain_text_password.encode('utf-8'), bcrypt.gensalt())
    return hashed_bytes.decode('utf-8')


def verify_password(plain_text_password, hashed_password):
    hashed_bytes_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_text_password.encode('utf-8'), hashed_bytes_password)


def is_user_registered(user_name):
    return data_manager.execute_select(
            f"""
            SELECT *
            FROM users
            WHERE user_name = '{user_name}'  
            """
    )


def get_user_hash_password(user_name):
    result = data_manager.execute_select( 
            f"""
            SELECT user_password
            FROM users
            WHERE user_name = '{user_name}'  
            """
    )
    return result[0]['user_password']


def register_user(username, password):
    data_manager.execute_insert( 
            f"""
            INSERT INTO users (user_name, user_password, registration_date)
            values('{username}', '{password}', NOW())
            """
    )