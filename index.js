require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const DISCORD_WEBHOOK_URL = process.env.WEB_HOOK_URL;

app.post('/webhook/github', async (req, res) => {
    const payload = req.body;
    const action = payload.action;

    if (action === 'opened' && payload.pull_request) {
        const pr = payload.pull_request;
        
        try {
            await axios.post(DISCORD_WEBHOOK_URL, {
                embeds: [{
                    title: `🚀 새로운 PR이 생성되었습니다!`,
                    description: `**제목:** ${pr.title}\n**작성자:** ${pr.user.login}`,
                    url: pr.html_url,
                    color: 5814783,
                }]
            });
            console.log('✅ 디스코드 알림 전송 성공');
        } catch (error) {
            console.error('❌ 디스코드 알림 전송 실패:', error.message);
        }
    }
    res.status(200).send('OK');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Post to " + DISCORD_WEBHOOK_URL);
    console.log(`🚀 Webhook server is running on port ${PORT}`);
});