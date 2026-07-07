import type {
  DailyChallenge,
  Flashcard,
  Milestone,
  Project,
  ProjectStep,
  Task,
  TaskLink,
  Track,
  TaskType,
} from '../types';

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

type TaskExtra = Pick<Task, 'starter' | 'doneWhen' | 'sandbox'>;

const t = (
  id: string,
  track: Track,
  type: TaskType,
  title: string,
  detail: string,
  estMin: number,
  links?: TaskLink[],
  extra?: TaskExtra,
): TaskSeed => ({ id, track, type, title, detail, estMin, links, ...extra });

const l = (label: string, url: string): TaskLink => ({ label, url });

// ── Track: algo — алгоритмы и решение задач ─────────────────────────────────
const algo: TaskSeed[] = [
  t('algo-w1', 'algo', 'practice', 'Секундомер Stopwatch: твой первый замер',
    'Stopwatch — это просто секундомер из System.Diagnostics, им меряют скорость кода. Открой песочницу, вставь каркас и допиши цикл. Запусти, увидь время в мс. Потом поменяй 100 млн на 1 млрд и запусти снова — время вырастет примерно в 10 раз.', 30,
    [l('MS Docs: Stopwatch', 'https://learn.microsoft.com/dotnet/api/system.diagnostics.stopwatch')],
    {
      sandbox: 'dotnetfiddle',
      doneWhen: 'В консоли появилось время в мс, и после замены 100 млн → 1 млрд оно выросло примерно в 10 раз.',
      starter: `using System;
using System.Diagnostics;

var sw = Stopwatch.StartNew();

long sum = 0;
// ТВОЯ СТРОЧКА: цикл от 1 до 100_000_000, каждый раз прибавляй i к sum


sw.Stop();
Console.WriteLine($"sum = {sum}, заняло {sw.ElapsedMilliseconds} мс");`,
    }),
  t('algo-w2', 'algo', 'practice', 'Big-O на пальцах: три цикла',
    'Big-O отвечает на вопрос: «данных стало в 10 раз больше — во сколько раз замедлится код?». В каркасе три метода: O(1) готов, тебе дописать O(n) (перебор) и O(n²) (два вложенных цикла). Запусти на 1 тыс / 10 тыс / 100 тыс и посмотри на рост времени — вот и вся магия Big-O.', 45,
    [l('Big-O Cheat Sheet', 'https://www.bigocheatsheet.com/')],
    {
      sandbox: 'dotnetfiddle',
      doneWhen: 'Видишь: O(1) не меняется, O(n) растёт линейно, O(n²) при ×10 данных замедляется примерно в 100 раз.',
      starter: `using System;
using System.Diagnostics;
using System.Linq;

int[] data = Enumerable.Range(0, 100_000).ToArray(); // поменяй размер: 1000, 10000, 100000

// O(1): всегда одинаково быстро
int First(int[] a) => a[0];

// O(n): дописать — перебором найди, есть ли число target
bool Contains(int[] a, int target)
{
    // ТВОЙ КОД: один цикл по a, верни true если нашёл
    return false;
}

// O(n^2): дописать — есть ли в массиве два одинаковых числа (два вложенных цикла)
bool HasDuplicate(int[] a)
{
    // ТВОЙ КОД: цикл в цикле
    return false;
}

var sw = Stopwatch.StartNew();
HasDuplicate(data);
sw.Stop();
Console.WriteLine($"n = {data.Length}, O(n^2) занял {sw.ElapsedMilliseconds} мс");`,
    }),
  t('algo-01', 'algo', 'practice', 'List vs HashSet: почувствуй разницу',
    'Ты уже умеешь Stopwatch и понял Big-O. Теперь заполни List<int> и HashSet<int> миллионом чисел и замерь у обоих Contains в цикле на 10 тыс повторов. Разница — в тысячи раз. Объясни её через Big-O (O(n) против O(1)) и запиши себе правило: когда List, когда HashSet, когда Dictionary.', 60,
    [l('Big-O Cheat Sheet', 'https://www.bigocheatsheet.com/'),
     l('MS Docs: коллекции', 'https://learn.microsoft.com/dotnet/standard/collections/')],
    {
      sandbox: 'dotnetfiddle',
      doneWhen: 'Замер показал: у HashSet поиск в тысячи раз быстрее, чем у List. Ты можешь объяснить почему (O(1) против O(n)).',
      starter: `using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

var list = Enumerable.Range(0, 1_000_000).ToList();
var set = new HashSet<int>(list);

var sw = Stopwatch.StartNew();
for (int i = 0; i < 10_000; i++) list.Contains(999_999);   // O(n)
sw.Stop();
Console.WriteLine($"List:    {sw.ElapsedMilliseconds} мс");

sw.Restart();
// ТВОЙ КОД: тот же цикл на 10_000 повторов, но set.Contains(999_999)  // O(1)

sw.Stop();
Console.WriteLine($"HashSet: {sw.ElapsedMilliseconds} мс");`,
    }),
  t('algo-02', 'algo', 'practice', 'Реши Two Sum через словарь',
    'Сначала реши brute-force за O(n²), потом за O(n) с Dictionary. Сформулируй вслух, почему хеш-таблица убирает вложенный цикл.', 45,
    [l('NeetCode Roadmap', 'https://neetcode.io/roadmap')]),
  t('algo-03', 'algo', 'practice', 'Группировка анаграмм',
    'Реши Group Anagrams: ключ группировки — отсортированная строка. Объясни сложность решения и почему ключ работает.', 45),
  t('algo-04', 'algo', 'practice', 'Подсчёт частот символов',
    'Реши «первый неповторяющийся символ в строке» через Dictionary<char,int>. Затем реши Valid Anagram тем же приёмом.', 30),
  t('algo-05', 'algo', 'practice', 'Two pointers: два указателя',
    'Реши Two Sum II (отсортированный массив) и Valid Palindrome двумя указателями. Объясни, почему указатели не «проскакивают» ответ.', 45),
  t('algo-06', 'algo', 'practice', 'Sliding window: скользящее окно',
    'Реши Longest Substring Without Repeating Characters. Объясни, почему левая граница окна никогда не откатывается назад и что это даёт по сложности.', 60),
  t('algo-07', 'algo', 'practice', 'Рекурсия ↔ цикл',
    'Напиши факториал и Фибоначчи рекурсивно, затем переведи оба в цикл. Нарисуй стек вызовов для fib(4). Сформулируй, когда рекурсия уместна, а когда опасна (глубина стека).', 45,
    [l('VisuAlgo: рекурсия', 'https://visualgo.net/en/recursion')]),
  t('algo-08', 'algo', 'theory', 'Сортировки: принцип, не зубрёжка',
    'Разбери Bubble, Insertion, Merge, Quick: сложность в лучшем/худшем случае, устойчивость. Реализуй одну (Insertion или Merge) руками без подглядывания.', 60,
    [l('VisuAlgo: сортировки', 'https://visualgo.net/en/sorting')]),
  t('algo-09', 'algo', 'practice', 'Бинарный поиск руками',
    'Реализуй binary search итеративно (следи за границами!), реши 1 задачу на нём. Объясни, почему нужен отсортированный массив и откуда O(log n).', 45,
    [l('LeetCode: Binary Search card', 'https://leetcode.com/explore/learn/card/binary-search/')]),
  t('algo-10', 'algo', 'practice', 'Struktogramm → код и обратно',
    'Возьми алгоритм (поиск максимума + подсчёт совпадений), нарисуй Struktogramm (Nassi-Shneiderman) и запиши псевдокодом в формате AP2. Потом переведи чужой Struktogramm в C#.', 60,
    [l('Structorizer (редактор)', 'https://structorizer.fisch.lu/')]),
  t('algo-11', 'algo', 'practice', 'C#-метод → Pseudocode формата IHK',
    'Возьми метод из своего проекта и запиши его псевдокодом в стиле AP2 (WENN/SOLANGE/FÜR). Проверь по образцам решений IHK.', 45),
  t('algo-12', 'algo', 'practice', 'Stack и Queue руками',
    'Реализуй свой Stack<int> на массиве (Push/Pop/Peek, рост при переполнении). Потом реши задачу Valid Parentheses своим стеком. Сформулируй: где в реальном коде живут стек (вызовы, undo) и очередь (задачи, сообщения).', 60),
  t('algo-13', 'algo', 'practice', 'Строки: StringBuilder против конкатенации',
    'Замерь Stopwatch-ем: собери строку из 100 тыс кусочков через += и через StringBuilder. Объясни разницу через immutability строк. Потом реши задачу «переверни слова в предложении».', 45),
  t('algo-14', 'algo', 'practice', 'Двумерные массивы: матрицы',
    'Потренируй int[,] и int[][]: обход всех элементов, сумма по строкам/столбцам, транспонирование. Задачи на матрицы регулярно бывают в AP2.', 45),
  t('algo-15', 'algo', 'practice', 'Связный список: пойми ссылки',
    'Реализуй односвязный список сам: класс Node (Value, Next), методы Add и Print. Потом переверни его (reverse) — классика собеса. Нарисуй на бумаге, как двигаются ссылки.', 60),
  t('algo-16', 'algo', 'practice', 'Множества в задачах',
    'Реши через HashSet: пересечение двух массивов, «есть ли дубликаты», «первый пропущенный положительный». Сформулируй, когда HashSet вместо List — автоматический рефлекс.', 45),
  t('algo-17', 'algo', 'practice', 'Жадные алгоритмы базово',
    'Реши: «минимум монет для суммы» и «максимум непересекающихся интервалов». Пойми принцип: на каждом шаге локально лучший выбор. Когда жадность работает, а когда нет?', 60),
  t('algo-18', 'algo', 'practice', 'Повторение: 5 задач заново по памяти',
    'Вернись к 5 решённым задачам (two sum, анаграммы, sliding window, binary search, reverse list) и реши их заново с чистого листа, не подглядывая. Что забылось — то и есть твоя точка роста.', 60),
];

