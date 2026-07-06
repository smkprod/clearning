import type { DailyChallenge, Flashcard, Milestone, Task, Track, TaskType } from '../types';

/**
 * Программа обучения: очередь задач, стартовые карточки, код-челленджи и майлстоуны.
 *
 * План НЕ привязан к датам — это очередь. «Сегодня» = следующие невыполненные
 * задачи. Пропуск дня просто сдвигает очередь.
 *
 * Уровень: интермедиэйт и выше — базовый синтаксис C# пропущен сознательно.
 * Все формулировки в императиве: сделай / реши / объясни (активное вспоминание).
 */

type TaskSeed = Omit<Task, 'done' | 'doneDate'>;

const t = (id: string, track: Track, type: TaskType, title: string, detail: string, estMin: number): TaskSeed => ({
  id,
  track,
  type,
  title,
  detail,
  estMin,
});

// ── Track: algo — алгоритмы и решение задач ─────────────────────────────────
const algo: TaskSeed[] = [
  t('algo-01', 'algo', 'practice', 'Замерь коллекции: Big-O на практике',
    'Напиши бенчмарк (Stopwatch, 1 млн элементов): Add / Contains / поиск для List, Dictionary, HashSet, Queue, Stack. Запиши результаты в таблицу и объясни Big-O каждой операции — когда какую коллекцию брать.', 90),
  t('algo-02', 'algo', 'practice', 'Реши Two Sum через словарь',
    'Сначала реши brute-force за O(n²), потом за O(n) с Dictionary. Сформулируй вслух, почему хеш-таблица убирает вложенный цикл.', 45),
  t('algo-03', 'algo', 'practice', 'Группировка анаграмм',
    'Реши Group Anagrams: ключ группировки — отсортированная строка. Объясни сложность решения и почему ключ работает.', 45),
  t('algo-04', 'algo', 'practice', 'Подсчёт частот символов',
    'Реши «первый неповторяющийся символ в строке» через Dictionary<char,int>. Затем реши Valid Anagram тем же приёмом.', 30),
  t('algo-05', 'algo', 'practice', 'Two pointers: два указателя',
    'Реши Two Sum II (отсортированный массив) и Valid Palindrome двумя указателями. Объясни, почему указатели не «проскакивают» ответ.', 45),
  t('algo-06', 'algo', 'practice', 'Sliding window: скользящее окно',
    'Реши Longest Substring Without Repeating Characters. Объясни, почему левая граница окна никогда не откатывается назад и что это даёт по сложности.', 60),
  t('algo-07', 'algo', 'practice', 'Рекурсия ↔ цикл',
    'Напиши факториал и Фибоначчи рекурсивно, затем переведи оба в цикл. Нарисуй стек вызовов для fib(4). Сформулируй, когда рекурсия уместна, а когда опасна (глубина стека).', 45),
  t('algo-08', 'algo', 'theory', 'Сортировки: принцип, не зубрёжка',
    'Разбери Bubble, Insertion, Merge, Quick: сложность в лучшем/худшем случае, устойчивость. Реализуй одну (Insertion или Merge) руками без подглядывания.', 60),
  t('algo-09', 'algo', 'practice', 'Бинарный поиск руками',
    'Реализуй binary search итеративно (следи за границами!), реши 1 задачу на нём. Объясни, почему нужен отсортированный массив и откуда O(log n).', 45),
  t('algo-10', 'algo', 'practice', 'Struktogramm → код и обратно',
    'Возьми алгоритм (поиск максимума + подсчёт совпадений), нарисуй Struktogramm (Nassi-Shneiderman) и запиши псевдокодом в формате AP2. Потом переведи чужой Struktogramm в C#.', 60),
  t('algo-11', 'algo', 'practice', 'C#-метод → Pseudocode формата IHK',
    'Возьми метод из своего проекта и запиши его псевдокодом в стиле AP2 (WENN/SOLANGE/FÜR). Проверь по образцам решений IHK.', 45),
];

