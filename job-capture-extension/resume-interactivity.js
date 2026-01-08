// Resume Interactivity Script
// This runs in the resume-template.html page

// Track which experiences are currently shown and which have been deleted
let shownExperienceIndices = [];
let deletedExperienceIndices = new Set(); // Track permanently deleted experiences
let allExperiences = [];
let resumeData = null;

// Initialize on load
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Get resume data from chrome.storage.local
        const result = await chrome.storage.local.get(['resumeData']);
        resumeData = result.resumeData;

        if (!resumeData) {
            document.getElementById('loading-state').innerHTML = `
                <p style="color: #dc2626;">No resume data found. Please generate from the extension.</p>
            `;
            return;
        }

        // Store all experiences
        allExperiences = resumeData.experiences || [];

        // Initialize shown indices (first 4)
        shownExperienceIndices = allExperiences.slice(0, 4).map((_, i) => i);

        // Render the resume
        renderResume();

        // Show the resume container
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('resume-container').style.display = 'block';

        // Update toolbar title
        document.getElementById('toolbar-title').textContent =
            `Resume for: ${resumeData.targetJobTitle} at ${resumeData.targetCompany}`;

        // Update page title
        document.title = `${resumeData.profile.name} - Resume for ${resumeData.targetJobTitle}`;

        console.log('Resume loaded with', allExperiences.length, 'experiences');

    } catch (error) {
        console.error('Failed to load resume data:', error);
        document.getElementById('loading-state').innerHTML = `
            <p style="color: #dc2626;">Error loading resume: ${error.message}</p>
        `;
    }
});

// Render the full resume
function renderResume() {
    const profile = resumeData.profile;
    const topExperiences = shownExperienceIndices.map(i => allExperiences[i]).filter(Boolean);

    const html = `
        <div class="header">
            <div class="name" contenteditable="true">${profile.name}</div>
            <div class="tagline" contenteditable="true">${profile.tagline}</div>
            <div class="contact-row">
                <span contenteditable="true">${profile.location}</span>
                <span contenteditable="true">${profile.phone}</span>
                <span contenteditable="true">${profile.email}</span>
                <span contenteditable="true">${profile.linkedin}</span>
            </div>
        </div>

        <div class="summary">
            <p contenteditable="true">${profile.summary}</p>
        </div>

        <div class="section" id="experience-section">
            <div class="section-title">Professional Experience</div>
            ${topExperiences.map((exp, displayIndex) => renderExperienceItem(exp, shownExperienceIndices[displayIndex])).join('')}
        </div>

        <div class="section">
            <div class="section-title">Key Achievements</div>
            <div class="achievements">
                ${profile.achievements.slice(0, 6).map(a => `
                <div class="achievement-item bullet-container">
                    <button class="delete-bullet no-print">×</button>
                    <span contenteditable="true">${a}</span>
                </div>`).join('')}
            </div>
        </div>

        <div class="section">
            <div class="section-title">Skills & Expertise</div>
            <div class="skills-grid">
                ${Object.entries(profile.skills).map(([category, skillList]) => `
                <div class="skill-category">
                    <div class="skill-category-title" contenteditable="true">${category}</div>
                    <div class="skill-list" contenteditable="true">${skillList.slice(0, 4).join(' • ')}</div>
                </div>
                `).join('')}
            </div>
        </div>

        <div class="section">
            <div class="section-title">Education</div>
            ${profile.education.map(edu => `
            <div class="education-item">
                <div>
                    <span class="edu-degree" contenteditable="true">${edu.degree}</span>
                    <span class="edu-school" contenteditable="true"> — ${edu.school}</span>
                    ${edu.details ? `<div class="edu-details" contenteditable="true">${edu.details}</div>` : ''}
                </div>
                <div class="exp-meta" contenteditable="true">${edu.year}</div>
            </div>
            `).join('')}
        </div>
    `;

    document.getElementById('resume-content').innerHTML = html;
}

// Render a single experience item
function renderExperienceItem(exp, dataIndex) {
    const highlightsHTML = exp.highlights.slice(0, 4).map(h => `
        <li class="bullet-container">
            <button class="delete-bullet no-print">×</button>
            <span contenteditable="true">${h}</span>
        </li>
    `).join('');

    return `
        <div class="experience-item" data-exp-index="${dataIndex}">
            <button class="delete-experience no-print" data-index="${dataIndex}">✕ Remove</button>
            <div class="exp-header">
                <div>
                    <div class="exp-title" contenteditable="true">${exp.role}</div>
                    <div class="exp-company" contenteditable="true">${exp.company}</div>
                </div>
                <div class="exp-meta">
                    <div contenteditable="true">${exp.period}</div>
                    <div class="exp-location" contenteditable="true">${exp.location}</div>
                </div>
            </div>
            <ul class="exp-highlights">${highlightsHTML}</ul>
        </div>
    `;
}

