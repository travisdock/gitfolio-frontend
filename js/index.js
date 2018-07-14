const store = {
  users: [],
  repositories: []
};

function init() {
  User.renderUsers()
  renderStyles()
}

function clipBoard(e) {
  let codeText = document.querySelector(`#${e.target.id}-code-hidden`);
  codeText.select();
  
  try { //it's good practice to put execCommands in try catch blocks
  document.execCommand('copy');
  } catch (err) {
    window.alert('Oops, unable to copy');
  }
  
}

function renderStyles() {
  document.querySelector("#css-code").innerText = `.card {
                background: white;
                color: black;
                margin: 1rem auto;
                display: flex;
                }
                .card-img {
                  height: 10rem;
                  background: black;
                  display: block;
                }
                .card-body {
                  margin: 1rem;
                }
                #github-name {
                }
                #github-title {
                }
                .repo-name {
                }
                .repo-link {
                }
                .repo-langs {
                }`
    document.querySelector("#sass-code").innerText = `.card {
                background: white;
                color: black;
                margin: 1rem auto;
                display: flex;
                .card-img {
                  height: 10rem;
                  background: black;
                  display: block;
                }
                .card-body {
                  margin: 1rem;
                  #github-name {
                  }
                  #github-title {
                  }
                  .repo-name {
                  }
                  .repo-link {
                  }
                  .repo-langs {
                  }
                }
              }`
}

function cleanStore(array, element) {
  return array.filter(e => e.userId !== element);
}

function renderTemplateWithPreview(user) {
  Adapter.getPreview(user.username).then(obj => {
    user.preview = obj
  })
  .then(resp => {
    Repository.renderTemplateStr(user.repositories(), user)
  })
}

function findOrCreateUser(username, repos) {
  if (User.findByUsername(username)) {
    return User.findByUsername(username)
  } else {
    return new User({"username": username, "id": repos[0].user_id}, store).renderSelf()
  }
}

function checkThenRender(repos, username) {
  const previewEl = document.querySelector("#preview-code");
  let user;

  if (repos.length > 0) {
    user = findOrCreateUser(username, repos)
    repos.map(repo => new Repository(repo, store)) // make the repos from DB into memory repos
    renderTemplateWithPreview(user)
  } else {
    htmlEl.innerText = "INVALID INPUT. CHECK PINNED REPOSITORIES OR GITHUB USERNAME."
    previewEl.innerText = "INVALID INPUT. CHECK PINNED REPOSITORIES OR GITHUB USERNAME."
  }   
}

function handleClick(e){
  if (e.target.className === "user") {
    let username = e.target.textContent
    Adapter.findUserRepos(username)
    .then(repos => {
      user = User.findByUsername(username)
      renderTemplateWithPreview(user)
    })
  } else if (e.target.id === "refresh") {
    let buttonEl = e.target.dataset.username
    username = buttonEl,
    user = User.findByUsername(username);
    if (buttonEl !== "none") {
      Adapter.createUserAndRepos(username)
      .then(repos => {
        user = User.findByUsername(username)
        store.repositories = cleanStore(store.repositories, user.id)
        repos.map(repo => new Repository(repo, store)) // make the repos from DB into memory repos
        Repository.renderTemplateStr(user.repositories(), user) // now we can access them by searching our store
      })
    } 
  } else if (e.target.className === "copy-button") {
    clipBoard(e)
  }
}

function handleSubmit(e){
  let inputEl = document.querySelector("#username-input"),
  username = inputEl.value.trim().toLowerCase(), regex = /\s/;
  
  if (!regex.test(RegExp(username)) &&  username.length !== 0) {
    const htmlEl = document.querySelector("#html-code")
    htmlEl.innerText = "Loading template..."
    
    Adapter.createUserAndRepos(username)
      .then(repos => { checkThenRender(repos, username)})
  } else {
      alert("Spaces are not allowed")
  } 
  
  e.preventDefault()
  inputEl.value = ''
}

document.addEventListener('DOMContentLoaded', init)
document.addEventListener("submit", handleSubmit)
document.addEventListener("click", handleClick)