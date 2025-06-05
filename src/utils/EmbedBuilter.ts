import { EmbedBuilder, EmbedData } from "discord.js";

export function BuildEmbed(embed: EmbedData) {
	return new EmbedBuilder({
		...embed,
		color: 0x5050f0,
		timestamp: new Date().toISOString()
	});
}