// ── Track: csharp — C# для сильного разработчика ────────────────────────────
const csharp: TaskSeed[] = [
  t('cs-01', 'csharp', 'practice', 'Докажи deferred execution в LINQ',
    'Напиши пример, где LINQ-запрос выполняется не при объявлении, а при перечислении (докажи через side effect в Select). Объясни разницу IEnumerable vs IQueryable: где реально выполняется код.', 60),
  t('cs-02', 'csharp', 'practice', 'Делегаты, Func/Action, события',
    'Напиши свой delegate, примеры с Func/Action/лямбдами и событие с подпиской/отпиской (+= / -=). Объясни, чем event отличается от публичного делегата.', 60),
  t('cs-03', 'csharp', 'practice', 'Свой generic-репозиторий',
    'Напиши IRepository<T> where T : class, IEntity с InMemory-реализацией (List внутри). Объясни, что дают ограничения where и когда generics лучше object.', 60),
  t('cs-04', 'csharp', 'theory', 'async/await под капотом',
    'Объясни: во что компилируется await (state machine), что такое Task, почему .Result/.Wait() дедлочат. Напиши пример отмены долгой операции через CancellationToken.', 75),
  t('cs-05', 'csharp', 'practice', 'Перепиши старый код на современный C#',
    'Возьми кусок своего проекта и перепиши: records вместо DTO-классов, pattern matching вместо if-цепочек, включи nullable reference types и почини warnings.', 60),
  t('cs-06', 'csharp', 'theory', 'Память: value vs reference, boxing, GC',
    'Объясни на примерах: семантика значений vs ссылок, boxing (int → object) и чем он дорог, IDisposable/using, поколения GC. Это топ-вопросы собеса — проговори вслух.', 45),
  t('cs-07', 'csharp', 'practice', 'Исключения vs Result-паттерн',
    'Напиши один сервис двумя способами: с исключениями и с Result<T> (успех/ошибка без throw). Сформулируй правило: когда исключение, когда Result.', 60),
  t('cs-08', 'csharp', 'practice', 'LINQ-ката: 5 задач',
    'Реши 5 задач только LINQ: GroupBy, SelectMany, Aggregate, ToDictionary, OrderBy+ThenBy. Без циклов. Потом объясни каждый запрос вслух.', 45),
];

// ── Track: backend — ASP.NET Core / EF Core ─────────────────────────────────
const backend: TaskSeed[] = [
  t('be-01', 'backend', 'practice', 'DI lifetimes: докажи экспериментом',
    'Создай три сервиса (Singleton/Scoped/Transient), каждый с Guid в конструкторе. Внедри их в контроллер дважды за запрос и выведи Guid-ы. Объясни результат — это топ-вопрос собеса.', 60),
  t('be-02', 'backend', 'practice', 'Напиши свой middleware',
    'Напиши middleware, логирующий метод, путь и время обработки запроса. Объясни порядок пайплайна (почему порядок Use... важен) и чем middleware отличается от filters.', 60),
  t('be-03', 'backend', 'practice', 'Воспроизведи и почини N+1',
    'Сделай две сущности (Order → Items), воспроизведи N+1, увидь его в логах SQL. Почини двумя способами: Include и проекцией в DTO через Select. Сравни SQL.', 60),
  t('be-04', 'backend', 'theory', 'Change tracking и миграции EF Core',
    'Объясни, как EF отслеживает изменения (states: Added/Modified/…), что делает SaveChanges. Создай миграцию, посмотри её код и снапшот, накати и откати её.', 45),
  t('be-05', 'backend', 'theory', 'REST-дизайн: чеклист',
    'Проверь своё API по чеклисту: правильные статус-коды (200/201/204/400/404/409), идемпотентность методов, версионирование. Исправь найденное.', 45),
  t('be-06', 'backend', 'practice', 'JWT auth с нуля',
    'Подключи JWT в тестовый API: эндпоинт выдачи токена, [Authorize], роль и политика. Нарисуй flow: логин → токен → заголовок → валидация. Расскажи его вслух.', 90),
  t('be-07', 'backend', 'practice', 'Валидация + единая обработка ошибок',
    'Подключи FluentValidation к DTO и сделай единый обработчик ошибок (middleware + ProblemDetails). Проверь: невалидный запрос → 400 с описанием, исключение → 500 без stack trace.', 60),
  t('be-08', 'backend', 'project', 'Auslagenerstattung: слой контроллеров',
    'Пройди все контроллеры своего проекта. Для каждого эндпоинта объясни вслух без AI: маршрут, DTO, статус-коды, зачем каждый атрибут. Непонятное — выпиши и разберись.', 60),
  t('be-09', 'backend', 'project', 'Auslagenerstattung: сервисы и EF',
    'Пройди бизнес-логику и слой данных: объясни каждую строку, каждый LINQ-запрос, каждую конфигурацию EF. Непонятные места преврати в карточки.', 90),
];

