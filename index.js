const axios = require('axios');
const xml2js = require('xml2js');
const fs = require('fs');

const GITHUB_CHANGELOG_RSS_URL = 'https://github.blog/changelog/feed/';

async function fetchChangelog() {
  try {
    const response = await axios.get(GITHUB_CHANGELOG_RSS_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching the GitHub Changelog RSS feed:', error);
    throw error;
  }
}

async function parseChangelog(xml) {
  try {
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);
    return result.rss.channel[0].item;
  } catch (error) {
    console.error('Error parsing the GitHub Changelog RSS feed:', error);
    throw error;
  }
}

function generateReport(posts) {
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

function outputReport(report) {
  const reportFilePath = 'changelog_report.json';
  fs.writeFileSync(reportFilePath, JSON.stringify(report, null, 2));
  console.log(`Report generated: ${reportFilePath}`);
}

async function main() {
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