// Event delegation for all clicks
document.addEventListener('click', function(e) {
    // Handle delete experience button
    if (e.target.classList.contains('delete-experience')) {
        e.preventDefault();
        const expItem = e.target.closest('.experience-item');
        const index = parseInt(e.target.dataset.index);
        deleteExperience(expItem, index);
        return;
    }

    // Handle delete bullet button
    if (e.target.classList.contains('delete-bullet')) {
        e.preventDefault();
        e.target.closest('.bullet-container').remove();
        return;
    }

    // Handle add bullet button
    if (e.target.id === 'add-bullet-btn' || e.target.closest('#add-bullet-btn')) {
        e.preventDefault();
        addBullet();
        return;
    }

    // Handle print button
    if (e.target.id === 'print-btn' || e.target.closest('#print-btn')) {
        e.preventDefault();
        window.print();
        return;
    }
});

// Delete experience and pull up next one
function deleteExperience(element, index) {
    console.log('=== DELETE EXPERIENCE ===');
    console.log('Deleting experience at index:', index, '(' + (allExperiences[index]?.company || 'unknown') + ')');
    console.log('Currently shown indices:', [...shownExperienceIndices]);
    console.log('Already deleted indices:', [...deletedExperienceIndices]);
    console.log('Total experiences available:', allExperiences.length);

    // Mark this experience as permanently deleted (won't be added back)
    deletedExperienceIndices.add(index);
    console.log('Marked as deleted:', index);

    // Remove from shown indices
    const positionInShown = shownExperienceIndices.indexOf(index);
    if (positionInShown > -1) {
        shownExperienceIndices.splice(positionInShown, 1);
        console.log('Removed from shown, new shown indices:', [...shownExperienceIndices]);
    }

    // Remove the element from DOM
    element.remove();
    console.log('Element removed from DOM');

    // Find next available experience to add (not shown AND not deleted)
    const nextIndex = findNextAvailableExperience();
    console.log('Next available experience index:', nextIndex);

    if (nextIndex !== -1) {
        const nextExp = allExperiences[nextIndex];
        console.log('Will add experience:', nextExp?.company || 'unknown');
        addExperienceToEnd(nextIndex);
        shownExperienceIndices.push(nextIndex);
        console.log('Updated shown indices:', [...shownExperienceIndices]);
    } else {
        console.log('No more experiences available to add');
    }
}

// Find next experience that isn't already shown AND hasn't been deleted
function findNextAvailableExperience() {
    for (let i = 0; i < allExperiences.length; i++) {
        // Skip if already shown or was deleted
        if (shownExperienceIndices.includes(i) || deletedExperienceIndices.has(i)) {
            continue;
        }
        console.log('Found available experience at index:', i, '(' + allExperiences[i]?.company + ')');
        return i;
    }
    return -1;
}

// Add an experience to the end of the section
function addExperienceToEnd(index) {
    const exp = allExperiences[index];
    if (!exp) {
        console.log('No experience found at index:', index);
        return;
    }

    console.log('Adding experience:', exp.company, 'at index:', index);

    const section = document.getElementById('experience-section');
    if (!section) {
        console.error('Experience section not found!');
        return;
    }

    // Create the new experience element
    const temp = document.createElement('div');
    temp.innerHTML = renderExperienceItem(exp, index);
    const newExpElement = temp.firstElementChild;

    if (newExpElement) {
        section.appendChild(newExpElement);
        console.log('Successfully added:', exp.company);
    } else {
        console.error('Failed to create experience element');
    }
}

// Add new bullet point to first experience
function addBullet() {
    const firstExp = document.querySelector('.exp-highlights');
    if (firstExp) {
        const li = document.createElement('li');
        li.className = 'bullet-container';
        li.innerHTML = '<button class="delete-bullet no-print">×</button><span contenteditable="true">New achievement - click to edit</span>';
        firstExp.appendChild(li);
        li.querySelector('span').focus();
    }
}

// Prevent losing edits when printing
window.onbeforeprint = function() {
    document.querySelectorAll('[contenteditable]').forEach(function(el) {
        el.blur();
    });
};
