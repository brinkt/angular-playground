import { AngularPlaygroundPage } from './app.po';

describe('angular-playground App', function() {
  let page: AngularPlaygroundPage;

  beforeEach(() => {
    page = new AngularPlaygroundPage();
  });

  it('should display the home component', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('The following functionality has been added:');
  });
});
