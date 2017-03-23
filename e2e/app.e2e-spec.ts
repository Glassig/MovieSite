import { MovieSitePage } from './app.po';

describe('movie-site App', () => {
  let page: MovieSitePage;

  beforeEach(() => {
    page = new MovieSitePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
