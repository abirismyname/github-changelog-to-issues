import { fetchChangelog, parseChangelog, generateReport } from '../index';
import axios from 'axios';
import * as xml2js from 'xml2js';

jest.mock('axios');
jest.mock('xml2js');

describe('GitHub Changelog Action', () => {
  const mockXml = '<rss><channel><item><title>Test Post</title><link>https://github.blog/test-post</link><pubDate>Mon, 01 Jan 2023 00:00:00 GMT</pubDate><description>Test description</description></item></channel></rss>';
  const mockPosts = [
    {
      title: ['Test Post'],
      link: ['https://github.blog/test-post'],
      pubDate: ['Mon, 01 Jan 2023 00:00:00 GMT'],
      description: ['Test description']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches the GitHub Changelog RSS feed', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockXml });

    const xml = await fetchChangelog();

    expect(axios.get).toHaveBeenCalledWith('https://github.blog/changelog/feed/');
    expect(xml).toBe(mockXml);
  });

  it('parses the GitHub Changelog RSS feed', async () => {
    (xml2js.Parser.prototype.parseStringPromise as jest.Mock).mockResolvedValue({ rss: { channel: [{ item: mockPosts }] } });

    const posts = await parseChangelog(mockXml);

    expect(xml2js.Parser.prototype.parseStringPromise).toHaveBeenCalledWith(mockXml);
    expect(posts).toEqual(mockPosts);
  });

  it('generates a report with new posts', () => {
    const report = generateReport(mockPosts);

    expect(report).toEqual([
      {
        title: 'Test Post',
        link: 'https://github.blog/test-post',
        pubDate: 'Mon, 01 Jan 2023 00:00:00 GMT',
        description: 'Test description'
      }
    ]);
  });
});