// ── Track: sql ───────────────────────────────────────────────────────────────
const sql: TaskSeed[] = [
  t('sql-01', 'sql', 'practice', 'JOIN-тренировка',
    'На учебной схеме (клиенты-заказы-товары) напиши 5 запросов: INNER/LEFT JOIN, агрегаты с GROUP BY и фильтрация групп через HAVING. Объясни разницу WHERE и HAVING.', 60),
  t('sql-02', 'sql', 'practice', 'Подзапросы и оконные функции',
    'Реши задачу подзапросом, потом перепиши через JOIN. Попробуй ROW_NUMBER() и RANK() (топ-3 заказа каждого клиента). Пойми, когда окно проще группировки.', 60),
  t('sql-03', 'sql', 'practice', 'План запроса и индекс',
    'Сгенерируй таблицу на 100k строк, напиши медленный запрос (фильтр по неиндексированному полю), посмотри план выполнения, добавь индекс, сравни план и время.', 60),
  t('sql-04', 'sql', 'practice', 'Нормализация 1NF–3NF',
    'Возьми «плохую» таблицу (всё в одной), нормализуй по шагам до 3NF, нарисуй ER-диаграмму. Проговори определение каждой нормальной формы — это нужно и на AP2.', 60),
  t('sql-05', 'sql', 'practice', 'Какой SQL генерит EF Core',
    'Включи логирование SQL в своём проекте, посмотри, во что превращаются твои LINQ-запросы. Найди хотя бы одно место, где SQL неожиданный, и объясни почему.', 45),
];

// ── Track: tests ─────────────────────────────────────────────────────────────
const tests: TaskSeed[] = [
  t('ts-01', 'tests', 'practice', 'Первые xUnit-тесты (AAA)',
    'Покрой один сервис своего проекта юнит-тестами: Arrange-Act-Assert, имена вида Method_Scenario_ExpectedResult. Добейся зелёного прогона dotnet test.', 60),
  t('ts-02', 'tests', 'practice', 'Moq: изоляция зависимостей',
    'Замокай репозиторий/внешнюю зависимость через Moq и протестируй сервис в изоляции. Проверь и happy path, и ошибку. Объясни, зачем вообще мокать.', 60),
  t('ts-03', 'tests', 'practice', 'Integration-тест через WebApplicationFactory',
    'Напиши integration-тест эндпоинта целиком (HTTP-запрос → ответ) через WebApplicationFactory с InMemory/SQLite базой. Сравни, что ловит он, а что — юнит-тест.', 90),
  t('ts-04', 'tests', 'practice', 'TDD на одном сервисе',
    'Новый маленький сервис (например, калькуляция возмещения) строго по циклу red → green → refactor. Сначала тест, потом код. Отрефлексируй, что изменилось в дизайне.', 60),
];

