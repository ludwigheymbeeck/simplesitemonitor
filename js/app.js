// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

const urls = [
  'https://zambati.com',
  'https://eu.planetva.net',
  'https://us.planetva.net/upordown.php',
  'https://eyesmart.com.au/upordown.php',
  'https://planetva.com/upordown.php'
]

function getDomain(url, subdomain) {
    subdomain = subdomain || false;

    url = url.replace(/(https?:\/\/)?(www.)?/i, '');

    if (!subdomain) {
        url = url.split('.');

        url = url.slice(url.length - 2).join('.');
    }

    if (url.indexOf('/') !== -1) {
        return url.split('/')[0];
    }

    return url;
}

function checkSites() {
  var sendDate = (new Date()).getTime();
  Promise.all(urls.map(url =>
    fetch(url + '?' + (new Date()).getTime()) // we need extra 'new Date().getTime()' in order to avoid caching...
      // .then(checkStatus)
      .then(response => {
        if (response.ok) {
          document.getElementById('monitoroutput').innerHTML += getDomain(response.url, true) + ' - <b>UP</b>';// + ' - status: ' + response.status + ' - ' + response.ok + '<br><br>'
          var receiveDate = (new Date()).getTime();
          var responseTimeMs = receiveDate - sendDate;
          document.getElementById('monitoroutput').innerHTML += ' - response time : ' + responseTimeMs + ' ms<br>'
          return Promise.resolve(response);
        } else {
          document.getElementById('monitoroutput').innerHTML += getDomain(response.url, true) + ' - <b>DOWN</b>' + ' - status: ' + response.status + ' - ' + response.ok + '<br>'
          return Promise.reject(new Error(response.statusText));
        }
      })             
      .catch(error => console.log('There was a problem!', error))
  ))
  .then(function(values) {
    // console.log(values);
    document.getElementById('monitoroutput').innerHTML += '<hr><i>Last Update: ' + Date().toString() + '</i>';
  });
}

function timeout() {
    setTimeout(function () {
        // Do Something Here
        document.getElementById('monitoroutput').innerHTML = '' // clear output
        checkSites();
        // document.getElementById('monitoroutput').innerHTML += '<br><hr><i>Last Update: ' + Date().toString() + '</i><hr><br>';
        // Then recall the parent function to
        // create a recursive loop. (every 60 sec)
        timeout();
    }, 60000);
}

checkSites();
// document.getElementById('monitoroutput').innerHTML += '<br><hr><i>Last Update: ' + Date().toString() + '</i><hr><br>';
timeout();