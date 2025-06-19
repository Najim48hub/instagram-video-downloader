document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('video-url');
    const downloadBtn = document.getElementById('download-btn');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const thumbnail = document.getElementById('thumbnail');
    const title = document.getElementById('title');
    const downloadLink = document.getElementById('download-link');
    const historyList = document.getElementById('history-list');
    const themeToggle = document.getElementById('theme-toggle');

    const history = JSON.parse(localStorage.getItem('downloadHistory')) || [];
    renderHistory();

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        themeToggle.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
    });

    downloadBtn.addEventListener('click', async () => {
        const url = urlInput.value.trim();
        if (!url) {
            alert('Please enter a valid Instagram URL');
            return;
        }

        loading.classList.remove('hidden');
        result.classList.add('hidden');

        try {
            const response = await fetch('http://localhost:3000/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch video data');
            }

            thumbnail.src = data.thumbnail;
            title.textContent = data.title || 'Instagram Video';
            downloadLink.href = data.downloadUrl;
            result.classList.remove('hidden');

            history.unshift({ url, title: data.title, timestamp: new Date().toLocaleString() });
            if (history.length > 10) history.pop();
            localStorage.setItem('downloadHistory', JSON.stringify(history));
            renderHistory();
        } catch (error) {
            alert(error.message);
        } finally {
            loading.classList.add('hidden');
        }
    });

    function renderHistory() {
        historyList.innerHTML = '';
        history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.title || 'Video'} - ${item.url} (${item.timestamp})`;
            historyList.appendChild(li);
        });
    }
});
