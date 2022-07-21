create database backoffice;
-- drop database backoffice;
use  backoffice;

-- drop table films
create table films(
  filmid character varying(40) primary key,
  title character varying(300) not null,
  description character varying(300),
  imageurl character varying(300),
  trailerurl character varying(300),
  categories character varying[],
  status char(1) not null,
  createdby character varying(40),
  createdat timestamp,
  updatedby character varying(40),
  updatedat timestamp
);

create table if not exists usefulfilm(
  id character varying(255) ,
  author character varying(255),
  createdat timestamp,
  updatedat timestamp,
  PRIMARY KEY (id, author)
)

--drop table categories
create table categories(
  categoryid character varying(40) primary key,
  categoryname character varying(300) not null,
  status char(1) not null,
  createdby character varying(40),
  createdat timestamp,
  updatedby character varying(40),
  updatedat timestamp
);

--drop table cinema
CREATE TABLE cinema (
  id varchar(40),
  name varchar(255) NOT NULL,
  address varchar(255) NOT NULL,
  parent varchar(40),
  status CHAR(1) NOT NULL,
  latitude  numeric,
  longitude numeric,
  imageURL text,
  createdby varchar(40),
  createdat timestamp,
  updatedby varchar(40),
  updatedat timestamp,
  gallery jsonb[],
  coverUrl text
  primary key(id)
);

CREATE TABLE modules (
  moduleid varchar(40) PRIMARY KEY,
  modulename varchar(255) not null,
  status char(1) not null,
  path varchar(255),
  resourcekey varchar(255),
  icon varchar(255),
  sequence int not null,
  parent varchar(40),
  createdby varchar(40),
  createdat timestamp,
  updatedby varchar(40),
  updatedat timestamp,
  displaymode char(1) not null
);

CREATE TABLE users (
  userid varchar(40) PRIMARY KEY,
  username varchar(255) not null,
  email varchar(255) not null,
  displayname varchar(255) not null,
  status char(1) not null,
  gender char(1),
  phone varchar(20),
  title varchar(10),
  position varchar(40),
  imageurl varchar(500),
  createdby varchar(40),
  createdat timestamp,
  updatedby varchar(40),
  updatedat timestamp,
  lastlogin timestamp
);

CREATE TABLE roles (
  roleid varchar(40) PRIMARY KEY,
  rolename varchar(255) not null,
  status char(1) not null,
  remark varchar(255),
  createdby varchar(40),
  createdat timestamp,
  updatedby varchar(40),
  updatedat timestamp
);
CREATE TABLE userroles (
  userid varchar(40) not null,
  roleid varchar(40) not null,
  PRIMARY KEY (userid, roleid)
);
CREATE TABLE rolemodules (
  roleid varchar(40) not null,
  moduleid varchar(40) not null,
  permissions int not null,
  PRIMARY KEY (roleid, moduleid)
);

CREATE TABLE auditlog (
  id varchar(255) PRIMARY KEY,
  resourcetype varchar(255),
  userid varchar(255),
  ip varchar(255),
  action varchar(255),
  timestamp timestamp,
  status varchar(255),
  remark varchar(255)
);

CREATE TABLE filmInfo (
  id varchar(255) PRIMARY KEY,
  rate numeric DEFAULT 0,
  rate1 integer DEFAULT 0,
  rate2 integer DEFAULT 0,
  rate3 integer DEFAULT 0,
  rate4 integer DEFAULT 0,
  rate5 integer DEFAULT 0,
  rate6 integer DEFAULT 0,
  rate7 integer DEFAULT 0,
  rate8 integer DEFAULT 0,
  rate9 integer DEFAULT 0,
  rate10 integer DEFAULT 0,
  viewCount integer DEFAULT 0
);

CREATE TABLE filmrate (
  id varchar(255),
  userid varchar(255),
  rate integer DEFAULT 0,
  rateTime date,
  review varchar(255),
  usefulcount integer DEFAULT 0,
  PRIMARY KEY (id , userid)
);

CREATE TABLE info(
  id varchar(255),
  rate numeric DEFAULT 0,
  rate1 integer DEFAULT 0,
  rate2 integer DEFAULT 0,
  rate3 integer DEFAULT 0,
  rate4 integer DEFAULT 0,
  rate5 integer DEFAULT 0,
  viewCount integer DEFAULT 0,
  primary key(id)
)

