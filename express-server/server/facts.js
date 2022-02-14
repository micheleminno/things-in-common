const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: process.env.ELASTICSEARCH_URL });

const OK = 200;
const NOK = 404;

function handleClientResponse(error, data, okMsg, nokMsg, res) {

  if (error) {

    console.error(error);
    res.status(NOK).json({nokMsg: error})
  } else {

    console.log(data);

    refreshIndexes(res, okMsg);
  }
}

function refreshIndexes(res, msg) {

  client.indices.refresh(function(error, data) {

    if (error) {

      console.error(error);
      res.status(NOK).json({"error refreshing": error})

    } else {

      res.status(OK).json({msg: true});
    }
  });
}

exports.add = function(req, res) {

  const name = req.query.name;
  const nameWithoutInnerSpaces = name.replace(/ /g, "-");

  console.log("Adding new fact: " + nameWithoutInnerSpaces);

  const query = req.query.query;

  const docToIndex = {

    index: 'real-affinities',
    type: 'thing',
    id: nameWithoutInnerSpaces,
    body: {
      name: name,
      query: query,
      is_fact: true
    }
  };

  client.index(docToIndex, function(error, data) {
    handleClientResponse(error, data, "fact added", "error adding new fact", res);
  });
};

exports.remove = function(req, res) {

  const name = req.query.name;
  const nameWithoutInnerSpaces = name.replace(/ /g, "-");

  console.log("Removing fact: " + nameWithoutInnerSpaces);

  const query = {
    index: 'real-affinities',
    body: {
      query: {
        bool: {
          must: {
            ids: {
              type: 'thing',
              values: [nameWithoutInnerSpaces]
            }
          },
          filter: {
            exists: {
              field: 'is_fact'
            }
          }
        }
      }
    }
  };

  client.deleteByQuery(query, function(error, data) {
    handleClientResponse(error, data, "fact " + name + " deleted", "error deleting fact " + name, res);
  });
};

exports.removeAll = function(req, res) {

  console.log("Removing all facts");

  const query = {
    index: 'real-affinities',
    body: {
      query: {
        bool: {
          must: {
            match_all: {}
          },
          filter: {
            exists: {
              field: "is_fact"
            }
          }
        }
      }
    }
  };

  client.deleteByQuery(query, function(error, data) {
    handleClientResponse(error, data, "all facts deleted", "error deleting all facts", res);
  });
};

exports.update = function(req, res) {

  const text = req.query.text;

  const name = req.query.name;
  const nameWithoutInnerSpaces = name.replace(/ /g, "-");

  console.log("Updating fact: " + nameWithoutInnerSpaces);

  const params = {

    index: 'real-affinities',
    type: 'thing',
    id: nameWithoutInnerSpaces,
    body: {

      doc: {
        content: text
      }
    }
  };

  client.update(params, function(error, data) {
    handleClientResponse(error, data, "fact " + name + " updated", "error updating fact " + name, res);
  });
};

exports.list = function(req, res) {

  const withContent = req.query.withContent;

  console.log("Getting all facts");

  const query = {
    index: 'real-affinities',
    body: {
      query: {
        bool: {
          must: {
            match_all: {}
          },
          filter: {
            exists: {
              field: "is_fact"
            }
          }
        }
      }
    }
  };

  client.search(query, function(error, data) {

    data = data.body;
    let facts = [];

    if(error) {

      console.error(error);

    } else {

        console.log(data);

        if ( typeof data.hits !== 'undefined' && data.hits &&
             typeof data.hits.hits !== 'undefined' && data.hits.hits) {

           const numberOfFacts = data.hits.hits.length;
           console.log(numberOfFacts + " facts retrieved from ES");

           for (let hitIndex in data.hits.hits) {

             const fact = data.hits.hits[hitIndex]["_source"];
             if (withContent && fact.content || !withContent) {

               facts.push(fact);
             }
           }
        } else {

            console.log("Data hits missing");
        }
    }

    console.log("Found " + facts.length + " facts");
    res.status(OK).json({
      facts : facts
    });
  });
};

exports.getMatchingThings = function(req, res) {

  const fact = req.query.factName;

  const nameWithoutInnerSpaces = fact.replace(/ /g, "-");

  console.log("Getting things matching with fact: " + nameWithoutInnerSpaces);

  const query = {
    index: 'real-affinities',
    body: {
      query: {
        more_like_this: {
          like: [
            {
              _type: 'thing',
              _id: nameWithoutInnerSpaces
            }
          ],
          fields: ['content'],
          min_term_freq: 1,
          min_doc_freq: 1
        }
      }
    }
  };

  client.search(query, function(error, data) {

    data = data.body;
    let things = [];

    if(error) {

      console.error(error);

    } else {

        console.log(data);

        if ( typeof data.hits !== 'undefined' && data.hits &&
             typeof data.hits.hits !== 'undefined' && data.hits.hits) {

           const numberOfThings = data.hits.hits.length;
           console.log(numberOfThings + " things retrieved from ES");

           for (let hitIndex in data.hits.hits) {

             const thing = data.hits.hits[hitIndex]["_source"];

             things.push(thing);
           }
        } else {

            console.log("Data hits missing");
        }
    }

    console.log("Found " + things.length + " matching things");

    res.status(OK).json({
      things : things
    });
  });
};
