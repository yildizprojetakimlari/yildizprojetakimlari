document.addEventListener('DOMContentLoaded', async () => {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const teamId = getQueryParam('id');
    const errorState = document.getElementById('error-state');
    const contentState = document.getElementById('team-content');

    if (!teamId) {
        errorState.style.display = 'block';
        return;
    }

    try {
        // Fetch specific team json dynamically
        const res = await fetch(`content/teams/${teamId}.json`);

        if (!res.ok) {
            throw new Error("Takım JSON dosyası bulunamadı.");
        }

        const team = await res.json();

        // Show content
        contentState.style.animation = 'fadeInUp 0.8s ease forwards';
        contentState.style.display = 'block';

        // Update Document Title
        document.title = `${team.name} - Yıldız Proje Takımları`;

        // Populate Hero
        document.getElementById('team-banner').src = team.bannerImage || '';
        document.getElementById('team-avatar').src = team.profilePhoto || '';
        document.getElementById('team-category').textContent = team.category || 'Belirtilmedi';
        document.getElementById('team-name').textContent = team.name || 'İsimsiz Takım';

        // Populate Main Content
        document.getElementById('team-full-desc').textContent = team.fullDescription || team.shortDescription;

        // Populate Hero Website
        const heroWebsiteEl = document.getElementById('team-website-hero');
        const heroWebsiteText = document.getElementById('team-website-text');

        if (team.socialLinks && team.socialLinks.website) {
            heroWebsiteEl.href = team.socialLinks.website;
            // Extract display domain for prettier look
            try {
                const urlObj = new URL(team.socialLinks.website);
                heroWebsiteText.textContent = urlObj.hostname.replace('www.', '');
            } catch (e) {
                heroWebsiteText.textContent = "Web Sitesini Ziyaret Et";
            }
            heroWebsiteEl.style.display = 'inline-flex';
        }

        // Populate Sidebar
        const locationEl = document.getElementById('team-location');
        if (team.location) {
            locationEl.textContent = team.location;
        } else {
            locationEl.closest('li').style.display = 'none';
        }
        const emailEl = document.getElementById('team-email');
        if (team.contactEmail) {
            emailEl.textContent = team.contactEmail;
            emailEl.href = `mailto:${team.contactEmail}`;
        } else {
            emailEl.closest('li').style.display = 'none';
        }

        const phoneEl = document.getElementById('team-phone');
        if (team.phone) {
            phoneEl.textContent = team.phone;
            phoneEl.href = `tel:${team.phone.replace(/\s+/g, '')}`;
        } else {
            phoneEl.closest('li').style.display = 'none';
        }

        const socialsContainer = document.getElementById('team-socials');
        const iconMap = {
            instagram: 'fa-instagram',
            linkedin: 'fa-linkedin',
            twitter: 'fa-x-twitter',
            youtube: 'fa-youtube',
            github: 'fa-github',
            website: 'fa-globe'
        };

        if (team.socialLinks) {
            for (const [platform, url] of Object.entries(team.socialLinks)) {
                if (!url) continue; // skip empty links
                const iconClass = iconMap[platform] || 'fa-link';
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                const isBrand = platform !== 'website';
                a.innerHTML = `<i class="${isBrand ? 'fa-brands' : 'fa-solid'} ${iconClass}"></i>`;
                socialsContainer.appendChild(a);
            }
        }

        // Populate Gallery
        const galleryContainer = document.getElementById('team-gallery');
        if (team.galleryPhotos && team.galleryPhotos.length > 0) {
            team.galleryPhotos.forEach(photoUrl => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `<img src="${photoUrl}" alt="Galeri Fotoğrafı" loading="lazy">`;
                galleryContainer.appendChild(item);
            });
        } else {
            galleryContainer.parentElement.style.display = 'none';
        }

    } catch (err) {
        console.error(err);
        errorState.style.display = 'block';
    }
});