CREATE TABLE rates(
  id varchar(255),
  author varchar(255),
  rate integer,
  time timestamp,
  review text,
  usefulcount integer default 0,
  replycount integer default 0,
  primary key(id, author)
)

CREATE TABLE ratereaction(
	id varchar(255),
	author varchar(255),
	userid varchar(255),
	time timestamp,
	reaction smallint,
	primary key(id, author, userid)
)

CREATE TABLE appreciation(
	id varchar(255),
	author varchar(255),
	title text,
	description text,
	createat timestamp,
	replycount integer default 0,
	primary key(id, author)
);

CREATE TABLE rate_comments(
  commentid serial,
  id varchar(255),
  author varchar(255),
  userId varchar(255),
  comment text,
  time timestamp,
  primary key(commentid)
);

yM389FbhlRQ

INSERT INTO categories (categoryid,categoryname,status) VALUES('adventure','adventure','A');
INSERT INTO categories (categoryid,categoryname,status) VALUES ('animated','animated','A');
INSERT INTO categories (categoryid,categoryname,status) VALUES ('comedy','comedy','A');
INSERT INTO categories (categoryid,categoryname,status) VALUES ('drama','drama','A');
INSERT INTO categories (categoryid,categoryname,status) VALUES ('horror','horror','A');
INSERT INTO categories (categoryid,categoryname,status) VALUES ('crime','crime','A');
INSERT INTO categories (categoryid,categoryname,status) VALUES ('fantasy','fantasy','A');
INSERT INTO categories (categoryid,categoryname,status) VALUES ('family','family','A');

INSERT INTO films (filmid,title,imageurl,trailerurl,categories,status) VALUES ('00001','The Shawshank Redemption','https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UY67_CR0,0,45,67_AL_.jpg','https://www.imdb.com/video/vi3877612057?playlistId=tt0111161&ref_=tt_pr_ov_vi','{drama}','A');
INSERT INTO films (filmid,title,imageurl,trailerurl,categories,status) VALUES ('00002','Thor: Love and Thunder','https://genk.mediacdn.vn/139269124445442048/2022/4/19/2-16503255592162067496114.jpg','https://www.youtube.com/watch?v=tgB1wUcmbbw','{drama,crime}','A');
INSERT INTO films (filmid,title,imageurl,trailerurl,categories,status) VALUES ('00003','Top Gun: Maverick','https://www.cgv.vn/media/catalog/product/cache/3/image/c5f0a1eff4c394a251036189ccddaacd/t/o/top_gun_maverick_-_poster_28.03_1_.jpg','https://www.youtube.com/watch?v=yM389FbhlRQ','{action,drama}','A');
INSERT INTO films (filmid,title,imageurl,trailerurl,categories,status) VALUES ('00004','The Batman','https://www.cgv.vn/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/p/o/poster_batman-1.jpg','https://youtu.be/761uRaAoW00','{action,crime,drama}','A');
INSERT INTO films (filmid,title,imageurl,trailerurl,categories,status) VALUES ('00005','The Sadness','https://phimnhua.com/wp-content/uploads/2022/04/phimnhua_1650248826.jpg','https://www.youtube.com/watch?v=axjme4v-xRo','{horror}','A');
INSERT INTO films (filmid,title,imageurl,trailerurl,categories,status) VALUES ('00006','Doctor Strange in the Multiverse of Madness','https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UY67_CR0,0,45,67_AL_.jpg','https://www.imdb.com/video/vi3877612057?playlistId=tt0111161&ref_=tt_pr_ov_vi','{action,adventure,fantasy}','A');
INSERT INTO films (filmid,title,imageurl,trailerurl,categories,status) VALUES ('00007','Fantastic Beasts: The Secrets of Dumbledore','https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2022/04/review-phim-sinh-vat-huyen-bi-3-fantastic-beasts-3-2-696x1031.jpg?fit=700%2C20000&quality=95&ssl=1','https://youtu.be/Y9dr2zw-TXQ','{family,adventure,fantasy}','A');
INSERT INTO films (filmid,title,imageurl,trailerurl,categories,status) VALUES ('00008','The Adam Project','http://photos.q00gle.com/storage/files/images-2021/images-movies/09/622b6789e7084.jpg','https://youtu.be/IE8HIsIrq4o','{action,comedy,adventure}','A');
INSERT INTO films (filmid,title,imageurl,trailerurl,categories,status) VALUES ('00009','Spider-Man: No Way Home','https://gamek.mediacdn.vn/133514250583805952/2021/11/17/photo-1-1637118381839432740223.jpg','https://www.youtube.com/watch?v=OB3g37GTALc','{action,adventure,fantasy}','A');
INSERT INTO films (filmid,title,imageurl,trailerurl,categories,status) VALUES ('00010','Dune','https://www.cgv.vn/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/d/u/dune-poster-1.jpg','https://youtu.be/8g18jFHCLXk','{action,adventure,drama}','A');

