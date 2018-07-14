const url = "http://localhost:3000/users"

const linkPreviewAPI = "https://api.linkpreview.net/?key=5b2a325bda205eafd3244c6ce9ed78d27d31f04c06ffc&q="
class Adapter {

    static getPreview(username) {
        return fetch(linkPreviewAPI + encodeURIComponent(`https://github.com/${username}`))
            .then(resp => resp.json())
    }

    static getUsers() {
        return fetch(url)
            .then(resp => resp.json())
    }

    static createUserAndRepos(name) {
        // Default options are marked with *
     let data = {user: {username: name}, refresh: true} 
        return fetch(url, {
            body: JSON.stringify(data), // must match 'Content-Type' header
            headers: {
            'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
        })
        .then(response => response.json()) // parses response to JSON
    }

    static findUserRepos(name) {
        // Default options are marked with *
      let data = {user: {username: name}, refresh: false}
        return fetch(url, {
            body: JSON.stringify(data), // must match 'Content-Type' header
            headers: {
            'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
        })
        .then(response => response.json()) // parses response to JSON
    }

}