// ── Track: csharp — C# для сильного разработчика ────────────────────────────
const csharp: TaskSeed[] = [
  t('cs-w1', 'csharp', 'practice', 'LINQ-разминка: Where / Select / OrderBy',
    'LINQ — это готовые методы для коллекций вместо ручных циклов. В каркасе список из 10 человек уже готов — тебе дописать 5 запросов по одной строке (Where, Select, OrderBy, First, Count). Потом перепиши ХОТЯ БЫ один обычным циклом for+if и увидь, насколько LINQ короче.', 30,
    [l('101 LINQ samples', 'https://learn.microsoft.com/samples/dotnet/try-samples/101-linq-samples/')],
    {
      sandbox: 'dotnetfiddle',
      doneWhen: 'Все 5 запросов выводят правильный результат, и ты переписал хотя бы один циклом — понял, что LINQ короче.',
      starter: `using System;
using System.Collections.Generic;
using System.Linq;

record Person(string Name, int Age, string City);

var people = new List<Person>
{
    new("Anna", 28, "Essen"),    new("Ben", 34, "Dortmund"),
    new("Clara", 22, "Bochum"),  new("David", 41, "Essen"),
    new("Eva", 30, "Dortmund"),  new("Felix", 19, "Bochum"),
    new("Greta", 45, "Essen"),   new("Hans", 27, "Dortmund"),
    new("Ida", 38, "Bochum"),    new("Jonas", 33, "Essen"),
};

// 1) Where:   люди старше 30
var over30 = people.Where(p => p.Age > 30).ToList();

// 2) Select:  ТОЛЬКО имена (List<string>) — ТВОЯ СТРОЧКА
// 3) OrderBy: отсортируй по возрасту — ТВОЯ СТРОЧКА
// 4) First:   первый человек из "Essen" — ТВОЯ СТРОЧКА
// 5) Count:   сколько людей из "Dortmund" — ТВОЯ СТРОЧКА

Console.WriteLine($"Старше 30: {over30.Count}");`,
    }),
  t('cs-01', 'csharp', 'practice', 'Докажи deferred execution в LINQ',
    'Напиши пример, где LINQ-запрос выполняется не при объявлении, а при перечислении (докажи через side effect в Select). Объясни разницу IEnumerable vs IQueryable: где реально выполняется код.', 60,
    [l('MS Docs: deferred execution', 'https://learn.microsoft.com/dotnet/standard/linq/deferred-execution-lazy-evaluation')]),
  t('cs-02', 'csharp', 'practice', 'Делегаты, Func/Action, события',
    'Напиши свой delegate, примеры с Func/Action/лямбдами и событие с подпиской/отпиской (+= / -=). Объясни, чем event отличается от публичного делегата.', 60,
    [l('MS Docs: делегаты', 'https://learn.microsoft.com/dotnet/csharp/programming-guide/delegates/')]),
  t('cs-03', 'csharp', 'practice', 'Свой generic-репозиторий',
    'Напиши IRepository<T> where T : class, IEntity с InMemory-реализацией (List внутри). Объясни, что дают ограничения where и когда generics лучше object.', 60,
    [l('MS Docs: constraints', 'https://learn.microsoft.com/dotnet/csharp/programming-guide/generics/constraints-on-type-parameters')]),
  t('cs-04', 'csharp', 'practice', 'async/await: воспроизведи дедлок и почини',
    'Напиши пример: долгая async-операция с отменой через CancellationToken. Воспроизведи блокировку через .Result и почини через await. Объясни вслух: state machine, что такое Task.', 75,
    [l('Stephen Cleary: Don\'t Block on Async Code', 'https://blog.stephencleary.com/2012/07/dont-block-on-async-code.html'),
     l('MS Docs: async/await', 'https://learn.microsoft.com/dotnet/csharp/asynchronous-programming/task-asynchronous-programming-model')]),
  t('cs-05', 'csharp', 'practice', 'Перепиши старый код на современный C#',
    'Возьми кусок своего проекта и перепиши: records вместо DTO-классов, pattern matching вместо if-цепочек, включи nullable reference types и почини warnings.', 60,
    [l('MS Docs: pattern matching', 'https://learn.microsoft.com/dotnet/csharp/fundamentals/functional/pattern-matching'),
     l('MS Docs: nullable references', 'https://learn.microsoft.com/dotnet/csharp/nullable-references')]),
  t('cs-06', 'csharp', 'practice', 'Память: докажи boxing бенчмарком',
    'Напиши бенчмарк: int в List<int> vs ArrayList (boxing) — сравни время. Напиши класс с IDisposable + using. Проговори вслух: value vs reference, поколения GC — топ-вопросы собеса.', 45,
    [l('MS Docs: boxing', 'https://learn.microsoft.com/dotnet/csharp/programming-guide/types/boxing-and-unboxing'),
     l('MS Docs: основы GC', 'https://learn.microsoft.com/dotnet/standard/garbage-collection/fundamentals')]),
  t('cs-07', 'csharp', 'practice', 'Исключения vs Result-паттерн',
    'Напиши один сервис двумя способами: с исключениями и с Result<T> (успех/ошибка без throw). Сформулируй правило: когда исключение, когда Result.', 60,
    [l('Khorikov: exceptions vs Result', 'https://enterprisecraftsmanship.com/posts/error-handling-exception-or-result/')]),
  t('cs-08', 'csharp', 'practice', 'LINQ-ката: 5 задач',
    'Реши 5 задач только LINQ: GroupBy, SelectMany, Aggregate, ToDictionary, OrderBy+ThenBy. Без циклов. Потом объясни каждый запрос вслух.', 45,
    [l('101 LINQ samples', 'https://learn.microsoft.com/samples/dotnet/try-samples/101-linq-samples/')]),
  t('cs-09', 'csharp', 'practice', 'Интерфейс vs абстрактный класс',
    'Спроектируй мини-иерархию: IPayable + абстрактный Employee + два наследника. Сформулируй правило, когда интерфейс, а когда абстрактный класс — топ-3 вопрос немецких собесов.', 45),
  t('cs-10', 'csharp', 'practice', 'List и Dictionary под капотом',
    'Эксперимент: выведи Capacity у List при добавлении 1000 элементов — увидь удвоение. Объясни, почему вставка «в среднем O(1)». Про Dictionary: что такое хеш-коллизия и зачем GetHashCode.', 45),
  t('cs-11', 'csharp', 'practice', 'Файлы и JSON',
    'Напиши консольку: сериализуй список объектов в JSON-файл (System.Text.Json), прочитай обратно, обработай «файла нет» и «битый JSON». Это хлеб любого реального проекта.', 45,
    [l('MS Docs: System.Text.Json', 'https://learn.microsoft.com/dotnet/standard/serialization/system-text-json/overview')]),
  t('cs-12', 'csharp', 'practice', 'HttpClient: сходи в чужой API',
    'Дёрни публичный API (например, open-meteo), десериализуй ответ в свои классы, обработай таймаут и не-200 ответ. Всё через async/await — как в настоящем бэкенде.', 60),
  t('cs-13', 'csharp', 'practice', 'Extension methods и yield return',
    'Напиши свой extension method для IEnumerable<int> (например, WhereEven) и свой итератор через yield return. Загляни, как LINQ устроен так же. Пойми ленивость yield.', 45),
  t('cs-14', 'csharp', 'practice', 'Самопроверка C#: 20 вопросов вслух',
    'Пройди свои карточки трека C# + придумай 5 новых вопросов. На каждый ответь вслух развёрнуто, как на собесе. Что промямлил — вернись в код и потрогай руками.', 45),
];

