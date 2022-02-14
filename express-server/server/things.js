const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: process.env.ELASTICSEARCH_URL });

const OK = 200;
const NOK = 404;

exports.index = function(req, res) {

  const thingParam = req.body;
  console.log("Indexing thing: " + thingParam);

  const thing = JSON.parse(thingParam);

  var content = "";
  var contentDates = [];
  for ( var tweetIndex in thing.tweets) {

    content += thing.tweets[tweetIndex].text + " ";
    contentDates.push(thing.tweets[tweetIndex].created_at);
  }

  const docToIndex = {

    index : 'real-affinities',
    type : 'thing',
    id : thing.id,
    body : {
      screen_name : thing.name,
      name : thing.name,
      location : thing.location,
      url : thing.url,
      thing_image_url : thing.thing_image_url,
      verified : thing.verified,
      description : thing.description,
      statuses_count : thing.statuses_count,
      followers_count : thing.followers_count,
      friends_count : thing.friends_count,
      content : content,
      contentDates : contentDates
    }
  };

  client.index(docToIndex, function(error, data) {
    handleClientResponse(error, data, "thing indexed", "error indexing new thing", res);
  });
};

exports.load = function(req, res) {

    const userIds = req.query.ids;

    console.log("Loading things with ids: " + userIds);

		var query = {
			index : 'real-affinities',
			body : {
				query : {
					ids : {
						type : "thing",
						values : userIds
					}
				}
			}
		};

		client.search(query, function (error, data) {

      data = data.body;
      var things = [];

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

      console.log(things.length + " things loaded");
      res.status(OK).json({
        things : things
      });
		});
};

this.matching = function(fact) {

  fact = fact.replace(" ", "-");
  console.log("Searching for things matching with fact: " + fact);

  var query = {
    index : 'real-affinities',
    body : {
      query : {
        more_like_this : {
          like : [
          {
            _type : 'thing',
            _id : fact
          }],
          fields : ['content'],
          min_term_freq : 1,
          min_doc_freq : 1
        }
      }
    }
  };

  client.search(query, function(error, data) {

    data = data.body;
    var things = [];

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

    console.log(things.length + " things loaded");
    res.status(OK).json({
      things : things
    });
  });
};
