# TaskThat
Web app to manage daily tasks or small projects.

# Description
Main purpose of this web application is to provide useful tool for managing small projects or tasks. Users are able to create boards, statuses and cards.  

When we create new board, we can decide whether we want app to create default statuses for us in this board (In progress, new, testing, done) or leave it blank.  
In every board we can create new statuses and in every status we are able to create cards with their description.  

Order of cards can be changed within status. Moving cards between statuses is available as well. Both operations are possible to accomplish via drag-and-drop.  
Data can be modified by clicking on the individual description.  

Finally, as users we are allowed to delete single cards, statuses and whole boards with everything inside them.  


# Launch
- clone repository
- create **venv**
- create **.env** file according to schema below:
  ```
        MY_PSQL_DBNAME=
        MY_PSQL_USER=
        MY_PSQL_HOST=localhost
        MY_PSQL_PASSWORD=
  ```
- create database in PostgreSQL with name chosen in .env file
- run sql script in data folder
- run **main.py** in your IDE

# Requirements
Python==3.11.0  
click==8.0.0  
colorama==0.4.4  
Flask==2.0.0  
itsdangerous==2.0.1  
Jinja2==3.0.1  
MarkupSafe==2.0.1  
psycopg2==2.9.1  
Werkzeug==2.0.1  
python-dotenv==0.18.0  



