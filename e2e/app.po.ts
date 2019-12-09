import { browser, element, by } from 'protractor';

export class AngularPlaygroundPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('appRoot p')).getText();
  }
}
