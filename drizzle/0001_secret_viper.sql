CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`telefone` varchar(20) NOT NULL,
	`email` varchar(320) NOT NULL,
	`cidade` varchar(255) NOT NULL,
	`tempo_compra` text,
	`situacao_atual` text,
	`renda` text,
	`criterio_escolha` text,
	`cnpj_mei` text,
	`idades` text,
	`pontuacao` int NOT NULL,
	`temperatura` enum('frio','morno','quente') NOT NULL,
	`prioridade` varchar(3) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
