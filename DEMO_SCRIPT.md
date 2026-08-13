# Replybase — демо, полный текст

Локально: http://localhost:3012  
Кейс: студия Eskviz, https://eskviz.com/

---

## Русский

**Лендинг**

> Меня зовут Сергей.
> Это Replybase — конструктор встраиваемого чат-бота.
> Это не общий GPT, а ИИ, который работает с вашими документами: FAQ, инструкции, технические задания и другие.
> На примере кейса веб-студии покажу, как это работает.

*(Features / Pricing мельком, без текста → Начать бесплатно)*

**Регистрация**

> Сначала обычная регистрация. Аккаунт создаётся в Supabase — это наша база и авторизация.
> Сейчас покажу: новый пользователь появился в Auth, а в таблице профилей у него тариф Free.

*(Auth → Users, `profiles.plan = free`)*

> Студия Eskviz. Люди заходят на сайт и спрашивают одно и то же: сколько стоит лендинг, какие сроки, нужна ли регистрация в БелГИЭ.
> Вместо того чтобы отвечать вручную, загружаем документы студии — и бот отвечает за нас.
> Бесплатно можно собрать бота и проверить в приложении. Чтобы поставить его на сайт — нужен тариф Starter.

**Бот**

> Создаём бота для студии. Назовём его Eskviz Help — это имя увидит человек на сайте.
> Один бот, одна база документов. Ничего лишнего.

**PDF**

> Сначала загружаю PDF. Бот не смотрит на файл как на картинку: мы достаём из него текст и кладём в базу.
> В этот момент OpenRouter считает эмбеддинги — по сути, переводит текст в числа, чтобы потом искать по смыслу, а не по точному слову.
> В Supabase это видно: документ и куски текста с векторами.

**Markdown**

> Теперь тот же текст, но в Markdown. Для бота формат не важен — хоть PDF, хоть md. Главное, что внутри.

**Копипаст с сайта**

> И третий способ — вообще без файла. Открыл страницу студии, скопировал текст, вставил сюда.
> Если на сайте обновили тарифы или контакты — можно так же быстро обновить базу бота.

**Чат**

> Спрашиваю как клиент: «Сколько стоит лендинг?»
> Что происходит: вопрос тоже уходит в OpenRouter — снова эмбеддинг. Supabase ищет ближайшие куски в документах. И уже по ним модель собирает ответ.
> То есть отвечает не «из головы», а из того, что мы загрузили. Здесь это 890 рублей за Старт.

> Второй вопрос: «Нужна ли регистрация в БелГИЭ?» Это тоже есть в документах, поэтому бот отвечает по делу.

> И третий: «Какая гарантия возврата денег?» Этого в документах нет. Бот не должен это выдумать — лучше сказать, что не знает, чем обещать лишнее.
> Этот ответ можно поменять в поле «Если ответа нет в документах». Например: «Я не нашел информацию, с этим вопросом вам сейчас поможет наша поддержка».

**Тариф**

> Бот внутри приложения уже работает. Чтобы поставить его на сайт, нужен Starter.
> Оплата здесь учебная: Stripe mock, денег не списывает. Но сам тариф меняется — сейчас это видно в профиле.

**Виджет**

> Вот готовый код: один script, его вставляют на сайт студии.
> Playground — это как будто мы уже на чужом сайте. Тот же бот, те же документы, только виджет в углу.
> Без Starter этот шаг был бы закрыт. Сейчас виджет открывается — спрашиваю то же: «Сколько стоит лендинг?»

**Финал**

> Это основной сценарий: документы в базе, бот отвечает по ним, а не фантазирует. Не знает — так и говорит. Потом Starter — и тот же бот уже на сайте.
> Чего в этом демо нет: я не прогонял корнер-кейсы и не проверял вёрстку на телефоне. Это следующий шаг, не скрываю.
> Под капотом — Next.js, Supabase и OpenRouter.
> Спасибо. Готов ответить на вопросы.