// ── Track: backend — ASP.NET Core / EF Core ─────────────────────────────────
const backend: TaskSeed[] = [
  t('be-w1', 'backend', 'practice', 'Подними пустой Web API и разбери Program.cs',
    'Выполни dotnet new webapi, запусти (dotnet run), открой Swagger в браузере и дёрни готовый эндпоинт. Потом пройди Program.cs строка за строкой и напиши комментарий к каждой своими словами: что такое builder, что кладут в Services, что такое app. Непонятные слова — сразу в карточки.', 45,
    [l('MS Docs: первый Web API', 'https://learn.microsoft.com/aspnet/core/tutorials/first-web-api')]),
  t('be-01', 'backend', 'practice', 'DI lifetimes: докажи экспериментом',
    'Создай три сервиса (Singleton/Scoped/Transient), каждый с Guid в конструкторе. Внедри их в контроллер дважды за запрос и выведи Guid-ы. Объясни результат — это топ-вопрос собеса.', 60,
    [l('MS Docs: DI в ASP.NET Core', 'https://learn.microsoft.com/aspnet/core/fundamentals/dependency-injection')]),
  t('be-02', 'backend', 'practice', 'Напиши свой middleware',
    'Напиши middleware, логирующий метод, путь и время обработки запроса. Объясни порядок пайплайна (почему порядок Use... важен) и чем middleware отличается от filters.', 60,
    [l('MS Docs: middleware', 'https://learn.microsoft.com/aspnet/core/fundamentals/middleware/')]),
  t('be-03', 'backend', 'practice', 'Воспроизведи и почини N+1',
    'Сделай две сущности (Order → Items), воспроизведи N+1, увидь его в логах SQL. Почини двумя способами: Include и проекцией в DTO через Select. Сравни SQL.', 60,
    [l('MS Docs: efficient querying', 'https://learn.microsoft.com/ef/core/performance/efficient-querying')]),
  t('be-04', 'backend', 'practice', 'Change tracking и миграции руками',
    'Создай миграцию, прочитай её код и снапшот, накати и откати её. Выведи ChangeTracker.Entries() до SaveChanges и объясни states (Added/Modified/…).', 45,
    [l('MS Docs: change tracking', 'https://learn.microsoft.com/ef/core/change-tracking/'),
     l('MS Docs: миграции', 'https://learn.microsoft.com/ef/core/managing-schemas/migrations/')]),
  t('be-05', 'backend', 'theory', 'REST-дизайн: чеклист',
    'Проверь своё API по чеклисту: правильные статус-коды (200/201/204/400/404/409), идемпотентность методов, версионирование. Исправь найденное.', 45,
    [l('Azure: API design', 'https://learn.microsoft.com/azure/architecture/best-practices/api-design')]),
  t('be-06', 'backend', 'practice', 'JWT auth с нуля',
    'Подключи JWT в тестовый API: эндпоинт выдачи токена, [Authorize], роль и политика. Нарисуй flow: логин → токен → заголовок → валидация. Расскажи его вслух.', 90,
    [l('jwt.io: introduction', 'https://jwt.io/introduction'),
     l('MS Docs: аутентификация', 'https://learn.microsoft.com/aspnet/core/security/authentication/')]),
  t('be-07', 'backend', 'practice', 'Валидация + единая обработка ошибок',
    'Подключи FluentValidation к DTO и сделай единый обработчик ошибок (middleware + ProblemDetails). Проверь: невалидный запрос → 400 с описанием, исключение → 500 без stack trace.', 60,
    [l('FluentValidation docs', 'https://docs.fluentvalidation.net/'),
     l('MS Docs: handle errors', 'https://learn.microsoft.com/aspnet/core/web-api/handle-errors')]),
  t('be-08', 'backend', 'project', 'Auslagenerstattung: слой контроллеров',
    'Пройди все контроллеры своего проекта. Для каждого эндпоинта объясни вслух без AI: маршрут, DTO, статус-коды, зачем каждый атрибут. Непонятное — выпиши и разберись.', 60),
  t('be-09', 'backend', 'project', 'Auslagenerstattung: сервисы и EF',
    'Пройди бизнес-логику и слой данных: объясни каждую строку, каждый LINQ-запрос, каждую конфигурацию EF. Непонятные места преврати в карточки.', 90),
  t('be-10', 'backend', 'practice', 'Конфигурация и Options pattern',
    'Вынеси настройки в appsettings.json, прочитай через IOptions<T>, переопредели переменной окружения. Секреты — в user secrets, не в git. Объясни порядок источников конфигурации.', 45,
    [l('MS Docs: configuration', 'https://learn.microsoft.com/aspnet/core/fundamentals/configuration/')]),
  t('be-11', 'backend', 'practice', 'Структурное логирование с Serilog',
    'Подключи Serilog: логи в консоль и файл, уровни (Information/Warning/Error), структурные свойства ({UserId}). Залогируй один бизнес-сценарий так, чтобы по логам можно было расследовать баг.', 60,
    [l('Serilog: getting started', 'https://github.com/serilog/serilog/wiki/Getting-Started')]),
  t('be-12', 'backend', 'practice', 'Пагинация, фильтр, сортировка',
    'Сделай списочный эндпоинт по-взрослому: ?page=2&pageSize=20&sortBy=date&filter=... через query-параметры. Верни метаданные (totalCount). Посмотри, какой SQL генерит Skip/Take.', 60),
  t('be-13', 'backend', 'practice', 'Кэширование с IMemoryCache',
    'Закэшируй тяжёлый запрос через IMemoryCache с истечением. Замерь время до и после. Обсуди сам с собой: когда кэш опасен (устаревшие данные) и что такое инвалидация.', 45),
  t('be-14', 'backend', 'practice', 'BackgroundService: фоновая задача',
    'Напиши HostedService, который раз в минуту что-то делает (чистит старые записи, шлёт «отчёт» в лог). Разберись с scope внутри singleton-сервиса — классические грабли.', 60,
    [l('MS Docs: background services', 'https://learn.microsoft.com/aspnet/core/fundamentals/host/hosted-services')]),
  t('be-15', 'backend', 'project', 'Разбери Telegram Mini App слой за слоем',
    'Второй проект: пройди фронт и бэк, объясни каждую интеграцию с Telegram, каждый запрос. Что делал AI и ты не понимаешь — перепиши руками. Цель: рассказывать о проекте без запинки.', 90),
  t('be-16', 'backend', 'project', 'Новая фича в Auslagenerstattung с нуля',
    'Придумай и добавь фичу сам, без AI: эндпоинт + валидация + сервис + миграция + тест. Это финальный экзамен трека: с нуля через все слои своими руками.', 120),
];

