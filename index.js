require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const DISCORD_WEBHOOK_URL = process.env.WEB_HOOK_URL;
const ISSUE_TARGET_URL = process.env.ISSUE_WEB_HOOK_URL;

app.post('/webhook/github', async (req, res) => {
    const payload = req.body;
    const action = payload.action;

    if (payload.pull_request && action === 'opened') {
        const pr = payload.pull_request;
        try {
            await axios.post(DISCORD_WEBHOOK_URL, {
                embeds: [{
                    title: `🚀 새로운 PR 생성: ${pr.title}`,
                    description: `**작성자:** ${pr.user.login}`,
                    url: pr.html_url,
                    color: 5814783,
                }]
            });
            console.log('✅ PR 알림 성공');
        } catch (error) {
            console.error('❌ PR 알림 실패:', error.message);
        }
    }

    if (payload.issue && action === 'opened') {
        const issue = payload.issue;
        try {
            await axios.post(ISSUE_TARGET_URL, {
                content: `🚨 **새로운 이슈가 등록되었습니다!**`,
                embeds: [{
                    title: issue.title,
                    description: issue.body ? issue.body.substring(0, 100) + "..." : "내용 없음",
                    url: issue.html_url,
                    color: 15158332,
                }]
            });
            console.log('✅ 이슈 알림 전송 성공');
        } catch (error) {
            console.error('❌ 이슈 알림 전송 실패:', error.message);
        }
    }

    res.status(200).send('OK');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Webhook server is running on port ${PORT}`);
});