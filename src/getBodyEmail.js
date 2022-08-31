const nextLine = '%0D%0A';

const getBodyEmail = title =>
  `Hi. I really like this hackathon and I would like to be a judge.${nextLine}About me. I am Senior Software Engineer at CoverWallet, an Aon company in Madrid, Spain. During my experience I got strong skills in building complex scalable services from completely ground. I have genuine passion for all sides of software development. I have 6+ years of experience in developing with the latest high-profile technologies from scratch focusing on microservices. Expertise with proficiency in robust code for high-volume business. Also I created the P2P platform swaper.com from scratch with the dev team in Latvia. Platform was the winner in 2019 and 2020 at BankingCheck and WealthFinance.${nextLine}Please let me know if it is possible to participate in the judging for ${title}.${nextLine}Thank you so much! Best regards.`;

module.exports = { getBodyEmail };
