import { Injectable } from '@nestjs/common';
import { Template } from 'handlebars';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PDFService {
  async generatePDF(
    credential: Credential,
    template: Template,
  ): Promise<Buffer> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Generate HTML from template and credential data
    const html = this.generateHTML(template, credential);

    await page.setContent(html);
    await page.setViewport({
      width: template.design.width,
      height: template.design.height,
    });

    const pdf = await page.pdf({
      width: template.design.width,
      height: template.design.height,
      printBackground: true,
    });

    await browser.close();
    return pdf;
  }

  private generateHTML(template: Template, credential: Credential): string {
    let html = `
      <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              width: ${template.design.width}px; 
              height: ${template.design.height}px;
              background-color: ${template.design.backgroundColor};
              position: relative;
            }
            .element {
              position: absolute;
            }
          </style>
        </head>
        <body>
    `;

    // Render each design element
    template.design.elements.forEach((element) => {
      let content = element.content;

      // Replace field placeholders with actual values
      if (credential.fieldValues) {
        credential.fieldValues.forEach((value, key) => {
          content = content.replace(`{{${key}}}`, value);
        });
      }

      html += `
        <div class="element" style="
          left: ${element.x}px;
          top: ${element.y}px;
          width: ${element.width}px;
          height: ${element.height}px;
          font-size: ${element.fontSize || 16}px;
          font-family: ${element.fontFamily || 'Arial'};
          color: ${element.fontColor || '#000'};
          font-weight: ${element.fontWeight || 'normal'};
          text-align: ${element.textAlign || 'left'};
          transform: rotate(${element.rotation || 0}deg);
          opacity: ${element.opacity || 1};
        ">
          ${element.type === 'qr' ? `<img src="${credential.qrCodeUrl}" />` : content}
        </div>
      `;
    });

    html += '</body></html>';
    return html;
  }
}
