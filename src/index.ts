(await import("dotenv")).config();
import { Client } from "discord.js";
import { PrismaClient } from "@prisma/client";

import { runCommand, setupCommands } from "./handler";

const prisma = new PrismaClient();

const client = new Client({
	intents: ["Guilds", "GuildMessages", "GuildScheduledEvents"]
});

client.once("ready", () => {
	console.log(`Logged in as ${client.user?.tag ?? "Unknown User"}`);
	void setupCommands(client);
});

client.on("interactionCreate", interaction => {
	if (!interaction.isCommand()) return;
	console.log("Received command:", interaction.commandName);
	void runCommand(client, interaction, prisma);
});

void client.login(process.env["TOKEN"]);