// ── Track: sql ───────────────────────────────────────────────────────────────
const sql: TaskSeed[] = [
  t('sql-w1', 'sql', 'practice', 'SQL-разминка на SQLBolt',
    'Пройди первые 6 уроков SQLBolt прямо в браузере: SELECT, WHERE, ORDER BY, LIMIT и первый JOIN. Ничего устанавливать не нужно, запросы пишешь сам в интерактиве — идеальный разгон перед настоящими JOIN-ами.', 40,
    [l('SQLBolt (интерактив)', 'https://sqlbolt.com/')]),
  t('sql-01', 'sql', 'practice', 'JOIN-тренировка',
    'На учебной схеме (клиенты-заказы-товары) напиши 5 запросов: INNER/LEFT JOIN, агрегаты с GROUP BY и фильтрация групп через HAVING. Объясни разницу WHERE и HAVING.', 60,
    [l('SQLBolt (интерактив)', 'https://sqlbolt.com/'),
     l('SQL Practice', 'https://www.sql-practice.com/')]),
  t('sql-02', 'sql', 'practice', 'Подзапросы и оконные функции',
    'Реши задачу подзапросом, потом перепиши через JOIN. Попробуй ROW_NUMBER() и RANK() (топ-3 заказа каждого клиента). Пойми, когда окно проще группировки.', 60,
    [l('Mode: window functions', 'https://mode.com/sql-tutorial/sql-window-functions/')]),
  t('sql-03', 'sql', 'practice', 'План запроса и индекс',
    'Сгенерируй таблицу на 100k строк, напиши медленный запрос (фильтр по неиндексированному полю), посмотри план выполнения, добавь индекс, сравни план и время.', 60,
    [l('Use The Index, Luke!', 'https://use-the-index-luke.com/')]),
  t('sql-04', 'sql', 'practice', 'Нормализация 1NF–3NF',
    'Возьми «плохую» таблицу (всё в одной), нормализуй по шагам до 3NF, нарисуй ER-диаграмму. Проговори определение каждой нормальной формы — это нужно и на AP2.', 60,
    [l('Normalisierung (DE)', 'https://www.datenbanken-verstehen.de/datenmodellierung/normalisierung/')]),
  t('sql-05', 'sql', 'practice', 'Какой SQL генерит EF Core',
    'Включи логирование SQL в своём проекте, посмотри, во что превращаются твои LINQ-запросы. Найди хотя бы одно место, где SQL неожиданный, и объясни почему.', 45,
    [l('MS Docs: simple logging', 'https://learn.microsoft.com/ef/core/logging-events-diagnostics/simple-logging')]),
  t('sql-06', 'sql', 'practice', 'Транзакции и ACID на живом примере',
    'Сценарий «перевод денег между счетами»: сделай без транзакции и слом посередине — увидь потерю денег. Оберни в BEGIN/COMMIT/ROLLBACK — почини. Расшифруй каждую букву ACID своими словами.', 60),
  t('sql-07', 'sql', 'practice', 'CTE: читабельные сложные запросы',
    'Возьми запрос с вложенным подзапросом и перепиши через WITH (CTE). Потом реши задачу «клиенты, потратившие больше среднего» двумя способами. Сравни читабельность.', 45),
  t('sql-08', 'sql', 'practice', 'SQL-марафон: 20 задач',
    'Прорешай 20 задач на sql-practice.com (уровень medium). Без подглядывания в решения — сначала свой запрос, потом сверка. Слабые места — в карточки.', 90,
    [l('SQL Practice', 'https://www.sql-practice.com/')]),
];

// ── Track: tests ─────────────────────────────────────────────────────────────
const tests: TaskSeed[] = [
  t('ts-01', 'tests', 'practice', 'Первые xUnit-тесты (AAA)',
    'Покрой один сервис своего проекта юнит-тестами: Arrange-Act-Assert, имена вида Method_Scenario_ExpectedResult. Добейся зелёного прогона dotnet test.', 60,
    [l('MS Docs: unit testing best practices', 'https://learn.microsoft.com/dotnet/core/testing/unit-testing-best-practices'),
     l('xUnit: getting started', 'https://xunit.net/docs/getting-started/v2/netcore/cmdline')]),
  t('ts-02', 'tests', 'practice', 'Moq: изоляция зависимостей',
    'Замокай репозиторий/внешнюю зависимость через Moq и протестируй сервис в изоляции. Проверь и happy path, и ошибку. Объясни, зачем вообще мокать.', 60,
    [l('Moq: quickstart', 'https://github.com/devlooped/moq/wiki/Quickstart')]),
  t('ts-03', 'tests', 'practice', 'Integration-тест через WebApplicationFactory',
    'Напиши integration-тест эндпоинта целиком (HTTP-запрос → ответ) через WebApplicationFactory с InMemory/SQLite базой. Сравни, что ловит он, а что — юнит-тест.', 90,
    [l('MS Docs: integration tests', 'https://learn.microsoft.com/aspnet/core/test/integration-tests')]),
  t('ts-04', 'tests', 'practice', 'TDD на одном сервисе',
    'Новый маленький сервис (например, калькуляция возмещения) строго по циклу red → green → refactor. Сначала тест, потом код. Отрефлексируй, что изменилось в дизайне.', 60,
    [l('Fowler: TDD', 'https://martinfowler.com/bliki/TestDrivenDevelopment.html')]),
  t('ts-05', 'tests', 'exam', 'Testverfahren для AP2: Äquivalenzklassen',
    'Экзаменационная тема! Прорешай задания: Blackbox vs Whitebox, Äquivalenzklassen (классы эквивалентности), Grenzwertanalyse (граничные значения). Составь тест-таблицу для функции валидации возраста.', 60),
  t('ts-06', 'tests', 'practice', 'Coverage: найди непокрытое',
    'Подключи coverage (dotnet test --collect:"XPlat Code Coverage" + отчёт), посмотри, что не покрыто в твоём проекте, докрой 2-3 критичных места. Пойми: 100% покрытие — не цель.', 60),
];