-- INSERT INTO cinema (id, name, address, parent, status, latitude, longitude, imageURL) VALUES ('00001','Galaxy Nguyen Du','116 Nguyễn Du, Quận 1, Tp.HCM, Thành phố Hồ Chí Minh','Galaxy','A','106.688470','10.767920', 'https://cdn.galaxycine.vn/media/2019/5/6/rapgiave-hinhrap-nguyen-du-1_1557134449561.jpg');
-- INSERT INTO cinema (id, name, address, parent, status, latitude, longitude, imageURL) VALUES ('00002','Galaxy Tan Binh','246 Nguyễn Hồng Đào,Tân Bình,Thành phố Hồ Chí Minh','Galaxy','A','106.615760','10.765440', 'https://cdn.galaxycine.vn/media/2019/5/6/rapgiave-hinhrap-nguyen-du-2_1557134452480.jpg');
-- INSERT INTO cinema (id, name, address, parent, status, latitude, longitude, imageURL) VALUES ('00003','Galaxy Huynh Tan Phat','Lầu 2, TTTM Coopmart, số 1362 Huỳnh Tấn Phát, khu phố 1, Phường Phú Mỹ, Quận 7, Tp.Hồ Chí Minh','Galaxy','A','106.700980','10.776530', 'https://cdn.galaxycine.vn/media/2019/5/6/rapgiave-hinhrap-nguyen-du-3_1557134455385.jpg');
-- INSERT INTO cinema (id, name, address, parent, status, latitude, longitude, imageURL) VALUES ('00004','Galaxy Quang Trung','Lầu 3, TTTM CoopMart Foodcosa số 304A, Quang Trung, P.11, Q. Gò Vấp, Tp.HCM','Galaxy','A','106.668750','10.831360', 'https://www.galaxycine.vn/media/2019/5/6/rapgiave-hinhrap-nvq-01_1557130993556.jpg');
-- INSERT INTO cinema (id, name, address, parent, status, latitude, longitude, imageURL) VALUES ('00005','CGV Hung Vuong',' Hùng Vương Plaza 126 Hùng Vương Quận 5 Tp. Hồ Chí Minh','CGV','A','106.686060','10.756610', 'https://cdn.galaxycine.vn/media/2020/1/14/dsc08626_1578986801643.jpg');
-- INSERT INTO cinema (id, name, address, parent, status, latitude, longitude, imageURL) VALUES ('00006','CGV Cresent Mall','Lầu 5, Crescent Mall Đại lộ Nguyễn Văn Linh, Phú Mỹ Hưng Quận 7 TP. Hồ Chí Minh','CGV','A','106.700980','10.776530', 'https://saigondepot.vn/wp-content/uploads/2020/06/1558513559_Galaxy-Cinema-16-1024x825.jpg');
-- INSERT INTO cinema (id, name, address, parent, status, latitude, longitude, imageURL) VALUES ('00007','Lotte Nam Sai Gon','Tầng 3, TTTM Lotte, số 469 đường Nguyễn Hữu Thọ, P.Tân Hưng, Q.7, TP.HCM, Việt Nam','Lotte','A','106.700980','10.776530', 'https://cdn.galaxycine.vn/media/2019/5/6/rapgiave-hinhrap-ben-tre-2_1557133175911.jpg');


