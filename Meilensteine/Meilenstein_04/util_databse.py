import mysql.connector

def db_connect():
    try:           
        host_url="localhost"
        user_name="User"
        password="123455678"
        datenbank="Softwareprojekt"
        
        database = mysql.connector.connect(host=host_url,user=user_name,passwd=password,db=datenbank,auth_plugin='mysql_native_password')
        return database
    except mysql.connector.Error as err:
        print("Verbindung konnte nicht hergestellt werden.\nFehler: %s \nBitte erneut probieren." % (err))
        return False #DB_Connect()
    
def database_create(database):
    util_db_cursor=database.cursor()
    db_table=database.cursor()

    db_table.execute("show tables")
    current_tables={}
    for x in db_table:
        if type(x[0]) is not str:
            current_tables.update({x[0].decode('utf-8'):1})
        else:
            current_tables.update({x[0]:1})

    if not current_tables.get("User"):
        create_event="CREATE TABLE `User` ( `user_id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(80) NOT NULL , `email` VARCHAR(100) NOT NULL , `password` VARCHAR NOT NULL , `rights` BOOLEAN NULL DEFAULT NULL , PRIMARY KEY (`user_id`, `name`, `email`)) ENGINE = InnoDB;"
        util_db_cursor.execute(create_event)
        database.commit()

    if not current_tables.get("Session"):
        create_user="CREATE TABLE `Session` ( `session_id` INT NOT NULL AUTO_INCREMENT , `time` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `user_id` INT(100) NOT NULL , PRIMARY KEY (`session_id`, `time`, `user_id`)) ENGINE = InnoDB;"
        util_db_cursor.execute(create_user)
        database.commit()

    util_db_cursor.close()
    db_table.close()
    return True