// ── Track: devops — главный дифференциатор для найма ────────────────────────
const devops: TaskSeed[] = [
  t('dv-01', 'devops', 'practice', 'Git: ветки, PR, rebase',
    'На своём репо: заведи feature-ветку, сделай PR на себя, вмержи. Потом потренируй rebase ветки на main. Сформулируй разницу merge и rebase и когда что.', 45,
    [l('Learn Git Branching (интерактив)', 'https://learngitbranching.js.org/'),
     l('Atlassian: merge vs rebase', 'https://www.atlassian.com/git/tutorials/merging-vs-rebasing')]),
  t('dv-02', 'devops', 'practice', 'Докеризуй свой API',
    'Напиши multi-stage Dockerfile для своего ASP.NET Core API, собери образ, запусти контейнер локально и проверь эндпоинт. Объясни, зачем multi-stage.', 60,
    [l('MS Docs: .NET в Docker', 'https://learn.microsoft.com/dotnet/core/docker/build-container'),
     l('Docker: multi-stage', 'https://docs.docker.com/build/building/multi-stage/')]),
  t('dv-03', 'devops', 'practice', 'docker-compose: API + БД одной командой',
    'Подними API и Postgres/SQL Server через docker-compose. Строка подключения — через переменные окружения. Проверь: docker compose up → рабочее приложение с БД.', 60,
    [l('Docker Compose docs', 'https://docs.docker.com/compose/')]),
  t('dv-04', 'devops', 'practice', 'Деплой контейнера в Azure',
    'Задеплой контейнер в Azure (App Service или Container Apps), подключи Azure SQL/Postgres. Результат: живой URL, который можно вставить в CV. Запиши шаги.', 120,
    [l('App Service: custom container', 'https://learn.microsoft.com/azure/app-service/quickstart-custom-container'),
     l('Container Apps: quickstart', 'https://learn.microsoft.com/azure/container-apps/quickstart-portal')]),
  t('dv-05', 'devops', 'practice', 'CI/CD: GitHub Actions',
    'Настрой workflow: build → test → deploy при пуше в main. Добавь badge в README. Сломай тест и убедись, что деплой не прошёл.', 90,
    [l('MS Docs: GitHub Actions для .NET', 'https://learn.microsoft.com/dotnet/devops/github-actions-overview')]),
  t('dv-06', 'devops', 'theory', 'AZ-900 спринт (опционально)',
    'Пройди Microsoft Learn path по основам Azure, реши пробный тест. Сертификат — HR-фильтр: решай по времени/деньгам, знания нужны в любом случае.', 120,
    [l('AZ-900: Azure Fundamentals', 'https://learn.microsoft.com/credentials/certifications/azure-fundamentals/')]),
  t('dv-07', 'devops', 'practice', 'Секреты и окружения по-взрослому',
    'Проверь свои репо: нет ли ключей в истории git. Настрой: локально — user secrets, в CI — GitHub Secrets, в Azure — App Settings/Key Vault. Правило: строка подключения никогда не в коде.', 45,
    [l('MS Docs: secrets', 'https://learn.microsoft.com/aspnet/core/security/app-secrets')]),
  t('dv-08', 'devops', 'practice', 'Health checks и мониторинг',
    'Добавь /health эндпоинт (AddHealthChecks + проверка БД). Подключи Application Insights в Azure, найди в портале свои запросы и ошибки. Умение «посмотреть, что с продом» очень ценят.', 60,
    [l('MS Docs: health checks', 'https://learn.microsoft.com/aspnet/core/host-and-deploy/health-checks')]),
  t('dv-09', 'devops', 'project', 'Задеплой второй проект',
    'Telegram Mini App (или что готово) — в Azure тем же путём: Docker → CI/CD → живой URL. Второй деплой закрепит первый: теперь ты «умеешь деплоить», а не «один раз получилось».', 90),
];

