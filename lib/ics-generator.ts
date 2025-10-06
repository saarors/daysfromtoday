/**
 * ICS 日历文件生成器
 * 
 * 功能：
 * 1. 生成符合 RFC 5545 标准的 .ics 文件
 * 2. 支持全天事件和提醒
 * 3. 多语言事件标题和描述
 * 
 * 标准：
 * - RFC 5545: Internet Calendaring and Scheduling Core Object Specification (iCalendar)
 * - 兼容 Google Calendar、Apple Calendar、Outlook
 * 
 * 符合项目规范：
 * - TypeScript 严格模式
 * - 纯函数设计
 * - 完整的错误处理
 */

import { format } from 'date-fns';

/**
 * ICS 事件配置
 */
export interface ICSEvent {
  // 事件标题
  title: string;
  
  // 事件描述
  description: string;
  
  // 事件日期（Date 对象）
  date: Date;
  
  // 是否为全天事件
  allDay?: boolean;
  
  // 提醒设置（分钟）
  reminderMinutes?: number;
  
  // 事件位置（可选）
  location?: string;
  
  // 事件 URL（可选）
  url?: string;
}

/**
 * 生成唯一的事件 ID
 */
function generateUID(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}@daysfromtoday.com`;
}

/**
 * 格式化日期为 iCalendar 格式
 * 
 * @param date - 日期对象
 * @param allDay - 是否为全天事件
 * @returns iCalendar 格式的日期字符串
 */
function formatICSDate(date: Date, allDay: boolean = true): string {
  if (allDay) {
    // 全天事件格式：YYYYMMDD
    return format(date, 'yyyyMMdd');
  } else {
    // 带时间的格式：YYYYMMDDTHHmmssZ
    return format(date, "yyyyMMdd'T'HHmmss'Z'");
  }
}

/**
 * 转义 ICS 文本内容
 * 
 * 根据 RFC 5545 规范，需要转义特殊字符：
 * - 逗号 (,)
 * - 分号 (;)
 * - 反斜杠 (\)
 * - 换行符 (\n)
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * 折叠长行（RFC 5545 要求每行不超过 75 字符）
 */
function foldLine(line: string): string {
  if (line.length <= 75) {
    return line;
  }
  
  const lines: string[] = [];
  let currentLine = line.substring(0, 75);
  let remaining = line.substring(75);
  
  lines.push(currentLine);
  
  while (remaining.length > 0) {
    currentLine = ' ' + remaining.substring(0, 74); // 续行以空格开头
    remaining = remaining.substring(74);
    lines.push(currentLine);
  }
  
  return lines.join('\r\n');
}

/**
 * 生成 ICS 文件内容
 * 
 * @param event - 事件配置
 * @returns ICS 文件内容字符串
 */
export function generateICS(event: ICSEvent): string {
  const now = new Date();
  const uid = generateUID();
  const dtstart = formatICSDate(event.date, event.allDay);
  const dtstamp = formatICSDate(now, false);
  
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//DaysFromToday//Date Calculator//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
  ];
  
  // 添加日期
  if (event.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${dtstart}`);
  } else {
    lines.push(`DTSTART:${dtstart}`);
  }
  
  // 添加标题（必需）
  lines.push(foldLine(`SUMMARY:${escapeICSText(event.title)}`));
  
  // 添加描述（可选）
  if (event.description) {
    lines.push(foldLine(`DESCRIPTION:${escapeICSText(event.description)}`));
  }
  
  // 添加位置（可选）
  if (event.location) {
    lines.push(foldLine(`LOCATION:${escapeICSText(event.location)}`));
  }
  
  // 添加 URL（可选）
  if (event.url) {
    lines.push(foldLine(`URL:${event.url}`));
  }
  
  // 添加提醒（可选）
  if (event.reminderMinutes) {
    lines.push('BEGIN:VALARM');
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:${escapeICSText(event.title)}`);
    lines.push(`TRIGGER:-PT${event.reminderMinutes}M`);
    lines.push('END:VALARM');
  }
  
  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');
  
  // 使用 CRLF 换行符（RFC 5545 要求）
  return lines.join('\r\n');
}

/**
 * 生成日期计算事件的 ICS 文件
 * 
 * @param targetDate - 目标日期
 * @param days - 天数
 * @param locale - 语言
 * @returns ICS 文件内容
 */
export function generateDateCalculationICS(
  targetDate: Date,
  days: number,
  locale: 'en' | 'zh' = 'en'
): string {
  const formattedDate = format(targetDate, 'yyyy-MM-dd');
  
  const title = locale === 'zh'
    ? `${Math.abs(days)} 天${days >= 0 ? '后' : '前'}：${formattedDate}`
    : `${Math.abs(days)} days ${days >= 0 ? 'from' : 'before'} today: ${formattedDate}`;
  
  const description = locale === 'zh'
    ? `从今天开始计算，${Math.abs(days)} 天${days >= 0 ? '后' : '前'}是 ${formattedDate}。由 DaysFromToday 计算生成。`
    : `Calculated by DaysFromToday: ${Math.abs(days)} days ${days >= 0 ? 'from' : 'before'} today is ${formattedDate}.`;
  
  return generateICS({
    title,
    description,
    date: targetDate,
    allDay: true,
    reminderMinutes: 60, // 提前 1 小时提醒
    url: `https://daysfromtoday.com/${locale}/days/${days}`
  });
}

/**
 * 生成 ICS 下载响应（用于 API 路由）
 * 
 * @param icsContent - ICS 文件内容
 * @param filename - 文件名（不含扩展名）
 * @returns Response 对象
 */
export function createICSResponse(icsContent: string, filename: string = 'event'): Response {
  return new Response(icsContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}.ics"`,
      'Cache-Control': 'no-cache'
    }
  });
}

