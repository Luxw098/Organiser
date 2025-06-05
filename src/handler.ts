import { ApplicationCommandDataResolvable, Client, CommandInteraction } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";

import { CommandType } from "./types/CommandType.ts";
import { PrismaClient } from "@prisma/client";
import { BuildEmbed } from "./utils/EmbedBuilter.ts";

const commands: CommandType[] = [];

export async function setupCommands(client: Client) {
	const commands_data: ApplicationCommandDataResolvable[] = [];
	const command_path = join(__dirname, "commands");
	const command_files = readdirSync(command_path).filter(
		file => file.endsWith(".ts") || file.endsWith(".js")
	);

	for (const file of command_files) {
		const command_class = (
			(await import(join(command_path, file))) as {
				default: new () => CommandType;
			}
		).default;
		const command = new command_class();

		commands_data.push({
			name: command.name,
			description: command.description,
			nameLocalizations: command.nameLocalizations,
			dmPermission: command.dmPermission,
			defaultMemberPermissions: command.defaultMemberPermissions,
			nsfw: command.nsfw,
			contexts: command.contexts,
			options: command.args,
			integrationTypes: command.integrationTypes
		} as ApplicationCommandDataResolvable);
		commands.push(command);
		console.log(`Loaded command:`, command.name);
	}

	try {
		await client.application?.commands.set(commands_data, "1353417061640175687");
		console.log("Commands registered successfully.");
	} catch (err) {
		console.log(err);
	}
}

export async function runCommand(
	client: Client,
	interaction: CommandInteraction,
	prisma: PrismaClient
) {
	const command = commands.find(cmd => cmd.name === interaction.commandName);
	if (!command) {
		console.error(`Command not found: ${interaction.commandName}`);
		await interaction.reply({ content: "Command not found.", ephemeral: true });
		return;
	}

	try {
		await command.run(client, interaction, prisma);
	} catch (error) {
		console.error(`Error executing command ${interaction.commandName}:`, error);
		if (interaction.channel?.isSendable())
			await interaction.channel.send({
				embeds: [
					BuildEmbed({
						title: "There was an error while executing this command.",
						description: JSON.stringify(error)
					})
				]
			});
	}
}
