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

async function fetchUser(username){
    const response = await fetch(`https://api.github.com/users/${username}`);
    if(!response.ok) throw new Error('User not found');
    console.log(response.json());
    
    return response.json();
}

async function fetchRepos(username){
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`);
    if(!response.ok) throw new Error('Could not fetch repos');
    console.log(response.json());

    return response.json();
}

