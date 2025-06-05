import {
	APIApplicationCommandOption,
	BaseApplicationCommandData,
	Client,
	CommandInteraction
} from "discord.js";
import { PrismaClient } from "@prisma/client";

export type CommandType = {
	description: string;
	args: APIApplicationCommandOption[];

	run(
		client: Client,
		interaction: CommandInteraction,
		prisma: PrismaClient
	): Promise<void>;
} & BaseApplicationCommandData;
