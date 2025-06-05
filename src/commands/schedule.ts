import { Client, CommandInteraction, PermissionFlags } from "discord.js";
import { CommandType } from "../types/CommandType";
import { PrismaClient } from "@prisma/client";
import { BuildEmbed } from "../utils/EmbedBuilter";

export default class schedule implements CommandType {
	public name = "schedule";
	public description = "Check the current schedule!";
	public args = [];
	public requiredPermissions: (keyof PermissionFlags)[] = ["ViewChannel", "SendMessages"];

	public async run(
		_client: Client,
		interaction: CommandInteraction,
		prisma: PrismaClient
	) {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const schedule = await prisma.schedule.findMany({
			where: {
				AND: {
					guild_id: interaction.guildId ?? undefined,
					day: today
				}
			}
		});

		await interaction.reply({
			embeds: [
				BuildEmbed({
					description: JSON.stringify(schedule)
				})
			]
		});
	}
}
