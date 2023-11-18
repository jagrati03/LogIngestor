const { Client } = require('elasticsearch');

// https://username:password@localhost:9200
// username & password should ideally come from env variables.
// const esClient = new Client({ node: 'https://elastic:1Wr32oPjsmpLOha1h22=@localhost:9200' }); // Update with relevant Elasticsearch server URL

// const esClient = new Client({
//   node: 'https://localhost:9200',
//   auth: { username: 'elastic',
//   password: '1Wr32oPjsmpLOha1h22=' },
//   // the fingerprint (SHA256) of the CA certificate that is used to sign
//   // the certificate that the Elasticsearch node presents for TLS.
//   caFingerprint: '2927601a90e7d94e777b2b62fa22fcb92804deaa7b4799cc32579f820c1903d4',
//   tls: {
//     // might be required if it's a self-signed certificate
//     rejectUnauthorized: false
//   }
// });

const esClient = new Client({ node: 'http://localhost:9200' });

// Function to store logs
async function storeLogs(logs) {
  const bulkBody = [];
  logs.forEach((log) => {
    bulkBody.push({ index: { _index: 'logs' } });
    bulkBody.push(log);
  });

  // console.log("BulkBody...");
  // console.log(bulkBody);
  await esClient.bulk({ body: bulkBody });
}

// Function to query logs based on parameters
async function queryLogs(searchText, filterField, filterValue) {
  const query = {
    bool: {
      must: [],
    },
  };

  if (searchText) {
    query.bool.must.push({ match: { message: searchText } });
  }

  if (filterField && filterValue) {
    query.bool.must.push({ term: { [filterField]: filterValue } });
  }

  
  try {
    const response = await esClient.search({
      index: 'logs',
      body: {
        query,
      },
    });

    // console.log("Query Payload...");
    // console.log(JSON.stringify(query, null, 2));

    // console.log("Response Body...");
    // console.log(JSON.stringify(response, null, 2));

    return response.hits.hits.map((hit) => hit._source);
  } catch (error) {
    console.error('Error querying logs:', error);
    return []; // Return an empty array or handle the error accordingly
  }
}

module.exports = {storeLogs, queryLogs};