// ── Track: devops — главный дифференциатор для найма ────────────────────────
const devops: TaskSeed[] = [
  t('dv-01', 'devops', 'practice', 'Git: ветки, PR, rebase',
    'На своём репо: заведи feature-ветку, сделай PR на себя, вмержи. Потом потренируй rebase ветки на main. Сформулируй разницу merge и rebase и когда что.', 45),
  t('dv-02', 'devops', 'practice', 'Докеризуй свой API',
    'Напиши multi-stage Dockerfile для своего ASP.NET Core API, собери образ, запусти контейнер локально и проверь эндпоинт. Объясни, зачем multi-stage.', 60),
  t('dv-03', 'devops', 'practice', 'docker-compose: API + БД одной командой',
    'Подними API и Postgres/SQL Server через docker-compose. Строка подключения — через переменные окружения. Проверь: docker compose up → рабочее приложение с БД.', 60),
  t('dv-04', 'devops', 'practice', 'Деплой контейнера в Azure',
    'Задеплой контейнер в Azure (App Service или Container Apps), подключи Azure SQL/Postgres. Результат: живой URL, который можно вставить в CV. Запиши шаги.', 120),
  t('dv-05', 'devops', 'practice', 'CI/CD: GitHub Actions',
    'Настрой workflow: build → test → deploy при пуше в main. Добавь badge в README. Сломай тест и убедись, что деплой не прошёл.', 90),
  t('dv-06', 'devops', 'theory', 'AZ-900 спринт (опционально)',
    'Пройди Microsoft Learn path по основам Azure, реши пробный тест. Сертификат — HR-фильтр: решай по времени/деньгам, знания нужны в любом случае.', 120),
];

// ── Track: exam — AP2, дедлайн 25.11.2026 ───────────────────────────────────
const exam: TaskSeed[] = [
  t('ex-01', 'exam', 'exam', 'Диагностика: старая AP2 целиком по времени',
    'Прорешай одну старую Prüfung (GA1 или GA2) за отведённые 90 минут без подсказок. Разбери ошибки и выпиши темы-провалы — они зададут приоритеты дальше.', 150),
  t('ex-02', 'exam', 'exam', 'Pseudocode: базовый тренажёр',
    'Прорешай 5 заданий IHK-формата на псевдокод (циклы, массивы, условия) руками на бумаге, без IDE. Сверь с образцами решений.', 90),
  t('ex-03', 'exam', 'exam', 'Struktogramme: читать и рисовать',
    'Переведи 3 Struktogramme в код и один свой алгоритм — в Struktogramm. Набей руку на обозначениях (ветвление, циклы с пред/постусловием).', 60),
  t('ex-04', 'exam', 'exam', 'Трассировка алгоритмов на бумаге',
    'Прорешай задания на трассировку (таблица значений переменных по шагам цикла) — типовой формат AP2 для сортировок и поиска.', 60),
  t('ex-05', 'exam', 'exam', 'ER-модель и UML по описанию',
    'По текстовому описанию предметной области нарисуй ER-модель (кардинальности!) и классовую диаграмму. Сверь с решением, разбери расхождения.', 60),
  t('ex-06', 'exam', 'exam', 'Нормализация + SQL на бумаге',
    'Прорешай экзаменационные задания: приведи таблицу к 3NF и напиши SELECT/JOIN руками без автодополнения. На бумаге ошибки другие — привыкни к формату.', 60),
  t('ex-07', 'exam', 'exam', 'IT-gestützter Arbeitsplatz: типовой блок',
    'Прорешай задания по темам: эргономика, Datenschutz/Datensicherheit, лицензии ПО, подбор конфигурации под требования. Выпиши повторяющиеся паттерны вопросов.', 60),
  t('ex-08', 'exam', 'exam', 'WISO блок 1: трудовое право',
    'Прорешай задания: Arbeitsvertrag, Tarifvertrag, Betriebsrat, Jugendarbeitsschutz. Каждый факт, который не знал, — сразу в карточку.', 90),
  t('ex-09', 'exam', 'exam', 'WISO блок 2: соцстрахование и договоры',
    'Прорешай задания: Sozialversicherung (5 столпов), Kündigung и сроки, Ausbildungsvertrag. Факты — в карточки, повторяй ежедневно.', 90),
  t('ex-10', 'exam', 'exam', 'Старая Prüfung №2 по времени',
    'Вторая полная Prüfung за 90 минут. Цель — не оценка, а темп и формат. Сравни результат с диагностикой: где прогресс, где нет.', 150),
  t('ex-11', 'exam', 'exam', 'Разбор ошибок №2 + добивка слабых тем',
    'Разбери каждую ошибку из Prüfung №2: пойми, знание или невнимательность. По слабым темам — ещё по 2-3 задания.', 90),
  t('ex-12', 'exam', 'exam', 'Prüfung №3: генеральная репетиция',
    'Третья полная Prüfung в условиях экзамена (время, бумага, без телефона). После — финальный список тем на последнюю неделю.', 150),
  t('ex-13', 'exam', 'exam', 'Финальный прогон WISO и формул',
    'Прогони все карточки WISO и алгоритмов подряд, прорешай один смешанный блок. Отметь, что осталось нетвёрдым, — повтори накануне.', 60),
];

