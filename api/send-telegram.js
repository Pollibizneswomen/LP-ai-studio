export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Метод не разрешён"
        });
    }


    const { name, contact, message } = req.body;


    if (!name || !contact || !message) {
        return res.status(400).json({
            success: false,
            message: "Заполните все поля"
        });
    }


    const text = `
🟢 Новая заявка с сайта L&P AI Studio

👤 Имя:
${name}

📱 Контакт:
${contact}

💬 Описание:
${message}
    `;


    const telegramUrl =
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`;


    const response = await fetch(telegramUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: text
        })
    });


    const data = await response.json();


    if (!data.ok) {
        return res.status(500).json({
            success: false,
            message: "Ошибка Telegram"
        });
    }


    res.status(200).json({
        success: true,
        message: "Заявка отправлена"
    });
}
