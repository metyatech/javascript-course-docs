import { test, expect } from "@playwright/test";

test("supplemental materials content renders as text", async ({ page }) => {
  await page.goto("/javascript-course-docs/docs/materials/javascript-basics-supplement");

  await expect(
    page.getByRole("heading", { name: "JavaScript基礎の補足資料" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "JavaScript 基礎の補足トピック" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "TypeScript" })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "AIエージェント" })).toBeVisible();

  const introLink = page.getByRole("link", {
    name: "JavaScript を学ぶと何ができるのか",
  });
  await expect(introLink).toHaveAttribute(
    "href",
    "/javascript-course-docs/docs/basics/introduction#javascript-%E3%82%92%E5%AD%A6%E3%81%B6%E3%81%A8%E4%BD%95%E3%81%8C%E3%81%A7%E3%81%8D%E3%82%8B%E3%81%AE%E3%81%8B"
  );
  const stateOfJsLink = page.getByRole("link", { name: "State of JS 2024" });
  await expect(stateOfJsLink).toHaveAttribute(
    "href",
    "https://2024.stateofjs.com/ja-JP/"
  );
  const aiImage = page.getByAltText("埼玉の画像生成例");
  await expect(aiImage).toHaveAttribute(
    "src",
    /\/javascript-course-docs\/.+\.png$/
  );
  await introLink.click();
  await expect(page).toHaveURL(
    /\/javascript-course-docs\/docs\/basics\/introduction#javascript-%E3%82%92%E5%AD%A6%E3%81%B6%E3%81%A8%E4%BD%95%E3%81%8C%E3%81%A7%E3%81%8D%E3%82%8B%E3%81%AE%E3%81%8B/
  );
  await expect(
    page.getByRole("heading", { name: "JavaScript を学ぶと何ができるのか" })
  ).toBeVisible();
});
