import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlConverterService {
  convertToHTML(str: string): string {
    const lines = str.split('\n');
    let html = '<div class="interpreta">';
  
    const patterns = new Map<string, (line: string) => string>([
      ['**', line => `<h2>${line.substring(2).trim().replace('**','')}</h2>`],
      ['##', line => `<h3>${line.substring(2).trim()}</h3>`],
      ['###', line => `<h4>${line.substring(3).trim()}</h4>`],
      ['![', this.handleImageMarkdown],
      ['[!', this.handleImageLinkMarkdown],
      ['▶️ [', this.handleVideoLinkMarkdown],
      ['- [', this.handleLinkMarkdown],
      ['-', line => `<li>${line.substring(1).trim()}</li>`],
      ['http', this.handleURL],
      ['@', this.handleUserMention]
    ]);
  
    for (const line of lines) {
      const pattern = Array.from(patterns.keys()).find(p => line.startsWith(p));
      if (pattern) {
        html += patterns.get(pattern)!(line);
      } else if (line.trim().length === 0) {
        html += '<br>';
      } else {
        html += `<p>${line}</p>`;
      }
    }
  
    html += '</div>';
    return html;
  }
  
  private handleUserMention(line: string): string {
    const username = line.substring(1, line.indexOf(' '));
    return `<a href="https://hive.blog/@${username}">${line}</a>`;
  }

  private handleURL(line: string): string {
    const url = line.match(/(https?:\/\/[^\s]+)/g);
    return `<a href="${url}">${url}</a>`;
  }

  private handleImageMarkdown(line: string): string {
    const altTextStartIndex = line.indexOf("[");
    const altTextEndIndex = line.indexOf("]");
    const altText = line.substring(altTextStartIndex + 1, altTextEndIndex);
    const linkStartIndex = line.indexOf("(");
    const linkEndIndex = line.indexOf(")");
    const link = line.substring(linkStartIndex + 1, linkEndIndex);
    return `<img src="${link}" alt="${altText}">`;
  }
  
  private handleImageLinkMarkdown(line: string): string {
    const imageStartIndex = line.indexOf("(");
    const imageEndIndex = line.indexOf(")");
    const imageLink = line.substring(imageStartIndex + 1, imageEndIndex);
    const linkStartIndex = line.indexOf("[");
    const linkEndIndex = line.indexOf("]");
    const linkText = line.substring(linkStartIndex + 1, linkEndIndex);
    const linkHref = line.substring(line.lastIndexOf("(") + 1, line.lastIndexOf(")"));
    return `<a href="${linkHref}"><img src="${imageLink}" alt="${linkText}"></a>`;
  }
  
  private handleVideoLinkMarkdown(line: string): string {
    const videoStartIndex = line.indexOf("[");
    const videoEndIndex = line.indexOf("]");
    const videoText = line.substring(videoStartIndex + 1, videoEndIndex);
    const linkStartIndex = line.indexOf("(");
    const linkEndIndex = line.indexOf(")");
    const linkHref = line.substring(linkStartIndex + 1, linkEndIndex);
    return `<p><a href="${linkHref}">${videoText}</a></p>`;
  }
  
  private handleLinkMarkdown(line: string): string {
    const linkStartIndex = line.indexOf("(");
    const linkEndIndex = line.indexOf(")");
    const link = line.substring(linkStartIndex + 1, linkEndIndex);
    const text = line.substring(3, line.indexOf("]")).trim();
    return `<p><a href="${link}">${text}</a></p>`;
  }
  

  applyStyles(): void {
    const styles = `
    .interpreta {
      font-family: 'Roboto', sans-serif;
      font-size: 16px;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      background-color: #ffffff;
      color: #333;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      width: 100%;
  }
  
  .interpreta h2 {
      font-size: 28px;
      font-weight: 600;
      margin: 25px 0 15px;
      color: #1976d2;
  }
  
  .interpreta h3 {
      font-size: 24px;
      font-weight: 500;
      margin: 20px 0 15px;
      color: #1976d2;
  }
  
  .interpreta h4 {
      font-size: 20px;
      font-weight: 500;
      margin: 15px 0 10px;
      color: #1976d2;
  }
  
  .interpreta p {
      margin: 15px 0;
      line-height: 1.8;
  }
  
  .interpreta img {
      max-width: 100%;
      height: auto;
      margin: 15px 0;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .interpreta a {
      color: #1976d2;
      text-decoration: none;
      transition: color 0.3s, text-decoration 0.3s;
  }
  
  .interpreta a:hover {
      text-decoration: underline;
      color: #004ba0;
  }
  
  .interpreta ul {
      padding-left: 25px;
      margin: 15px 0;
  }
  
  .interpreta li {
      margin: 10px 0;
  }
  
  .interpreta p {
      margin: 15px 0;
  }
  
    `;

    if (!document.head.querySelector('#interpreta-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'interpreta-styles';
      styleElement.innerHTML = styles;
      document.head.appendChild(styleElement);
    }
  }
}