// ── Track: job — поиск работы ────────────────────────────────────────────────
const job: TaskSeed[] = [
  t('job-01', 'job', 'practice', 'CV на немецком (1 страница)',
    'Напиши CV сам: упор на стек (C#/.NET, Azure, React) и задеплоенный проект с живым URL. Потом отдай AI на ревью — но текст твой.', 90),
  t('job-02', 'job', 'practice', 'README для каждого проекта',
    'Для Auslagenerstattung и Telegram Mini App: скриншоты, стек, как запустить, архитектура в 5 предложениях, что переписал и понял после AI-версии.', 60),
  t('job-03', 'job', 'practice', 'LinkedIn + Xing: Open to Work',
    'Заполни оба профиля: стек, проекты с ссылками, «Open to work» (Ruhrgebiet + remote). Попроси 1-2 человек из Ausbildung дать рекомендацию.', 60),
  t('job-04', 'job', 'practice', 'Рассказ о проектах за 2 минуты',
    'Подготовь и запиши на диктофон рассказ о каждом проекте: проблема → решение → стек → чему научился. Слушай и переписывай, пока не звучит уверенно.', 45),
  t('job-05', 'job', 'theory', 'Честный нарратив про AI-assisted проекты',
    'Сформулируй письменно: «начал с AI, затем переписал и понимаю каждый слой» + подготовь ответы на 5 каверзных вопросов об этом. Честность здесь — сильная позиция.', 30),
  t('job-06', 'job', 'practice', 'Первые 5 заявок',
    'Найди 5 вакансий Junior .NET (Ruhrgebiet + remote), адаптируй CV под каждую, отправь. Занеси все в трекер заявок в этом приложении.', 90),
  t('job-07', 'job', 'practice', '20 вопросов с собесов → карточки',
    'Собери 20 типовых вопросов .NET-собеса (DI, async, EF, GC, REST), сформулируй свои ответы и заведи карточки в этом приложении.', 60),
  t('job-08', 'job', 'practice', 'Mock-интервью с AI',
    'Попроси AI провести техинтервью Junior .NET на 30 минут (вопросы + live-coding). Отвечай вслух. Разбери провалы, слабое — в карточки.', 60),
  t('job-09', 'job', 'practice', 'Добей до 20+ заявок',
    'Отправь ещё 15 заявок, обнови трекер. Проанализируй отклики: на какие формулировки в CV реагируют — скорректируй.', 120),
];

