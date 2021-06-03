
const CLIENT_ID = '331674287595-boi6247dnl01oa35gn3ft19vl30e6fud.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/contacts.readonly";
const apiKey = 'AIzaSyBkysyvmBh-p-af6Xo7YkbxLKENWphhgjc';
const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content')
const channelForm = document.getElementById('channel-form')
const channelInput = document.getElementById('channel-input')
const videoContainer = document.getElementById('video-container')
const getData = document.getElementById('get-channel-data');

//Options
/**
const defaultChannel = 'techwebguy'
//Load auth2 Library
function handleClientLoad(){
    gapi.load('client:auth2', initClient);
}

//Init API Client library and set up sign in listeners

function initClient(){
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(() => {        
        //Listen for sign in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)
        // Handle initial sign in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    })
}

// Update UI Signin state changes
function updateSigninStatus(isSignedIn){
    if(isSignedIn){
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
        videoContainer.style.display - 'block';
        // getChannel(defaultChannel);
        getChannel(defaultChannel);
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
        videoContainer.style.display - 'none';
    }
}


// Handle Login

function handleAuthClick(){
    gapi.auth2.getAuthInstance().signIn();
}

//Handle Log out
function handleSignoutClick(){
    gapi.auth2.getAuthInstance().signOut();
}


//Get channel from API
function getChannel(channel){
    console.log("Heyyyyy");
    return gapi.client.youtube.channels.list({
        part: 'snippet,contentDetails,statistics',
        forUsername: channel
    })
    .then(function(response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
      },
      function(err) { console.error("Execute error", err); });
}
**/


// const defaultChan = "UC29ju8bIPH5as8OGnQzwJyA";
const defaultChan = "UC29ju8bIPH5as8OGnQzwJyA";
function handleClientLoad(){
    gapi.load("client:auth2", function() {
        gapi.auth2.init({client_id: CLIENT_ID});
      });
}

  function authenticate() {
     return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        .then(function() { 
            console.log("Sign-in successful"); 
           
        },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    gapi.client.setApiKey(apiKey);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API", gapi);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());},
              function(err) { console.error("Error loading GAPI client for API", err); });
  }

  function updateSigninStatus(isSignedIn){
    if(isSignedIn){
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
        videoContainer.style.display - 'block';
        
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
        videoContainer.style.display - 'none';
    }
  }

  // Display Channel Data

  function showChannelData(data){
    const channelData = document.getElementById('channel-data');
    channelData.innerHTML = data
  }

  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute(channel) {
    return gapi.client.youtube.channels.list({
        "part": [
            "snippet,contentDetails,statistics"
          ],
          "id": [
            channel
          ]
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response.result);
                if(response.result.items){
                    const channel = response.result.items[0];

                    const output = `
                        <ul class="collection">
                            <li class="collection-item">Title: ${channel.snippet.title}</li>
                            <li class="collection-item">ID: ${channel.id}</li>
                            <li class="collection-item">Subscribers: 
                            ${numberWithCommas(channel.statistics.subscriberCount)}</li>
                            <li class="collection-item">Views: 
                            ${numberWithCommas(channel.statistics.viewCount)}</li>
                            <li class="collection-item">Videos: 
                            ${numberWithCommas(channel.statistics.videoCount)}</li>
                        </ul>
                        <p>${channel.snippet.description}</p>
                        <hr>
                        <a class="btn grey darken-2" target="_blank" href="https://youtube.com/${channel.snippet.customUrl}">Visit Channel</a>
                    `;
                    showChannelData(output);

                    const playlistId = channel.contentDetails.relatedPlaylists.uploads;
                    requestVideoPlaylist(playlistId);

                } else {
                    alert('No channel by that ID')
                }
                
              },
              function(err) { console.error("Execute error", err);});
  }
  

authorizeButton.addEventListener('click', function(){
authenticate().then(loadClient)
})
channelForm.addEventListener('submit', function(e){
    e.preventDefault();
    const channel = channelInput.value;
execute(channel)
})

signoutButton.onclick = handleSignoutClick;


//Handle Log out
function handleSignoutClick(){
    gapi.auth2.getAuthInstance().signOut();
}


function requestVideoPlaylist(playlistId) {
    const requestOptions = {
        playlistId: playlistId,
        part: 'snippet',
        maxResults: 12
    }

    const request = gapi.client.youtube.playlistItems.list(requestOptions);

    request.execute(response => {
        console.log(response);
        const playListItems = response.result.items;
        if(playListItems){
            let output = '<br><h4 class="center-align">Latest Videos</h4>';

            playListItems.forEach(item => {
                const videoId = item.snippet.resourceId.videoId;
                output += `
                    <div class="col s3">
                    <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                `;

            });

            //Output Videos
            videoContainer.innerHTML = output;
        } else {
            videoContainer.innerHTML = "<h4>There is no uploaded videos!</h4>"
        }
    })
    // console.log(gapi.client)
}


function numberWithCommas(x) {
    return x 
}

