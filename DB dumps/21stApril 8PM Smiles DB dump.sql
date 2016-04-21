CREATE DATABASE  IF NOT EXISTS `smiles_schema` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `smiles_schema`;
-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: localhost    Database: smiles_schema
-- ------------------------------------------------------
-- Server version	5.7.12-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity` (
  `ACTIVITY_NAME` varchar(100) NOT NULL,
  `ORPHANAGE_ID` int(15) NOT NULL,
  `WISHLIST_ID` int(15) NOT NULL AUTO_INCREMENT,
  `VISIT_DATE` date NOT NULL,
  `IS_VISIT_COMPLETED` varchar(1) NOT NULL DEFAULT 'N',
  `IS_DONATIONS_CLOSED` varchar(1) DEFAULT 'N',
  `IS_DELETED` varchar(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`WISHLIST_ID`),
  KEY `ORPHANAGE_NAME_FK_idx` (`ORPHANAGE_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
INSERT INTO `activity` VALUES ('Diwali Visit',1,1,'2016-10-23','N','N','N'),('New Year Visit',2,2,'2016-01-01','N','N','N');
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_gallery_map`
--

DROP TABLE IF EXISTS `activity_gallery_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_gallery_map` (
  `IMAGE_ID` int(15) NOT NULL AUTO_INCREMENT,
  `ACTIVITY_ID` int(15) NOT NULL,
  `IMG_PATH` text NOT NULL,
  `IS_DELETED` varchar(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`IMAGE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_gallery_map`
--

LOCK TABLES `activity_gallery_map` WRITE;
/*!40000 ALTER TABLE `activity_gallery_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_gallery_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment` (
  `COMMENT_ID` int(15) NOT NULL AUTO_INCREMENT,
  `ITEM_ID` int(15) NOT NULL,
  `COMMENT` varchar(300) NOT NULL,
  `USER_ID` int(15) NOT NULL,
  `TIME_STAMP` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `IS_DELETED` varchar(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`COMMENT_ID`),
  KEY `ITEM_ID_FK_idx` (`ITEM_ID`),
  KEY `USER_ID_FK_idx` (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donation_items`
--

DROP TABLE IF EXISTS `donation_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `donation_items` (
  `TRANSACTION_ID` int(15) NOT NULL,
  `ITEM_ID` int(15) NOT NULL,
  `DONOR_USER_ID` int(15) NOT NULL,
  `STATUS` varchar(30) NOT NULL,
  `RECEIVER_USER_ID` int(15) NOT NULL,
  `QUANTITY` int(15) NOT NULL,
  `WISHLIST_ID` int(15) NOT NULL,
  `NEED_PICKUP` varchar(1) NOT NULL DEFAULT 'N',
  `PICKUP_ADDRESS` varchar(300) DEFAULT NULL,
  `IS_CLOSED` varchar(1) NOT NULL DEFAULT 'N',
  `IS_DELETED` varchar(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`TRANSACTION_ID`),
  KEY `ITEM_ID_FK_TRANSACTION_idx` (`ITEM_ID`),
  KEY `DONAR_USER_ID_TRANSACTION_idx` (`DONOR_USER_ID`),
  KEY `WISHLIST_ID_FK_ITEMDONATION_idx` (`WISHLIST_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donation_items`
--

LOCK TABLES `donation_items` WRITE;
/*!40000 ALTER TABLE `donation_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `donation_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donation_money`
--