INSERT INTO modules (moduleid,modulename,status,path,resourcekey,icon,sequence,parent,displaymode) VALUES ('dashboard','Dashboard','A','/dashboard','dashboard','assignments',1,'', 'A');
INSERT INTO modules (moduleid,modulename,status,path,resourcekey,icon,sequence,parent,displaymode) VALUES ('admin','Admin','A','/admin','admin','contacts',2,'','I');
INSERT INTO modules (moduleid,modulename,status,path,resourcekey,icon,sequence,parent,displaymode) VALUES ('setup','Setup','A','/setup','setup','settings',3,'','I');
INSERT INTO modules (moduleid,modulename,status,path,resourcekey,icon,sequence,parent,displaymode) VALUES ('report','Report','A','/report','report','pie_chart',4,'','A');

INSERT INTO modules (moduleid,modulename,status,path,resourcekey,icon,sequence,parent,displaymode) VALUES ('user','User Management','A','/users','user','person',1,'admin','I');
INSERT INTO modules (moduleid,modulename,status,path,resourcekey,icon,sequence,parent,displaymode) VALUES ('role','Role Management','A','/roles','role','credit_card',2,'admin','I');
INSERT INTO modules (moduleid,modulename,status,path,resourcekey,icon,sequence,parent,displaymode) VALUES ('role_assignment','Role Management','A','/role-assignment','role_assignment','credit_card',3,'admin','I');
INSERT INTO modules (moduleid,modulename,status,path,resourcekey,icon,sequence,parent,displaymode) VALUES ('audit_log','Audit Log','A','/audit-logs','audit_log','zoom_in',4,'admin','I');


INSERT INTO roles (roleid, rolename, status, remark) VALUES ('admin','Admin','A','Admin');
INSERT INTO roles (roleid, rolename, status, remark) VALUES ('call_center','Call Center','A','Call Center');
INSERT INTO roles (roleid, rolename, status, remark) VALUES ('it_support','IT Support','A','IT Support');
INSERT INTO roles (roleid, rolename, status, remark) VALUES ('operator','Operator Group','A','Operator Group');

INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00001','gareth.bale','gareth.bale@gmail.com','Gareth Bale','https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Liver-RM_%282%29_%28cropped%29.jpg/440px-Liver-RM_%282%29_%28cropped%29.jpg','A','M','0987654321','Mr','M');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00002','cristiano.ronaldo','cristiano.ronaldo@gmail.com','Cristiano Ronaldo','https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cristiano_Ronaldo_2018.jpg/400px-Cristiano_Ronaldo_2018.jpg','I','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00003','james.rodriguez','james.rodriguez@gmail.com','James Rodríguez','https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/James_Rodriguez_2018.jpg/440px-James_Rodriguez_2018.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00004','zinedine.zidane','zinedine.zidane@gmail.com','Zinedine Zidane','https://upload.wikimedia.org/wikipedia/commons/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00005','kaka','kaka@gmail.com','Kaká','https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Kak%C3%A1_visited_Stadium_St._Petersburg.jpg/500px-Kak%C3%A1_visited_Stadium_St._Petersburg.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00006','luis.figo','luis.figo@gmail.com','Luís Figo','https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/UEFA_TT_7209.jpg/440px-UEFA_TT_7209.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00007','ronaldo','ronaldo@gmail.com','Ronaldo','https://upload.wikimedia.org/wikipedia/commons/c/c8/Real_Valladolid-Valencia_CF%2C_2019-05-18_%2890%29_%28cropped%29.jpg','I','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00008','thibaut.courtois','thibaut.courtois@gmail.com','Thibaut Courtois','https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Courtois_2018_%28cropped%29.jpg/440px-Courtois_2018_%28cropped%29.jpg','I','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00009','luka.modric','luka.modric@gmail.com','Luka Modrić','https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/ISL-HRV_%287%29.jpg/440px-ISL-HRV_%287%29.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00010','xabi.alonso','xabi.alonso@gmail.com','Xabi Alonso','https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Xabi_Alonso_Training_2017-03_FC_Bayern_Muenchen-3_%28cropped%29.jpg/440px-Xabi_Alonso_Training_2017-03_FC_Bayern_Muenchen-3_%28cropped%29.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00011','karim.benzema','karim.benzema@gmail.com','Karim Benzema','https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Karim_Benzema_2018.jpg/440px-Karim_Benzema_2018.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00012','marc-andre.ter.stegen','marc-andre.ter.stegen@gmail.com','Marc-André ter Stegen','https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Marc-Andr%C3%A9_ter_Stegen.jpg/500px-Marc-Andr%C3%A9_ter_Stegen.jpg','I','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00013','sergino.dest','sergino.dest@gmail.com','Sergiño Dest','https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Sergino_Dest.jpg/440px-Sergino_Dest.jpg','I','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00014','gerard.pique','gerard.pique@gmail.com','Gerard Piqué','https://upload.wikimedia.org/wikipedia/commons/4/4e/Gerard_Piqu%C3%A9_2018.jpg','A','M','0987654321','Mr','M');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00015','ronald.araujo','ronald.araujo@gmail.com','Ronald Araújo','https://pbs.twimg.com/media/EtnqxaEU0AAc6A6.jpg','A','M','0987654321','Mr','M');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00016','sergio.busquets','sergio.busquets@gmail.com','Sergio Busquets','https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Sergio_Busquets_2018.jpg/440px-Sergio_Busquets_2018.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00017','antoine.griezmann','antoine.griezmann@gmail.com','Antoine Griezmann','https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Antoine_Griezmann_in_2018_%28cropped%29.jpg/440px-Antoine_Griezmann_in_2018_%28cropped%29.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00018','miralem.pjanic','miralem.pjanic@gmail.com','Miralem Pjanić','https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/20150331_2025_AUT_BIH_2130_Miralem_Pjani%C4%87.jpg/440px-20150331_2025_AUT_BIH_2130_Miralem_Pjani%C4%87.jpg','A','M','0987654321','Mrs','M');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00019','martin.braithwaite','martin.braithwaite@gmail.com','Martin Braithwaite','https://pbs.twimg.com/profile_images/1231549032943800320/WR769kKG_400x400.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00020','ousmane.dembele','ousmane.dembele@gmail.com','Ousmane Dembélé','https://upload.wikimedia.org/wikipedia/commons/7/77/Ousmane_Demb%C3%A9l%C3%A9_2018.jpg','A','M','0987654321','Ms','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00021','riqui.puig','riqui.puig@gmail.com','Riqui Puig','https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Bar%C3%A7a_Napoli_12_%28cropped%29.jpg/440px-Bar%C3%A7a_Napoli_12_%28cropped%29.jpg','A','M','0987654321','Ms','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00022','philip.coutinho','philip.coutinho@gmail.com','Philip Coutinho','https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Norberto_Murara_Neto_2019.jpg/440px-Norberto_Murara_Neto_2019.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00023','victor.lindelof','victor.lindelof@gmail.com','Victor Lindelöf','https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/CSKA-MU_2017_%286%29.jpg/440px-CSKA-MU_2017_%286%29.jpg','I','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00024','eric.bailly','eric.bailly@gmail.com','Eric Bailly','https://upload.wikimedia.org/wikipedia/commons/c/cf/Eric_Bailly_-_ManUtd.jpg','I','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00025','phil.jones','phil.jones@gmail.com','Phil Jones','https://upload.wikimedia.org/wikipedia/commons/f/fa/Phil_Jones_2018-06-28_1.jpg','I','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00026','harry.maguire','harry.maguire@gmail.com','Harry Maguire','https://upload.wikimedia.org/wikipedia/commons/b/be/Harry_Maguire_2018-07-11_1.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00027','paul.pogba','paul.pogba@gmail.com','Paul Pogba','https://upload.wikimedia.org/wikipedia/commons/b/be/Harry_Maguire_2018-07-11_1.jpg','I','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00028','edinson.cavani','edinson.cavani@gmail.com','Edinson Cavani','https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Edinson_Cavani_2018.jpg/440px-Edinson_Cavani_2018.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00029','juan.mata','juan.mata@gmail.com','Juan Mata','https://upload.wikimedia.org/wikipedia/commons/7/70/Ukr-Spain2015_%286%29.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00030','anthony.martial','anthony.martial@gmail.com','Anthony Martial','https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Anthony_Martial_27_September_2017_cropped.jpg/440px-Anthony_Martial_27_September_2017_cropped.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00031','marcus.rashford','marcus.rashford@gmail.com','Marcus Rashford','https://upload.wikimedia.org/wikipedia/commons/5/5e/Press_Tren_CSKA_-_MU_%283%29.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00032','mason.greenwood','mason.greenwood@gmail.com','Mason Greenwood','https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mason_Greenwood.jpeg/440px-Mason_Greenwood.jpeg','A','M','0987654321','Ms','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00033','lee.grant','lee.grant@gmail.com','Lee Grant','https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/LeeGrant09.jpg/400px-LeeGrant09.jpg','A','M','0987654321','Ms','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00034','jesse.lingard','jesse.lingard@gmail.com','Jesse Lingard','https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Jesse_Lingard_2018-06-13_1.jpg/440px-Jesse_Lingard_2018-06-13_1.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00035','keylor.navas','keylor.navas@gmail.com','Keylor Navas','https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Liver-RM_%288%29_%28cropped%29.jpg/440px-Liver-RM_%288%29_%28cropped%29.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00036','achraf.hakimi','achraf.hakimi@gmail.com','Achraf Hakimi','https://upload.wikimedia.org/wikipedia/commons/9/91/Iran-Morocco_by_soccer.ru_14_%28Achraf_Hakimi%29.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00037','presnel.kimpembe','presnel.kimpembe@gmail.com','Presnel Kimpembe','https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Presnel_Kimpembe.jpg/400px-Presnel_Kimpembe.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00038','sergio.ramos','sergio.ramos@gmail.com','Sergio Ramos','https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/FC_RB_Salzburg_versus_Real_Madrid_%28Testspiel%2C_7._August_2019%29_09.jpg/440px-FC_RB_Salzburg_versus_Real_Madrid_%28Testspiel%2C_7._August_2019%29_09.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00039','marquinhos','marquinhos@gmail.com','Marquinhos','https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Brasil_conquista_primeiro_ouro_ol%C3%ADmpico_nos_penaltis_1039278-20082016-_mg_4916_%28cropped%29.jpg/440px-Brasil_conquista_primeiro_ouro_ol%C3%ADmpico_nos_penaltis_1039278-20082016-_mg_4916_%28cropped%29.jpg','A','M','0987654321','Mr','E');
INSERT INTO users (userid,username,email,displayname,imageurl,status,gender,phone,title,position) VALUES ('00040','marco.verratti','marco.verratti@gmail.com','Marco Verratti','https://upload.wikimedia.org/wikipedia/commons/d/d0/Kiev-PSG_%289%29.jpg','A','M','0987654321','Mr','E');

