module.exports = async function handler(request, response) {
    if (request.method !== "POST") {
        return response.status(405).json({
            error: "Разрешён только POST-запрос",
        });
    }

    try {
        const { message } = request.body || {};

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

        const prompt = `
Ты — вежливый AI-консультант студии L&P AI Studio.

Студия помогает бизнесу:
— создавать тексты;
— оформлять карточки товаров;
— создавать изображения и контент;
— внедрять AI-автоматизацию.

Отвечай на русском языке.
Пиши понятно, дружелюбно и не слишком длинно.
Помогай клиенту подобрать подходящую услугу.
Не придумывай цены и сроки.
Если клиент хочет сделать заказ, предложи заполнить форму связи на сайте.

Сообщение клиента:
${message}
        `.trim();

        const geminiResponse = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey,
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
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

        const reply =
            data?.candidates?.[0]?.content?.parts
                ?.map((part) => part.text || "")
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