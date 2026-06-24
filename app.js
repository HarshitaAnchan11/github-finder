const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const profileCard = document.getElementById('profileCard');
const reposSection = document.getElementById('reposSection');
const errorMsg = document.getElementById('errorMsg');

//--Event listeners--
searchBtn.addEventListener('click', handleSearch);

//allow pressing enter to search
searchInput.addEventListener('keypress', (e) => {
    if(e.key == 'Enter') handleSearch();
});

//main function
async function handleSearch(){
    const username = searchInput.value.trim();
    if(!username) return;

    hideAll();
    searchBtn.textContent = 'Loading...';
    searchBtn.disabled = true;

    try {
        const userData = await fetchUser(username);
        displayProfile(userData);

        const reposData = await fetchRepos(username);
        displayRepos(reposData);

    } catch(error) {
        showError();
    } finally {
        searchBtn.textContent = '🔍︎';
        searchBtn.disabled = false;
    }
}

async function fetchUser(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  console.log('Status:', response.status);      // ADD THIS
  console.log('OK?:', response.ok);             // ADD THIS
  if (!response.ok) throw new Error('User not found');
  return response.json();
}

async function fetchRepos(username){
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`);
    if(!response.ok) throw new Error('Could not fetch repos');
    console.log(response.json());

    return response.json();
}

function displayProfile(user){
    document.getElementById('avatar').src = user.avatar_url;
    document.getElementById('name').textContent = user.name || user.login;
    document.getElementById('username').textContent = `@${user.login}`;
    document.getElementById('bio').textContent = user.bio || 'No bio available';
    document.getElementById('repos').textContent = `Repos: ${user.public_repos}`;
    document.getElementById('followers').textContent = `👥 Followers: ${user.followers}`;
    document.getElementById('following').textContent = `➕ Following: ${user.following}`;
    document.getElementById('profileLink').href = user.html_url;

    profileCard.classList.remove('hidden');
}

function displayRepos(repos) {
    const reposList = document.getElementById('reposList');
    reposList.innerHTML = '';

    if(repos.length == 0){
        reposList.innerHTML = '<p> NO public repositories found.</p>';
    } else {
        repos.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.classList.add('repo-card');
            repoCard.innerHTML =`
            <a href = "${repo.html_url}" target ="_blank">${repo.name}</a>
            <p>${repo.description || 'No description'}</p>
            <div class="repo-meta">
                <span>⭐ ${repo.stargazers_count}</span>
                <span>🍴 ${repo.forks_count}</span>
                <span>💻 ${repo.language || 'N/A'}</span>
            </div>
            `;
            reposList.appendChild(repoCard);
        
        });
    }
    reposSection.classList.remove('hidden');
}

function hideAll(){
    profileCard.classList.add('hidden');
    reposSection.classList.add('hidden');
    errorMsg.classList.add('hidden');
}

function showError(){
    errorMsg.classList.remove('hidden');
}

