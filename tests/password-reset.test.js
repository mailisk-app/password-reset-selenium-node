const { Builder, By } = require("selenium-webdriver");
const { MailiskClient } = require("mailisk");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

(async function passwordResetTest() {
  let resetLink;
  const namespace = process.env.NAMESPACE;
  const testEmailAddress = `test.${new Date().getTime()}@${namespace}.mailisk.net`;

  const mailisk = new MailiskClient({ apiKey: process.env.API_KEY });

  // Create a new Chrome driver
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Let's visit the signup page and create a new user
    await driver.get("http://localhost:3000/register");
    await new Promise((r) => setTimeout(r, 500));
    await driver.findElement(By.id("email")).sendKeys(testEmailAddress);
    await driver.findElement(By.id("password")).sendKeys("password");
    await driver.findElement(By.css("form")).submit();
    await new Promise((r) => setTimeout(r, 500));

    // We should have been redirected to the login page, so let's enter our credentials
    await driver.findElement(By.id("email")).sendKeys(testEmailAddress);
    await driver.findElement(By.id("password")).sendKeys("password");
    await driver.findElement(By.css("form")).submit();
    await new Promise((r) => setTimeout(r, 500));

    // Let's send a password reset email
    await driver.get("http://localhost:3000/forgot");
    await new Promise((r) => setTimeout(r, 500));
    await driver.findElement(By.id("email")).sendKeys(testEmailAddress);
    await driver.findElement(By.css("form")).submit();
    // the reset email is sent here!

    // Now we wait for the email to arrive extract the link
    const { data: emails } = await mailisk.searchInbox(namespace, {
      to_addr_prefix: testEmailAddress,
    });
    const email = emails[0];
    resetLink = email.text.match(/.*\[(http:\/\/localhost:3000\/.*)\].*/)[1];

    // We visit the reset link and set the new password
    await driver.get(resetLink);
    await new Promise((r) => setTimeout(r, 500));
    await driver.findElement(By.id("new-password")).sendKeys("newpassword");
    await driver.findElement(By.css("form")).submit();
    await new Promise((r) => setTimeout(r, 500));

    // Let's try logging in again, but this time with the new password
    await driver.get("http://localhost:3000");
    await new Promise((r) => setTimeout(r, 500));
    await driver.findElement(By.id("email")).sendKeys(testEmailAddress);
    await driver.findElement(By.id("password")).sendKeys("newpassword");
    await driver.findElement(By.css("form")).submit();
    await new Promise((r) => setTimeout(r, 500));

    // If we successfully log in, the app will redirect us to the dashboard
    let currentUrl = await driver.getCurrentUrl();
    if (currentUrl !== "http://localhost:3000/dashboard") {
      throw new Error(`Expected url to be 'http://localhost:3000/dashboard' got '${currentUrl}'`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    // Close the browser
    await driver.quit();
  }
})();