// ── Track: exam — AP2, дедлайн 25.11.2026 ───────────────────────────────────
const exam: TaskSeed[] = [
  t('ex-01', 'exam', 'exam', 'Диагностика: старая AP2 целиком по времени',
    'Прорешай одну старую Prüfung (GA1 или GA2) за отведённые 90 минут без подсказок. Разбери ошибки и выпиши темы-провалы — они зададут приоритеты дальше.', 150,
    [l('U-Form: старые Prüfungen', 'https://www.u-form-shop.de/'),
     l('IHK-PAL (составитель экзаменов)', 'https://www.ihk-pal.de/')]),
  t('ex-02', 'exam', 'exam', 'Pseudocode: базовый тренажёр',
    'Прорешай 5 заданий IHK-формата на псевдокод (циклы, массивы, условия) руками на бумаге, без IDE. Сверь с образцами решений.', 90,
    [l('IT-Berufe-Podcast: AP2', 'https://it-berufe-podcast.de/')]),
  t('ex-03', 'exam', 'exam', 'Struktogramme: читать и рисовать',
    'Переведи 3 Struktogramme в код и один свой алгоритм — в Struktogramm. Набей руку на обозначениях (ветвление, циклы с пред/постусловием).', 60,
    [l('Structorizer (редактор)', 'https://structorizer.fisch.lu/')]),
  t('ex-04', 'exam', 'exam', 'Трассировка алгоритмов на бумаге',
    'Прорешай задания на трассировку (таблица значений переменных по шагам цикла) — типовой формат AP2 для сортировок и поиска.', 60),
  t('ex-05', 'exam', 'exam', 'ER-модель и UML по описанию',
    'По текстовому описанию предметной области нарисуй ER-модель (кардинальности!) и классовую диаграмму. Сверь с решением, разбери расхождения.', 60,
    [l('ER-Modell (DE)', 'https://www.datenbanken-verstehen.de/datenmodellierung/'),
     l('draw.io (рисовалка)', 'https://app.diagrams.net/')]),
  t('ex-06', 'exam', 'exam', 'Нормализация + SQL на бумаге',
    'Прорешай экзаменационные задания: приведи таблицу к 3NF и напиши SELECT/JOIN руками без автодополнения. На бумаге ошибки другие — привыкни к формату.', 60),
  t('ex-07', 'exam', 'exam', 'IT-gestützter Arbeitsplatz: типовой блок',
    'Прорешай задания по темам: эргономика, Datenschutz/Datensicherheit, лицензии ПО, подбор конфигурации под требования. Выпиши повторяющиеся паттерны вопросов.', 60),
  t('ex-08', 'exam', 'exam', 'WISO блок 1: трудовое право',
    'Прорешай задания: Arbeitsvertrag, Tarifvertrag, Betriebsrat, Jugendarbeitsschutz. Каждый факт, который не знал, — сразу в карточку.', 90,
    [l('Prozubi: WISO', 'https://www.prozubi.de/')]),
  t('ex-09', 'exam', 'exam', 'WISO блок 2: соцстрахование и договоры',
    'Прорешай задания: Sozialversicherung (5 столпов), Kündigung и сроки, Ausbildungsvertrag. Факты — в карточки, повторяй ежедневно.', 90,
    [l('Prozubi: WISO', 'https://www.prozubi.de/')]),
  t('ex-10', 'exam', 'exam', 'Старая Prüfung №2 по времени',
    'Вторая полная Prüfung за 90 минут. Цель — не оценка, а темп и формат. Сравни результат с диагностикой: где прогресс, где нет.', 150,
    [l('U-Form: старые Prüfungen', 'https://www.u-form-shop.de/')]),
  t('ex-11', 'exam', 'exam', 'Разбор ошибок №2 + добивка слабых тем',
    'Разбери каждую ошибку из Prüfung №2: пойми, знание или невнимательность. По слабым темам — ещё по 2-3 задания.', 90),
  t('ex-12', 'exam', 'exam', 'Prüfung №3: генеральная репетиция',
    'Третья полная Prüfung в условиях экзамена (время, бумага, без телефона). После — финальный список тем на последнюю неделю.', 150),
  t('ex-14', 'exam', 'exam', 'Netzplan и Gantt: проектное планирование',
    'Прорешай задания на Netzplantechnik: FAZ/FEZ/SAZ/SEZ, Puffer, kritischer Pfad. Нарисуй Netzplan по таблице задач руками — типовое задание письменной части.', 90),
  t('ex-15', 'exam', 'exam', 'Lastenheft, Pflichtenheft, Qualität',
    'Прорешай блок: разница Lastenheft/Pflichtenheft, этапы проекта, критерии качества ПО (ISO), Qualitätssicherung. Определения — в карточки.', 60),
  t('ex-16', 'exam', 'exam', 'OOP на бумаге: диаграмма → код',
    'Задания AP2: по классовой диаграмме напиши код (наследование, полиморфизм) и наоборот — по коду нарисуй диаграмму. Без IDE, на бумаге, как на экзамене.', 60),
  t('ex-17', 'exam', 'exam', 'WISO блок 3: договоры и право',
    'Прорешай: Kaufvertrag (заключение, Mängel, Gewährleistung), AGB, Verbraucherschutz, Vollmachten. Факты — в карточки.', 90,
    [l('Prozubi: WISO', 'https://www.prozubi.de/')]),
  t('ex-18', 'exam', 'exam', 'WISO блок 4: экономика',
    'Прорешай: Wirtschaftsordnung, Konjunkturzyklen, Inflation und EZB, Magisches Viereck. Это регулярные темы WISO — формулы и определения в карточки.', 90,
    [l('Prozubi: WISO', 'https://www.prozubi.de/')]),
  t('ex-19', 'exam', 'exam', 'Стратегия экзамена: время и порядок',
    'Разбери формат своих двух пересдач (Algorithmen 90 мин, WISO 60 мин): сколько заданий, сколько минут на каждое, что решать первым. Напиши план «если застрял — пропускаю через N минут».', 45),
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
    'Найди 5 вакансий Junior .NET (Ruhrgebiet + remote), адаптируй CV под каждую, отправь. Занеси все в трекер заявок в этом приложении.', 90,
    [l('StepStone', 'https://www.stepstone.de/'),
     l('Indeed DE', 'https://de.indeed.com/')]),
  t('job-07', 'job', 'practice', '20 вопросов с собесов → карточки',
    'Собери 20 типовых вопросов .NET-собеса (DI, async, EF, GC, REST), сформулируй свои ответы и заведи карточки в этом приложении.', 60,
    [l('Exercism: C# track', 'https://exercism.org/tracks/csharp')]),
  t('job-08', 'job', 'practice', 'Mock-интервью с AI',
    'Попроси AI провести техинтервью Junior .NET на 30 минут (вопросы + live-coding). Отвечай вслух. Разбери провалы, слабое — в карточки.', 60),
  t('job-09', 'job', 'practice', 'Добей до 20+ заявок',
    'Отправь ещё 15 заявок, обнови трекер. Проанализируй отклики: на какие формулировки в CV реагируют — скорректируй.', 120),
  t('job-10', 'job', 'practice', 'Anschreiben-шаблон',
    'Напиши базовое немецкое Anschreiben (3 абзаца: кто ты → почему эта фирма → что принесёшь) и научись адаптировать его под вакансию за 10 минут. Сохрани как шаблон.', 60),
  t('job-11', 'job', 'practice', 'Нетворкинг: 5 контактов',
    'Напиши 5 людям в LinkedIn/Xing: разработчикам из компаний Ruhrgebiet, рекрутерам. Короткое сообщение: учусь, вот проекты, открыт к Junior-позициям. Вступи в 2 .NET-сообщества.', 45),
  t('job-12', 'job', 'practice', 'Изучи зарплатные вилки',
    'Посмотри вилки Junior .NET в NRW (kununu, glassdoor, stepstone gehalt). Сформулируй свой ответ на вопрос о зарплате: диапазон + обоснование. Отрепетируй вслух.', 30),
  t('job-13', 'job', 'practice', 'Заявки 21–35 + анализ воронки',
    'Ещё 15 заявок. Потом посчитай воронку в трекере: заявки → ответы → интервью. Если ответов <10% — переработай CV/первую страницу GitHub, спроси у AI ревью с позиции рекрутера.', 120),
  t('job-14', 'job', 'practice', 'Разбор реального интервью',
    'После каждого настоящего собеседования: в тот же день выпиши ВСЕ вопросы, что ответил слабо — в карточки и в задачи. Одно реальное интервью стоит пяти mock-ов.', 45),
  t('job-15', 'job', 'practice', 'Второе mock-интервью: замер прогресса',
    'Через месяц после первого: снова 30-минутное техинтервью с AI, те же темы + новые. Сравни с первым — что стало увереннее, что всё ещё плавает.', 60),
];

/**
 * Интерливинг: очередь собирается чередованием треков (день = разные темы,
 * это доказанно эффективнее блочного «месяц одного C#»). Задачи трека exam
 * распределены с растущей плотностью к концу очереди — по мере приближения
 * к 25.11 экзамен автоматически становится приоритетом.
 */
