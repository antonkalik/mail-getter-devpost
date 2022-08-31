const axios = require('axios');
const logger = require('./logger');

let responses = [];
const LIMIT = 10;

function getUrl(page = 0, perPage = 100) {
  return `https://devpost.com/api/hackathons?challenge_type[]=online&order_by=recently-added&status[]=upcoming&page=${page}&per_page=${perPage}`;
}

async function getData(page) {
  logger.log('getting page:', page);
  const url = getUrl(page);
  return axios.get(url).then(async result => {
    const hackathons = result.data.hackathons.map(it => ({
      id: it.id,
      title: it.title,
      url: it.url,
    }));

    return Promise.all(
      hackathons.map(async hackathon => {
        const resultHtml = await axios.get(hackathon.url);
        const str = resultHtml.data.toString().trim();
        const rawEmail = str.slice(
          str.indexOf('">Email the hackathon manager') - 70,
          str.indexOf('">Email the hackathon manager')
        );
        const email = rawEmail.slice(
          rawEmail.indexOf('<a href="mailto:') + '<a href="mailto:'.length
        );
        return {
          id: hackathon.id,
          title: hackathon.title.trim(),
          email: email.trim(),
        };
      })
    );
  });
}

async function parser(page = 0) {
  const data = await getData(page);

  logger.log('loading data...');
  logger.log('page', page);
  logger.log('data.length', data?.length);

  if (data?.length > 0 || page === LIMIT) {
    responses.push(data);
    page = page + 1;
    await parser(page);
  }

  return responses.flat().reduce((obj, it) => {
    obj[it.id] = it;
    return obj;
  }, {});
}

module.exports = { parser };
