document.addEventListener('DOMContentLoaded', async () => {

    const teamsGrid = document.getElementById('teams-grid');
    const categoryFilters = document.getElementById('category-filters');

    // Only execute if we are on the index page
    if (!teamsGrid || !categoryFilters) return;

    // We'll fetch the JSON files. Netlify CMS will output them as separate JSONs.
    // For a fully dynamic build, we would need a build step, but for vanilla JS
    // we can use a hardcoded list of slugs or an index file. We will assume we have 
    // a list of known team slugs. When you add new teams via CMS, you either run a small script
    // to build an index, or we fetch known ones. 

    let teamsList = [];
    let categoriesList = new Set();

    // Dinamik takım listesini çek (netlify build veya local node script ile oluşturulan)
    try {
        const listRes = await fetch('content/teamsList.json');
        if (listRes.ok) {
            const teamSlugs = await listRes.json();
            for (const slug of teamSlugs) {
                const res = await fetch(`content/teams/${slug}.json`);
                if (res.ok) {
                    const data = await res.json();
                    data.id = slug; // append ID for routing
                    teamsList.push(data);
                    categoriesList.add(data.category);
                }
            }
        } else {
            console.warn("teamsList.json bulunamadı, takımlar yüklenemiyor.");
        }
    } catch (err) {
        console.error("Takımlar yüklenirken hata oluştu:", err);
    }

    // 1. Render Categories dynamically
    categoriesList.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filter = category;
        btn.textContent = category;
        categoryFilters.appendChild(btn);
    });

    // 2. Render Team Cards
    function renderTeams(filter = 'all') {
        teamsGrid.innerHTML = '';

        const filteredTeams = filter === 'all'
            ? teamsList
            : teamsList.filter(t => t.category === filter);

        filteredTeams.forEach((team, index) => {
            const card = document.createElement('div');
            card.className = 'team-card';
            card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
            card.style.opacity = '0';

            card.innerHTML = `
                <div class="card-header">
                    <img src="${team.bannerImage}" alt="${team.name} Banner" class="card-banner" loading="lazy">
                </div>
                <img src="${team.profilePhoto}" alt="${team.name} Avatar" class="card-avatar" loading="lazy">
                <div class="card-body">
                    <span class="card-category">${team.category}</span>
                    <h3 class="card-title">${team.name}</h3>
                    <p class="card-desc">${team.shortDescription}</p>
                    <div class="card-footer">
                        <div class="view-team-btn">Takımı İncele <i class="fa-solid fa-arrow-right"></i></div>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                window.location.href = `team.html?id=${team.id}`;
            });

            teamsGrid.appendChild(card);
        });
    }

    // Initial render
    renderTeams();

    // 3. Filter Event Listeners
    categoryFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderTeams(e.target.dataset.filter);
        }
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
