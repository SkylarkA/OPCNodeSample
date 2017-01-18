import { Ng2HmiPage } from './app.po';

describe('ng2-hmi App', function() {
  let page: Ng2HmiPage;

  beforeEach(() => {
    page = new Ng2HmiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
