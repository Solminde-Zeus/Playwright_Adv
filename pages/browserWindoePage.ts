import { Page, BrowserContext, expect } from "@playwright/test"; 
import { BrowserWindowsData } from "../test-data/browserWindow.data";
export class BrowserWindowsPage {
  private childTab: Page | null = null;
  constructor(
    private readonly page: Page,
    private readonly context: BrowserContext,
  ) {}
  private readonly newTabBtn = () => this.page.locator("#tabButton");
  private readonly newWindowMsgBtn = () =>
    this.page.locator("#messageWindowButton");
  async goto(): Promise<void> {
    await this.page.goto(BrowserWindowsData.url);
  }
  // TC_001 — Opens new tab and stores reference as class property
  async openNewTabAndVerifyItExists(): Promise<void> {
    const newTabPromise = this.context.waitForEvent("page");
    await this.newTabBtn().click();
    this.childTab = await newTabPromise;
    await this.childTab.waitForLoadState("domcontentloaded");
    expect(this.context.pages().length).toBe(2);
  }
  // TC_002 — Verifies heading and URL of the stored child tab
  async verifyNewTabContent(): Promise<void> {
    await expect(this.childTab!.locator("h1")).toHaveText(
      BrowserWindowsData.newTabExpectedText,
    );
    expect(this.childTab!.url()).toContain(
      BrowserWindowsData.newTabExpectedUrl,
    );
  }
  // TC_003 — Closes stored child tab and returns focus to parent
  async closeChildTabAndReturnToParent(): Promise<void> {
    await this.childTab!.close();
    await this.page.bringToFront();
    expect(this.context.pages().length).toBe(1);
    expect(this.page.url()).toContain("browser-windows");
  }
  // TC_004 — Opens message window and verifies its content
  async verifyNewWindowMessageContent(): Promise<void> {
    const popupPromise = this.context.waitForEvent("page");
    await this.newWindowMsgBtn().click();
    const popup = await popupPromise;
    await popup.waitForLoadState("domcontentloaded");
    expect(await popup.locator("body").getByText(BrowserWindowsData.newWindowMessageText,));
    await popup.close();
  }
}