INSERT INTO userroles(userid, roleid) VALUES ('00001','admin');
INSERT INTO userroles(userid, roleid) VALUES ('00003','admin');
INSERT INTO userroles(userid, roleid) VALUES ('00004','admin');
INSERT INTO userroles(userid, roleid) VALUES ('00005','it_support');
INSERT INTO userroles(userid, roleid) VALUES ('00007','admin');
INSERT INTO userroles(userid, roleid) VALUES ('00008','call_center');
INSERT INTO userroles(userid, roleid) VALUES ('00009','it_support');
INSERT INTO userroles(userid, roleid) VALUES ('00010','call_center');
INSERT INTO userroles(userid, roleid) VALUES ('00011','it_support');
INSERT INTO userroles(userid, roleid) VALUES ('00012','call_center');
INSERT INTO userroles(userid, roleid) VALUES ('00012','it_support');

INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','dashboard',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','admin',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','setup',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','report',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','audit_log',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','activity_log',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','operation_report',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','merchant_report',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','merchant_fee_report',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','summary_report',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','transaction_report',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','group',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','company',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','product',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','fee',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','merchant',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','user',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','role',7);
INSERT INTO rolemodules(roleid,moduleid,permissions) VALUES ('admin','role_assignment',7);
/*
ALTER TABLE userroles ADD FOREIGN KEY (userid) REFERENCES users (userid);
ALTER TABLE userroles ADD FOREIGN KEY (roleid) REFERENCES roles (roleid);

ALTER TABLE modules ADD FOREIGN KEY (parent) REFERENCES modules (moduleid);

ALTER TABLE rolemodules ADD FOREIGN KEY (roleid) REFERENCES roles (roleid);
ALTER TABLE rolemodules ADD FOREIGN KEY (moduleid) REFERENCES modules (moduleid);
*/