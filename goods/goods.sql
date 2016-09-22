create database goods character set utf8;

use goods;

create table adminInfo(
    aid int primary key auto_increment,
    aname varchar(40) not null unique,
    pwd varchar(20) not null
);

alter table adminInfo auto_increment=1001;

create table goodsType(
    tid int primary key auto_increment,
    tname varchar(40) not null unique,
    status int
);

alter table goodsType auto_increment=1001;

create table goodsInfo(
    gid int primary key auto_increment,
    gname varchar(100),
    price decimal(10,2),
    pic varchar(1000),
    tid int
);

alter table goodsInfo auto_increment=1001;

