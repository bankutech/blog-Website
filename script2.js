const blogForm = document.getElementById('blog-form');
const writePostSection = document.getElementById('write-post-section');
const fullPostSection = document.getElementById('full-post-section');
const cancelPostBtn = document.getElementById('cancel-post');
const successMessage = document.getElementById('success-message');
const backToBlogBtn = document.getElementById('back-to-blog');

const uploadContainer = document.getElementById('upload-container');
const fileInput = document.getElementById('file-input');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const removeImageBtn = document.getElementById('remove-image');
const uploadBtn = document.querySelector('.upload-btn');

const titleCounter = document.getElementById('title-counter');
const excerptCounter = document.getElementById('excerpt-counter');
const contentCounter = document.getElementById('content-counter');
const imageDescCounter = document.getElementById('image-desc-counter');

    let uploadedImage = null;

    document.addEventListener('DOMContentLoaded', function () {
        setupEventListeners();
        setupCharacterCounters();
    });

    function setupEventListeners() {
        blogForm.addEventListener('submit', function (e) {
            e.preventDefault();
            publishPost();
        });

        cancelPostBtn.addEventListener('click', function () {
            if (confirm('Cancel this post? All unsaved data will be lost.')) {
                resetForm();
            }
        });

        backToBlogBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showWriteSection();
        });

        uploadContainer.addEventListener('click', () => fileInput.click());
        uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        fileInput.addEventListener('change', handleImageUpload);

        uploadContainer.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        uploadContainer.addEventListener('dragleave', () => uploadContainer.classList.remove('dragover'));
        uploadContainer.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                handleImageUpload();
            }
        });

        removeImageBtn.addEventListener('click', resetImageUpload);
    }

    function handleImageUpload() {
        const file = fileInput.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Only image files are allowed.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImage = e.target.result;
            imagePreview.src = e.target.result;
            imagePreviewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    function resetImageUpload() {
        fileInput.value = '';
        uploadedImage = null;
        imagePreviewContainer.style.display = 'none';
        document.getElementById('image-desc').value = '';
        imageDescCounter.textContent = '0';
    }

    function setupCharacterCounters() {
        const titleInput = document.getElementById('post-title');
        const excerptInput = document.getElementById('post-excerpt');
        const contentInput = document.getElementById('post-content');
        const imageDescInput = document.getElementById('image-desc');

        titleInput.addEventListener('input', () => {
            titleCounter.textContent = titleInput.value.length;
            titleCounter.style.color = titleInput.value.length > 100 ? '#e74c3c' : '#7f8c8d';
        });
        excerptInput.addEventListener('input', () => {
            excerptCounter.textContent = excerptInput.value.length;
            excerptCounter.style.color = excerptInput.value.length > 200 ? '#e74c3c' : '#7f8c8d';
        });
        contentInput.addEventListener('input', () => {
            contentCounter.textContent = contentInput.value.length;
        });
        imageDescInput.addEventListener('input', () => {
            imageDescCounter.textContent = imageDescInput.value.length;
            imageDescCounter.style.color = imageDescInput.value.length > 150 ? '#e74c3c' : '#7f8c8d';
        });
    }

    function publishPost() {
        const title = document.getElementById('post-title').value.trim();
        const excerpt = document.getElementById('post-excerpt').value.trim();
        const content = document.getElementById('post-content').value.trim();
        const imageDesc = document.getElementById('image-desc').value.trim();

        if (!title || !content) {
            alert('Please enter at least a title and content.');
            return;
        }

        const post = {
            id: Date.now(),
            title,
            image: uploadedImage,
            imageDesc,
            excerpt,
            content,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        };

        let posts = JSON.parse(localStorage.getItem('inksing-posts')) || [];
        posts.unshift(post);
        localStorage.setItem('inksing-posts', JSON.stringify(posts));

        showSuccessMessage();
        previewPost(post);
        resetForm();
    }

    function showSuccessMessage() {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => (successMessage.style.display = 'none'), 5000);
    }

    function previewPost(post) {
        document.getElementById('full-post-title').textContent = post.title;
        document.getElementById('full-post-date').textContent = `Published on ${post.date}`;

        const fullPostImage = document.getElementById('full-post-image');
        if (post.image) {
            fullPostImage.innerHTML = `
                <img src="${post.image}" alt="${post.title}" class="image-preview">
                ${post.imageDesc ? `<p class="image-caption">${post.imageDesc}</p>` : ''}
            `;
        } else {
            fullPostImage.innerHTML = '';
        }

        const contentParagraphs = post.content.split('\n').filter((p) => p.trim() !== '');
        document.getElementById('full-post-content').innerHTML = contentParagraphs
            .map((p) => `<p>${p}</p>`)
            .join('');

        writePostSection.style.display = 'none';
        fullPostSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showWriteSection() {
        writePostSection.style.display = 'block';
        fullPostSection.style.display = 'none';
        successMessage.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resetForm() {
        blogForm.reset();
        resetImageUpload();
        titleCounter.textContent = '0';
        excerptCounter.textContent = '0';
        contentCounter.textContent = '0';
        imageDescCounter.textContent = '0';
    }
