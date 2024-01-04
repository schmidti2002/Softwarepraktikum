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
        create_event="CREATE TABLE `Ticketsystem`.`user` ( `user_id` INT NOT NULL AUTO_INCREMENT , `username` VARCHAR(80) NOT NULL , `email` VARCHAR(80) NOT NULL , `password` VARCHAR(64) NOT NULL , `time` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `rights` BOOLEAN NULL DEFAULT NULL , `session_token` VARCHAR(64) NOT NULL , PRIMARY KEY (`user_id`, `username`, `email`)) ENGINE = InnoDB;" 
        util_db_cursor.execute(create_event)
        database.commit()

    util_db_cursor.close()
    db_table.close()
    return True