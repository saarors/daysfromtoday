/**
 * TableOfContents - 目录导航组件
 * 
 * 用途: 自动生成文章目录，支持锚点跳转
 * 使用场景: 所有长文章（>1000字）
 */

'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  maxDepth?: 2 | 3 | 4;    // 最大标题层级（默认 3）
  sticky?: boolean;        // 是否固定在侧边（默认 false）
  title?: string;          // 目录标题（默认 "目录"）
}

export function TableOfContents({
  maxDepth = 3,
  sticky = false,
  title = '目录',
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 获取文章中的所有标题
    const selectors = ['h2', 'h3', 'h4'].slice(0, maxDepth - 1).join(', ');
    const elements = document.querySelectorAll<HTMLHeadingElement>(selectors);
    
    const items: TOCItem[] = Array.from(elements).map((element) => ({
      id: element.id || element.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
      text: element.textContent || '',
      level: parseInt(element.tagName[1]),
    }));

    // 为没有 id 的标题添加 id
    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = items[index].id;
      }
    });

    setHeadings(items);

    // 监听滚动，高亮当前位置的标题
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [maxDepth]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      className={`
        my-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700
        ${sticky ? 'md:sticky md:top-4' : ''}
      `}
    >
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`
                block text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors
                ${
                  activeId === heading.id
                    ? 'text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400'
                }
              `}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

