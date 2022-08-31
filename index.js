const axios = require('axios');

const url =
  'https://devpost.com/api/hackathons?challenge_type[]=online&order_by=recently-added&page=0&per_page=200&status[]=upcoming';

console.log('loading...');

axios.get(url).then(async result => {
  const hackathons = result.data.hackathons.map(it => ({
    id: it.id,
    title: it.title,
    url: it.url,
  }));

  const results = await Promise.all(
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
        ...hackathon,
        email,
      };
    })
  );

  console.log('results', results);
});
