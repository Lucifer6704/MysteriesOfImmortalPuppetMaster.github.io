// script.js

// Scroll to the bottom of the page
function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

// Toggle Synopsis visibility
function toggleSynopsis() {
    const synopsisSection = document.querySelector('.synopsis-section');
    synopsisSection.classList.toggle('collapsed');
    const button = synopsisSection.querySelector('button.view-synopsis');
    button.textContent = synopsisSection.classList.contains('collapsed') ? 'v' : '^';
}

// Fetch chapters from the chapters.json file and populate the list
async function loadChapters() {
    try {
        const response = await fetch('chapters.json');
        const chapters = await response.json();
        const chaptersPerBook = [231, 500]; // Array of cutoff points for books

        const chapterContainer = document.getElementById('chapterContainer');
        chapterContainer.innerHTML = ''; // Clear any existing content

        const books = [];
        let currentChapterStart = 0;

        chaptersPerBook.forEach((cutoff, index) => {
            books[index] = chapters.slice(currentChapterStart, cutoff);
            currentChapterStart = cutoff;
        });

        books.forEach((bookChapters, bookIndex) => {
            const bookDiv = document.createElement('div');
            bookDiv.className = 'book';

            const bookButton = document.createElement('button');
            bookButton.className = 'read-chapterLIST';
            bookButton.textContent = `Book ${bookIndex + 1}`;
            bookButton.onclick = function () {
                const chapterList = this.nextElementSibling;
                const isExpanded = chapterList.classList.toggle('expanded');

                if (isExpanded) {
                    Array.from(chapterList.children).forEach((li, index) => {
                        setTimeout(() => {
                            li.classList.add('show');
                        }, index * 10); // Delay between each chapter appearing
                    });
                } else {
                    Array.from(chapterList.children).forEach(li => {
                        li.classList.remove('show');
                    });
                }
            };
            bookDiv.appendChild(bookButton);

            const ul = document.createElement('ul');
            bookChapters.forEach(chapter => {
                const li = document.createElement('li');
                li.classList.add('chapter-item'); // Adding class to control animation
                const a = document.createElement('a');
                a.href = chapter.filename;
                a.textContent = chapter.title.slice(0, 20); // Only show the first 20 characters
                li.appendChild(a);
                ul.appendChild(li);
            });
            bookDiv.appendChild(ul);

            chapterContainer.appendChild(bookDiv);
        });

        // Adjust visibility based on screen width
        function adjustChapterVisibility() {
            const screenWidth = window.innerWidth;
            const thresholdWidth = 800; // Adjust this threshold as needed
            const bookUls = document.querySelectorAll('.book ul');
            bookUls.forEach((ul, index) => {
                const isLastBook = index === bookUls.length - 1;
                if (isLastBook) {
                    ul.classList.add('expanded');
                    Array.from(ul.children).forEach(li => li.classList.add('show'));
                } else {
                    if (screenWidth < thresholdWidth) {
                        ul.classList.remove('expanded');
                        Array.from(ul.children).forEach(li => li.classList.remove('show'));
                    } else {
                        ul.classList.add('expanded');
                        Array.from(ul.children).forEach(li => li.classList.add('show'));
                    }
                }
            });
        }

        adjustChapterVisibility();
        window.addEventListener('resize', adjustChapterVisibility);

    } catch (error) {
        console.error('Error loading chapters:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const synopsisButton = document.querySelector('button.view-synopsis');
    if (synopsisButton) {
        synopsisButton.addEventListener('click', toggleSynopsis);
    }

    loadChapters();
});
