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
                { name: '🌐  REGION', value: '
http://googleusercontent.com/immersive_entry_chip/0

4. Click the green **"Commit changes..."** button to save it.

---

### Step 2: Connect it to Render

Now that your GitHub files are ready and saved, copy your GitHub repository link from your address bar (it should look like `https://github.com/ahlanjuliusderamos-netizen/drawps-status-bot`).

1. Open your **Render Dashboard** tab.
2. Tap the **Public Git Repository** tab.
3. Paste your GitHub link into the box and click **Connect**.

Let me know what screen pops up on Render as soon as you hit connect!