const WEAVE: Track[] = [
  // модуль 0 — разгон: всё в браузере (dotnetfiddle), одна среда, по нарастающей.
  // Никакой установки SDK: сначала уверенно пишем и запускаем C#/алгоритмы.
  'algo', 'csharp', 'algo', 'algo', 'csharp', 'algo',
  // фаза 1: подключаем экзамен, бэкенд (тут уже нужен .NET SDK), sql, тесты
  'exam', 'backend', 'sql', 'csharp', 'algo', 'tests', 'job', 'csharp',
  'exam', 'backend', 'algo', 'sql', 'csharp', 'devops', 'algo', 'tests',
  'algo', 'backend', 'exam', 'devops', 'sql', 'csharp', 'algo', 'tests',
  'backend', 'job', 'exam', 'algo', 'csharp', 'devops', 'sql', 'backend',
  'algo', 'tests', 'job', 'exam', 'csharp', 'backend', 'algo', 'devops',
  'sql', 'job', 'csharp', 'exam', 'backend', 'algo', 'tests', 'job',
  // фаза 2: экзамен каждый 4-й слот, devops добивает деплой
  'exam', 'algo', 'backend', 'csharp', 'exam', 'sql', 'devops', 'job',
  'exam', 'algo', 'backend', 'tests', 'exam', 'csharp', 'devops', 'job',
  'exam', 'algo', 'sql', 'backend', 'exam', 'csharp', 'job', 'devops',
  'exam', 'algo', 'backend', 'job', 'exam', 'csharp', 'sql', 'algo',
  // фаза 3: плотная подготовка к AP2 + заявки и интервью
  'exam', 'job', 'algo', 'exam', 'backend', 'job', 'exam', 'algo',
  'exam', 'job', 'csharp', 'exam', 'algo', 'job', 'exam', 'backend',
  'exam', 'job', 'algo', 'exam', 'job', 'exam', 'algo', 'job',
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
  // остатки дочерпываем по кругу, чтобы интерливинг сохранялся до конца
  let remaining = Object.values(queues).filter((q) => q.length > 0);
  while (remaining.length > 0) {
    for (const q of remaining) {
      const next = q.shift();
      if (next) result.push(next);
    }
    remaining = remaining.filter((q) => q.length > 0);
  }
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
  c('ch-29', 'Fizz Buzz', 'easy', 'fizz-buzz'),
  c('ch-30', 'Reverse String', 'easy', 'reverse-string'),
  c('ch-01', 'Two Sum', 'easy', 'two-sum'),
  c('ch-31', 'Palindrome Number', 'easy', 'palindrome-number'),
  c('ch-02', 'Contains Duplicate', 'easy', 'contains-duplicate'),
  c('ch-32', 'Roman to Integer', 'easy', 'roman-to-integer'),
  c('ch-03', 'Valid Anagram', 'easy', 'valid-anagram'),
  c('ch-33', 'Length of Last Word', 'easy', 'length-of-last-word'),
  c('ch-04', 'Valid Parentheses', 'easy', 'valid-parentheses'),
  c('ch-34', 'Remove Duplicates from Sorted Array', 'easy', 'remove-duplicates-from-sorted-array'),
  c('ch-05', 'Best Time to Buy and Sell Stock', 'easy', 'best-time-to-buy-and-sell-stock'),
  c('ch-35', 'Plus One', 'easy', 'plus-one'),
  c('ch-06', 'Binary Search', 'easy', 'binary-search'),
  c('ch-36', 'Search Insert Position', 'easy', 'search-insert-position'),
  c('ch-07', 'First Unique Character in a String', 'easy', 'first-unique-character-in-a-string'),
  c('ch-37', 'Single Number', 'easy', 'single-number'),
  c('ch-08', 'Valid Palindrome', 'easy', 'valid-palindrome'),
  c('ch-38', 'Missing Number', 'easy', 'missing-number'),
  c('ch-09', 'Move Zeroes', 'easy', 'move-zeroes'),
  c('ch-39', 'Intersection of Two Arrays II', 'easy', 'intersection-of-two-arrays-ii'),
  c('ch-10', 'Majority Element', 'easy', 'majority-element'),
  c('ch-40', 'Merge Sorted Array', 'easy', 'merge-sorted-array'),
  c('ch-11', 'Squares of a Sorted Array', 'easy', 'squares-of-a-sorted-array'),
  c('ch-41', 'Isomorphic Strings', 'easy', 'isomorphic-strings'),
  c('ch-12', 'Merge Two Sorted Lists', 'easy', 'merge-two-sorted-lists'),
  c('ch-42', 'Happy Number', 'easy', 'happy-number'),
  c('ch-13', 'Reverse Linked List', 'easy', 'reverse-linked-list'),
  c('ch-43', 'Linked List Cycle', 'easy', 'linked-list-cycle'),
  c('ch-14', 'Ransom Note', 'easy', 'ransom-note'),
  c('ch-44', 'Word Pattern', 'easy', 'word-pattern'),
  c('ch-45', 'Climbing Stairs', 'easy', 'climbing-stairs'),
  c('ch-46', 'Pascal’s Triangle', 'easy', 'pascals-triangle'),
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
  c('ch-47', 'Daily Temperatures', 'medium', 'daily-temperatures'),
  c('ch-48', 'Longest Consecutive Sequence', 'medium', 'longest-consecutive-sequence'),
  c('ch-49', 'Kth Largest Element in an Array', 'medium', 'kth-largest-element-in-an-array'),
  c('ch-50', 'House Robber', 'medium', 'house-robber'),
  c('ch-28', 'Spiral Matrix', 'medium', 'spiral-matrix'),
  c('ch-51', 'Rotate Image', 'medium', 'rotate-image'),
  c('ch-52', 'Set Matrix Zeroes', 'medium', 'set-matrix-zeroes'),
  c('ch-53', 'Insert Interval', 'medium', 'insert-interval'),
  c('ch-54', 'Find First and Last Position of Element', 'medium', 'find-first-and-last-position-of-element-in-sorted-array'),
  c('ch-55', 'Search a 2D Matrix', 'medium', 'search-a-2d-matrix'),
  c('ch-56', 'Jump Game', 'medium', 'jump-game'),
  c('ch-57', 'Unique Paths', 'medium', 'unique-paths'),
  c('ch-58', 'Coin Change', 'medium', 'coin-change'),
  c('ch-59', 'Longest Palindromic Substring', 'medium', 'longest-palindromic-substring'),
  c('ch-60', 'Generate Parentheses', 'medium', 'generate-parentheses'),
  c('ch-61', 'Permutations', 'medium', 'permutations'),
  c('ch-62', 'Subsets', 'medium', 'subsets'),
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
  f('fc-21', 'tests', 'Äquivalenzklassen и Grenzwertanalyse?',
    'Входные данные делят на классы эквивалентности и тестируют по одному представителю из каждого + проверяют граничные значения (min, max, ±1 от границы).'),
  f('fc-22', 'tests', 'Blackbox vs Whitebox Test?',
    'Blackbox — тест по спецификации, без знания кода (что делает). Whitebox — со знанием внутренней структуры, покрытие ветвей и путей (как делает).'),
  f('fc-23', 'exam', 'Lastenheft vs Pflichtenheft?',
    'Lastenheft — ЧТО хочет заказчик (требования, пишет заказчик). Pflichtenheft — КАК это будет реализовано (пишет исполнитель на основе Lastenheft).'),
  f('fc-24', 'exam', 'Kritischer Pfad в Netzplan?',
    'Самая длинная цепочка операций, у которых Puffer = 0. Задержка любой из них сдвигает срок всего проекта.'),
  f('fc-25', 'exam', 'WISO: что такое Inflation и кто с ней борется в еврозоне?',
    'Устойчивый рост уровня цен = падение покупательной способности. EZB через Leitzins (ключевую ставку); цель — около 2% в год.'),
  f('fc-26', 'exam', 'WISO: AGB — что это и когда действуют?',
    'Allgemeine Geschäftsbedingungen — типовые условия договора. Действуют, если явно включены в договор при заключении и не противоречат закону (§305 ff. BGB).'),
  f('fc-27', 'csharp', 'yield return — что делает?',
    'Превращает метод в ленивый итератор: элементы отдаются по одному при перечислении, состояние метода сохраняется между вызовами. Ничего не выполняется, пока не начали перечислять.'),
  f('fc-28', 'csharp', 'Что такое extension method?',
    'Статический метод в статическом классе с this-параметром первого аргумента; вызывается как метод расширяемого типа. Весь LINQ — extension methods для IEnumerable.'),
  f('fc-29', 'sql', 'Что такое транзакция и ACID?',
    'Группа операций, выполняемая как одно целое. Atomicity — всё или ничего; Consistency — данные валидны до и после; Isolation — параллельные транзакции не мешают; Durability — закоммиченное не теряется.'),
  f('fc-30', 'algo', 'Вставка в начало: List vs LinkedList?',
    'List<T>: O(n) — сдвигает все элементы. LinkedList<T>: O(1) — переставляет ссылки. Но List обычно быстрее на практике из-за кэш-локальности массива.'),
  f('fc-31', 'csharp', 'Интерфейс vs абстрактный класс — когда что?',
    'Интерфейс — контракт «умеет X», можно реализовать много. Абстрактный класс — общая база с состоянием и частичной реализацией, наследуется один. Нет общего кода → интерфейс.'),
];

