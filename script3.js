let blogPosts = [
            {
                id: 1,
                title: "The Future of Web Development",
                category: "Technology",
                image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                excerpt: "Exploring the latest trends and technologies shaping the future of web development. From AI-assisted coding to new frameworks.",
                content: "<p>Web development is evolving at an unprecedented pace. With new frameworks, tools, and methodologies emerging regularly, developers need to stay updated to remain competitive.</p><p>The rise of AI-assisted coding tools is revolutionizing how we write code. These tools can suggest improvements, detect bugs, and even generate code snippets automatically.</p><p>As we look to the future, the boundaries between frontend and backend development continue to blur, with full-stack developers becoming increasingly valuable in the industry.</p>",
                date: "September 25, 2025",
                featured: true
            },
            {
                id: 2,
                title: "Minimalist Design Principles",
                category: "Design",
                image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                excerpt: "How simplicity and clarity can create more effective and beautiful designs that users love.",
                content: "<p>Minimalism in design is about stripping away unnecessary elements to focus on what's essential. This approach creates interfaces that are not only beautiful but also highly functional.</p><p>By removing visual clutter, minimalist design allows users to focus on the content and tasks that matter most. This leads to better user experiences and higher conversion rates.</p><p>The principle of 'less is more' has never been more relevant than in today's information-saturated digital landscape.</p>",
                date: "September 20, 2025",
                featured: false
            }
        ];

        const blogPostsContainer = document.getElementById('blog-posts-container');
        const categoriesList = document.getElementById('categories-list');
        const categoryFilter = document.getElementById('post-category');
        const featuredPostContainer = document.getElementById('featured-post-content');

        const postModal = document.getElementById('post-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDate = document.getElementById('modal-date');
        const modalContent = document.getElementById('modal-content');
        const closeModalBtn = document.getElementById('close-modal');

        const confirmationModal = document.getElementById('confirmation-modal');
        const confirmDeleteBtn = document.getElementById('confirm-delete');
        const cancelDeleteBtn = document.getElementById('cancel-delete');

        let postToDelete = null;
        document.addEventListener('DOMContentLoaded', function() {
            const savedPosts = JSON.parse(localStorage.getItem('inksing-posts')) || [];
            if (savedPosts.length > 0) {
                blogPosts = [...savedPosts, ...blogPosts];
            }

            renderBlogPosts();
            renderCategories();
            renderFeaturedPost();
            setupEventListeners();
        });
        function setupEventListeners() {
            categoryFilter.addEventListener('change', function() {
                filterPostsByCategory(this.value);
            });

            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', function() {
                    postModal.style.display = 'none';
                });
            }
            window.addEventListener('click', function(e) {
                if (e.target === postModal) {
                    postModal.style.display = 'none';
                }
                if (e.target === confirmationModal) {
                    confirmationModal.style.display = 'none';
                }
            });
            confirmDeleteBtn.addEventListener('click', function() {
                if (postToDelete !== null) {
                    deletePost(postToDelete);
                    confirmationModal.style.display = 'none';
                    postToDelete = null;
                }
            });

            cancelDeleteBtn.addEventListener('click', function() {
                confirmationModal.style.display = 'none';
                postToDelete = null;
            });
        }
        function renderBlogPosts(posts = blogPosts) {
            blogPostsContainer.innerHTML = '';

            if (posts.length === 0) {
                blogPostsContainer.innerHTML = `
                    <div class="no-posts">
                        <i class="fas fa-file-alt"></i>
                        <h3>No blog posts yet</h3>
                        <p>Be the first to write a blog post!</p>
                        <a href="write.html" class="btn">Write Your First Post</a>
                    </div>
                `;
                return;
            }

            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post-card';
                
                let imageSrc = '';
                if (typeof post.image === 'string') {
                    imageSrc = post.image;
                } else if (post.image && post.image.data) {
                    imageSrc = post.image.data;
                } else {
                    imageSrc = 'https://via.placeholder.com/800x400?text=No+Image+Available';
                }
                
                postElement.innerHTML = `
                    <div class="post-actions">
                        <button class="btn btn-danger delete-post" data-id="${post.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="post-image" style="background-image: url('${imageSrc}')"></div>
                    <div class="post-content">
                        <div class="post-meta">
                            <span class="post-category">${post.category || 'Uncategorized'}</span>
                            <span>${post.date}</span>
                        </div>
                        <h3 class="post-title">${post.title}</h3>
                        <p class="post-excerpt">${post.excerpt}</p>
                        <a href="#" class="read-more" data-id="${post.id}">
                            Read More <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                `;
                blogPostsContainer.appendChild(postElement);
            });

            document.querySelectorAll('.read-more').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const postId = parseInt(this.getAttribute('data-id'));
                    showFullPost(postId);
                });
            });

            document.querySelectorAll('.delete-post').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const postId = parseInt(this.getAttribute('data-id'));
                    showDeleteConfirmation(postId);
                });
            });
        }

        function renderCategories() {
            categoriesList.innerHTML = '';
            const categoryCounts = {};

            blogPosts.forEach(post => {
                const category = post.category || 'Uncategorized';
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });

            const allItem = document.createElement('li');
            allItem.innerHTML = `
                <a href="#" class="category-filter-link" data-category="all">All</a>
                <span class="category-count">${blogPosts.length}</span>
            `;
            categoriesList.appendChild(allItem);

            for (const category in categoryCounts) {
                const item = document.createElement('li');
                item.innerHTML = `
                    <a href="#" class="category-filter-link" data-category="${category}">${category}</a>
                    <span class="category-count">${categoryCounts[category]}</span>
                `;
                categoriesList.appendChild(item);
            }

            document.querySelectorAll('.category-filter-link').forEach(filter => {
                filter.addEventListener('click', function(e) {
                    e.preventDefault();
                    const category = this.getAttribute('data-category');
                    categoryFilter.value = category;
                    filterPostsByCategory(category);
                });
            });
        }
        function renderFeaturedPost() {
            const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0];

            if (featuredPost) {
                featuredPostContainer.innerHTML = `
                    <h4>${featuredPost.title}</h4>
                    <p>${featuredPost.excerpt}</p>
                    <a href="#" class="read-more featured-read-more" data-id="${featuredPost.id}">
                        Read featured post <i class="fas fa-arrow-right"></i>
                    </a>
                `;

                document.querySelector('.featured-read-more').addEventListener('click', function(e) {
                    e.preventDefault();
                    const postId = parseInt(this.getAttribute('data-id'));
                    showFullPost(postId);
                });
            }
        }
        function filterPostsByCategory(category) {
            if (category === 'all') {
                renderBlogPosts();
            } else {
                const filteredPosts = blogPosts.filter(post => post.category === category);
                renderBlogPosts(filteredPosts);
            }
        }


        function showFullPost(postId) {
            const post = blogPosts.find(p => p.id === postId);
            if (post) {
                let imageSrc = '';
                if (typeof post.image === 'string') {
                    imageSrc = post.image;
                } else if (post.image && post.image.data) {
                    imageSrc = post.image.data;
                }
                
                let modalHTML = '';
                
                if (imageSrc) {
                    modalHTML += `
                        <div class="modal-image-container">
                            <img src="${imageSrc}" alt="${post.title}" class="modal-image">
                            ${post.imageDesc ? `<p class="modal-image-caption">${post.imageDesc}</p>` : ''}
                        </div>
                    `;
                }
                
                modalHTML += `<div class="modal-content-text">${post.content}</div>`;
                
                modalTitle.textContent = post.title;
                modalDate.textContent = post.date;
                modalContent.innerHTML = modalHTML;
                postModal.style.display = 'flex';
            }
        }

        function showDeleteConfirmation(postId) {
            postToDelete = postId;
            confirmationModal.style.display = 'flex';
        }

        function deletePost(postId) {
            blogPosts = blogPosts.filter(post => post.id !== postId);
            
            const savedPosts = blogPosts.filter(post => post.id >= 1000); // Only user-created posts have high IDs
            localStorage.setItem('inksing-posts', JSON.stringify(savedPosts));
            renderBlogPosts();
            renderCategories();
            renderFeaturedPost();
            showNotification('Post deleted successfully!', 'success');
        }

        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background: ${type === 'success' ? '#4fc3a1' : '#e74c3c'};
                color: white;
                border-radius: 5px;
                z-index: 10000;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                animation: slideInRight 0.3s;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
   