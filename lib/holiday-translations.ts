/**
 * 节假日名称翻译映射
 * 将英文节假日名称翻译为各种语言
 */

export const holidayTranslations: Record<string, Record<string, string>> = {
  // 中国节假日
  "New Year's Day": {
    zh: '元旦',
    en: "New Year's Day"
  },
  "Spring Festival": {
    zh: '春节',
    en: 'Spring Festival'
  },
  "Chinese New Year": {
    zh: '春节',
    en: 'Chinese New Year'
  },
  "Qingming Festival": {
    zh: '清明节',
    en: 'Qingming Festival'
  },
  "Tomb Sweeping Day": {
    zh: '清明节',
    en: 'Tomb Sweeping Day'
  },
  "Labour Day": {
    zh: '劳动节',
    en: 'Labour Day'
  },
  "Labor Day": {
    zh: '劳动节',
    en: 'Labor Day'
  },
  "Dragon Boat Festival": {
    zh: '端午节',
    en: 'Dragon Boat Festival'
  },
  "Mid-Autumn Festival": {
    zh: '中秋节',
    en: 'Mid-Autumn Festival'
  },
  "National Day": {
    zh: '国庆节',
    en: 'National Day'
  },
  
  // 美国节假日
  "Martin Luther King Jr. Day": {
    zh: '马丁·路德·金纪念日',
    en: "Martin Luther King Jr. Day"
  },
  "Presidents' Day": {
    zh: '总统日',
    en: "Presidents' Day"
  },
  "Memorial Day": {
    zh: '阵亡将士纪念日',
    en: 'Memorial Day'
  },
  "Independence Day": {
    zh: '独立日',
    en: 'Independence Day'
  },
  "Juneteenth": {
    zh: '六月节',
    en: 'Juneteenth'
  },
  "Thanksgiving Day": {
    zh: '感恩节',
    en: 'Thanksgiving Day'
  },
  "Christmas Day": {
    zh: '圣诞节',
    en: 'Christmas Day'
  },
  "Veterans Day": {
    zh: '退伍军人节',
    en: 'Veterans Day'
  },
  "Columbus Day": {
    zh: '哥伦布日',
    en: 'Columbus Day'
  },
  
  // 英国节假日
  "Good Friday": {
    zh: '耶稣受难日',
    en: 'Good Friday'
  },
  "Easter Monday": {
    zh: '复活节星期一',
    en: 'Easter Monday'
  },
  "Early May Bank Holiday": {
    zh: '五月初银行假日',
    en: 'Early May Bank Holiday'
  },
  "Spring Bank Holiday": {
    zh: '春季银行假日',
    en: 'Spring Bank Holiday'
  },
  "Summer Bank Holiday": {
    zh: '夏季银行假日',
    en: 'Summer Bank Holiday'
  },
  "Boxing Day": {
    zh: '节礼日',
    en: 'Boxing Day'
  },
  
  // 日本节假日
  "Coming of Age Day": {
    zh: '成人节',
    en: 'Coming of Age Day'
  },
  "National Foundation Day": {
    zh: '建国纪念日',
    en: 'National Foundation Day'
  },
  "Vernal Equinox Day": {
    zh: '春分日',
    en: 'Vernal Equinox Day'
  },
  "Showa Day": {
    zh: '昭和日',
    en: 'Showa Day'
  },
  "Constitution Memorial Day": {
    zh: '宪法纪念日',
    en: 'Constitution Memorial Day'
  },
  "Greenery Day": {
    zh: '绿之日',
    en: 'Greenery Day'
  },
  "Children's Day": {
    zh: '儿童节',
    en: "Children's Day"
  },
  "Marine Day": {
    zh: '海之日',
    en: 'Marine Day'
  },
  "Mountain Day": {
    zh: '山之日',
    en: 'Mountain Day'
  },
  "Respect for the Aged Day": {
    zh: '敬老日',
    en: 'Respect for the Aged Day'
  },
  "Autumnal Equinox Day": {
    zh: '秋分日',
    en: 'Autumnal Equinox Day'
  },
  "Sports Day": {
    zh: '体育日',
    en: 'Sports Day'
  },
  "Culture Day": {
    zh: '文化日',
    en: 'Culture Day'
  },
  
  // 德国节假日
  "Epiphany": {
    zh: '主显节',
    en: 'Epiphany'
  },
  "Maundy Thursday": {
    zh: '濯足节',
    en: 'Maundy Thursday'
  },
  "Easter Sunday": {
    zh: '复活节',
    en: 'Easter Sunday'
  },
  "Whit Monday": {
    zh: '圣灵降临节次日',
    en: 'Whit Monday'
  },
  "Corpus Christi": {
    zh: '圣体节',
    en: 'Corpus Christi'
  },
  "Assumption of Mary": {
    zh: '圣母升天节',
    en: 'Assumption of Mary'
  },
  "German Unity Day": {
    zh: '德国统一日',
    en: 'German Unity Day'
  },
  "Reformation Day": {
    zh: '宗教改革日',
    en: 'Reformation Day'
  },
  "All Saints' Day": {
    zh: '万圣节',
    en: "All Saints' Day"
  },
  
  // 其他常见节假日
  "New Year's Eve": {
    zh: '除夕',
    en: "New Year's Eve"
  },
  "Valentine's Day": {
    zh: '情人节',
    en: "Valentine's Day"
  },
  "International Women's Day": {
    zh: '国际妇女节',
    en: "International Women's Day"
  },
  "Mother's Day": {
    zh: '母亲节',
    en: "Mother's Day"
  },
  "Father's Day": {
    zh: '父亲节',
    en: "Father's Day"
  },
  "Halloween": {
    zh: '万圣夜',
    en: 'Halloween'
  },
};

/**
 * 翻译节假日名称
 * @param name - 英文节假日名称
 * @param locale - 目标语言
 * @returns 翻译后的名称，如果没有翻译则返回原名称
 */
export function translateHolidayName(name: string, locale: string): string {
  if (locale === 'en' || !holidayTranslations[name]) {
    return name;
  }
  
  return holidayTranslations[name][locale] || name;
}

/**
 * 批量翻译节假日
 */
export function translateHolidays<T extends { name: string; localName?: string }>(
  holidays: T[],
  locale: string
): (T & { translatedName: string })[] {
  return holidays.map(holiday => ({
    ...holiday,
    translatedName: translateHolidayName(holiday.name, locale)
  }));
}