DROP TABLE IF EXISTS `donation_money`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `donation_money` (
  `ID` int(15) NOT NULL,
  `USER_ID` int(15) NOT NULL,
  `WISHLIST_ID` int(15) NOT NULL,
  `MONEY` int(15) NOT NULL,
  `TIMESTAMP` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `IS_DELETED` varchar(1) DEFAULT 'N',
  PRIMARY KEY (`ID`),
  KEY `WISHLIST_ID_FK_idx` (`WISHLIST_ID`),
  KEY `USER_ID_FK_DONATION_MONEY_idx` (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donation_money`
--

LOCK TABLES `donation_money` WRITE;
/*!40000 ALTER TABLE `donation_money` DISABLE KEYS */;
/*!40000 ALTER TABLE `donation_money` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orphanage`
--

DROP TABLE IF EXISTS `orphanage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orphanage` (
  `ORPHANAGE_ID` int(15) NOT NULL,
  `ORPHANAGE_NAME` varchar(45) NOT NULL,
  `ORPHANAGE_PHONE` varchar(20) NOT NULL,
  `ORPHANGE_ADDRESS` varchar(300) NOT NULL,
  `ORPHANAGE_EMAIL` varchar(45) NOT NULL,
  `ORPHANAGE_DESCRIPTION` varchar(300) NOT NULL,
  `ORPHANAGE_IMG` text NOT NULL,
  `ORPHANAGE_DOCUMENT_PATH` varchar(300) DEFAULT NULL,
  `IS_DELETED` varchar(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`ORPHANAGE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orphanage`
--

LOCK TABLES `orphanage` WRITE;
/*!40000 ALTER TABLE `orphanage` DISABLE KEYS */;
INSERT INTO `orphanage` VALUES (1,'Arul Illam','9562387445','Magazine Road, St Thomas Mount, Chennai, Tamil Nadu 600016','arulillam@gmail.com','Regd 339/2011 Home for the orphans children','sample','sample','N'),(2,'Papa Home','7322345645','6th Main Road, Ram Nagar North Extn., Srinivasa Nagar, Ram Nagar, Velachery, Chennai, Tamil Nadu 600042','papahome@gmail.com','papa home desc','sample','sample','N'),(3,'Nethaji Mercy Home','8231232233','No.12, Pandithurai Street, Land Mark Sangeetha Restaurant, Velachery Bypass Rd, Kamarajapuram, Chennai, Tamil Nadu 600042','nethajimercy@gmail.com','nethaji mercy home desc','sample','sample','N');
/*!40000 ALTER TABLE `orphanage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `points`
--

DROP TABLE IF EXISTS `points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `points` (
  `USER_ID` int(15) NOT NULL,
  `POINTS_GAINED` int(15) NOT NULL,
  KEY `USER_ID_FK_idx` (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `points`
--

LOCK TABLES `points` WRITE;
/*!40000 ALTER TABLE `points` DISABLE KEYS */;
/*!40000 ALTER TABLE `points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `self_request`
--

DROP TABLE IF EXISTS `self_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `self_request` (
  `SELF_REQUEST_ID` int(15) NOT NULL,
  `USER_ID` int(15) NOT NULL,
  `TAGS` varchar(200) DEFAULT NULL,
  `STATUS` varchar(15) NOT NULL,
  `QUANTITY` int(15) NOT NULL DEFAULT '1',
  `IMAGE_PATH` text,
  `IS_DELETED` varchar(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`SELF_REQUEST_ID`),
  KEY `USER_ID_FK_SELFREQUEST_idx` (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `self_request`
--

LOCK TABLES `self_request` WRITE;
/*!40000 ALTER TABLE `self_request` DISABLE KEYS */;
INSERT INTO `self_request` VALUES (1,1,'3','requested',1,NULL,'N'),(2,2,'2','requested',2,NULL,'N');
/*!40000 ALTER TABLE `self_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `USER_ID` int(15) NOT NULL,
  `USER_NAME` varchar(45) NOT NULL,
  `USER_ROLE` varchar(15) NOT NULL,
  `USER_EMAIL` varchar(45) NOT NULL,
  `USER_PASSWORD` varchar(45) NOT NULL,
  `USER_PHONE` varchar(15) NOT NULL,
  `USER_ADDR` varchar(300) NOT NULL,
  `USER_PHOTO` text,
  PRIMARY KEY (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'chaitanya','DONOR','chaitanya@gmail.com','chaitanya','9876543210','perungudi chennai','chaitanya photo'),(2,'sharan','DONOR','sharan@gmail.com','sharan','9873451234','adyar chennai','sharan photo'),(3,'faizan','ARMY','faizan@gmail.com','faizan','9123432654','taramani chennai','faizan photo'),(4,'chintan','ADMIN','chintan@gmail.com','chintan','9342278234','velachery chennai','chintan photo'),(5,'mani','SUPER_ADMIN','mani@gmail.com','mani','9567239856','thiruvanmiyur chennai','mani photo');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist_items`
--

DROP TABLE IF EXISTS `wishlist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wishlist_items` (
  `ITEM_ID` int(15) NOT NULL AUTO_INCREMENT,
  `ITEM_NAME` varchar(100) NOT NULL,
  `WISHLIST_ID` int(15) DEFAULT NULL,
  `ITEM_DESCRIPTION` varchar(300) DEFAULT NULL,
  `ITEM_QTY` int(15) DEFAULT NULL,
  `APPROXIMATE_PRICE` int(15) DEFAULT NULL,
  `ITEMS_RECEIVED` int(15) DEFAULT '0',
  `ADDED_BY` varchar(15) DEFAULT NULL,
  `TAGS` varchar(200) DEFAULT NULL,
  `IS_WISHLIST_ITEM_CLOSED` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`ITEM_ID`),
  KEY `ACTIVITY_ID_FK_idx` (`WISHLIST_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist_items`
--

LOCK TABLES `wishlist_items` WRITE;
/*!40000 ALTER TABLE `wishlist_items` DISABLE KEYS */;
INSERT INTO `wishlist_items` VALUES (1,'pencils',1,'for kids',10,30,0,'admin','stationary','N'),(2,'notebooks',1,'long ruled notebooks',20,400,0,'admin','stationary','N'),(3,'bags',1,'for carrying books',5,500,0,'admin','stationary','N'),(4,'wish1',NULL,'desc',NULL,1000,0,NULL,NULL,NULL),(5,'wish1',NULL,'desc',1,1000,0,NULL,NULL,NULL),(6,'wish2',NULL,'desc',2,2000,0,NULL,NULL,NULL),(7,'wish3',NULL,'desc',3,300,0,NULL,NULL,NULL),(8,'wish4',NULL,'desc',4,200,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `wishlist_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-21 20:13:54