---

## English

**Landing**

> Hi, I’m Siarhei.
> This is Replybase — a builder for an embeddable chatbot.
> It’s not a general-purpose GPT. It’s AI that works with your documents: FAQs, instructions, briefs, and the rest.
> I’ll show how it works using a web studio as the example.

*(Glance at Features / Pricing, no talk → Start free)*

**Sign up**

> First, a regular sign-up. The account is created in Supabase — that’s our database and auth.
> I’ll show it: the new user is in Auth, and in the profiles table the plan is Free.

*(Auth → Users, `profiles.plan = free`)*

> This is Eskviz, a web studio. People land on the site and ask the same things: how much is a landing page, what’s the timeline, do they need BelGIE registration.
> Instead of answering by hand, we load the studio’s documents — and the bot answers for us.
> On the free plan you can build a bot and test it in the app. To put it on the website, you need Starter.

**Bot**

> Let’s create a bot for the studio. I’ll call it Eskviz Help — that’s the name a visitor will see on the site.
> One bot, one document base. Nothing extra.

**PDF**

> First I upload a PDF. The bot doesn’t look at the file as an image: we extract the text and put it in the database.
> Right now OpenRouter is computing embeddings — basically turning text into numbers, so later we can search by meaning, not by the exact wording.
> You can see it in Supabase: the document, and the text chunks with vectors.

**Markdown**

> Same content, now as Markdown. The format doesn’t matter to the bot — PDF or md. What matters is what’s inside.

**Paste from the site**

> Third way — no file at all. I open the studio’s page, copy a block of text, paste it here.
> If they update prices or contacts on the site, you can refresh the bot’s knowledge the same way, in a minute.

**Chat**

> I’ll ask it the way a client would: “How much does a landing page cost?”
> What happens: the question also goes to OpenRouter — another embedding. Supabase finds the closest chunks in the docs. Then the model answers from those chunks.
> So it’s not answering from its own head. It’s answering from what we uploaded. Here that’s 890 BYN for the Start package.

> Second question: “Do I need BelGIE registration?” That’s in the docs too, so the bot answers from there.

> Third: “What’s the money-back guarantee?” That isn’t in the documents. The bot shouldn’t invent it — better to say it doesn’t know than to promise something extra.
> You can change that reply in the “If the answer isn’t in the docs” field. For example: “I couldn’t find that. Our support team can help you with this question right now.”

**Plan**

> The bot already works inside the app. To put it on the website, we need Starter.
> Payment here is a mock: fake Stripe, no real charge. But the plan itself does change — you can see it on the profile.

**Widget**

> Here’s the snippet: one script tag, you drop it on the studio’s site.
> The playground is as if we’re already on someone else’s website. Same bot, same docs, just the widget in the corner.
> Without Starter this step would be blocked. Now the widget opens — I’ll ask the same thing: “How much does a landing page cost?”

**Close**

> That’s the core loop: documents in, answers from those documents, not made up. If it doesn’t know, it says so. Then Starter — and the same bot is on the site.
> What I haven’t done yet: I haven’t gone through corner cases, and I haven’t tested the layout on a phone. That’s next. I’m not hiding it.
> Under the hood: Next.js, Supabase, and OpenRouter.
> Thanks. Happy to take questions.

---

## Вопросы в чат

RU:

```
Сколько стоит лендинг?
Нужна ли регистрация в БелГИЭ?
Какая гарантия возврата денег?
```

EN:

```
How much does a landing page cost?
Do I need BelGIE registration?
What’s the money-back guarantee?
```

---

## До старта / если ломается

Incognito. Finder: PDF + `docs/demo/FAQ-и-тарифы-Eskviz.md`. Вкладки: eskviz.com, Supabase, [OpenRouter Activity](https://openrouter.ai/activity) (период **1 Hour**, group by **Model**).

Free = 3 документа. Виджет 402 → тариф ещё Free. Чат пустой → OpenRouter. Email занят → другой.