/**
 * Интерливинг: очередь собирается чередованием треков (день = разные темы,
 * это доказанно эффективнее блочного «месяц одного C#»). Задачи трека exam
 * распределены с растущей плотностью к концу очереди — по мере приближения
 * к 25.11 экзамен автоматически становится приоритетом.
 */
const WEAVE: Track[] = [
  // старт: диагностика экзамена + разгон по всем трекам
  'exam', 'algo', 'csharp', 'backend', 'algo', 'sql', 'csharp', 'exam',
  'algo', 'backend', 'tests', 'job', 'csharp', 'algo', 'sql', 'devops',
  'backend', 'exam', 'algo', 'csharp', 'tests', 'job', 'backend', 'sql',
  'algo', 'devops', 'csharp', 'exam', 'backend', 'algo', 'tests', 'job',
  'sql', 'csharp', 'devops', 'backend', 'algo', 'exam', 'job', 'csharp',
  // середина: экзамен чаще, devops добивает деплой
  'backend', 'algo', 'exam', 'devops', 'tests', 'job', 'sql', 'exam',
  'algo', 'backend', 'devops', 'exam', 'job', 'algo', 'exam', 'devops',
  // финал: плотная подготовка к AP2 + заявки
  'exam', 'job', 'algo', 'exam', 'job', 'exam', 'job', 'exam', 'job', 'exam',
];

function interleave(byTrack: Record<Track, TaskSeed[]>): TaskSeed[] {
  const queues: Record<Track, TaskSeed[]> = Object.fromEntries(
    Object.entries(byTrack).map(([k, v]) => [k, [...v]]),
  ) as Record<Track, TaskSeed[]>;

  const result: TaskSeed[] = [];
  for (const track of WEAVE) {
    const next = queues[track].shift();
    if (next) result.push(next);
  }
  // если в каком-то треке задач больше, чем слотов в WEAVE — дочерпываем в конец
  for (const rest of Object.values(queues)) result.push(...rest);
  return result;
}

export const CURRICULUM_TASKS: TaskSeed[] = interleave({
  algo,
  csharp,
  backend,
  sql,
  tests,
  devops,
  exam,
  job,
});

// ── Код-челленджи: по одному в день, easy → medium ──────────────────────────
type ChallengeSeed = Omit<DailyChallenge, 'solved'>;

const c = (id: string, title: string, difficulty: 'easy' | 'medium', slug: string): ChallengeSeed => ({
  id,
  title,
  difficulty,
  link: `https://leetcode.com/problems/${slug}/`,
});

