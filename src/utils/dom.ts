/*
 * @Date: 2022-10-26 21:38:10
 * @Author: 枫
 * @LastEditors: 枫
 * @description: DOM 工具
 * @LastEditTime: 2022-10-29 16:55:25
 */

/**
 * 根据文本和字号计算宽度
 * @param text 文本
 * @param fontsize 字号
 * @returns
 */
export function getDOMWidthWithFontSize(text: string, fontsize: number) {
  const textElement = document.createElement("div");
  textElement.style.display = "inline-block";
  textElement.textContent = text;
  textElement.style.fontSize = fontsize + "px";
  textElement.style.lineHeight = fontsize + "px";
  document.body.appendChild(textElement);
  const width = textElement.clientWidth;
  document.body.removeChild(textElement);
  return width;
}

/**
 * 根据图片地址计算图片的尺寸
 * @param src 图片地址
 * @returns
 */
export function getImageSizeBySrc(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;

    img.onload = () => resolve({ width: img.width, height: img.height });

    img.onerror = reject;
  });
}
