import type { ReactNode } from 'react';

export type LegalDocId = 'terms' | 'privacy' | 'consent' | 'medical';

export interface LegalDoc {
  id: LegalDocId;
  title: string;
  shortTitle: string;
  version: string;
  effectiveDate: string;
  summary: string;
  content: ReactNode;
}

export const LEGAL_VERSION = '1.0';
export const LEGAL_EFFECTIVE_DATE = '3 февраля 2026';
export const OPERATOR_NAME = 'Сыцевич Никита Владимирович';
export const OPERATOR_EMAIL = 'nikitka.sytsevich@icloud.com';
export const OPERATOR_ADDRESS = 'Республика Беларусь, Брестская обл., Лунинецкий р-н, г. Микашевичи, ул. Строителей 7А, кв. 59';
export const APP_NAME = 'Body Tweaker';

const sectionTitle = 'text-sm font-bold text-slate-800 dark:text-white';
const paragraph = 'text-sm text-slate-600 dark:text-slate-300 leading-relaxed';
const list = 'list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300';

export const LEGAL_DOCS: LegalDoc[] = [
  {
    id: 'terms',
    title: 'Пользовательское соглашение',
    shortTitle: 'Пользовательское соглашение',
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    summary: 'Правила использования приложения и ограничения ответственности.',
    content: (
      <div className="space-y-4">
        <p className={paragraph}>
          Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует порядок
          использования приложения {APP_NAME}. Используя приложение или нажимая «Принять»,
          вы подтверждаете, что ознакомились и согласны с условиями Соглашения.
        </p>

        <div className="space-y-2">
          <h4 className={sectionTitle}>1. Общие положения</h4>
          <p className={paragraph}>
            Оператор приложения: {OPERATOR_NAME}, адрес: {OPERATOR_ADDRESS}, e-mail для обращений: {OPERATOR_EMAIL}.
            Приложение предназначено для информационных целей и самоконтроля.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>2. Предмет Соглашения</h4>
          <p className={paragraph}>
            Приложение предоставляет инструменты для ведения дневника, таймеры и справочные
            материалы по интервальному голоданию, дыхательным практикам и биоритмам.
            Приложение не является медицинским изделием и не оказывает медицинские услуги.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>3. Доступ и использование</h4>
          <p className={paragraph}>
            Доступ осуществляется через Telegram Mini App. Регистрация и создание аккаунта
            в приложении не требуются. Часть функций может зависеть от возможностей Telegram.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>4. Возраст и безопасность</h4>
          <p className={paragraph}>
            Приложение предназначено для лиц старше 18 лет. Пользователь подтверждает, что не
            имеет противопоказаний и использует приложение на свой риск.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>5. Права и обязанности пользователя</h4>
          <ul className={list}>
            <li>Использовать приложение добросовестно и безопасно.</li>
            <li>Не полагаться на материалы приложения как на медицинские рекомендации.</li>
            <li>Самостоятельно оценивать риски и при необходимости обращаться к врачу.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>6. Ограничение ответственности</h4>
          <p className={paragraph}>
            Приложение предоставляется «как есть». Оператор не несет ответственности за
            возможный вред здоровью или иные последствия использования материалов приложения.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>7. Интеллектуальная собственность</h4>
          <p className={paragraph}>
            Все права на контент, дизайн и программный код приложения принадлежат Оператору
            или законным правообладателям. Копирование и распространение без разрешения запрещены.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>8. Изменения и контакты</h4>
          <p className={paragraph}>
            Оператор вправе обновлять Соглашение. Актуальная версия доступна в приложении.
            По вопросам обращайтесь на {OPERATOR_EMAIL}.
          </p>
        </div>
        <div className="space-y-2">
          <h4 className={sectionTitle}>9. Применимое право</h4>
          <p className={paragraph}>
            К настоящему Соглашению применяется право Республики Беларусь.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'privacy',
    title: 'Политика конфиденциальности',
    shortTitle: 'Политика конфиденциальности',
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    summary: 'Как обрабатываются и защищаются ваши данные.',
    content: (
      <div className="space-y-4">
        <p className={paragraph}>
          Настоящая Политика описывает, какие данные обрабатываются при использовании
          приложения {APP_NAME}, как они хранятся и какие у пользователя есть права.
        </p>

        <div className="space-y-2">
          <h4 className={sectionTitle}>1. Оператор</h4>
          <p className={paragraph}>
            Оператор персональных данных: {OPERATOR_NAME}, адрес: {OPERATOR_ADDRESS}, e-mail: {OPERATOR_EMAIL}.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>2. Какие данные обрабатываются</h4>
          <ul className={list}>
            <li>Данные Telegram профиля, доступные приложению: имя, username, фото профиля.</li>
            <li>Данные, вводимые пользователем: история голодания, сессии дыхания, настройки.</li>
            <li>Технические данные, передаваемые браузером при загрузке внешних ресурсов (например, IP, user-agent).</li>
            <li>Сведения, которые могут относиться к состоянию здоровья, если пользователь вводит их в приложении.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>3. Правовые основания и цели</h4>
          <ul className={list}>
            <li>Основание обработки — согласие субъекта персональных данных.</li>
            <li>Цели: предоставление функционала приложения, сохранение истории и настроек, обратная связь по обращениям.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>4. Источники и хранение</h4>
          <ul className={list}>
            <li>Данные хранятся локально на устройстве пользователя.</li>
            <li>При поддержке Telegram Cloud Storage данные могут синхронизироваться в облаке Telegram.</li>
            <li>Передача данных на сервер Оператора не осуществляется.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>5. Передача третьим лицам</h4>
          <p className={paragraph}>
            Оператор не передает данные третьим лицам. Однако Telegram является независимым
            оператором, и обработка в Telegram Cloud Storage регулируется политикой Telegram.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>6. Трансграничная передача</h4>
          <p className={paragraph}>
            При использовании Telegram и облачной синхронизации возможна трансграничная передача
            персональных данных. В случае передачи в государства без надлежащего уровня защиты
            такие действия осуществляются на основании согласия пользователя с учетом возможных рисков
            (отсутствие специального законодательства, уполномоченного органа и мер ответственности).
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>7. Сроки хранения</h4>
          <p className={paragraph}>
            Данные хранятся до их удаления пользователем (через функцию «Сбросить все данные»)
            либо до отзыва согласия.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>8. Права пользователя</h4>
          <ul className={list}>
            <li>Запросить информацию об обработке данных.</li>
            <li>Отозвать согласие и удалить данные через настройки приложения.</li>
            <li>Требовать исправления, блокирования или удаления данных при отсутствии оснований для обработки.</li>
            <li>Получать информацию о предоставлении данных третьим лицам (если такое имело место).</li>
            <li>Обжаловать действия Оператора в уполномоченный орган или суд.</li>
            <li>Обратиться к Оператору по адресу {OPERATOR_EMAIL}.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>9. Порядок реализации прав</h4>
          <p className={paragraph}>
            Для реализации прав субъект подает заявление в письменной форме либо в виде электронного документа.
            В заявлении указываются ФИО, адрес, дата рождения, суть требования и подпись (либо ЭЦП).
            Срок предоставления информации — до 5 рабочих дней, срок прекращения обработки, удаления или внесения
            изменений — до 15 календарных дней (если иное не предусмотрено законом).
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>10. Безопасность</h4>
          <p className={paragraph}>
            Данные в хранилище приложения шифруются. Для синхронизации с Telegram Cloud Storage
            используется защищенный канал Telegram.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'consent',
    title: 'Согласие на обработку персональных данных',
    shortTitle: 'Согласие на обработку данных',
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    summary: 'Формальное согласие в соответствии с 152‑ФЗ.',
    content: (
      <div className="space-y-4">
        <p className={paragraph}>
          Настоящим пользователь дает согласие Оператору {OPERATOR_NAME} на обработку
          персональных данных в целях, указанных ниже.
        </p>

        <div className="space-y-2">
          <h4 className={sectionTitle}>1. Состав персональных данных</h4>
          <ul className={list}>
            <li>Данные Telegram профиля: имя, username, фото профиля.</li>
            <li>Данные использования приложения: история, настройки, введенные пользователем сведения.</li>
            <li>Сведения, которые могут относиться к состоянию здоровья, если пользователь вводит их в приложении.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>2. Действия с данными</h4>
          <p className={paragraph}>
            Сбор, запись, систематизация, накопление, хранение, обновление, использование,
            обезличивание (при необходимости), предоставление, блокирование, удаление.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>3. Цели обработки</h4>
          <ul className={list}>
            <li>Предоставление функционала приложения.</li>
            <li>Сохранение пользовательской истории и настроек.</li>
            <li>Обратная связь по запросам пользователя.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>4. Специальные персональные данные</h4>
          <p className={paragraph}>
            Пользователь дает согласие на обработку специальных персональных данных (сведения о состоянии здоровья),
            если такие сведения вводятся в приложении.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>5. Трансграничная передача</h4>
          <p className={paragraph}>
            Пользователь дает согласие на трансграничную передачу персональных данных при использовании Telegram и
            облачной синхронизации, включая возможную передачу в государства без надлежащего уровня защиты, и
            проинформирован о соответствующих рисках.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>6. Срок действия согласия</h4>
          <p className={paragraph}>
            Согласие действует до его отзыва. Отзыв возможен путем удаления данных в настройках
            приложения и направления запроса на {OPERATOR_EMAIL}.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>7. Оператор и контакты</h4>
          <p className={paragraph}>
            Оператор: {OPERATOR_NAME}, адрес: {OPERATOR_ADDRESS}, e-mail: {OPERATOR_EMAIL}.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'medical',
    title: 'Медицинское предупреждение и ограничения',
    shortTitle: 'Медицинское предупреждение',
    version: LEGAL_VERSION,
    effectiveDate: LEGAL_EFFECTIVE_DATE,
    summary: 'Важно о рисках голодания и дыхательных практик.',
    content: (
      <div className="space-y-4">
        <p className={paragraph}>
          Приложение {APP_NAME} не является медицинским изделием и не заменяет консультацию
          врача. Использование материалов приложения осуществляется на ваш риск.
        </p>

        <div className="space-y-2">
          <h4 className={sectionTitle}>1. Когда нельзя использовать практики</h4>
          <ul className={list}>
            <li>Беременность и период грудного вскармливания.</li>
            <li>Возраст до 18 лет.</li>
            <li>Сахарный диабет, расстройства пищевого поведения.</li>
            <li>Хронические заболевания, требующие регулярного наблюдения.</li>
            <li>Сердечно-сосудистые, неврологические и психические заболевания.</li>
            <li>Прием лекарств, влияющих на обмен веществ, давление или сознание.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>2. Безопасность дыхательных практик</h4>
          <ul className={list}>
            <li>Не выполняйте практики во время управления транспортом или в воде.</li>
            <li>При головокружении прекратите практику и восстановите дыхание.</li>
            <li>Выполняйте упражнения в безопасной обстановке.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className={sectionTitle}>3. Экстренные случаи</h4>
          <p className={paragraph}>
            При ухудшении самочувствия немедленно прекратите практику и обратитесь за
            медицинской помощью.
          </p>
        </div>
      </div>
    )
  }
];

export const getLegalDocById = (id: LegalDocId): LegalDoc | undefined => {
  return LEGAL_DOCS.find((doc) => doc.id === id);
};
