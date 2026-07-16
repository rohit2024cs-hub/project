CREATE DATABASE IF NOT EXISTS `prod_test`;
USE `prod_test`;

DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=OLAP
DUPLICATE KEY(`id`)
DISTRIBUTED BY HASH(`id`) BUCKETS 1
PROPERTIES (
  "replication_allocation" = "tag.location.default: 1"
);

INSERT INTO `product` (`id`, `name`, `price`) VALUES
(1, 'hdd', 5500.00),
(2, 'ram', 4800.00);
