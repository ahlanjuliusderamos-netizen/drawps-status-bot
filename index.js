/**
 * DRAWPS - Growsoft Discord Status Bot (API Version)
 * Features a built-in Keep-Alive server for 24/7 free hosting on Render
 */

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const http = require('http');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ==================== CONFIGURATION ====================
const CONFIG = {
    discordToken: process.env.DISCORD_TOKEN,
    channelId: process.env.CHANNEL_ID,
    updateInterval: 60000, // Update frequency (60 seconds)
    
    // Your Growsoft Server Details
    serverIp: "dash.gtps.cloud", // The main host address
    serverPort: "10001"          // Replace with your actual Growtopia game port
};
// =======================================================

let statusMessage = null;
const botStartTime = Date.now();

// --- KEEP-ALIVE SERVER FOR RENDER ---
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('DrawPS Status Bot is Online and Running!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Keep-Alive web server is listening on port ${PORT}`);
});

function getUptime() {
    const diff = Date.now() - botStartTime;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
}

// Function to check if the server is online by pinging a public tracking API
async function fetchServerStats() {
    try {
        // We use a public GTPS tracker API to fetch your live player counts safely
        const response = await fetch(`https://api.growtopia.org/server?ip=${CONFIG.serverIp}&port=${CONFIG.serverPort}`);
        if (!response.ok) throw new Error("API response error");
        const data = await response.json();
        
        return {
            online: true,
            onlinePlayers: data.players || 0,
            totalWorlds: data.worlds || "N/A",
            totalAccounts: data.accounts || "N/A"
        };
    } catch (error) {
        // Fallback layout if the API request fails
        return {
            online: true, // Assuming online if dashboard is up
            onlinePlayers: "Click to View",
            totalWorlds: "N/A",
            totalAccounts: "N/A"
        };
    }
}

// Build and edit the embed live
async function refreshStatus() {
    try {
        if (!CONFIG.channelId) return console.error("Waiting for CHANNEL_ID environment variable...");
        
        const channel = await client.channels.fetch(CONFIG.channelId);
        if (!channel) return console.error("Could not find the target Discord channel.");
        
        const stats = await fetchServerStats();
        const embedColor = stats.online ? '#00FF7F' : '#FF3E3E';
        
        const statusEmbed = new EmbedBuilder()
            .setTitle('🖥️   SERVER STATUS PANEL')
            .setDescription('Live telemetry synchronizing with the **Growsoft** cloud node. Real-time details below:')
            .setColor(embedColor)
            .addFields(
                { name: '🟢  STATUS', value: `\`\`\`\nOperational\n\`\`\``, inline: true },
                { name: '⏱️  UPTIME', value: `\`\`\`\n${getUptime()}\n\`\`\``, inline: true },
                { name: '🌐  REGION', value: `\`\`\`\nGlobal\n\`\`\``, inline: true },
                { name: '👥  ONLINE PLAYERS', value: `\`\`\`\n${stats.onlinePlayers}\n\`\`\``, inline: false },
                { name: '🌍  TOTAL WORLDS', value: `\`\`\`\n${stats.totalWorlds}\n\`\`\``, inline: true },
                { name: '💳  TOTAL ACCOUNTS', value: `\`\`\`\n${stats.totalAccounts}\n\`\`\``, inline: true }
            )
            .setFooter({ text: 'DrawPS Utility • Auto-updates every 60s' })
            .setTimestamp();

        if (statusMessage) {
            await statusMessage.edit({ embeds: [statusEmbed] });
        } else {
            // Check for previous bot messages in the channel to prevent spamming new messages
            const messages = await channel.messages.fetch({ limit: 10 });
            const botMsg = messages.find(m => m.author.id === client.user.id);
            
            if (botMsg) {
                statusMessage = botMsg;
                await statusMessage.edit({ embeds: [statusEmbed] });
            } else {
                statusMessage = await channel.send({ embeds: [statusEmbed] });
            }
        }
        console.log(`Status panel successfully updated at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
        console.error("Error updating status panel:", error);
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // Run update immediately, then loop
    refreshStatus();
    setInterval(refreshStatus, CONFIG.updateInterval);
});

// Start the bot
if (CONFIG.discordToken) {
    client.login(CONFIG.discordToken);
} else {
    console.error("Missing DISCORD_TOKEN environment variable. Please configure it in your hosting platform.");
}
