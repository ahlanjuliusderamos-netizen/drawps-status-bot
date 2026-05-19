/**
 * DRAWPS - Growsoft Discord Status Bot
 * Designed for Growtopia Private Servers hosted on Growsoft.cc
 * Features a built-in Keep-Alive server for 24/7 free hosting on Render
 */

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
const http = require('http');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ==================== CONFIGURATION ====================
const CONFIG = {
    discordToken: process.env.DISCORD_TOKEN, 
    channelId: process.env.CHANNEL_ID,       
    updateInterval: 60000,                  // Update frequency (60 seconds)
    
    // Growsoft Database Settings (Configured securely in Render Dashboard)
    db: {
        host: process.env.DB_HOST,      
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: 3306
    }
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

// Helper to format system uptime smoothly
function getUptime() {
    const diff = Date.now() - botStartTime;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
}

// Safely fetch stats directly from the Growsoft MySQL Database
async function fetchServerStats() {
    let connection;
    try {
        connection = await mysql.createConnection(CONFIG.db);

        // Fetch online players count
        const [playerRows] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE online = 1');
        const onlinePlayers = playerRows[0]?.count || 0;

        // Total registered accounts
        const [totalAccountRows] = await connection.execute('SELECT COUNT(*) as count FROM users');
        const totalAccounts = totalAccountRows[0]?.count || 0;

        // Total worlds created
        const [worldRows] = await connection.execute('SELECT COUNT(*) as count FROM worlds');
        const totalWorlds = worldRows[0]?.count || 0;

        await connection.end();

        return {
            online: true,
            onlinePlayers,
            totalAccounts,
            totalWorlds
        };
    } catch (error) {
        console.error("Database connection/query error:", error.message);
        if (connection) await connection.end();
        return {
            online: false,
            onlinePlayers: 0,
            totalAccounts: 0,
            totalWorlds: 0
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
        const serverStatusText = stats.online ? 'Operational' : 'Maintenance / Offline';

        const statusEmbed = new EmbedBuilder()
            .setTitle('🖥️   SERVER STATUS PANEL')
            .setDescription('Live telemetry synchronizing with the **Growsoft** cloud node. Real-time details below:')
            .setColor(embedColor)
            .addFields(
                { name: '🟢  STATUS', value: `\`\`\`\n${serverStatusText}\n\`\`\``, inline: true },
                { name: '⏱️  UPTIME', value: `\`\`\`\n${getUptime()}\n\`\`\``, inline: true },
                { name: '🌐  REGION', value: '
http://googleusercontent.com/immersive_entry_chip/0

5. Click the green **"Commit changes..."** button, and save it just like you did for the first file!

---

### Step 3: Copy Your Repository Link
Now, tap the search/URL bar of your mobile browser (at the top where it says `github.com/ahlanjuliusderamo...`) and copy that whole link. 

Once you have done these 3 steps, you can go back to the **Render** tab, paste the link in, and hit **Connect**! Let me know if you run into any trouble.
          
