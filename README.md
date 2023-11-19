# Problem Statement

## Assignment

Log Ingestor and Query Interface

## Objective

Develop a log ingestor system that can efficiently handle vast volumes of log data, and offer a simple interface for querying this data using full-text search or specific field filters.

Both the systems (the log ingestor and the query interface) can be built using any programming language of your choice.

The logs should be ingested (in the log ingestor) over HTTP, on port `3000`.

> We will use a script to populate the logs into your system, so please ensure that the default port is set to the port mentioned above.

### Sample Log Data Format:

The logs to be ingested will be sent in this format.

{
"level": "error",
"message": "Failed to connect to DB",
"resourceId": "server-1234",
"timestamp": "2023-09-15T08:00:00Z",
"traceId": "abc-xyz-123",
"spanId": "span-456",
"commit": "5e5342f",
"metadata": {
"parentResourceId": "server-0987"
}
}

## Requirements

The requirements for the log ingestor and the query interface are specified below.

### Log Ingestor:

- Develop a mechanism to ingest logs in the provided format.
- Ensure scalability to handle high volumes of logs efficiently.
- Mitigate potential bottlenecks such as I/O operations, database write speeds, etc.
- Make sure that the logs are ingested via an HTTP server, which runs on port `3000` by default.

### Query Interface:

- Offer a user interface (Web UI or CLI) for full-text search across logs.
- Include filters based on:
  - level
  - message
  - resourceId
  - timestamp
  - traceId
  - spanId
  - commit
  - metadata.parentResourceId
- Aim for efficient and quick search results.

## Advanced Features (Bonus):

These features aren’t compulsory to implement, however, adding them might increase the chances of your submission being accepted.

- Implement search within specific date ranges.
- Utilize regular expressions for search.
- Allow combining multiple filters.
- Provide real-time log ingestion and searching capabilities.
- Implement role-based access to the query interface.

## Sample Queries

The following are some sample queries that will be executed for validation.

- Find all logs with the level set to "error".
- Search for logs with the message containing the term "Failed to connect".
- Retrieve all logs related to resourceId "server-1234".
- Filter logs between the timestamp "2023-09-10T00:00:00Z" and "2023-09-15T23:59:59Z". (Bonus)

## Evaluation Criteria:

Your submission will be evaluated based on the following criteria.

- Volume: The ability of your system to ingest massive volumes.
- Speed: Efficiency in returning search results.
- Scalability: Adaptability to increasing volumes of logs/queries.
- Usability: Intuitive, user-friendly interface.
- Advanced Features: Implementation of bonus functionalities.
- Readability: The cleanliness and structure of the codebase.

## Submission:

We’re accepting submissions through GitHub Classroom. Please visit the following link to join and create your submission: https://classroom.github.com/a/2sZOX9xt

Make sure to include the following things in your submission:

- The entire source code.
- A README showcasing how to run the project, the system design, a list of features implemented, and any identified issues present in the system.
- (Optional) Video or presentation showcasing the solution.

> Please ensure that you’ve also applied for the role on [our jobs portal](https://jobs.lever.co/dyte-io), or your submission **will not be evaluated**.

## Tips:

Here are a few tips for completing the specified task.

- Consider hybrid database solutions (relational + NoSQL) for a balance of structured data handling and efficient search capabilities.
- Database indexing and sharding might be beneficial for scalability and speed.
- Distributed systems or cloud-based solutions can ensure robust scalability.

# Solution:

## Running the Project (Setup)

Below are the steps to Spin up Elastic Search using docker.

`docker network create elastic`

`docker pull docker.elastic.co/elasticsearch/elasticsearch8.11.1`

`docker run --name es01 --net elastic -p 9200:9200 -it -m 1GB docker.elastic.co/elasticsearch/elasticsearch:8.11.1`

Make sure to copy the elasticsearch.yml from the root folder of this project into the `/usr/share/elasticsearch/config/elasticsearch.yml` of the docker container.

Now that the elastic search is up & running we can setup the node server to communicate with the elasticsearch service which will take care of parsing & ingesting the logs via the endpoints exposed.

Install dependencies using `npm install`

Start the application using `npm run start`

The app will start on port 3000.

> Add sample data into the Log Ingestion Endpoint (POST - http://localhost:3000/ingest):

```
curl -X POST -H "Content-Type: application/json" -d '{"logs": [{"message": "Log entry 1"}, {"message": "Log entry 2"}]}' http://localhost:3000/ingest
```

> Query Endpoint (GET - http://localhost:3000/query) (sample query):

Either trigger the query from a Web UI as such (haven't created a web ui surface)

> http://localhost:3000/query?searchText=Log&filterField=message&filterValue=entry

Or using the CLI as follows

```
curl -X GET "http://localhost:3000/query?searchText=Log&filterField=message&filterValue=entry"

```

## Design

Elasticsearch and Kibana form a potent duo for data storage and visualization, while Node.js empowers developers to build robust applications, and Docker offers an environment to seamlessly containerize and deploy them.
Together, these tools create an integrated ecosystem that enables us to log, store, analyze, and visualize the performance and behavior of our applications.

Elasticsearch’s distributed nature ensures data availability and scalability. It’s an ideal choice for indexing and querying log data generated by log injestor in the given application.

Scalability: As the application and data grow, Elasticsearch’s distributed architecture can scale horizontally to handle the increased load.

Search and Analysis: Elasticsearch’s powerful querying capabilities allow us to search and analyze the data with precision.

## Reference Docs:

> Install Elasticsearch with Docker
> https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html

> Setting the Elastic Search JS client:
> https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-connecting.html

> Bulk Indexing using the JS client:
> https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/bulk_examples.html

> Added a local elasticsearch.yml file that should be replaced in the docker elastic search config to disable the ssl features.
> https://www.elastic.co/guide/en/elasticsearch/reference/current/security-settings.html

> Query Endpoint (sample query):
> http://localhost:3000/query?searchText=Log&filterField=message&filterValue=entry

```
curl -X POST -H "Content-Type: application/json" -d '{
  "query": {
    "bool": {
      "must": [
        {"match": {"message": "Log"}}
      ]
    }
  }
}' http://localhost:9200/logs/_search

```

This step is not needed currently in development stage since all auth policies have been disabled but for production use cases this has to be taken care of.

> Generate Enrollment Token using
> https://stackoverflow.com/questions/71204472/how-can-i-generate-enrollment-token-for-elasticsearch-to-connect-with-kibana
> bin/elasticsearch-create-enrollment-token --scope kibana

## Note:

This is a basic setup for development purposes. In a production environment, we would need to add security measures, error handling, and potentially use environment variables for sensitive information.

Entry point to see all the data that got inserted into elastic search: (`logs` here represents the index_name in this case.)
http://localhost:9200/logs/_search?pretty
https://stackoverflow.com/questions/14565888/how-can-i-view-the-contents-of-an-elasticsearch-index
"# LogIngestor" 
"# LogIngestor" 
"# LogIngestor" 
"# LogIngestor" 
"# LogIngestor" 
"# LogIngestor" 
"# LogIngestor" 
"# LogIngestor" 
