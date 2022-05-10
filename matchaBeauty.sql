DROP TABLE IF EXISTS creditcard;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS brand;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS favourites;
DROP TABLE IF EXISTS shoppingBag;
DROP TABLE IF EXISTS orders;

CREATE TABLE creditcard(
    ccid text primary key not null, -- unique id
    name text NOT NULL,
    exp text NOT NULL,
    cardNum integer NOT NULL,
    cvv integer NOT NULL
);

INSERT INTO creditCard VALUES('CC1','Areej Irfan','3/26/24',123456, 682);
INSERT INTO creditCard VALUES('CC2','Kashish Mughal','3/26/24',123457, 503);
INSERT INTO creditCard VALUES('CC3','Zahra Ali','3/26/24',123458, 249);
INSERT INTO creditCard VALUES('CC4','Tamana Talal','3/26/24',123458, 731);

CREATE TABLE user(
    username text not null primary key, -- unique id
    password text NOT NULL, 
    email text NOT NULL,
    ccid TEXT REFERENCES creditCard(ccid)
);

INSERT INTO user VALUES('user1','1234','user1@gmail.com','CC1');
INSERT INTO user VALUES('user2','1234','user2@gmail.com','CC2');
INSERT INTO user VALUES('user3','1234','user3@gmail.com','CC3');
INSERT INTO user VALUES('user4','1234','user4@gmail.com','CC4');

CREATE TABLE brand(
    name text not null primary key, -- unique id
    rank text,
    sales integer
);

INSERT INTO brand VALUES('fairy',1,80);
INSERT INTO brand VALUES('strawberry',4,35);
INSERT INTO brand VALUES('princess',3,41);
INSERT INTO brand VALUES('angel',2,59);
INSERT INTO brand VALUES('lily',5,20);

CREATE TABLE product(
    name text not null, -- unique id
    pid text NOT NULL primary key,
    price real NOT NULL,
    category text NOT NULL,
    sales integer,
    brand TEXT REFERENCES brand(name),
    quantity integer NOT NULL,
    image text not null
);

INSERT INTO product VALUES('strawberry red mascara','P1',6.99,'eyes',67,'strawberry',50,'IMG_4727.jpg');
INSERT INTO product VALUES('garden palette','P2',27.99,'eyes',30,'fairy',0,'IMG_4739.jpg');
INSERT INTO product VALUES('garden eyeliner','P3',6.99,'eyes',10,'fairy',50,'IMG_4736.jpg');
INSERT INTO product VALUES('flower palette','P4',25.99,'eyes',5,'lily',50,'IMG_4730.jpg');
INSERT INTO product VALUES('castle palette','P5',40.99,'eyes',31,'princess',50,'IMG_4769.jpg');
INSERT INTO product VALUES('strawberry shake palette','P6',11.99,'eyes',0,'strawberry',50,'IMG_4735.jpg');
INSERT INTO product VALUES('sparkly eyeshadow','P7',7.99,'eyes',10,'fairy',50,'IMG_4737.jpg');
INSERT INTO product VALUES('princess palette','P8',40.99,'eyes',31,'princess',70,'IMG_4728.jpg');
INSERT INTO product VALUES('clouds palette','P9',22.99,'eyes',21,'angel',50,'IMG_4732.jpg');

INSERT INTO product VALUES('sparkly lipstick','P10',13.99,'lips',10,'fairy',50,'IMG_4748.jpg');
INSERT INTO product VALUES('red lipgloss','P11',11.99,'lips',6,'strawberry',50,'IMG_4742.jpg');
INSERT INTO product VALUES('skyliner lipliner','P12',8.99,'lips',13,'angel',50,'IMG_4743.jpg');
INSERT INTO product VALUES('perfect lipstick','P13',5.99,'lips',55,'princess',50,'IMG_4747.jpg');
INSERT INTO product VALUES('pedal lipgloss','P14',6.99,'lips',68,'lily',50,'IMG_4745.jpg');

INSERT INTO product VALUES('fairy bronzer','P15',5.99,'face',20,'fairy',50,'IMG_4759.jpg');
INSERT INTO product VALUES('strawberry blush','P16',12.99,'face',19,'strawberry',50,'IMG_4749.jpg');
INSERT INTO product VALUES('pretty pink blush','P17',9.99,'face',25,'angel',50,'IMG_4752.jpg');
INSERT INTO product VALUES('castle highligher palette','P18',27.99,'face',2,'princess',50,'IMG_4754.jpg');
INSERT INTO product VALUES('flower highlighter','P19',25.99,'face',69,'lily',50,'IMG_4755.jpg');

CREATE TABLE favourites(
    username text not null, -- unique id
    pid text NOT NULL,
    primary key(username,pid),
    foreign key(username) references user(username),
    foreign key(pid) references product(pid)
);

INSERT INTO favourites VALUES('user1','P19');
INSERT INTO favourites VALUES('user1','P11');
INSERT INTO favourites VALUES('user2','P16');
INSERT INTO favourites VALUES('user3','P8');
INSERT INTO favourites VALUES('user3','P9');
INSERT INTO favourites VALUES('user3','P14');
INSERT INTO favourites VALUES('user3','P2');
INSERT INTO favourites VALUES('user4','P14');
INSERT INTO favourites VALUES('user4','P13');

CREATE TABLE orders(
    ccid text NOT NULL, -- unique id
    pid text NOT NULL,
    quantity text NOT NULL,
    status text NOT NULL,
    date text NOT NULL,
    primary key(ccid,date),
    foreign key(ccid) references creditCard(ccid),
    foreign key(pid) references product(pid)
);

INSERT INTO orders VALUES('CC1','P14',1,'delivered','12/23/21');
INSERT INTO orders VALUES('CC1','P15',1,'delivered','1/30/22');
INSERT INTO orders VALUES('CC2','P15',1,'delivered','1/2/22');
INSERT INTO orders VALUES('CC3','P6',2,'delivered','10/16/21');
INSERT INTO orders VALUES('CC4','P2',1,'delivered','11/22/21');
