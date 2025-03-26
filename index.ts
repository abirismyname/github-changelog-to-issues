import axios from 'axios';
import * as xml2js from 'xml2js';
import * as fs from 'fs';

const GITHUB_CHANGELOG_RSS_URL = 'https://github.blog/changelog/feed/';

async function fetchChangelog(): Promise<string> {
  try {
    const response = await axios.get(GITHUB_CHANGELOG_RSS_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching the GitHub Changelog RSS feed:', error);
    throw error;
  }
}

async function parseChangelog(xml: string): Promise<any[]> {
  try {
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);
    return result.rss.channel[0].item;
  } catch (error) {
    console.error('Error parsing the GitHub Changelog RSS feed:', error);
    throw error;
  }
}

interface Post {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

function generateReport(posts: any[]): Post[] {
  const report = posts.map(post => {
    return {
      title: post.title[0],
      link: post.link[0],
      pubDate: post.pubDate[0],
      description: post.description[0]
    };
  });
  return report;
}

function outputReport(report: Post[]): void {
  const reportFilePath = 'changelog_report.json';
  fs.writeFileSync(reportFilePath, JSON.stringify(report, null, 2));
  console.log(`Report generated: ${reportFilePath}`);
}

async function main(): Promise<void> {
  try {
    const xml = await fetchChangelog();
    const posts = await parseChangelog(xml);
    const report = generateReport(posts);
    outputReport(report);
  } catch (error) {
    console.error('Error generating the changelog report:', error);
  }
}

main();