// ── Проекты: позвоночник обучения ───────────────────────────────────────────
/**
 * Лестница проектов, которые пользователь строит САМ. Ежедневные задачи —
 * это навыки (гаммы); проекты — где навыки складываются в живое приложение
 * и в портфолио. Идут по нарастающей: консоль → API → БД+auth → тесты →
 * деплой → фронт → доведение своих pet-проектов. Каждый даёт артефакт в CV.
 */
type ProjectSeed = Omit<Project, 'repoUrl' | 'liveUrl'>;

const step = (id: string, label: string): ProjectStep => ({ id, label, done: false });

export const CURRICULUM_PROJECTS: ProjectSeed[] = [
  {
    id: 'p1',
    title: 'Ausgaben-Tracker (консоль)',
    goal: 'Консольное приложение, которое хранит расходы в JSON-файле и считает статистику.',
    skills: ['csharp'],
    estWeeks: 1,
    steps: [
      step('p1-1', 'Модель Expense (record: дата, сумма, категория) и List<Expense> в памяти'),
      step('p1-2', 'Меню в консоли: добавить / удалить / показать список'),
      step('p1-3', 'Статистика через LINQ: сумма за месяц, разбивка по категориям'),
      step('p1-4', 'Сохранение и загрузка из JSON-файла (System.Text.Json)'),
      step('p1-5', 'Обработка ошибок: нет файла, битый JSON, неверный ввод'),
      step('p1-6', 'README + первый push в GitHub'),
    ],
  },
  {
    id: 'p2',
    title: 'Notes API (первый веб-бэкенд)',
    goal: 'REST API с CRUD — твой первый ASP.NET Core бэкенд.',
    skills: ['backend'],
    estWeeks: 2,
    steps: [
      step('p2-1', 'dotnet new webapi, модель Note + DTO'),
      step('p2-2', 'EF Core InMemory, DbContext, регистрация в DI'),
      step('p2-3', 'CRUD-эндпоинты GET/POST/PUT/DELETE с правильными статус-кодами'),
      step('p2-4', 'Проверь каждый эндпоинт руками через Swagger'),
      step('p2-5', 'Проекция в DTO — не отдавай сущности наружу'),
      step('p2-6', 'README с примерами запросов, push'),
    ],
  },
  {
    id: 'p3',
    title: 'API вырастает: БД + валидация + auth',
    goal: 'Тот же API, но production-shape: реальная БД, валидация, JWT-аутентификация.',
    skills: ['backend', 'sql'],
    estWeeks: 2,
    steps: [
      step('p3-1', 'Замени InMemory на SQLite/Postgres, включи миграции'),
      step('p3-2', 'FluentValidation на все входные DTO'),
      step('p3-3', 'JWT: регистрация, логин, [Authorize], роли'),
      step('p3-4', 'Единая обработка ошибок (ProblemDetails)'),
      step('p3-5', 'Пагинация, фильтр и сортировка на списочном эндпоинте'),
      step('p3-6', 'Конфиг через appsettings + секреты в user secrets, не в git'),
    ],
  },
  {
    id: 'p4',
    title: 'Тесты (дифференциатор для найма)',
    goal: 'Проект, покрытый тестами — то, чего нет у большинства джунов.',
    skills: ['tests'],
    estWeeks: 1,
    steps: [
      step('p4-1', 'xUnit: unit-тесты на сервис по схеме AAA'),
      step('p4-2', 'Moq: изолируй зависимости, проверь happy path и ошибку'),
      step('p4-3', 'Integration-тесты эндпоинтов через WebApplicationFactory'),
      step('p4-4', 'Зелёный dotnet test + badge покрытия в README'),
    ],
  },
  {
    id: 'p5',
    title: 'Docker + Azure + CI/CD (главный проект)',
    goal: 'Живой URL в облаке, который вставишь прямо в CV.',
    skills: ['devops'],
    estWeeks: 2,
    steps: [
      step('p5-1', 'Multi-stage Dockerfile, запусти контейнер локально'),
      step('p5-2', 'docker-compose: API + БД поднимаются одной командой'),
      step('p5-3', 'Деплой в Azure (App Service/Container Apps) + Azure SQL/Postgres'),
      step('p5-4', 'GitHub Actions: build → test → deploy в main'),
      step('p5-5', 'Health check, живой URL в README и CV'),
    ],
  },
  {
    id: 'p6',
    title: 'Фронтенд: стань full-stack',
    goal: 'React/TS интерфейс поверх твоего API — полноценный full-stack проект.',
    skills: ['job'],
    estWeeks: 2,
    steps: [
      step('p6-1', 'Vite + React + TS, страница со списком записей'),
      step('p6-2', 'Fetch к твоему API, отображение данных, состояние загрузки'),
      step('p6-3', 'Форма создания и редактирования'),
      step('p6-4', 'Обработка ошибок и пустых состояний'),
      step('p6-5', 'Задеплой фронт на Vercel, свяжи с бэкендом (CORS)'),
    ],
  },
  {
    id: 'p7',
    title: 'Портфолио: доведи свои два проекта',
    goal: 'Auslagenerstattung и Telegram Mini App готовы показать работодателю.',
    skills: ['job'],
    estWeeks: 1,
    steps: [
      step('p7-1', 'README на каждый: скриншоты, стек, запуск, архитектура в 5 строк'),
      step('p7-2', 'Пойми и умей объяснить каждый слой без AI'),
      step('p7-3', 'Задеплой оба, добудь живые ссылки'),
      step('p7-4', 'Рассказ о каждом проекте за 2 минуты (запиши на диктофон)'),
      step('p7-5', 'Ссылки в CV, LinkedIn и pinned на GitHub-профиле'),
    ],
  },
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
