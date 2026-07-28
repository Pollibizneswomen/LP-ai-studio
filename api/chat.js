module.exports = async function handler(request, response) {
    if (request.method !== "POST") {
        return response.status(405).json({
            error: "Разрешён только POST-запрос",
        });
    }

    try {
        const { message, history = [] } = request.body || {};

        if (!message || typeof message !== "string") {
            return response.status(400).json({
                error: "Сообщение не найдено",
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return response.status(500).json({
                error: "GEMINI_API_KEY не настроен",
            });
        }

        const systemPrompt = `
Ты — AI-консультант студии L&P AI Studio.

О студии:
• Создание текстов для бизнеса.
• Оформление карточек товаров для маркетплейсов.
• Создание изображений и AI-контента.
• Внедрение AI-автоматизации.

Правила общения:
- Отвечай только на русском языке.
- Будь дружелюбным, естественным и профессиональным.
- Не здоровайся в каждом сообщении.
- Если в истории переписки уже было приветствие, сразу отвечай на вопрос.
- Не представляйся повторно.
- Учитывай предыдущие сообщения пользователя.
- Не повторяй информацию без необходимости.
- Пиши понятно и не слишком длинно.
- Не используй символы Markdown: звёздочки, решётки и обратные кавычки.
- Не придумывай цены, сроки и гарантии.
- Если пользователь хочет заказать услугу, предложи оставить заявку через форму на сайте.
        `.trim();

        const safeHistory = Array.isArray(history)
            ? history
                  .filter(
                      item =>
                          item &&
                          typeof item.text === "string" &&
                          (item.role === "user" || item.role === "model")
                  )
                  .slice(-10)
            : [];

        const contents = [
            {
                role: "user",
                parts: [
                    {
                        text: systemPrompt,
                    },
                ],
            },
            {
                role: "model",
                parts: [
                    {
                        text: "Понял правила и готов консультировать клиента.",
                    },
                ],
            },
            ...safeHistory.map(item => ({
                role: item.role,
                parts: [
                    {
                        text: item.text,
                    },
                ],
            })),
            {
                role: "user",
                parts: [
                    {
                        text: message.trim(),
                    },
                ],
            },
        ];

        const geminiResponse = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey,
                },
                body: JSON.stringify({
                    contents,
                    generationConfig: {
                        temperature: 0.7,
                        topP: 0.95,
                        topK: 40,
                        maxOutputTokens: 1500,
                    },
                }),
            }
        );

        const data = await geminiResponse.json();

        if (!geminiResponse.ok) {
            console.error("Ошибка Gemini:", data);

            return response.status(geminiResponse.status).json({
                error:
                    data?.error?.message ||
                    "Не удалось получить ответ от AI",
            });
        }

        const reply = data?.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("")
            .trim();

        if (!reply) {
            return response.status(500).json({
                error: "AI не вернул текст ответа",
            });
        }

        return response.status(200).json({
            reply,
        });
    } catch (error) {
        console.error("Ошибка AI-чата:", error);

        return response.status(500).json({
            error: "Произошла ошибка при обращении к AI",
        });
    }
};

