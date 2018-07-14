 console.log("repo");

class Repository {
  constructor({id, name, url, languages, user_id}, store) {
    this.id = id
    this.name = name
    this.url = url
    this.languages = languages
    this.userId = user_id
    if (!store.repositories.find(repo => repo.url === this.url)) {
      store.repositories.push(this)
    }
  }

    // TODO Make this id always start at one for user
  htmlTemp(id) {
    return `
      <div class="card repo" id="repo-${id}">
        <div class="card-body">
          <h3 class="repo-name">${this.name}</h3>
          <a class="repo-link" href="${this.url}" target="_blank">Go to project</a>
          <p class="repo-link" >${this.languages}</p>
        </div>
      </div>
    `
  }

  static renderTemplateStr(repos, user) {
    let str = `<div class="card">
                <img class="card-img" src="${user.preview.image}" alt="A photo of ${user.username}">
                <div class="card-body">
                  <p id="github-name">${user.preview.title}</p>
                  <a id="github-profile" href="${user.preview.url}" target="_blank">GitHub Profile</a>
                </div>
              </div>

              <div class="repos">`,
      htmlCodeEl = document.querySelector("#html-code"),
      htmlCodeInput = document.querySelector("#html-code-hidden"),
      htmlCodePreview = document.querySelector("#preview-code");
    htmlCodeEl.innerText = "";
    let id = 0
    repos.forEach(repo => {
      str += repo.htmlTemp(++id)
    })
    str += "</div>"
    htmlCodeEl.innerText = str
    htmlCodeInput.value = str
    htmlCodePreview.innerHTML = str
    let refresh = document.querySelector("#refresh")


    refresh.dataset.username = user.username

  }
}
