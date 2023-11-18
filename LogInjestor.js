const express = require('express');
const bodyParser = require('body-parser');
const {storeLogs, queryLogs} = require('./QueryInterface')
const app = express();
const port = 3000;


// Use bodyParser to parse JSON requests
app.use(bodyParser.json());

// Endpoint for log ingestion
app.post('/ingest', async(req, res) => {
  try {
    // Extract logs from the request body
    const logs = req.body.logs;

    // Process and store logs
    await storeLogs(logs);

    res.status(200).send('Logs ingested successfully.');
  } catch (error) {
    console.error('Error ingesting logs:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Endpoint for querying logs
app.get('/query', async(req, res) => {
  try {
    // Extract query parameters from the request
    const searchText = req.query.searchText;
    const filterField = req.query.filterField;
    const filterValue = req.query.filterValue;

    // Query logs based on parameters
    const result = await queryLogs(searchText, filterField, filterValue);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error querying logs:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the HTTP server
app.listen(port, () => {
  console.log(`Log Ingestor listening at http://localhost:${port}`);
});
