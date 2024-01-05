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

    if not current_tables.get("user"):
        execute_sql="CREATE TABLE `user` ( `user_id` INT NOT NULL AUTO_INCREMENT , `username` VARCHAR(80) NOT NULL , `email` VARCHAR(100) NOT NULL , `password` VARCHAR(64) NOT NULL , `time` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL , `session_token` VARCHAR(64) NOT NULL , `rights` BOOLEAN NOT NULL DEFAULT FALSE , PRIMARY KEY (`user_id`), UNIQUE (`username`)) ENGINE = InnoDB;" 
        util_db_cursor.execute(execute_sql)
        database.commit()

    if not current_tables.get("StructMaster"):
        execute_sql="CREATE TABLE `StructMaster` ( `struct_id` INT NOT NULL AUTO_INCREMENT , `struct_type` INT NOT NULL , `root_node` INT NOT NULL , `user_id` INT NOT NULL , PRIMARY KEY (`struct_id`)) ENGINE = InnoDB;"
        util_db_cursor.execute(execute_sql)
        database.commit()

    if not current_tables.get("HeapNodes"):
        execute_sql="CREATE TABLE `HeapNodes` ( `node_id` INT NOT NULL AUTO_INCREMENT , `value` INT NULL DEFAULT NULL , `child_left` INT NULL DEFAULT NULL , `child_right` INT NULL DEFAULT NULL , PRIMARY KEY (`node_id`)) ENGINE = InnoDB;"
        util_db_cursor.execute(execute_sql)
        database.commit()

    if not current_tables.get("ListNodes"):
        execute_sql="CREATE TABLE `ListNodes` ( `node_id` INT NOT NULL AUTO_INCREMENT , `value` INT NULL DEFAULT NULL , `next_node` INT NULL DEFAULT NULL , PRIMARY KEY (`node_id`)) ENGINE = InnoDB;"
        util_db_cursor.execute(execute_sql)
        database.commit()

    util_db_cursor.close()
    db_table.close()
    return True