export const CURRICULUM_CHALLENGES: ChallengeSeed[] = [
  c('ch-01', 'Two Sum', 'easy', 'two-sum'),
  c('ch-02', 'Contains Duplicate', 'easy', 'contains-duplicate'),
  c('ch-03', 'Valid Anagram', 'easy', 'valid-anagram'),
  c('ch-04', 'Valid Parentheses', 'easy', 'valid-parentheses'),
  c('ch-05', 'Best Time to Buy and Sell Stock', 'easy', 'best-time-to-buy-and-sell-stock'),
  c('ch-06', 'Binary Search', 'easy', 'binary-search'),
  c('ch-07', 'First Unique Character in a String', 'easy', 'first-unique-character-in-a-string'),
  c('ch-08', 'Valid Palindrome', 'easy', 'valid-palindrome'),
  c('ch-09', 'Move Zeroes', 'easy', 'move-zeroes'),
  c('ch-10', 'Majority Element', 'easy', 'majority-element'),
  c('ch-11', 'Squares of a Sorted Array', 'easy', 'squares-of-a-sorted-array'),
  c('ch-12', 'Merge Two Sorted Lists', 'easy', 'merge-two-sorted-lists'),
  c('ch-13', 'Reverse Linked List', 'easy', 'reverse-linked-list'),
  c('ch-14', 'Ransom Note', 'easy', 'ransom-note'),
  c('ch-15', 'Two Sum II — Input Array Is Sorted', 'medium', 'two-sum-ii-input-array-is-sorted'),
  c('ch-16', 'Group Anagrams', 'medium', 'group-anagrams'),
  c('ch-17', 'Longest Substring Without Repeating Characters', 'medium', 'longest-substring-without-repeating-characters'),
  c('ch-18', 'Top K Frequent Elements', 'medium', 'top-k-frequent-elements'),
  c('ch-19', 'Maximum Subarray', 'medium', 'maximum-subarray'),
  c('ch-20', 'Product of Array Except Self', 'medium', 'product-of-array-except-self'),
  c('ch-21', 'Sort Colors', 'medium', 'sort-colors'),
  c('ch-22', 'Rotate Array', 'medium', 'rotate-array'),
  c('ch-23', 'Container With Most Water', 'medium', 'container-with-most-water'),
  c('ch-24', '3Sum', 'medium', '3sum'),
  c('ch-25', 'Subarray Sum Equals K', 'medium', 'subarray-sum-equals-k'),
  c('ch-26', 'Merge Intervals', 'medium', 'merge-intervals'),
  c('ch-27', 'Min Stack', 'medium', 'min-stack'),
  c('ch-28', 'Spiral Matrix', 'medium', 'spiral-matrix'),
];

// ── Стартовые карточки (Leitner). Пользователь дополняет своими. ────────────
type CardSeed = Omit<Flashcard, 'box' | 'nextReview'>;

const f = (id: string, track: Track, front: string, back: string): CardSeed => ({ id, track, front, back });

export const CURRICULUM_FLASHCARDS: CardSeed[] = [
  f('fc-01', 'csharp', 'Разница IEnumerable и IQueryable?',
    'IEnumerable — выполнение в памяти (LINQ to Objects). IQueryable строит дерево выражений и транслируется в источник (например, SQL) — фильтрация уходит в БД.'),
  f('fc-02', 'backend', 'DI lifetimes в ASP.NET Core?',
    'Singleton — один экземпляр на всё приложение; Scoped — один на HTTP-запрос; Transient — новый при каждом резолве.'),
  f('fc-03', 'backend', 'Что за проблема N+1 в EF Core?',
    'Один запрос за списком + по запросу на каждый связанный объект. Решается Include (eager loading) или проекцией в DTO через Select.'),
  f('fc-04', 'csharp', 'Чем опасен .Result у async-метода?',
    'Блокирует поток и может привести к дедлоку (контекст ждёт поток, поток ждёт задачу). Использовать await по всей цепочке.'),
  f('fc-05', 'sql', '1NF / 2NF / 3NF кратко?',
    '1NF — атомарные значения; 2NF — нет частичной зависимости от части составного ключа; 3NF — нет транзитивных зависимостей неключевых атрибутов.'),
  f('fc-06', 'csharp', 'Что такое deferred execution в LINQ?',
    'Запрос не выполняется при объявлении — только при перечислении (foreach, ToList, Count). Каждое перечисление выполняет запрос заново.'),
  f('fc-07', 'backend', 'Singleton зависит от Scoped — что будет?',
    'Captive dependency: scoped-сервис «застревает» в singleton и живёт дольше запроса. ASP.NET Core в Development кидает исключение при валидации скоупов.'),
  f('fc-08', 'backend', 'Какие HTTP-методы идемпотентны?',
    'GET, PUT, DELETE (и HEAD/OPTIONS) — повтор запроса не меняет результат. POST не идемпотентен, PATCH — не обязательно.'),
  f('fc-09', 'backend', 'Что такое middleware pipeline?',
    'Цепочка компонентов, обрабатывающих HttpContext в порядке регистрации. Каждый может вызвать next() или замкнуть ответ (short-circuit).'),
  f('fc-10', 'csharp', 'record vs class?',
    'record — ссылочный тип с value-семантикой равенства (сравнение по значениям), init-only свойства по умолчанию, встроенные ToString и with-выражения.'),
  f('fc-11', 'csharp', 'Boxing — что это и чем плох?',
    'Упаковка value type в object на куче (int → object). Дорог: аллокация + нагрузка на GC. Возникает в нетипизированных коллекциях и при кастах к интерфейсам.'),
  f('fc-12', 'algo', 'Сложность поиска: Dictionary vs List?',
    'Dictionary — O(1) в среднем (хеш-таблица). List.Contains — O(n). BinarySearch по отсортированному List — O(log n).'),
  f('fc-13', 'algo', 'Когда QuickSort деградирует до O(n²)?',
    'При неудачных pivot — например, уже отсортированный массив и pivot по краю. В среднем O(n log n). MergeSort стабильно O(n log n), но требует память.'),
  f('fc-14', 'algo', 'Что такое Struktogramm?',
    'Диаграмма Nassi-Shneiderman: структурное представление алгоритма вложенными блоками (последовательность, ветвление, циклы) без goto. Стандартный формат AP2.'),
  f('fc-15', 'backend', 'Почему DbContext регистрируют как Scoped?',
    'DbContext не потокобезопасен и держит change tracker. Один экземпляр на HTTP-запрос = естественная unit of work: все изменения запроса в одном SaveChanges.'),
  f('fc-16', 'exam', 'WISO: максимальная Probezeit в Ausbildung?',
    'От 1 до 4 месяцев (§20 BBiG). Во время Probezeit обе стороны могут расторгнуть договор без срока и без указания причины.'),
  f('fc-17', 'exam', 'WISO: 5 столпов социального страхования?',
    'Krankenversicherung, Pflegeversicherung, Rentenversicherung, Arbeitslosenversicherung, Unfallversicherung (последнюю платит только работодатель).'),
  f('fc-18', 'exam', 'WISO: что такое Betriebsrat и от какого размера фирмы?',
    'Представительство работников (Mitbestimmung): участвует в кадровых и социальных вопросах. Возможен от 5 постоянных работников с правом голоса (BetrVG).'),
  f('fc-19', 'exam', 'WISO: Tarifvertrag vs Betriebsvereinbarung?',
    'Tarifvertrag: профсоюз ↔ работодатель/союз работодателей, отраслевой уровень (зарплаты, отпуск). Betriebsvereinbarung: Betriebsrat ↔ работодатель, уровень предприятия.'),
  f('fc-20', 'exam', 'WISO: срок Kündigungsfrist в Probezeit (обычный трудовой договор)?',
    '2 недели, в любой день (§622 Abs. 3 BGB). После Probezeit — минимум 4 недели к 15-му числу или к концу месяца.'),
];

// ── Майлстоуны готовности к работе ──────────────────────────────────────────
export const CURRICULUM_MILESTONES: Omit<Milestone, 'done'>[] = [
  { id: 'ms-01', label: 'Решаю easy/medium задачи сам, без подсказок' },
  { id: 'ms-02', label: 'Могу с нуля поднять ASP.NET Core API с EF Core, auth и валидацией' },
  { id: 'ms-03', label: 'В проекте написаны unit- и integration-тесты' },
  { id: 'ms-04', label: 'Проект задеплоен в Azure (Docker + CI/CD), есть живой URL' },
  { id: 'ms-05', label: 'CV / LinkedIn / Xing / GitHub готовы' },
  { id: 'ms-06', label: 'Отправлено 20+ заявок, ведётся трекер' },
  { id: 'ms-07', label: 'Могу объяснить любую строку в своих проектах' },
];

export const DEFAULT_EXAM_DATE = '2026-11-25';
export const DEFAULT_DAILY_GOAL_MIN = 120;
export const DEFAULT_MIN_DAY_MIN = 30;
